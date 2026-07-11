import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })

import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  const all = await payload.find({
    collection: 'coupons',
    limit: 1000,
    overrideAccess: true,
  })

  let updated = 0
  let skippedKits = 0
  let alreadySet = 0
  let failed = 0

  for (const coupon of all.docs) {
    if (coupon.code === 'KITS15') {
      skippedKits++
      continue
    }
    if (coupon.applicableProductTypes === 'normal_only') {
      alreadySet++
      continue
    }
    try {
      await payload.update({
        collection: 'coupons',
        id: coupon.id,
        data: { applicableProductTypes: 'normal_only' },
        overrideAccess: true,
      })
      updated++
    } catch (err: any) {
      // Some legacy coupons reference deleted products/categories; full-document
      // validation rejects the update even though this field is unrelated.
      failed++
      console.error(`Failed to update coupon ${coupon.code} (id ${coupon.id}): ${err.message}`)
    }
  }

  console.log(`Updated: ${updated}, already normal_only: ${alreadySet}, skipped (KITS15): ${skippedKits}, failed: ${failed}, total: ${all.docs.length}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
