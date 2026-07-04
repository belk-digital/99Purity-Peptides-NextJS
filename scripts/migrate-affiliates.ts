import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'

const SLICEWP_URL = 'https://99puritypeptides.com/staging-v2/wp-json/slicewp/v1'
const CK = 'ck_t7ArhVAOqHcNEARZaEXJK58YCCwVpL'
const CS = 'cs_3a6ohjTlrEromi3noxN5loPefeJTA0'

async function fetchSliceWP(endpoint: string) {
  let allData: any[] = []
  let offset = 0
  
  do {
    const url = new URL(`${SLICEWP_URL}/${endpoint}`)
    url.searchParams.append('consumer_key', CK)
    url.searchParams.append('consumer_secret', CS)
    url.searchParams.append('per_page', '100')
    url.searchParams.append('offset', offset.toString())
    
    console.log(`Fetching ${url.toString()}...`)
    const res = await fetch(url.toString())
    
    if (!res.ok) {
      throw new Error(`SliceWP API Error: ${res.status} ${res.statusText}`)
    }
    
    const data = await res.json()
    if (data.length === 0) break;
    
    allData = allData.concat(data)
    offset += data.length
  } while (true)
  
  return allData
}

const slicewpToPayloadAffiliateMap = new Map<number, string>()
const slicewpToPayloadCommissionMap = new Map<number, string>()

async function migrateAffiliates(payload: any) {
  const affiliates = await fetchSliceWP('affiliates')
  console.log(`Fetched ${affiliates.length} affiliates from SliceWP`)
  
  for (const aff of affiliates) {
    if (!aff.user_id) continue;
    
    // The slug is often the 'aff=' part of the default_referral_url
    let referralSlug = ''
    if (aff.default_referral_url) {
      const urlParams = new URLSearchParams(aff.default_referral_url.split('?')[1] || '')
      referralSlug = urlParams.get('aff') || ''
    }

    console.log(`Processing Affiliate for WooCommerce User ID: ${aff.user_id} (slug: ${referralSlug})`)

    const existing = await payload.find({
      collection: 'affiliates',
      where: { referralSlug: { equals: referralSlug } }
    })
    
    if (existing.totalDocs > 0) {
      console.log(`Affiliate ${referralSlug} already exists.`)
      slicewpToPayloadAffiliateMap.set(aff.id, existing.docs[0].id)
      continue
    }

    const userRes = await payload.find({
      collection: 'users',
      where: { 'metadata.woocommerce_id': { equals: parseInt(aff.user_id, 10) } }
    })

    if (userRes.totalDocs === 0) {
      console.log(`Payload User not found for WooCommerce User ID ${aff.user_id}, skipping affiliate.`)
      continue
    }

    try {
      const createdAffiliate = await payload.create({
        collection: 'affiliates',
        data: {
          user: userRes.docs[0].id,
          status: aff.status === 'active' ? 'approved' : (aff.status === 'rejected' ? 'rejected' : 'pending'),
          applicationDate: aff.date_created ? new Date(aff.date_created).toISOString() : undefined,
          approvedAt: aff.status === 'active' && aff.date_created ? new Date(aff.date_created).toISOString() : undefined,
          referralSlug: referralSlug,
          payoutCurrency: 'USD',
          websiteUrl: aff.website || undefined,
          payoutMethods: aff.payment_email ? [{
            type: 'paypal',
            isPrimary: true,
            paypalEmail: aff.payment_email
          }] : undefined
        }
      })
      slicewpToPayloadAffiliateMap.set(aff.id, createdAffiliate.id)
    } catch (err: any) {
      console.error(`Error migrating affiliate ${referralSlug}:`, err.message)
    }
  }

  // Second pass: link parent affiliates
  for (const aff of affiliates) {
    if (aff.parent_id && aff.parent_id !== 0) {
      const childPayloadId = slicewpToPayloadAffiliateMap.get(aff.id)
      const parentPayloadId = slicewpToPayloadAffiliateMap.get(aff.parent_id)
      if (childPayloadId && parentPayloadId) {
        try {
          await payload.update({
            collection: 'affiliates',
            id: childPayloadId,
            data: { parentAffiliate: parentPayloadId }
          })
        } catch (e) {}
      }
    }
  }
}

async function migrateCommissions(payload: any) {
  const commissions = await fetchSliceWP('commissions')
  console.log(`Fetched ${commissions.length} commissions from SliceWP`)
  
  const slicewpAffiliates = await fetchSliceWP('affiliates')

  for (const comm of commissions) {
    if (!comm.affiliate_id || !comm.reference) continue;

    console.log(`Processing Commission ${comm.id} for Affiliate ${comm.affiliate_id}`)

    const swAff = slicewpAffiliates.find((a: any) => a.id === comm.affiliate_id)
    if (!swAff) continue;

    const userRes = await payload.find({
      collection: 'users',
      where: { 'metadata.woocommerce_id': { equals: parseInt(swAff.user_id, 10) } }
    })
    
    if (userRes.totalDocs === 0) continue;
    
    const affiliateRes = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: userRes.docs[0].id } }
    })
    
    if (affiliateRes.totalDocs === 0) continue;
    const payloadAffiliateId = affiliateRes.docs[0].id

    // 2. Find the Payload Order by woo order number (comm.reference)
    const orderRes = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: comm.reference } }
    })
    
    if (orderRes.totalDocs === 0) {
      console.log(`Order ${comm.reference} not found in Payload, skipping commission ${comm.id}`)
      continue;
    }
    const payloadOrderId = orderRes.docs[0].id

    // Check if conversion already exists
    const existing = await payload.find({
      collection: 'affiliate-conversions',
      where: { order: { equals: payloadOrderId } }
    })
    if (existing.totalDocs > 0) {
      slicewpToPayloadCommissionMap.set(comm.id, existing.docs[0].id)
      continue;
    }

    try {
      const createdConv = await payload.create({
        collection: 'affiliate-conversions',
        data: {
          affiliate: payloadAffiliateId,
          order: payloadOrderId,
          commissionAmount: parseFloat(comm.amount || '0') * 100, // Cents
          eligibleSubtotal: parseFloat(comm.reference_amount || '0') * 100,
          status: comm.status === 'unpaid' ? 'approved' : (comm.status === 'rejected' ? 'voided' : 'paid'),
          approvedAt: comm.date_created ? new Date(comm.date_created).toISOString() : new Date().toISOString()
        }
      })
      slicewpToPayloadCommissionMap.set(comm.id, createdConv.id)
    } catch (err: any) {
      console.error(`Error migrating commission ${comm.id}:`, err.message)
    }
  }
}

async function migratePayments(payload: any) {
  const payments = await fetchSliceWP('payments')
  console.log(`Fetched ${payments.length} payments from SliceWP`)

  const slicewpAffiliates = await fetchSliceWP('affiliates')
  
  for (const pay of payments) {
    if (!pay.affiliate_id) continue;

    const swAff = slicewpAffiliates.find((a: any) => a.id === pay.affiliate_id)
    if (!swAff) continue;

    const userRes = await payload.find({
      collection: 'users',
      where: { 'metadata.woocommerce_id': { equals: parseInt(swAff.user_id, 10) } }
    })
    if (userRes.totalDocs === 0) continue;

    const affiliateRes = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: userRes.docs[0].id } }
    })
    if (affiliateRes.totalDocs === 0) continue;
    const payloadAffiliateId = affiliateRes.docs[0].id

    // Map commission IDs
    const payloadConversionIds: string[] = []
    if (Array.isArray(pay.commission_ids)) {
      for (const cid of pay.commission_ids) {
        const pid = slicewpToPayloadCommissionMap.get(cid)
        if (pid) payloadConversionIds.push(pid)
      }
    }

    if (payloadConversionIds.length === 0) {
      console.log(`Skipping payment ${pay.id} because it has no mapped conversions in Payload.`)
      continue
    }

    let pMethod = 'bank_wire'
    if (pay.payout_method && pay.payout_method.toLowerCase().includes('paypal')) pMethod = 'paypal'

    try {
      await payload.create({
        collection: 'affiliate-payouts',
        data: {
          affiliate: payloadAffiliateId,
          totalAmountCents: parseFloat(pay.amount || '0') * 100,
          currency: (pay.currency || 'USD').toUpperCase(),
          paymentMethod: pMethod,
          status: pay.status === 'paid' ? 'paid' : 'processing',
          paidAt: pay.date_created ? new Date(pay.date_created).toISOString() : new Date().toISOString(),
          conversions: payloadConversionIds,
          conversionCount: payloadConversionIds.length
        }
      })
    } catch (err: any) {
      console.error(`Error migrating payment ${pay.id}:`, err.message)
    }
  }
}

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  
  console.log('--- Starting SliceWP Affiliates Migration ---')
  await migrateAffiliates(payload)
  await migrateCommissions(payload)
  await migratePayments(payload)
  
  console.log('--- SliceWP Affiliates Migration Complete ---')
  process.exit(0)
}

main().catch(console.error)
