import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Payzentric posts the transaction result to Status_url as plain form fields (not JSON), and the
// exact casing/spelling varies between their docs and their SOAP examples (e.g. "transactionid"
// vs "TransactionID", "externlID" vs "ExternalID") — this looks a field up case-insensitively so
// none of that matters.
function pick(fields: Record<string, string>, ...names: string[]): string | undefined {
  const lower: Record<string, string> = {}
  for (const key of Object.keys(fields)) lower[key.toLowerCase()] = fields[key]
  for (const name of names) {
    const value = lower[name.toLowerCase()]
    if (value !== undefined && value !== '') return value
  }
  return undefined
}

const SUCCESS_STATUSES = ['approved', 'success', 'succeeded', 'completed', 'captured']
const FAILURE_STATUSES = ['declined', 'rejected', 'failed', 'error', 'cancelled']

export async function POST(req: Request) {
  try {
    let fields: Record<string, string> = {}
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      fields = (await req.json().catch(() => ({}))) || {}
    } else {
      const formData = await req.formData()
      formData.forEach((value, key) => {
        fields[key] = String(value)
      })
    }

    // Payzentric's docs don't define a request-signing scheme for this endpoint (unlike
    // CircoFlows, which at least has an optional X-Signature). The CashierTransactionID we send
    // is this order's own numeric id, so the only real guard available here is: only ever act on
    // an order that is still pending and specifically waiting on Payzentric — never touch an
    // order that's already finalized or belongs to a different payment method.
    const orderId = pick(fields, 'transactionid', 'TransactionID', 'CashierTransactionID', 'TraceID')
    const status = (pick(fields, 'status', 'Status') || '').toLowerCase()
    const externalId = pick(fields, 'externlID', 'externalID', 'ExternalTraceID')
    const errorDescription = pick(fields, 'errorDescription', 'Description', 'Message', 'Mesg')

    if (!orderId || isNaN(Number(orderId))) {
      console.warn('Payzentric webhook: no usable order id in payload', fields)
      return new Response('Ignored', { status: 200 })
    }

    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: Number(orderId), depth: 0, overrideAccess: true }).catch(() => null)

    if (!order || order.paymentMethod !== 'payzentric') {
      console.warn(`Payzentric webhook: order ${orderId} not found or not a Payzentric order`)
      return new Response('Ignored', { status: 200 })
    }

    if (externalId && order.payzentricTransactionId !== externalId) {
      await payload.update({ collection: 'orders', id: order.id, data: { payzentricTransactionId: externalId }, overrideAccess: true }).catch((err) => {
        console.error(`Failed to store Payzentric transaction id for order ${orderId}:`, err)
      })
    }

    if (FAILURE_STATUSES.includes(status)) {
      if (!order.isFinalized && order.status === 'pending') {
        await payload.update({ collection: 'orders', id: order.id, data: { status: 'cancelled' }, overrideAccess: true, context: { paymentFailed: true } })
        const { notifyAdminFailedPayment } = await import('@/app/[locale]/(frontend)/(shop)/checkout/actions')
        await notifyAdminFailedPayment(String(order.id), errorDescription || `Payzentric payment ${status || 'failed'}`).catch(console.error)
      }
      return new Response('Webhook handled', { status: 200 })
    }

    if (!SUCCESS_STATUSES.includes(status)) {
      // Requested/Pending/in-flight 3D Secure challenge — nothing to finalize yet.
      return new Response('Acknowledged', { status: 200 })
    }

    // Amount isn't in Payzentric's documented ASYNC response fields, but re-check it anyway if
    // they ever do send one — same defense-in-depth as the Stripe/CircoFlows handlers.
    const paidAmount = pick(fields, 'amount', 'Amount')
    if (paidAmount !== undefined) {
      const expectedAmount = Number(order.total || 0).toFixed(2)
      if (Number(paidAmount).toFixed(2) !== expectedAmount) {
        console.error(`Payzentric webhook: amount mismatch for order ${orderId} (paid ${paidAmount}, expected ${expectedAmount})`)
        return new Response('Amount mismatch', { status: 500 })
      }
    }

    const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
    await finalizeOrder(String(order.id), {})

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error: any) {
    console.error('Payzentric webhook error:', error)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }
}
