import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'

const WC_URL = 'https://99puritypeptides.com/staging-v2/wp-json/wc/v3'
const WC_CK = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8'
const WC_CS = 'cs_259d976093d3af4594cd37d3df8114092e1cb934'
const authHeader = 'Basic ' + Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')

const SLICEWP_URL = 'https://99puritypeptides.com/staging-v2/wp-json/slicewp/v1'
const SW_CK = 'ck_t7ArhVAOqHcNEARZaEXJK58YCCwVpL'
const SW_CS = 'cs_3a6ohjTlrEromi3noxN5loPefeJTA0'

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

async function fetchSliceWpUsers() {
  let allData: any[] = []
  let offset = 0
  
  do {
    const url = new URL(`${SLICEWP_URL}/affiliates`)
    url.searchParams.append('consumer_key', SW_CK)
    url.searchParams.append('consumer_secret', SW_CS)
    url.searchParams.append('per_page', '100')
    url.searchParams.append('offset', offset.toString())
    
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`SliceWP API Error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (data.length === 0) break;
    allData = allData.concat(data)
    offset += data.length
  } while (true)
  
  return allData
}

async function mapAffiliateCoupons(payload: any) {
  const coupons = await fetchWc('/coupons')
  console.log(`Fetched ${coupons.length} coupons from WC`)
  
  const affiliates = await fetchSliceWpUsers()
  console.log(`Fetched ${affiliates.length} affiliates from SliceWP`)

  let mappedCount = 0;

  for (const coupon of coupons) {
    const swMeta = coupon.meta_data?.find((m: any) => m.key === 'slicewp_affiliate_id')
    if (swMeta && swMeta.value) {
      const swAffiliateId = parseInt(swMeta.value, 10)
      console.log(`Coupon ${coupon.code} belongs to SW Affiliate ID ${swAffiliateId}`);
      
      // Find the SW Affiliate to get their user_id
      const swAffiliate = affiliates.find(a => parseInt(a.id, 10) === swAffiliateId)
      if (!swAffiliate) {
        console.log(` > SW Affiliate ${swAffiliateId} not found in fetched affiliates!`);
        continue;
      }

      // Find the Payload User via woocommerce_id
      const userRes = await payload.find({
        collection: 'users',
        where: { 'metadata.woocommerce_id': { equals: parseInt(swAffiliate.user_id, 10) } }
      })
      if (userRes.totalDocs === 0) {
        console.log(` > Payload User not found for woocommerce_id ${swAffiliate.user_id}`);
        continue;
      }

      // Find the Payload Affiliate via Payload User ID
      const affRes = await payload.find({
        collection: 'affiliates',
        where: { user: { equals: userRes.docs[0].id } }
      })
      if (affRes.totalDocs === 0) {
         console.log(` > Payload Affiliate not found for user ${userRes.docs[0].email}`);
         continue;
      }

      const payloadAffiliateId = affRes.docs[0].id

      // Find the Payload Coupon
      const couponRes = await payload.find({
        collection: 'coupons',
        where: { code: { equals: coupon.code.toUpperCase() } }
      })
      if (couponRes.totalDocs === 0) {
         console.log(` > Payload Coupon not found for code ${coupon.code.toUpperCase()}`);
         continue;
      }

      const payloadCouponId = couponRes.docs[0].id

      try {
        await payload.update({
          collection: 'affiliates',
          id: payloadAffiliateId,
          data: {
            couponCode: coupon.code.toUpperCase(),
            coupon: payloadCouponId
          }
        })
        console.log(`Mapped Coupon ${coupon.code} to Affiliate ${affRes.docs[0].referralSlug}`)
        mappedCount++;
      } catch(e: any) {
        console.error(`Failed to map coupon ${coupon.code}`, e.message)
      }
    }
  }
  
  console.log(`Successfully mapped ${mappedCount} coupons to affiliates!`)
}

async function main() {
  const payload = await getPayload({ config })
  await mapAffiliateCoupons(payload)
  process.exit(0)
}

main().catch(console.error)
