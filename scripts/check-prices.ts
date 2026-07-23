import { getPayload } from 'payload'
import config from '../src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1000,
  })

  console.log(`Found ${products.docs.length} products.`)

  for (const p of products.docs) {
    const isSpray = p.categories?.some((c: any) => c.name?.toLowerCase().includes('spray')) || p.name.toLowerCase().includes('spray')
    
    console.log(`\nProduct: ${p.name} | isSpray: ${isSpray} | Base Price: ${p.price}`)
    
    if (p.hasVariants && p.variants) {
      console.log('  Variants:')
      for (const v of p.variants) {
        console.log(`    SKU: ${v.sku} | Price: ${v.price} | Options: ${v.options?.map((o: any) => `${o.key}: ${o.value}`).join(', ')}`)
      }
    }

    if (p.bulkBundles && p.bulkBundles.length > 0) {
      console.log('  Bulk Bundles:')
      for (const b of p.bulkBundles) {
        console.log(`    Name: ${b.name} | Qty: ${b.quantity} | Price: ${b.price} | Discount: ${b.discountPercentage}`)
        if (b.variantOverrides) {
          console.log(`      Variant Overrides:`)
          for (const vo of b.variantOverrides) {
            console.log(`        SKU: ${vo.variantSku} | Price: ${vo.price}`)
          }
        }
      }
    }
  }

  process.exit(0)
}

check()
