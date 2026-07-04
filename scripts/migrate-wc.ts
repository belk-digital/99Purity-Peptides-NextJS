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

    // Check if exists
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
      const addr = await payload.create({
        collection: 'addresses',
        data: {
          user: payloadUser.id,
          label: 'Default Billing',
          firstName: user.billing.first_name || user.first_name || '',
          lastName: user.billing.last_name || user.last_name || '',
          company: user.billing.company || '',
          line1: user.billing.address_1,
          line2: user.billing.address_2 || '',
          city: user.billing.city || '',
          state: user.billing.state || '',
          postalCode: user.billing.postcode || '',
          country: user.billing.country || 'US',
          phone: user.billing.phone || '0000000000',
          isDefaultBilling: true,
          isDefaultShipping: false,
        }
      })
      billingAddrId = addr.id
    }

    if (user.shipping && user.shipping.address_1) {
      const addr = await payload.create({
        collection: 'addresses',
        data: {
          user: payloadUser.id,
          label: 'Default Shipping',
          firstName: user.shipping.first_name || user.first_name || '',
          lastName: user.shipping.last_name || user.last_name || '',
          company: user.shipping.company || '',
          line1: user.shipping.address_1,
          line2: user.shipping.address_2 || '',
          city: user.shipping.city || '',
          state: user.shipping.state || '',
          postalCode: user.shipping.postcode || '',
          country: user.shipping.country || 'US',
          phone: user.billing?.phone || '0000000000',
          isDefaultBilling: false,
          isDefaultShipping: true,
        }
      })
      shippingAddrId = addr.id
    }

    // Update user with default addresses
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
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  
  console.log('Running test migration for 1 user...')
  await migrateUsers(payload, true)
  
  console.log('Test complete. Exiting.')
  process.exit(0)
}

main().catch(console.error)
