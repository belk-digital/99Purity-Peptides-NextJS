import { getPayload } from 'payload'
import config from '../src/payload.config'
import 'dotenv/config'
import { Resend } from 'resend'

async function run() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY in environment variables')
    process.exit(1)
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY)

  console.log('Fetching all users...')
  const users = await payload.find({
    collection: 'users',
    limit: 10000,
    overrideAccess: true,
  })

  console.log(`Found ${users.docs.length} users. Syncing to Resend...`)

  let successCount = 0
  let errorCount = 0

  for (const user of users.docs) {
    console.log(`Processing ${user.email}...`)
    
    // Set acceptsMarketing to true in db if not already true
    if (!user.acceptsMarketing) {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          acceptsMarketing: true,
        },
        overrideAccess: true,
      })
    }
    
    const payloadObj: any = {
      email: user.email,
      unsubscribed: false,
    }
    if (user.firstName) payloadObj.firstName = user.firstName
    if (user.lastName) payloadObj.lastName = user.lastName
    if (process.env.RESEND_AUDIENCE_ID) {
      payloadObj.audienceId = process.env.RESEND_AUDIENCE_ID
    }
    
    try {
      const { error } = await resend.contacts.create(payloadObj)
      if (error) {
        console.error(`Resend API Error for ${user.email}:`, error)
        errorCount++
      } else {
        successCount++
      }
    } catch (err) {
      console.error(`Failed to add user ${user.email} to Resend:`, err)
      errorCount++
    }
  }

  console.log(`\nSync complete! Successfully synced ${successCount} users. Encountered ${errorCount} errors.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during sync:', err)
  process.exit(1)
})
