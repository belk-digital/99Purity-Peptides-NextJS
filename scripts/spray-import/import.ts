import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_PATH = path.resolve(__dirname, 'content.txt')
const IMAGES_DIR = 'C:/Users/aquib/Downloads/spray images'

// Each entry: block index in content.txt (0-based, in file order), product key, display name,
// variants (sku suffix, strength label, price, image filename), and whether to strip a specific
// strength token from the shared block text (for blocks that were written for a single strength
// but are reused across multiple variants).
const PRODUCTS = [
  {
    blockIndex: 0,
    name: 'Semax Spray',
    slug: 'semax-spray',
    stripToken: null,
    variants: [
      { suffix: '5mg', strength: '5mg', price: 75, image: 'SEMAX spray 5mg.png' },
    ],
  },
  {
    blockIndex: 1, // Selank 100mcg block used as canonical text
    name: 'Selank Spray',
    slug: 'selank-spray',
    stripToken: '100mcg',
    variants: [
      { suffix: '100mcg', strength: '100mcg', price: 75, image: 'SELANK spray 100mcg.png' },
      { suffix: '300mcg', strength: '300mcg', price: 85, image: 'SELANK spray 300mcg.png' },
    ],
  },
  {
    blockIndex: 3,
    name: 'Semax + Selank Spray',
    slug: 'semax-selank-spray',
    stripToken: null,
    variants: [
      { suffix: '300mcg', strength: '300mcg', price: 120, image: 'SEMAX + SELANK  spray 300mcg.png' },
    ],
  },
  {
    blockIndex: 4,
    name: 'Oxytocin Spray',
    slug: 'oxytocin-spray',
    stripToken: null,
    variants: [
      { suffix: '10mg', strength: '10mg', price: 85, image: 'OXYTOCIN spray10mg.png' },
    ],
  },
  {
    blockIndex: 5,
    name: 'PT-141 Spray',
    slug: 'pt-141-spray',
    stripToken: null,
    variants: [
      { suffix: '10mg', strength: '10mg', price: 85, image: 'PT-141  spray 10mg.png' },
    ],
  },
  {
    blockIndex: 6, // Epitalon 10mg block used as canonical text
    name: 'Epitalon Spray',
    slug: 'epitalon-spray',
    stripToken: '10mg',
    variants: [
      { suffix: '10mg', strength: '10mg', price: 75, image: 'EPITALON spray 10mg.png' },
      { suffix: '50mg', strength: '50mg', price: 85, image: 'EPITALON spray 50mg.png' },
    ],
  },
  {
    blockIndex: 7,
    name: 'DSIP Spray',
    slug: 'dsip-spray',
    stripToken: null,
    variants: [
      { suffix: '10mg', strength: '10mg', price: 75, image: 'DSIP spray 10mg.png' },
    ],
  },
  {
    blockIndex: 8,
    name: 'KPV Spray',
    slug: 'kpv-spray',
    stripToken: null,
    variants: [
      { suffix: '5mg', strength: '5mg', price: 85, image: 'KPV spray 5mg.png' },
    ],
  },
  {
    blockIndex: 9,
    name: 'VIP Spray',
    slug: 'vip-spray',
    stripToken: null,
    variants: [
      { suffix: '10mg', strength: '10mg', price: 85, image: 'VIP spray 10mg.png' },
    ],
  },
  {
    blockIndex: 10, // already generic across both strengths
    name: 'GHK-Cu Spray',
    slug: 'ghk-cu-spray',
    stripToken: null,
    variants: [
      { suffix: '50mg', strength: '50mg', price: 75, image: 'GHK-CU spray 50mg.png' },
      { suffix: '100mg', strength: '100mg', price: 85, image: 'GHK-CU 100mg.png' },
    ],
  },
  {
    blockIndex: 11, // already generic across both strengths
    name: 'BPC-157 Spray',
    slug: 'bpc-157-spray',
    stripToken: null,
    variants: [
      { suffix: '5mg', strength: '5mg', price: 75, image: 'BPC-157 spray 5mg.png' },
      { suffix: '10mg', strength: '10mg', price: 85, image: 'BPC-157 spray 10mg.png' },
    ],
  },
  {
    blockIndex: 12, // already generic across both strengths
    name: 'NAD+ Spray',
    slug: 'nad-spray',
    stripToken: null,
    variants: [
      { suffix: '50mg', strength: '50mg', price: 75, image: 'NAD+ spray 50mg.png' },
      { suffix: '100mg', strength: '100mg', price: 85, image: 'NAD+ spray 100mg.png' },
    ],
  },
  {
    blockIndex: 13,
    name: 'MT-2 Spray',
    slug: 'mt-2-spray',
    stripToken: null,
    variants: [
      { suffix: '10mg', strength: '10mg', price: 75, image: 'MT-2 spray 10mg.png' },
    ],
  },
]

function parseBlocks(raw: string) {
  // strip BOM and normalize line endings
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n')
  // Products are separated by a line followed by "<Name>\nFocus Keyphrase\n" (blank-line count is inconsistent in the source doc)
  const productTexts = text.split(/\n+(?=.+\nFocus Keyphrase\n)/).filter((p) => p.trim())
  // Within each product, sections are separated by a "________________" line (blank-line count after it varies too)
  return productTexts.map((p) => p.split(/\n________________\n+/).map((chunk) => chunk.trim()))
}

function section(chunk: string, label: string): string {
  const lines = chunk.split('\n')
  if (lines[0].trim() !== label) {
    throw new Error(`Expected section "${label}" but got "${lines[0]}" in chunk:\n${chunk.slice(0, 80)}`)
  }
  return lines.slice(1).join('\n').trim()
}

function bullets(chunk: string, label: string): string {
  const body = section(chunk, label)
  return body
    .split('\n')
    .map((l) => l.replace(/^\*\s*/, '').trim())
    .filter(Boolean)
    .map((l) => `- ${l}`)
    .join('\n')
}

function parseFaqs(chunk: string): { question: string; answer: string }[] {
  const lines = chunk.split('\n').slice(1) // drop "Product-Specific FAQs (GEO Optimized)" header
  const faqs: { question: string; answer: string }[] = []
  let current: { question: string; answer: string } | null = null
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const qMatch = line.match(/^\d+\.\s*(.+)$/)
    if (qMatch) {
      if (current) faqs.push(current)
      current = { question: qMatch[1].trim(), answer: '' }
    } else if (current) {
      current.answer = current.answer ? `${current.answer} ${line}` : line
    }
  }
  if (current) faqs.push(current)
  return faqs
}

function stripStrength(text: string, token: string | null): string {
  if (!token) return text
  return text
    .replace(new RegExp(`\\s*${token}`, 'g'), '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .trim()
}

const DRY_RUN = process.argv.includes('--dry-run')

async function run() {
  if (DRY_RUN) {
    console.log('=== DRY RUN — no database writes, just showing parsed content ===\n')
    const rawContent = fs.readFileSync(CONTENT_PATH, 'utf-8')
    const blocks = parseBlocks(rawContent)
    for (const product of PRODUCTS) {
      const chunks = blocks[product.blockIndex]
      const seoTitle = stripStrength(section(chunks[1], 'SEO Title'), product.stripToken)
      const metaDesc = stripStrength(section(chunks[2], 'Meta Description'), product.stripToken)
      const shortDesc = stripStrength(section(chunks[5], 'Short Description'), product.stripToken)
      const researchFocus = bullets(chunks[8], 'Research Focus & Mechanism Overview')
      const qualityPurity = bullets(chunks[9], 'Quality & Purity Standards')
      const compliance = stripStrength(section(chunks[10], 'Compliance Notice'), product.stripToken)
      const faqs = parseFaqs(chunks[11]).map((f) => ({
        question: stripStrength(f.question, product.stripToken),
        answer: stripStrength(f.answer, product.stripToken),
      }))
      console.log('='.repeat(80))
      console.log(`PRODUCT: ${product.name}  (slug: ${product.slug})`)
      console.log(`variants: ${product.variants.map((v) => `${v.strength}=$${v.price} [${v.image}]`).join(', ')}`)
      console.log(`SEO Title: ${seoTitle}`)
      console.log(`Meta Description: ${metaDesc}`)
      console.log(`Short Description: ${shortDesc}`)
      console.log(`Research Focus:\n${researchFocus}`)
      console.log(`Quality & Purity:\n${qualityPurity}`)
      console.log(`Compliance: ${compliance}`)
      console.log(`FAQs (${faqs.length}):`)
      for (const f of faqs) console.log(`  Q: ${f.question}\n  A: ${f.answer}`)
      for (const v of product.variants) {
        const filePath = path.join(IMAGES_DIR, v.image)
        console.log(`  image exists [${v.image}]: ${fs.existsSync(filePath)}`)
      }
    }
    process.exit(0)
  }

  const dotenv = await import('dotenv')
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })

  const { getPayload } = await import('payload')
  const config = (await import('../../src/payload.config')).default
  const payload = await getPayload({ config })

  console.log('Ensuring "Nasal Sprays" category exists...')
  const existingCategory = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'nasal-sprays' } },
    limit: 1,
  })
  let categoryId: string | number
  if (existingCategory.docs.length > 0) {
    categoryId = existingCategory.docs[0].id
    console.log('Category already exists, reusing:', categoryId)
  } else {
    const created = await payload.create({
      collection: 'categories',
      data: { name: 'Nasal Sprays', slug: 'nasal-sprays', isVisible: true } as any,
    })
    categoryId = created.id
    console.log('Created category:', categoryId)
  }

  const rawContent = fs.readFileSync(CONTENT_PATH, 'utf-8')
  const blocks = parseBlocks(rawContent)

  const mediaCache = new Map<string, string | number>()
  async function uploadImage(filename: string, alt: string): Promise<string | number> {
    if (mediaCache.has(filename)) return mediaCache.get(filename)!
    const filePath = path.join(IMAGES_DIR, filename)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Image not found: ${filePath}`)
    }
    const fileData = fs.readFileSync(filePath)
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: fileData,
        mimetype: 'image/png',
        name: filename,
        size: fs.statSync(filePath).size,
      },
    })
    mediaCache.set(filename, media.id)
    return media.id
  }

  for (const product of PRODUCTS) {
    console.log(`\nProcessing: ${product.name}`)

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  Skipping — product with slug "${product.slug}" already exists.`)
      continue
    }

    const chunks = blocks[product.blockIndex]

    const seoTitleRaw = section(chunks[1], 'SEO Title')
    const metaDescRaw = section(chunks[2], 'Meta Description')
    const shortDescRaw = section(chunks[5], 'Short Description')
    const mediumDescRaw = section(chunks[6], 'Medium Description')
    const productDescRaw = section(chunks[7], 'Product Description')
    const researchFocus = bullets(chunks[8], 'Research Focus & Mechanism Overview')
    const qualityPurity = bullets(chunks[9], 'Quality & Purity Standards')
    const complianceRaw = section(chunks[10], 'Compliance Notice')
    const faqsRaw = parseFaqs(chunks[11])

    const seoTitle = stripStrength(seoTitleRaw, product.stripToken)
    const metaDesc = stripStrength(metaDescRaw, product.stripToken)
    const shortDesc = stripStrength(shortDescRaw, product.stripToken)
    const mediumDesc = stripStrength(mediumDescRaw, product.stripToken)
    const productDesc = stripStrength(productDescRaw, product.stripToken)
    const compliance = stripStrength(complianceRaw, product.stripToken)
    const faqs = faqsRaw.map((f) => ({
      question: stripStrength(f.question, product.stripToken),
      answer: stripStrength(f.answer, product.stripToken),
    }))

    const hasVariants = product.variants.length > 1

    // Upload images for each variant
    const variantImageIds: (string | number)[] = []
    for (const v of product.variants) {
      const id = await uploadImage(v.image, `${product.name} ${v.strength}`)
      variantImageIds.push(id)
    }

    const payloadData: any = {
      name: product.name,
      description: shortDesc,
      seoTitle,
      seoDescription: metaDesc,
      slug: product.slug,
      price: product.variants[0].price,
      stock: 500,
      categories: [categoryId],
      images: [{ image: variantImageIds[0] }],

      hasVariants,
      ...(hasVariants
        ? {
            variants: product.variants.map((v, i) => ({
              sku: `${product.slug}-${v.suffix}`,
              images: [{ image: variantImageIds[i] }],
              price: v.price,
              stock: 500,
              options: [{ key: 'Strength', value: v.strength }],
            })),
          }
        : {
            sku: `${product.slug}-${product.variants[0].suffix}`,
          }),

      productDetailsTitle: 'Product Details',
      productDetailsDescription: `${mediumDesc}\n\n${productDesc}`,

      researchFocusTitle: 'Research Focus & Mechanism Overview',
      researchFocusDescription: researchFocus,

      qualityPurityTitle: 'Quality & Purity Standards',
      qualityPurityDescription: qualityPurity,

      complianceNoticeTitle: 'Compliance Notice',
      complianceNoticeDescription: compliance,

      faqs,
      status: 'active',
      isVisible: true,
    }

    await payload.create({ collection: 'products', data: payloadData })
    console.log(`  Created: ${product.name} (${product.variants.length} variant(s))`)
  }

  console.log('\nDone.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during import:', err)
  process.exit(1)
})
