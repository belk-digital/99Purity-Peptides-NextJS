import { getPayload } from 'payload'
import configPromise from './src/payload.config'
import fs from 'fs'
import path from 'path'

async function run() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config: configPromise })
  
  console.log('Fetching active products...')
  const result = await payload.find({
    collection: 'products',
    where: { status: { equals: 'active' } },
    limit: 1000,
  })
  
  const activeSlugs = result.docs.map(doc => doc.slug)
  console.log(`Found ${activeSlugs.length} active products.`)
  
  const configPath = path.join(process.cwd(), 'next.config.ts')
  let configStr = fs.readFileSync(configPath, 'utf8')
  
  let linesRemoved = 0
  activeSlugs.forEach(slug => {
    // We want to match: { source: '/product/<slug>', destination: '/', permanent: true },
    // and { source: '/:locale/product/<slug>', destination: '/:locale', permanent: true },
    const searchStr1 = `{ source: '/product/${slug}',`
    const searchStr2 = `{ source: '/:locale/product/${slug}',`
    
    const lines = configStr.split('\n')
    const initialLength = lines.length
    
    configStr = lines.filter(line => !line.includes(searchStr1) && !line.includes(searchStr2)).join('\n')
    
    if (configStr.split('\n').length < initialLength) {
      console.log(`Removed redirects for active product: ${slug}`)
      linesRemoved += (initialLength - configStr.split('\n').length)
    }
  })
  
  if (linesRemoved > 0) {
    fs.writeFileSync(configPath, configStr)
    console.log(`Successfully removed ${linesRemoved} redirect lines from next.config.ts`)
  } else {
    console.log('No matching redirects found to remove.')
  }
  
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
