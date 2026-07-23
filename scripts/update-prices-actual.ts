import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1000,
  })

  let updatedCount = 0;

  for (const p of products.docs) {
    const isSpray = p.categories?.some((c: any) => c.name?.toLowerCase().includes('spray')) || p.name.toLowerCase().includes('spray')
    
    if (isSpray) {
      console.log(`Skipping spray: ${p.name}`)
      continue
    }

    let needsUpdate = false
    let newPrice = p.price + 5
    
    let newVariants = p.variants ? [...p.variants] : []
    
    if (p.hasVariants && p.variants) {
      newVariants = p.variants.map((v: any) => {
        let kitSizeStr = v.options?.find((o: any) => o.key === 'Kit Sizes')?.value || ''
        let is10Kit = kitSizeStr.includes('10 Kit') || v.sku.toLowerCase().endsWith('-k10')
        let is5Kit = kitSizeStr.includes('5 Kit') || v.sku.toLowerCase().endsWith('-k5')
        
        let inc = 5
        if (is10Kit) inc = 50
        else if (is5Kit) inc = 25
        
        console.log(`  -> Variant ${v.sku}: ${v.price} => ${v.price + inc}`)
        return {
          ...v,
          price: v.price + inc
        }
      })
      needsUpdate = true
    }

    console.log(`Updating product ${p.name} base price: ${p.price} => ${newPrice}`)
    needsUpdate = true

    if (needsUpdate) {
      try {
        await payload.update({
          collection: 'products',
          id: p.id,
          data: {
            price: newPrice,
            variants: newVariants.length > 0 ? newVariants : undefined
          }
        })
        updatedCount++
      } catch (err) {
        console.error(`Failed to update ${p.name}:`, err)
      }
    }
  }

  console.log(`Update complete. Updated ${updatedCount} products.`)
  process.exit(0)
}

run()
