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

async function fixCoupons(payload: any) {
  const coupons = await fetchWc('/coupons')
  console.log(`Fetched ${coupons.length} coupons from WC for syncing`)
  
  for (const coupon of coupons) {
    if (!coupon.code) continue;

    const upperCode = coupon.code.toUpperCase();

    const existing = await payload.find({
      collection: 'coupons',
      where: { code: { equals: upperCode } }
    })

    const isExpired = coupon.date_expires && new Date(coupon.date_expires).getTime() < Date.now();

    const lockedEmails = Array.isArray(coupon.email_restrictions) 
      ? coupon.email_restrictions.map((e: string) => ({ email: e })) 
      : [];

    const discountType = coupon.discount_type === 'percent' ? 'percentage' : 'fixed_amount';
    const amount = parseFloat(coupon.amount);
    const val = discountType === 'fixed_amount' ? amount * 100 : amount;

    let appliesTo = 'all';
    let productsList: any[] = [];
    if (coupon.product_ids && coupon.product_ids.length > 0) {
      appliesTo = 'specific_products';
      for (const wcProductId of coupon.product_ids) {
        try {
          const res = await fetch(`${WC_URL}/products/${wcProductId}`, { headers: { Authorization: authHeader } })
          if (res.ok) {
            const wooProd = await res.json();
            const prodRes = await payload.find({
              collection: 'products',
              where: { name: { equals: wooProd.name } }
            });
            if (prodRes.totalDocs > 0) {
              productsList.push({ product: prodRes.docs[0].id });
            }
          }
        } catch(e) {
          console.error('Error fetching woo product', e);
        }
      }
    }

    const updateData = {
      code: upperCode,
      type: discountType,
      value: val,
      usageCount: coupon.usage_count || 0,
      usageLimit: coupon.usage_limit || undefined,
      freeShipping: coupon.free_shipping,
      excludeSaleItems: coupon.exclude_sale_items || false,
      minSpend: coupon.minimum_amount ? parseFloat(coupon.minimum_amount) * 100 : undefined,
      lockedEmails: lockedEmails,
      stackable: !coupon.individual_use,
      appliesTo: appliesTo,
      ...(appliesTo === 'specific_products' ? { products: productsList } : {}),
      // We skip expiresAt if it's in the past to avoid Payload validation errors
      ...(isExpired ? {} : { expiresAt: coupon.date_expires ? new Date(coupon.date_expires).toISOString() : undefined })
    }

    if (existing.totalDocs > 0) {
      console.log(`Updating existing coupon: ${coupon.code}`)
      try {
        await payload.update({
          collection: 'coupons',
          id: existing.docs[0].id,
          data: updateData
        })
      } catch (err: any) {
        console.error(`Failed to update coupon ${coupon.code}:`, err.message)
      }
    } else {
      console.log(`Creating missing coupon: ${coupon.code}`)
      try {
        await payload.create({
          collection: 'coupons',
          data: {
            ...updateData,
            applicableProductTypes: 'all'
          }
        })
      } catch (err: any) {
        console.error(`Failed to create coupon ${coupon.code}:`, err.message)
      }
    }
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('--- Starting Coupon Fix Migration ---')
  await fixCoupons(payload)
  console.log('--- Coupon Fix Migration Complete ---')
  process.exit(0)
}

main().catch(console.error)
