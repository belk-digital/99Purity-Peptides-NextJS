import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const webhookSecret = process.env.CIRCOFLOWS_API_SECRET as string

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')

    // CircoFlows documents signature verification as optional, but we enforce it anyway —
    // without this, anyone who learns this URL could POST a fake "success" notification.
    if (!signature) {
      return new Response('Missing X-Signature', { status: 400 })
    }
    const computed = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
    const signatureBuffer = Buffer.from(signature)
    const computedBuffer = Buffer.from(computed)
    if (
      signatureBuffer.length !== computedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, computedBuffer)
    ) {
      return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(rawBody)
    if (event.event !== 'payment.notify' || !event.data) {
      return new Response('Ignored', { status: 200 })
    }

    const { merchant_transaction_id: orderId, status, amount, transaction_id } = event.data
    if (!orderId) {
      return new Response('Missing merchant_transaction_id', { status: 200 })
    }

    const payload = await getPayload({ config: configPromise })
    const order = await payload.findByID({ collection: 'orders', id: Number(orderId), depth: 0, overrideAccess: true })
    if (!order) {
      return new Response('Order not found', { status: 200 })
    }

    if (transaction_id && order.circoflowsTransactionId !== transaction_id) {
      await payload.update({
        collection: 'orders',
        id: Number(orderId),
        data: { circoflowsTransactionId: transaction_id },
        overrideAccess: true,
      })
    }

    if (status === 'success') {
      const expectedAmount = (order.total || 0).toFixed(2)
      if (Number(amount) !== Number(expectedAmount)) {
        console.error(`CircoFlows webhook: amount mismatch for order ${orderId} (paid ${amount}, expected ${expectedAmount})`)
        return new Response('Amount mismatch', { status: 400 })
      }

      const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
      const ok = await finalizeOrder(orderId, {})
      if (!ok) {
        return new Response('finalizeOrder failed', { status: 500 })
      }
    } else if (status === 'declined') {
      if (!order.isFinalized && order.status === 'pending') {
        // Cancelling releases the reserved stock/coupon/points via the afterOrderChange hook,
        // same as the Stripe payment_intent.payment_failed handler.
        await payload.update({ collection: 'orders', id: Number(orderId), data: { status: 'cancelled' }, overrideAccess: true, context: { paymentFailed: true } })
      }
      try {
        const { notifyAdminFailedPayment } = await import('@/app/[locale]/(frontend)/(shop)/checkout/actions')
        await notifyAdminFailedPayment(String(orderId), event.data.message || 'CircoFlows payment declined')
      } catch (err) {
        console.error('Failed to send CircoFlows decline notification:', err)
      }
    }
    // 'processing' (3DS in flight) — no action, wait for a later notify.

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error: any) {
    console.error('CircoFlows webhook error:', error)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }
}
