import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'

async function upsertCoupon(payload: any, code: string, data: Record<string, any>) {
  const existing = await payload.find({
    collection: 'coupons',
    where: { code: { equals: code } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'coupons',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    console.log(`Updated coupon ${code}`)
  } else {
    await payload.create({
      collection: 'coupons',
      data: { code, ...data },
      overrideAccess: true,
    })
    console.log(`Created coupon ${code}`)
  }
}

async function main() {
  const payload = await getPayload({ config })

  await upsertCoupon(payload, 'PURITY25', {
    type: 'percentage',
    value: 25,
    isActive: true,
    applicableProductTypes: 'all',
    appliesTo: 'all',
  })

  await upsertCoupon(payload, 'NEW25', {
    type: 'percentage',
    value: 25,
    isActive: true,
    newCustomersOnly: true,
    applicableProductTypes: 'all',
    appliesTo: 'all',
  })

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
