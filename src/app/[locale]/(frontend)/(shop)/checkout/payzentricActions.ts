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

// Payzentric's xmlData schema takes a "Brand" string but doesn't document its own BIN table for
// the ASYNC endpoint (only the separate SOAP Initiate_Deposit lists an enum) — detecting from the
// card number keeps this working for any brand without relying on client input.
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

export type PayzentricCardData = {
  cardHolder: string
  cardNumber: string
  expMonth: string
  expYear: string
  cvv: string
}

/**
 * Creates the pending order (same reservation/dedupe path as every other payment method), then
 * builds the Mnet xmlData blob for Payzentric's ASYNC/3D Secure endpoint. Unlike CircoFlows, this
 * gateway is not called server-to-server — the docs require the *customer's own browser* to POST
 * this payload directly to Payzentric so any 3D Secure challenge can run in that same browser
 * session. So this action only prepares the data; PayzentricCheckoutForm.tsx is what actually
 * submits it via a real (non-fetch) form POST.
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
  asyncUrl?: string
  providerPIN?: string
  xmlData?: string
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

  const asyncUrl = process.env.PAYZENTRIC_ASYNC_URL
  const providerPIN = process.env.PAYZENTRIC_PROVIDER_PIN
  const processorUser = process.env.PAYZENTRIC_PROCESSOR_USER
  const processorPass = process.env.PAYZENTRIC_PROCESSOR_PASS
  const merchantUser = process.env.PAYZENTRIC_MERCHANT_USER
  const merchantPassword = process.env.PAYZENTRIC_MERCHANT_PASSWORD

  if (!asyncUrl || !providerPIN || !processorUser || !processorPass || !merchantUser || !merchantPassword) {
    await cancelUnfinalizedOrder(order.id)
    await notifyAdminFailedPayment(String(order.id), 'Payzentric is not configured (missing env vars)').catch(console.error)
    return { error: 'Card payments are temporarily unavailable. Please try another payment method.' }
  }

  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || `https://${headersList.get('host')}`
    // x-forwarded-for can carry a "client, proxy1, proxy2" chain (Vercel included) — the first
    // entry is the actual customer, the rest are intermediate proxies.
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0].trim() || headersList.get('x-real-ip') || '127.0.0.1'

    const brand = detectCardBrand(cardData.cardNumber)

    const xmlData =
      '<Mnet>' +
      '<Processor>' +
      `<ProviderPIN>${escapeXml(providerPIN)}</ProviderPIN>` +
      `<ProcessorUser>${escapeXml(processorUser)}</ProcessorUser>` +
      `<ProcessorPass>${escapeXml(processorPass)}</ProcessorPass>` +
      '<ProcessorKey></ProcessorKey>' +
      `<Status_url>${escapeXml(`${origin}/api/webhooks/payzentric`)}</Status_url>` +
      `<Return_url>${escapeXml(`${origin}/order-confirmation/${order.id}`)}</Return_url>` +
      '<ExtraKey1></ExtraKey1>' +
      '</Processor>' +
      '<Merchant>' +
      `<MerchantUser>${escapeXml(merchantUser)}</MerchantUser>` +
      `<MerchantPassword>${escapeXml(merchantPassword)}</MerchantPassword>` +
      '</Merchant>' +
      '<Transaction>' +
      `<Amount>${Number(order.total || 0).toFixed(2)}</Amount>` +
      '<Currency>USD</Currency>' +
      `<CashierTransactionID>${escapeXml(String(order.id))}</CashierTransactionID>` +
      `<Description>${escapeXml(`Order #${order.orderNumber || order.id} - 99 Purity Peptides`)}</Description>` +
      '<CreditCard>' +
      `<CardHolder>${escapeXml(cardData.cardHolder)}</CardHolder>` +
      `<CardNumber>${escapeXml(cardData.cardNumber.replace(/\s+/g, ''))}</CardNumber>` +
      `<Brand>${brand}</Brand>` +
      `<ExpMonth>${escapeXml(cardData.expMonth)}</ExpMonth>` +
      `<ExpYear>${escapeXml(cardData.expYear)}</ExpYear>` +
      `<CCV>${escapeXml(cardData.cvv)}</CCV>` +
      '</CreditCard>' +
      '</Transaction>' +
      '<Customer>' +
      `<CustomerPIN>${escapeXml(String(order.id))}</CustomerPIN>` +
      `<First>${escapeXml(formData.firstName)}</First>` +
      `<Last>${escapeXml(formData.lastName || '')}</Last>` +
      `<Address>${escapeXml(formData.address)}</Address>` +
      `<Zip>${escapeXml(formData.zip)}</Zip>` +
      `<City>${escapeXml(formData.city)}</City>` +
      `<State>${escapeXml(formData.state)}</State>` +
      `<Country>${escapeXml(formData.country || 'US')}</Country>` +
      `<Email>${escapeXml(formData.email)}</Email>` +
      // Not collected at checkout — Payzentric's own SOAP docs say to default this to the
      // current date when there's nothing real to send, so the node is never missing/null.
      `<BirthDate>${new Date().toISOString().slice(0, 10)}</BirthDate>` +
      '<SSN></SSN>' +
      '<SecureID></SecureID>' +
      `<Phone>${escapeXml(formData.phone)}</Phone>` +
      `<IP>${escapeXml(ipAddress)}</IP>` +
      '</Customer>' +
      '</Mnet>'

    return { orderId: orderRes.orderId, asyncUrl, providerPIN, xmlData }
  } catch (error: any) {
    await cancelUnfinalizedOrder(order.id)
    await notifyAdminFailedPayment(String(order.id), error.message || 'Payzentric xmlData build threw').catch(console.error)
    console.error('Payzentric payment preparation failed:', error)
    return { error: 'Failed to prepare card payment. Please try again.' }
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
 * Payzentric doesn't expose a status-check API (unlike CircoFlows/Stripe) — the only source of
 * truth is the async POST to Status_url. This just reports whatever the webhook has already
 * written, so the confirmation page can poll it and refresh once the webhook lands instead of
 * showing a stale "processing" state indefinitely.
 */
export async function getPayzentricOrderStatus(orderId: string): Promise<{ isFinalized: boolean; status?: string; paymentStatus?: string }> {
  const payload = await getPayload({ config: configPromise })
  const order = await payload.findByID({ collection: 'orders', id: Number(orderId), depth: 0, overrideAccess: true })
  if (!order) return { isFinalized: false }
  return { isFinalized: !!order.isFinalized, status: order.status, paymentStatus: order.paymentStatus }
}
