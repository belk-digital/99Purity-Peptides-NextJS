import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  console.log('Fetching products...')
  const { docs: products } = await payload.find({ 
    collection: 'products', 
    limit: 1000 
  })

  console.log(`Found ${products.length} products. Updating titles...`)
  
  let updatedCount = 0
  for (const product of products) {
    if (product.name.endsWith(' - Research Grade')) {
      const newName = product.name.replace(' - Research Grade', '')
      await payload.update({
        collection: 'products',
        id: product.id,
        data: { name: newName }
      })
      console.log(`Updated: ${product.name} -> ${newName}`)
      updatedCount++
    }
  }

  console.log(`Done! Successfully updated ${updatedCount} product titles.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during update:', err)
  process.exit(1)
})
