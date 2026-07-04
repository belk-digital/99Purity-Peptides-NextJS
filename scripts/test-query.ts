import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
import { getPayload } from 'payload'
import config from '@payload-config'

async function testQuery() {
  const payload = await getPayload({ config })
  const aff = await payload.find({
    collection: 'affiliates',
    where: { id: { equals: 68 } },
    overrideAccess: true,
  })
  
  if (aff.totalDocs > 0) {
    const data = aff.docs[0]
    console.log("Stats for Affiliate 68:")
    console.log("Total Earned:", data.totalCommissionEarned)
    console.log("Total Approved:", data.totalCommissionApproved)
    console.log("Total Requested:", data.totalCommissionRequested)
    console.log("Total Paid:", data.totalCommissionPaid)
    console.log("Available Balance:", (data.totalCommissionApproved || 0) - (data.totalCommissionRequested || 0) - (data.totalCommissionPaid || 0))
  } else {
    console.log("Affiliate 68 not found.")
  }
  process.exit(0)
}

testQuery()
