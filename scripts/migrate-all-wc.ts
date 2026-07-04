import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

const WC_URL = 'https://99puritypeptides.com/staging-v2/wp-json/wc/v3'
const WC_CK = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8'
const WC_CS = 'cs_259d976093d3af4594cd37d3df8114092e1cb934'
const authHeader = 'Basic ' + Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')

async function fetchWc(endpoint: string, singlePage: boolean = false) {
  let allData: any[] = []
  let page = 1
  let totalPages = 1
  
  do {
    const url = new URL(`${WC_URL}${endpoint}`)
    url.searchParams.append('per_page', singlePage ? '1' : '100')
    url.searchParams.append('page', page.toString())
    
    console.log(`Fetching ${url.toString()}...`)
    const res = await fetch(url.toString(), {
      headers: { Authorization: authHeader }
    })
    
    if (!res.ok) {
      throw new Error(`WC API Error: ${res.status} ${res.statusText}`)
    }
    
    const data = await res.json()
    allData = allData.concat(data)
    
    if (singlePage) break;

    totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10)
    page++
  } while (page <= totalPages)
  
  return allData
}

async function migrateUsers(payload: any, singlePage: boolean = false) {
  const users = await fetchWc('/customers', singlePage)
  console.log(`Fetched ${users.length} users`)
  
  for (const user of users) {
    if (!user.email) continue;
    console.log(`Processing user: ${user.email}`)

    try {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: user.email } }
      })

      let payloadUser;
      if (existing.totalDocs > 0) {
        console.log(`User ${user.email} exists, skipping creation.`)
        payloadUser = existing.docs[0]
      } else {
        payloadUser = await payload.create({
          collection: 'users',
          data: {
            email: user.email,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            role: 'customer',
            emailVerified: true,
            password: crypto.randomUUID() + crypto.randomUUID(),
            phone: user.billing?.phone ? user.billing.phone.replace(/[^0-9+]/g, '') : undefined,
            metadata: {
              woocommerce_id: user.id
            }
          }
        })
      }

      // Addresses
      let billingAddrId = null;
      let shippingAddrId = null;

      if (user.billing && user.billing.address_1) {
        const existingAddr = await payload.find({
          collection: 'addresses',
          where: { user: { equals: payloadUser.id }, isDefaultBilling: { equals: true } }
        })
        if (existingAddr.totalDocs === 0) {
          const addr = await payload.create({
            collection: 'addresses',
            data: {
              user: payloadUser.id,
              label: 'Default Billing',
              firstName: user.billing.first_name || user.first_name || 'Unknown',
              lastName: user.billing.last_name || user.last_name || 'Unknown',
              company: user.billing.company || '',
              line1: user.billing.address_1 || 'Unknown',
              line2: user.billing.address_2 || '',
              city: user.billing.city || 'Unknown',
              state: user.billing.state || 'Unknown',
              postalCode: user.billing.postcode || '00000',
              country: user.billing.country || 'US',
              phone: user.billing.phone || '0000000000',
              isDefaultBilling: true,
              isDefaultShipping: false,
            }
          })
          billingAddrId = addr.id
        } else {
          billingAddrId = existingAddr.docs[0].id
        }
      }

      if (user.shipping && user.shipping.address_1) {
        const existingAddr = await payload.find({
          collection: 'addresses',
          where: { user: { equals: payloadUser.id }, isDefaultShipping: { equals: true } }
        })
        if (existingAddr.totalDocs === 0) {
          const addr = await payload.create({
            collection: 'addresses',
            data: {
              user: payloadUser.id,
              label: 'Default Shipping',
              firstName: user.shipping.first_name || user.first_name || 'Unknown',
              lastName: user.shipping.last_name || user.last_name || 'Unknown',
              company: user.shipping.company || '',
              line1: user.shipping.address_1 || 'Unknown',
              line2: user.shipping.address_2 || '',
              city: user.shipping.city || 'Unknown',
              state: user.shipping.state || 'Unknown',
              postalCode: user.shipping.postcode || '00000',
              country: user.shipping.country || 'US',
              phone: user.billing?.phone || '0000000000',
              isDefaultBilling: false,
              isDefaultShipping: true,
            }
          })
          shippingAddrId = addr.id
        } else {
          shippingAddrId = existingAddr.docs[0].id
        }
      }

      if (billingAddrId || shippingAddrId) {
        await payload.update({
          collection: 'users',
          id: payloadUser.id,
          data: {
            ...(billingAddrId ? { defaultBillingAddress: billingAddrId } : {}),
            ...(shippingAddrId ? { defaultShippingAddress: shippingAddrId } : {})
          }
        })
      }
    } catch (err: any) {
      console.error(`Error processing user ${user.email}:`, err.message);
    }
  }
}

async function migrateCoupons(payload: any, singlePage: boolean = false) {
  const coupons = await fetchWc('/coupons', singlePage)
  console.log(`Fetched ${coupons.length} coupons`)
  
  for (const coupon of coupons) {
    if (!coupon.code) continue;
    console.log(`Processing coupon: ${coupon.code}`)

    const existing = await payload.find({
      collection: 'coupons',
      where: { code: { equals: coupon.code } }
    })

    if (existing.totalDocs > 0) {
      console.log(`Coupon ${coupon.code} exists, skipping.`)
      continue
    }

    try {
      const discountType = coupon.discount_type === 'percent' ? 'percentage' : 'fixed_amount';
      const amount = parseFloat(coupon.amount);
      const val = discountType === 'fixed_amount' ? amount * 100 : amount; // Cents if fixed amount

      await payload.create({
        collection: 'coupons',
        data: {
          code: coupon.code,
          type: discountType,
          value: val,
          usageCount: coupon.usage_count || 0,
          usageLimit: coupon.usage_limit || undefined,
          freeShipping: coupon.free_shipping,
          expiresAt: coupon.date_expires ? new Date(coupon.date_expires).toISOString() : undefined,
          applicableProductTypes: 'all',
          appliesTo: 'all'
        }
      })
    } catch (e: any) {
      console.error(`Error migrating coupon ${coupon.code}:`, e.message);
    }
  }
}

async function migrateOrders(payload: any, singlePage: boolean = false) {
  const orders = await fetchWc('/orders', singlePage)
  console.log(`Fetched ${orders.length} orders`)
  
  for (const order of orders) {
    console.log(`Processing order: ${order.number || order.id}`)

    const existing = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: order.number || order.id.toString() } }
    })

    if (existing.totalDocs > 0) {
      console.log(`Order ${order.number || order.id} exists, skipping.`)
      continue
    }

    let ownerId = null;
    if (order.customer_id) {
      const userRes = await payload.find({
        collection: 'users',
        where: { 'metadata.woocommerce_id': { equals: order.customer_id } }
      });
      if (userRes.totalDocs > 0) {
        ownerId = userRes.docs[0].id;
      }
    }

    const mapStatus = (wcStatus: string) => {
      if (['pending', 'processing', 'on-hold'].includes(wcStatus)) return 'pending'
      if (wcStatus === 'completed') return 'completed'
      if (wcStatus === 'cancelled') return 'cancelled'
      if (wcStatus === 'refunded') return 'refunded'
      return 'pending'
    }

    const items = await Promise.all((order.line_items || []).map(async (item: any) => {
      // Very loose match for product
      const productRes = await payload.find({
        collection: 'products',
        where: { name: { equals: item.name } },
        limit: 1
      });
      
      return {
        product: productRes.totalDocs > 0 ? productRes.docs[0].id : null,
        variant: item.name,
        price: parseFloat(item.price || '0') * 100, // Cents
        quantity: item.quantity
      }
    }));

    try {
      await payload.create({
        collection: 'orders',
        data: {
          orderNumber: order.number || order.id.toString(),
          owner: ownerId,
          customerFirstName: order.billing?.first_name || '',
          customerLastName: order.billing?.last_name || '',
          customerPhone: order.billing?.phone || '',
          status: mapStatus(order.status),
          paymentStatus: order.status === 'completed' || order.status === 'processing' ? 'captured' : 'unpaid',
          fulfillmentStatus: order.status === 'completed' ? 'fulfilled' : 'unfulfilled',
          total: parseFloat(order.total || '0') * 100,
          taxTotal: parseFloat(order.total_tax || '0') * 100,
          shippingTotal: parseFloat(order.shipping_total || '0') * 100,
          discountTotal: parseFloat(order.discount_total || '0') * 100,
          subtotal: parseFloat(order.total || '0') * 100, // approx
          feeTotal: 0,
          createdAt: order.date_created ? new Date(order.date_created).toISOString() : new Date().toISOString(),
          updatedAt: order.date_modified ? new Date(order.date_modified).toISOString() : new Date().toISOString(),
          guestEmail: !ownerId ? order.billing?.email : undefined,
          items,
          shippingAddress: {
            line1: order.shipping?.address_1 || '',
            line2: order.shipping?.address_2 || '',
            city: order.shipping?.city || '',
            state: order.shipping?.state || '',
            postalCode: order.shipping?.postcode || '',
            country: order.shipping?.country || 'US',
          },
          billingAddress: {
            line1: order.billing?.address_1 || '',
            line2: order.billing?.address_2 || '',
            city: order.billing?.city || '',
            state: order.billing?.state || '',
            postalCode: order.billing?.postcode || '',
            country: order.billing?.country || 'US',
          }
        }
      })
    } catch (e: any) {
      console.error(`Error migrating order ${order.id}:`, e.message);
    }
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  
  console.log('--- Starting Migration ---')
  // Users and Coupons are fully migrated, skip to save time!
  // await migrateUsers(payload, false)
  // await migrateCoupons(payload, false)
  await migrateOrders(payload, false)
  
  console.log('--- Migration Complete ---')
  process.exit(0)
}

main().catch(console.error)
