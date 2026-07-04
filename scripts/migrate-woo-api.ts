import { getPayload } from 'payload'
import config from '@payload-config'

const WP_URL = 'https://99puritypeptides.com/staging-v2'
const WC_KEY = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8'
const WC_SECRET = 'cs_259d976093d3af4594cd37d3df8114092e1cb934'
const AUTH_HEADER = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')

// Set to true to actually insert data into Payload.
// Set to false to just fetch and log (Dry Run).
const IS_DRY_RUN = true;

async function fetchWP(endpoint: string) {
  let allData: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const sep = endpoint.includes('?') ? '&' : '?'
    const url = `${WP_URL}/wp-json/${endpoint}${sep}per_page=100&page=${page}`
    console.log(`[GET] ${url}`)
    const res = await fetch(url, {
      headers: { 'Authorization': AUTH_HEADER }
    })
    
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn(`[WARNING] Access denied to ${endpoint}. (Keys might be WC-only)`)
        return []
      }
      throw new Error(`API Error: ${res.statusText} on ${url}`)
    }
    
    const data = await res.json()
    if (!Array.isArray(data)) {
      console.error('Expected array, got:', typeof data)
      return []
    }
    
    if (data.length === 0) {
      hasMore = false
    } else {
      allData = allData.concat(data)
      page++
    }
  }
  return allData
}

async function migrateUsers(payload: any, wcCustomers: any[]) {
  console.log(`\n--- Migrating ${wcCustomers.length} Users ---`)
  for (const customer of wcCustomers) {
    try {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: customer.email } }
      })

      let payloadUser;
      if (existing.totalDocs > 0) {
        payloadUser = existing.docs[0]
        if (!IS_DRY_RUN) {
          payloadUser = await payload.update({
            collection: 'users',
            id: payloadUser.id,
            data: {
              firstName: customer.first_name || payloadUser.firstName,
              lastName: customer.last_name || payloadUser.lastName,
              phone: customer.billing?.phone || payloadUser.phone,
              metadata: {
                ...payloadUser.metadata,
                woocommerce_id: customer.id
              }
            }
          })
        }
        console.log(`[USER] Updated existing: ${customer.email}`)
      } else {
        if (!IS_DRY_RUN) {
          payloadUser = await payload.create({
            collection: 'users',
            data: {
              email: customer.email,
              firstName: customer.first_name,
              lastName: customer.last_name,
              phone: customer.billing?.phone,
              role: 'customer',
              emailVerified: true,
              password: crypto.randomUUID() + crypto.randomUUID(), 
              metadata: { woocommerce_id: customer.id }
            },
          })
        }
        console.log(`[USER] Created new: ${customer.email}`)
      }

      // Migrate Addresses if we created/updated a user
      if (payloadUser && !IS_DRY_RUN) {
        if (customer.shipping && customer.shipping.address_1) {
          await payload.create({
            collection: 'addresses',
            data: {
              user: payloadUser.id,
              label: 'Default Shipping',
              firstName: customer.shipping.first_name || customer.first_name,
              lastName: customer.shipping.last_name || customer.last_name,
              company: customer.shipping.company,
              line1: customer.shipping.address_1,
              line2: customer.shipping.address_2,
              city: customer.shipping.city,
              state: customer.shipping.state,
              postalCode: customer.shipping.postcode,
              country: customer.shipping.country || 'US',
              phone: customer.shipping.phone || customer.billing?.phone || '0000000000',
              isDefaultShipping: true
            }
          }).catch((e: any) => console.log(`  Failed to add shipping for ${customer.email}: ${e.message}`))
        }
        
        if (customer.billing && customer.billing.address_1) {
          await payload.create({
            collection: 'addresses',
            data: {
              user: payloadUser.id,
              label: 'Default Billing',
              firstName: customer.billing.first_name || customer.first_name,
              lastName: customer.billing.last_name || customer.last_name,
              company: customer.billing.company,
              line1: customer.billing.address_1,
              line2: customer.billing.address_2,
              city: customer.billing.city,
              state: customer.billing.state,
              postalCode: customer.billing.postcode,
              country: customer.billing.country || 'US',
              phone: customer.billing.phone || '0000000000',
              isDefaultBilling: true
            }
          }).catch((e: any) => console.log(`  Failed to add billing for ${customer.email}: ${e.message}`))
        }
      }
    } catch (err: any) {
      console.error(`[ERROR USER] ${customer.email}:`, err.message)
    }
  }
}

async function migrateCoupons(payload: any, wcCoupons: any[]) {
  console.log(`\n--- Migrating ${wcCoupons.length} Coupons ---`)
  for (const coupon of wcCoupons) {
    try {
      const existing = await payload.find({
        collection: 'coupons',
        where: { code: { equals: coupon.code } }
      })

      if (existing.totalDocs > 0) {
        console.log(`[COUPON] Skipping existing: ${coupon.code}`)
        continue;
      }

      let type = 'fixed_amount'
      if (coupon.discount_type === 'percent') type = 'percentage'
      if (coupon.discount_type === 'fixed_cart') type = 'fixed_amount'

      if (!IS_DRY_RUN) {
        await payload.create({
          collection: 'coupons',
          data: {
            code: coupon.code,
            type,
            value: parseFloat(coupon.amount || '0'),
            usageLimit: coupon.usage_limit || 0,
            usageCount: coupon.usage_count || 0,
            freeShipping: coupon.free_shipping || false,
            expiresAt: coupon.date_expires ? new Date(coupon.date_expires).toISOString() : undefined,
            applicableProductTypes: 'all',
            appliesTo: 'all'
          }
        })
      }
      console.log(`[COUPON] Created: ${coupon.code}`)
    } catch (err: any) {
      console.error(`[ERROR COUPON] ${coupon.code}:`, err.message)
    }
  }
}

async function migrateOrders(payload: any, wcOrders: any[]) {
  console.log(`\n--- Migrating ${wcOrders.length} Orders ---`)
  for (const order of wcOrders) {
    try {
      const existing = await payload.find({
        collection: 'orders',
        where: { orderNumber: { equals: String(order.id) } }
      })

      if (existing.totalDocs > 0) {
        console.log(`[ORDER] Skipping existing: #${order.id}`)
        continue;
      }

      // Find user
      let payloadUserId = null
      if (order.customer_id) {
        const users = await payload.find({
          collection: 'users',
          where: { 'metadata.woocommerce_id': { equals: order.customer_id } }
        })
        if (users.totalDocs > 0) payloadUserId = users.docs[0].id
      }

      // Find products
      const items = []
      for (const item of order.line_items) {
        // Try to match by name or SKU. This is a best-effort approach since old IDs don't match.
        const products = await payload.find({
          collection: 'products',
          where: { name: { equals: item.name } } // Simple match for now
        })
        
        items.push({
          product: products.totalDocs > 0 ? products.docs[0].id : null,
          variant: item.name,
          price: parseFloat(item.price || '0'),
          quantity: item.quantity
        })
      }

      let status = 'pending'
      if (order.status === 'processing') status = 'paid'
      if (order.status === 'completed') status = 'completed'
      if (order.status === 'cancelled') status = 'cancelled'
      if (order.status === 'refunded') status = 'refunded'

      if (!IS_DRY_RUN) {
        await payload.create({
          collection: 'orders',
          data: {
            orderNumber: String(order.id),
            owner: payloadUserId,
            customerFirstName: order.billing?.first_name,
            customerLastName: order.billing?.last_name,
            customerPhone: order.billing?.phone,
            guestEmail: payloadUserId ? undefined : order.billing?.email,
            items,
            status,
            paymentStatus: (status === 'paid' || status === 'completed') ? 'captured' : 'unpaid',
            fulfillmentStatus: status === 'completed' ? 'fulfilled' : 'unfulfilled',
            subtotal: parseFloat(order.total || '0') * 100, // Assuming order total in cents if payload is set up that way.
            total: parseFloat(order.total || '0') * 100,
            taxTotal: parseFloat(order.total_tax || '0') * 100,
            shippingTotal: parseFloat(order.shipping_total || '0') * 100,
            feeTotal: 0,
            couponCode: order.coupon_lines?.[0]?.code || '',
            billingAddress: {
              line1: order.billing?.address_1,
              line2: order.billing?.address_2,
              city: order.billing?.city,
              state: order.billing?.state,
              postalCode: order.billing?.postcode,
              country: order.billing?.country,
            },
            shippingAddress: {
              line1: order.shipping?.address_1,
              line2: order.shipping?.address_2,
              city: order.shipping?.city,
              state: order.shipping?.state,
              postalCode: order.shipping?.postcode,
              country: order.shipping?.country,
            }
          }
        })
      }
      console.log(`[ORDER] Created: #${order.id} for ${order.billing?.email}`)
    } catch (err: any) {
      console.error(`[ERROR ORDER] #${order.id}:`, err.message)
    }
  }
}

async function migrateAffiliates(payload: any, wpAffiliates: any[]) {
  console.log(`\n--- Migrating ${wpAffiliates.length} Affiliates ---`)
  for (const aff of wpAffiliates) {
    try {
      if (aff.status !== 'active') continue;

      let payloadUserId = null
      if (aff.user_id) {
        const users = await payload.find({
          collection: 'users',
          where: { 'metadata.woocommerce_id': { equals: aff.user_id } }
        })
        if (users.totalDocs > 0) payloadUserId = users.docs[0].id
      }

      if (!payloadUserId) {
         console.log(`[AFFILIATE] Skipping ${aff.referral_slug} - User not found`)
         continue
      }

      const existing = await payload.find({
        collection: 'affiliates',
        where: { referralSlug: { equals: aff.referral_slug } }
      })
      if (existing.totalDocs > 0) {
        console.log(`[AFFILIATE] Skipping existing: ${aff.referral_slug}`)
        continue
      }

      if (!IS_DRY_RUN) {
        await payload.create({
          collection: 'affiliates',
          data: {
            user: payloadUserId,
            status: 'approved',
            referralSlug: aff.referral_slug,
            couponCode: aff.custom_affiliate_slug || aff.referral_slug,
            payoutCurrency: 'USD',
            totalCommissionEarned: parseFloat(aff.paid_earnings || '0') * 100,
            totalCommissionPaid: parseFloat(aff.paid_earnings || '0') * 100,
            totalCommissionPending: parseFloat(aff.unpaid_earnings || '0') * 100,
          }
        })
      }
      console.log(`[AFFILIATE] Created: ${aff.referral_slug}`)
    } catch(e: any) {
      console.error(`[ERROR AFFILIATE] ${aff.referral_slug}:`, e.message)
    }
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })

  console.log(`Starting ${IS_DRY_RUN ? 'DRY RUN' : 'REAL MIGRATION'}...`)

  try {
    const customers = await fetchWP('wc/v3/customers')
    await migrateUsers(payload, customers)

    const coupons = await fetchWP('wc/v3/coupons')
    await migrateCoupons(payload, coupons)

    const orders = await fetchWP('wc/v3/orders')
    await migrateOrders(payload, orders)

    // SliceWP endpoint
    const affiliates = await fetchWP('slicewp/v1/affiliates')
    await migrateAffiliates(payload, affiliates)

  } catch(e: any) {
    console.error('Fatal Migration Error:', e.message)
  }
  
  process.exit(0)
}

main()
