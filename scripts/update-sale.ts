import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function run() {
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({ 
    collection: 'products', 
    limit: 1000 
  })

  // Pick 5 specific products to put on sale
  const saleProducts = products.filter(p => 
    ['Tirzepatide', 'Semax', 'NAD+', 'TB-500', 'BPC-157'].some(name => p.name.includes(name))
  )

  // If none match, just take the first 5
  const targets = saleProducts.length > 0 ? saleProducts : products.slice(0, 5)

  for (const product of targets) {
    const originalPrice = product.price || 100
    const salePrice = Math.floor(originalPrice * 0.8) // 20% off

    // Update variants if they exist
    let updatedVariants = product.variants
    if (product.hasVariants && product.variants?.length) {
      updatedVariants = product.variants.map((v: any) => ({
        ...v,
        salePrice: Math.floor((v.price || 100) * 0.8)
      }))
    }

    await payload.update({
      collection: 'products',
      id: product.id,
      data: { 
        salePrice: salePrice,
        variants: updatedVariants
      }
    })
    console.log(`Placed ${product.name} on sale! (Original: $${originalPrice}, Sale: $${salePrice})`)
  }

  console.log(`Successfully put ${targets.length} products on sale.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during update:', err)
  process.exit(1)
})
