'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { createPayloadOrder, notifyAdminFailedPayment } from './actions'

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function unescapeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

// Field names in Payzentric's own docs are inconsistent in casing between the request schema,
// the "Response" table, and the XML error example (e.g. "TraceID" vs "traceid", "Status" vs
// "status") — matching case-insensitively means we don't have to guess which casing shows up.
function extractXmlTag(xml: string, tagName: string): string | undefined {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i'))
  return match ? match[1].trim() : undefined
}

// Payzentric's own SOAP examples show this enum uppercase (VISA/MASTERCARD/AMERICANEXPRESS/...).
function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MASTERCARD'
  if (/^3[47]/.test(digits)) return 'AMERICANEXPRESS'
  if (/^6(?:011|5)/.test(digits)) return 'DISCOVER'
  if (/^3(?:0[0-5]|[68])/.test(digits)) return 'DINERS'
  if (/^35/.test(digits)) return 'JCB'
  return 'VISA'
}

// Checkout's state field is free text (e.g. "south carolina"), but Payzentric's SOAP API
// requires the 2-letter code (e.g. "SC") — sending the full name is what caused the very first
// live test to fail with "Invalid State Code" (error 1009).
const US_STATE_CODES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC', 'puerto rico': 'PR', guam: 'GU', 'virgin islands': 'VI',
}

function normalizeStateCode(state: string): string {
  const trimmed = (state || '').trim()
  if (/^[a-zA-Z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return US_STATE_CODES[trimmed.toLowerCase()] || trimmed
}

export type PayzentricCardData = {
  cardHolder: string
  cardNumber: string
  expMonth: string
  expYear: string
  cvv: string
}

type SoapResult = {
  status?: string
  transactionId?: string
  traceId?: string
  description?: string
  message?: string
  externalTraceId?: string
  descriptor?: string
  errorCode?: string
  errorMessage?: string
}

const SOAP_ACTION = 'http://tempuri.org/Initiate_Deposit'

/**
 * Calls Payzentric's SOAP Initiate_Deposit endpoint directly, server-to-server — this is the
 * "Credit Card Function" flow (API docs pages 5-7), not the ASYNC/3D Secure redirect flow this
 * integration used during sandbox testing. It's synchronous: the card is authorized and the
 * result (approved/rejected/needs-redirect) comes back in this same HTTP response, no webhook
 * involved. The interesting payload arrives XML-escaped inside <Initiate_DepositResult> — it has
 * to be unescaped before it can be parsed as its own XML document.
 */
async function callInitiateDeposit(fields: Record<string, string>): Promise<SoapResult> {
  const soapUrl = process.env.PAYZENTRIC_SOAP_URL as string

  // Every node from Payzentric's own example template is included, even ones we leave empty —
  // omitting a node entirely (rather than sending it empty) is what caused the ASYNC endpoint to
  // throw a raw NullReferenceException during sandbox testing, and there's no reason to assume
  // this SOAP endpoint's XML deserializer is any more defensive.
  const soapBody =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<soap:Body>' +
    '<Initiate_Deposit xmlns="http://tempuri.org/">' +
    '<objWSCreditCardBE>' +
    `<Username>${escapeXml(fields.Username)}</Username>` +
    `<Password>${escapeXml(fields.Password)}</Password>` +
    `<ProviderPIN>${escapeXml(fields.ProviderPIN)}</ProviderPIN>` +
    `<AccountID>${escapeXml(fields.AccountID)}</AccountID>` +
    `<AccountPassword>${escapeXml(fields.AccountPassword)}</AccountPassword>` +
    `<AccountKey>${escapeXml(fields.AccountKey)}</AccountKey>` +
    '<ExtraHashKey></ExtraHashKey>' +
    `<CustomerPIN>${escapeXml(fields.CustomerPIN)}</CustomerPIN>` +
    `<TraceID>${escapeXml(fields.TraceID)}</TraceID>` +
    `<FirstName>${escapeXml(fields.FirstName)}</FirstName>` +
    `<LastName>${escapeXml(fields.LastName)}</LastName>` +
    `<Address>${escapeXml(fields.Address)}</Address>` +
    `<City>${escapeXml(fields.City)}</City>` +
    `<StateCode>${escapeXml(fields.StateCode)}</StateCode>` +
    `<CountryCode>${escapeXml(fields.CountryCode)}</CountryCode>` +
    `<PostalCode>${escapeXml(fields.PostalCode)}</PostalCode>` +
    `<Email>${escapeXml(fields.Email)}</Email>` +
    `<Phone>${escapeXml(fields.Phone)}</Phone>` +
    `<CreditCardHolder>${escapeXml(fields.CreditCardHolder)}</CreditCardHolder>` +
    `<CreditCardNumber>${escapeXml(fields.CreditCardNumber)}</CreditCardNumber>` +
    `<CreditCardExpirationMonth>${escapeXml(fields.CreditCardExpirationMonth)}</CreditCardExpirationMonth>` +
    `<CreditCardExpirationYear>${escapeXml(fields.CreditCardExpirationYear)}</CreditCardExpirationYear>` +
    `<CreditCardType>${escapeXml(fields.CreditCardType)}</CreditCardType>` +
    `<CreditCardCVV>${escapeXml(fields.CreditCardCVV)}</CreditCardCVV>` +
    `<Amount>${escapeXml(fields.Amount)}</Amount>` +
    `<CurrencyCode>${escapeXml(fields.CurrencyCode)}</CurrencyCode>` +
    `<IPv4Address>${escapeXml(fields.IPv4Address)}</IPv4Address>` +
    '<Comments></Comments>' +
    '<Descriptor></Descriptor>' +
    `<ReturnURL>${escapeXml(fields.ReturnURL)}</ReturnURL>` +
    '<SSN></SSN>' +
    '<DriversLicense></DriversLicense>' +
    `<Birthdate>${escapeXml(fields.Birthdate)}</Birthdate>` +
    '<WhiteCode></WhiteCode>' +
    '<Udf1></Udf1>' +
    '</objWSCreditCardBE>' +
    '</Initiate_Deposit>' +
    '</soap:Body>' +
    '</soap:Envelope>'

  const response = await fetch(soapUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: SOAP_ACTION,
    },
    body: soapBody,
  })

  const raw = await response.text()
  const encodedResult = extractXmlTag(raw, 'Initiate_DepositResult')
  if (!encodedResult) {
    throw new Error(`Payzentric SOAP call returned no parseable result (HTTP ${response.status}): ${raw.slice(0, 500)}`)
  }

  const innerXml = unescapeXmlEntities(encodedResult)

  return {
    status: extractXmlTag(innerXml, 'Status'),
    transactionId: extractXmlTag(innerXml, 'transactionid') || extractXmlTag(innerXml, 'TransactionID'),
    traceId: extractXmlTag(innerXml, 'TraceID'),
    description: extractXmlTag(innerXml, 'Description'),
    message: extractXmlTag(innerXml, 'Message'),
    externalTraceId: extractXmlTag(innerXml, 'ExternalTraceID'),
    descriptor: extractXmlTag(innerXml, 'Descriptor'),
    errorCode: extractXmlTag(innerXml, 'Code'),
    errorMessage: extractXmlTag(innerXml, 'Mesg'),
  }
}

/**
 * Creates the pending order (same reservation/dedupe path as every other payment method), then
 * calls Payzentric's SOAP endpoint directly. Unlike the ASYNC/3D Secure flow this replaces, the
 * card number never leaves our server — Payzentric returns the approve/decline result in the
 * same request, so there's no webhook and no browser redirect for the common case. Some cards
 * may still come back with a Descriptor redirect URL (a 3D Secure/bank challenge) — that's the
 * one case the caller still needs to send the browser to.
 */
export async function createPayzentricPayment(
  items: any[],
  shippingMethodName: string,
  couponCode: string | undefined,
  isRedeemingPoints: boolean,
  formData: any,
  cardData: PayzentricCardData,
  userId?: string,
  isNewAddress = false
): Promise<{
  orderId?: string
  success?: boolean
  redirectUrl?: string
  error?: string
  updatedItems?: any[]
  priceChanged?: boolean
}> {
  const orderRes = await createPayloadOrder(
    items,
    shippingMethodName,
    couponCode,
    isRedeemingPoints,
    formData,
    'payzentric_pending',
    userId,
    'payzentric',
    isNewAddress
  )

  if (orderRes.error || !orderRes.orderId) {
    return orderRes
  }

  const payload = await getPayload({ config: configPromise })
  const order = await payload.findByID({ collection: 'orders', id: Number(orderRes.orderId), depth: 0, overrideAccess: true })
  if (!order) {
    return { error: 'Order not found after creation' }
  }

  const soapUrl = process.env.PAYZENTRIC_SOAP_URL
  const username = process.env.PAYZENTRIC_USERNAME
  const password = process.env.PAYZENTRIC_PASSWORD
  const providerPIN = process.env.PAYZENTRIC_PROVIDER_PIN
  const accountId = process.env.PAYZENTRIC_ACCOUNT_ID
  const accountPassword = process.env.PAYZENTRIC_ACCOUNT_PASSWORD
  const accountKey = process.env.PAYZENTRIC_ACCOUNT_KEY

  if (!soapUrl || !username || !password || !providerPIN || !accountId || !accountPassword || !accountKey) {
    await cancelUnfinalizedOrder(order.id)
    await notifyAdminFailedPayment(String(order.id), 'Payzentric is not configured (missing env vars)').catch(console.error)
    return { error: 'Card payments are temporarily unavailable. Please try another payment method.' }
  }

  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || `https://${headersList.get('host')}`
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0].trim() || headersList.get('x-real-ip') || '127.0.0.1'
    const brand = detectCardBrand(cardData.cardNumber)
    const isUS = (formData.country || 'US') === 'US'

    const result = await callInitiateDeposit({
      Username: username,
      Password: password,
      ProviderPIN: providerPIN,
      AccountID: accountId,
      AccountPassword: accountPassword,
      AccountKey: accountKey,
      CustomerPIN: String(order.owner || order.id),
      TraceID: String(order.id),
      FirstName: formData.firstName,
      LastName: formData.lastName || '',
      Address: formData.address,
      City: formData.city,
      // Docs: "applies only to US, NonUS should use NA - NN" — using NN for anything non-US.
      StateCode: isUS ? normalizeStateCode(formData.state) : 'NN',
      CountryCode: formData.country || 'US',
      PostalCode: formData.zip,
      Email: formData.email,
      Phone: formData.phone,
      CreditCardHolder: cardData.cardHolder,
      CreditCardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      CreditCardExpirationMonth: cardData.expMonth,
      CreditCardExpirationYear: cardData.expYear,
      CreditCardType: brand,
      CreditCardCVV: cardData.cvv,
      Amount: Number(order.total || 0).toFixed(2),
      CurrencyCode: 'USD',
      IPv4Address: ipAddress,
      ReturnURL: `${origin}/order-confirmation/${order.id}`,
      // Not collected at checkout — docs say to default to the current date when there's
      // nothing real to send.
      Birthdate: new Date().toISOString().slice(0, 10),
    })

    console.log(`Payzentric Initiate_Deposit result for order ${order.id}:`, result)

    if (result.transactionId) {
      await payload.update({ collection: 'orders', id: order.id, data: { payzentricTransactionId: result.transactionId }, overrideAccess: true }).catch((err) => {
        console.error(`Failed to store Payzentric transaction id for order ${order.id}:`, err)
      })
    }

    const status = (result.status || '').toLowerCase()

    if (result.errorCode || status === 'rejected') {
      await cancelUnfinalizedOrder(order.id)
      const reason = result.errorMessage || result.message || result.description || `Payzentric declined (status: ${result.status || 'unknown'}${result.errorCode ? `, code ${result.errorCode}` : ''})`
      await notifyAdminFailedPayment(String(order.id), reason).catch(console.error)
      return { error: 'Your card was declined. Please try a different card or payment method.' }
    }

    if (status === 'approved') {
      const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
      await finalizeOrder(String(order.id), {})
      return { orderId: orderRes.orderId, success: true }
    }

    if (result.descriptor) {
      // Some cards still require a 3D Secure/bank redirect even through this endpoint. There's
      // no documented status-check API for this SOAP flow, so once the customer's browser lands
      // back on our order-confirmation page, the best we can do is what getPayzentricOrderStatus
      // already does — poll our own order record and hope a follow-up call from Payzentric (or
      // manual admin confirmation) lands.
      return { orderId: orderRes.orderId, redirectUrl: result.descriptor }
    }

    // "Requested"/"Pending" with no redirect URL and no clear approve/decline.
    return { orderId: orderRes.orderId, success: false }
  } catch (error: any) {
    await cancelUnfinalizedOrder(order.id)
    await notifyAdminFailedPayment(String(order.id), error.message || 'Payzentric SOAP call threw').catch(console.error)
    console.error('Payzentric payment failed:', error)
    return { error: 'Failed to process card payment. Please try again.' }
  }
}

async function cancelUnfinalizedOrder(orderId: string | number) {
  try {
    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: Number(orderId), depth: 0, overrideAccess: true })
    if (order && !order.isFinalized && order.status === 'pending') {
      await payload.update({ collection: 'orders', id: Number(orderId), data: { status: 'cancelled' }, overrideAccess: true, context: { paymentFailed: true } })
    }
  } catch (err) {
    console.error(`Failed to cancel unfinalized Payzentric order ${orderId}:`, err)
  }
}

/**
 * No status-check API is documented for this SOAP flow — this just reports whatever's already
 * in our own order record, for the confirmation page's fallback poll (relevant only if a
 * Descriptor redirect/3DS challenge was involved; the common approve/decline case finalizes
 * synchronously before the customer ever reaches this page).
 */
export async function getPayzentricOrderStatus(orderId: string): Promise<{ isFinalized: boolean; status?: string; paymentStatus?: string }> {
  const payload = await getPayload({ config: configPromise })
  const order = await payload.findByID({ collection: 'orders', id: Number(orderId), depth: 0, overrideAccess: true })
  if (!order) return { isFinalized: false }
  return { isFinalized: !!order.isFinalized, status: order.status, paymentStatus: order.paymentStatus }
}
