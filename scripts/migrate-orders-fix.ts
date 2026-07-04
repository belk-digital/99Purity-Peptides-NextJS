import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'

const WC_URL = 'https://99puritypeptides.com/staging-v2/wp-json/wc/v3'
const WC_CK = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8'
const WC_CS = 'cs_259d976093d3af4594cd37d3df8114092e1cb934'
const authHeader = 'Basic ' + Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')

async function fetchWc(endpoint: string) {
  let allData: any[] = []
  let page = 1
  let totalPages = 1
  
  do {
    const url = new URL(`${WC_URL}${endpoint}`)
    url.searchParams.append('per_page', '100')
    url.searchParams.append('page', page.toString())
    
    console.log(`Fetching ${url.toString()}...`)
    const res = await fetch(url.toString(), {
      headers: { Authorization: authHeader }
    })
    if (!res.ok) throw new Error(`WC API Error: ${res.status} ${res.statusText}`)
    
    const data = await res.json()
    allData = allData.concat(data)
    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10)
    page++
  } while (page <= totalPages)
  
  return allData
}

async function fixOrders(payload: any) {
  const orders = await fetchWc('/orders')
  console.log(`Fetched ${orders.length} orders from WC for syncing missing fields`)
  
  const batchSize = 10;
  for (let i = 0; i < orders.length; i += batchSize) {
    const batch = orders.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(orders.length / batchSize)}...`);
    
    await Promise.all(batch.map(async (order: any) => {
      const orderNumber = order.number || order.id.toString()
      console.log(`Syncing missing fields for order: ${orderNumber}`)

      const existing = await payload.find({
        collection: 'orders',
        where: { orderNumber: { equals: orderNumber } }
      })

      if (existing.totalDocs === 0) {
        console.log(`Order ${orderNumber} not found in Payload, skipping.`)
        return;
      }

      const payloadOrderId = existing.docs[0].id;
      const existingNotes = existing.docs[0].notes || [];

      const couponCode = order.coupon_lines ? order.coupon_lines.map((c: any) => c.code).join(', ') : '';
      const shippingMethod = order.shipping_lines ? order.shipping_lines.map((s: any) => s.method_title).join(', ') : '';
      const customerNote = order.customer_note || '';
      
      const feeTotalCents = order.fee_lines ? order.fee_lines.reduce((sum: number, fee: any) => sum + parseFloat(fee.total || '0'), 0) * 100 : 0;
      const appliedFees = order.fee_lines ? order.fee_lines.map((fee: any) => ({
        feeName: fee.name,
        amount: parseFloat(fee.total || '0') * 100
      })) : [];

      const refunds = order.refunds ? order.refunds.map((r: any) => ({
        amount: parseFloat(r.total || '0') * 100 * -1, // WooCommerce usually makes it negative, let's keep it positive if Payload expects positive
        reason: r.reason || 'WooCommerce Refund'
      })) : [];

      let internalNoteBody = `Payment Method: ${order.payment_method_title || order.payment_method}\n`;
      if (order.transaction_id) {
        internalNoteBody += `Transaction ID: ${order.transaction_id}\n`;
      }
      const txnMeta = order.meta_data?.find((m: any) => m.key === '_circoflows_transaction_id');
      if (txnMeta) {
        internalNoteBody += `Circoflows TXN: ${txnMeta.value}\n`;
      }

      // Fetch woo order notes
      let wooNotes: any[] = [];
      try {
        const res = await fetch(`${WC_URL}/orders/${order.id}/notes`, { headers: { Authorization: authHeader } })
        if (res.ok) {
          wooNotes = await res.json();
        }
      } catch(e) {
        console.error('Error fetching woo notes for', order.id, e);
      }

      const mappedWooNotes = wooNotes.map((n: any) => ({
        type: 'internal',
        note: `[WC Note - ${n.author}]: ${n.note.replace(/<[^>]+>/g, '')}`, // Strip HTML from Woo note
        date: n.date_created ? new Date(n.date_created).toISOString() : new Date().toISOString(),
        isEmailed: false
      }));

      const hasNewNote = existingNotes.filter((n: any) => n.note === internalNoteBody).length > 0;
      
      // Combine everything, but filter out duplicates just in case
      const updatedNotes = hasNewNote ? existingNotes : [
        ...existingNotes,
        {
          type: 'internal',
          note: internalNoteBody,
          date: new Date().toISOString(),
          isEmailed: false
        }
      ];

      // Push the woo notes too if they aren't already there
      for (const mn of mappedWooNotes) {
        if (!updatedNotes.find((n: any) => n.note === mn.note)) {
          updatedNotes.push(mn);
        }
      }

      const payloadItems = existing.docs[0].items || [];
      const updatedItems = payloadItems.map((payloadItem: any, index: number) => {
        const wcItem = order.line_items?.[index];
        if (wcItem) {
          let variantAttributes = '';
          if (wcItem.meta_data && wcItem.meta_data.length > 0) {
            variantAttributes = wcItem.meta_data
              .filter((m: any) => m.display_value && m.key !== '_reduced_stock')
              .map((m: any) => m.display_value)
              .join(' | ');
          }
          let newVariant = wcItem.name;
          if (variantAttributes) {
            newVariant += ` - ${variantAttributes}`;
          }
          return {
            ...payloadItem,
            variant: newVariant
          }
        }
        return payloadItem;
      });

      try {
        await payload.update({
          collection: 'orders',
          id: payloadOrderId,
          data: {
            couponCode: couponCode || undefined,
            shippingMethod: shippingMethod || undefined,
            customerNote: customerNote || undefined,
            feeTotal: feeTotalCents,
            appliedFees: appliedFees,
            notes: updatedNotes,
            refunds: refunds.length > 0 ? refunds : undefined,
            items: updatedItems,
            createdAt: order.date_created ? new Date(order.date_created).toISOString() : new Date().toISOString(),
            updatedAt: order.date_modified ? new Date(order.date_modified).toISOString() : new Date().toISOString()
          }
        })
      } catch (err: any) {
        console.error(`Failed to update order ${orderNumber}:`, err.message)
      }
    }));
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('--- Starting Order Fix Migration ---')
  await fixOrders(payload)
  console.log('--- Order Fix Migration Complete ---')
  process.exit(0)
}

main().catch(console.error)
