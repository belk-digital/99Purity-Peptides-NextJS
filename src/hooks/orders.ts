import type { CollectionAfterChangeHook } from 'payload'
import { appendOrderToSheet } from '@/lib/google/sheets'

export const afterOrderChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  // Sync to Google Sheets if it became paid, captured, or completed
  const becamePaid = (doc.paymentStatus === 'paid' || doc.paymentStatus === 'captured') && 
                     (previousDoc?.paymentStatus !== 'paid' && previousDoc?.paymentStatus !== 'captured')
  const becameCompleted = doc.status === 'completed' && previousDoc?.status !== 'completed'

  if (becamePaid || becameCompleted) {
    try {
      await appendOrderToSheet(doc as any)
      req.payload.logger.info(`Synced Order ${doc.id} to Google Sheets from hook`)
    } catch (err) {
      req.payload.logger.error({ err }, `Failed to sync Order ${doc.id} to Google Sheets`)
    }
  }

  if (operation === 'update') {
    // If the order is refunded or cancelled, we must reverse any associated affiliate conversions
    const wasRefunded = doc.status === 'refunded' && previousDoc?.status !== 'refunded'
    const wasCancelled = doc.status === 'cancelled' && previousDoc?.status !== 'cancelled'

    if (wasRefunded || wasCancelled) {
      const conversions = await req.payload.find({
        collection: 'affiliate-conversions',
        where: { order: { equals: doc.id } },
        overrideAccess: true,
      })

      for (const conv of conversions.docs) {
        if (conv.status !== 'voided' && conv.status !== 'reversed') {
          await req.payload.update({
            collection: 'affiliate-conversions',
            id: conv.id,
            data: {
              status: 'reversed',
              reversedAt: new Date().toISOString(),
              reversedReason: wasRefunded ? 'order_refunded' : 'order_cancelled',
            },
            overrideAccess: true,
          })
        }
      }
    }
  }

  // Handle custom email notes from admin
  if (req.context.queuedCustomerNotes && Array.isArray(req.context.queuedCustomerNotes)) {
    let customerEmail = doc.guestEmail
    
    // Resolve owner email if not a guest
    if (!customerEmail && doc.owner) {
      if (typeof doc.owner === 'object' && doc.owner !== null && doc.owner.email) {
        customerEmail = doc.owner.email
      } else {
        try {
          const user = await req.payload.findByID({
            collection: 'users',
            id: typeof doc.owner === 'object' ? doc.owner.id : doc.owner,
            depth: 0,
          })
          if (user && user.email) {
            customerEmail = user.email
          }
        } catch (e) {
          req.payload.logger.error(`Could not resolve owner email for order ${doc.id}`)
        }
      }
    }
    
    if (customerEmail) {
      try {
        const { generateOrderInvoiceHtml } = await import('@/lib/emails/generateOrderEmail')
        
        for (const customNote of req.context.queuedCustomerNotes) {
          // Pass the note into the email generator
          const invoiceHtml = await generateOrderInvoiceHtml(doc, req.payload, customNote)
          
          await req.payload.sendEmail({
            from: 'Orders | 99 Purity Peptides <orders@99puritypeptides.com>',
            to: customerEmail,
            subject: `Update regarding your Order #${doc.orderNumber || doc.id}`,
            html: invoiceHtml,
          })
          
          req.payload.logger.info(`Sent custom order note to ${customerEmail} for order ${doc.id}`)
        }
      } catch (err) {
        req.payload.logger.error({ err }, `Failed to send custom order note email for order ${doc.id}`)
      }
    } else {
      req.payload.logger.error(`No customer email found to send order notes for order ${doc.id}`)
    }
  }

  // Handle tracking link email
  if (req.context.queueTrackingEmail && doc.trackingLink) {
    let customerEmail = doc.guestEmail
    if (!customerEmail && doc.owner) {
      if (typeof doc.owner === 'object' && doc.owner !== null && doc.owner.email) {
        customerEmail = doc.owner.email
      } else {
        try {
          const user = await req.payload.findByID({ collection: 'users', id: typeof doc.owner === 'object' ? doc.owner.id : doc.owner, depth: 0 })
          if (user && user.email) customerEmail = user.email
        } catch (e) {}
      }
    }

    if (customerEmail) {
      try {
        const { generateOrderInvoiceHtml } = await import('@/lib/emails/generateOrderEmail')
        const invoiceHtml = await generateOrderInvoiceHtml(doc, req.payload, "Great news! Your order has been shipped. You can track your package using the tracking link below.")
        
        await req.payload.sendEmail({
          from: 'Orders | 99 Purity Peptides <orders@99puritypeptides.com>',
          to: customerEmail,
          subject: `Your Order #${doc.orderNumber || doc.id} has shipped!`,
          html: invoiceHtml,
        })
        
        req.payload.logger.info(`Sent tracking email to ${customerEmail} for order ${doc.id}`)
      } catch (err) {
        req.payload.logger.error({ err }, `Failed to send tracking email for order ${doc.id}`)
      }
    }
  }

  return doc
}
