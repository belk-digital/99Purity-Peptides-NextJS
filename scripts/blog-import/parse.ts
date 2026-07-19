import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import mammoth from 'mammoth'
import { JSDOM } from 'jsdom'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const SOURCE_DIR = process.argv[2] || 'C:\\Users\\aquib\\Downloads\\Products_Blog_post'
const OUT_DIR = path.resolve(process.cwd(), 'scripts/blog-import/parsed')

const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
  { category: 'Recovery protocols', keywords: ['bpc-157', 'tb-500', 'thymosin', 'kpv', 'ghk', 'wound', 'recovery'] },
  { category: 'Growth research', keywords: ['ghrp', 'cjc', 'ipamorelin', 'hgh', 'sermorelin', 'tesamorelin', 'growth'] },
  { category: 'Metabolic research', keywords: ['retatrutide', 'semaglutide', 'tirzepatide', 'aod', 'metabolic', 'glp'] },
  { category: 'Muscle studies', keywords: ['follistatin', 'muscle', 'myostatin', 'ace-031'] },
]

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\.docx$/i, '')
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function toSlug(str: string): string {
  return normalize(str).replace(/\s+/g, '-')
}

function guessCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) return category
  }
  return 'Product Guides'
}

function linkifyUrls(html: string): string {
  // Reference sections list plain-text URLs (not real Word hyperlinks); mammoth
  // leaves them as bare text. Skip paragraphs that already contain a real link.
  if (html.includes('<a ')) return html
  return html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
}

function tokenOverlapScore(a: string, b: string): number {
  const aTokens = new Set(a.split(' ').filter(Boolean))
  const bTokens = new Set(b.split(' ').filter(Boolean))
  if (aTokens.size === 0 || bTokens.size === 0) return 0
  let shared = 0
  for (const t of aTokens) if (bTokens.has(t)) shared++
  return shared / Math.max(aTokens.size, bTokens.size)
}

type ParsedPost = {
  sourceFile: string
  slug: string
  metaTitle: string
  metaDescription: string
  h1: string
  bodyHtml: string
  faqs: { question: string; answer: string }[]
  category: string
  matchedProduct: { id: string; name: string; slug: string } | null
  matchScore: number
  matchStatus: 'matched' | 'needs-review' | 'no-match'
}

async function extractFaqs(schemaText: string): Promise<{ question: string; answer: string }[]> {
  const blocks = schemaText.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
  for (const block of blocks) {
    const jsonText = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim()
    try {
      const parsed = JSON.parse(jsonText)
      if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
        return parsed.mainEntity.map((q: any) => ({
          question: q.name || '',
          answer: q.acceptedAnswer?.text || '',
        })).filter((f: any) => f.question && f.answer)
      }
    } catch {
      // not valid JSON on its own — ignore
    }
  }
  return []
}

async function parseFile(filePath: string): Promise<ParsedPost | null> {
  const fileName = path.basename(filePath)
  const { value: html } = await mammoth.convertToHtml({ path: filePath })
  const dom = new JSDOM(`<body>${html}</body>`)
  const elements = Array.from(dom.window.document.body.children) as any[]

  let phase: 'meta' | 'body' | 'schema' = 'meta'
  let skipSection = false
  let metaTitle = ''
  let metaDescription = ''
  let h1 = ''
  // Some docs write "Meta Title:" / "Meta Description:" inline with the value on the
  // same line; others write the label alone on its own paragraph with the value on the
  // NEXT paragraph. Track which label we're expecting a value for.
  let expectingMetaValue: 'title' | 'description' | null = null
  const bodyParts: string[] = []
  const schemaLines: string[] = []

  for (const el of elements) {
    const text = (el.textContent || '').trim()
    if (!text) continue

    if (phase === 'meta') {
      if (expectingMetaValue === 'title') {
        metaTitle = text
        expectingMetaValue = null
        continue
      }
      if (expectingMetaValue === 'description') {
        metaDescription = text
        expectingMetaValue = null
        continue
      }
      if (/^Meta Title:?\s*$/i.test(text)) {
        expectingMetaValue = 'title'
        continue
      }
      if (/^Meta Description:?\s*$/i.test(text)) {
        expectingMetaValue = 'description'
        continue
      }
      if (/^Meta Title:/i.test(text)) {
        metaTitle = text.replace(/^Meta Title:\s*/i, '')
        continue
      }
      if (/^Meta Description:/i.test(text)) {
        metaDescription = text.replace(/^Meta Description:\s*/i, '')
        continue
      }
      if (/^H1:/i.test(text)) {
        h1 = text.replace(/^H1:\s*/i, '')
        phase = 'body'
        continue
      }
      // "META INFORMATION", "BLOG POST", product name header, etc — skip
      continue
    }

    if (phase === 'body') {
      if (/^SCHEMA MARKUP/i.test(text)) {
        phase = 'schema'
        continue
      }
      if (/^H2:/i.test(text)) {
        const headingText = text.replace(/^H2:\s*/i, '')
        // Some docs have an editorial "Internal Links" section (unresolved [INTERNAL
        // LINK: ...] placeholders) and/or a plain-text FAQ section duplicating the
        // FAQPage JSON-LD block we already render via <FaqSection>. Drop both entirely
        // rather than publish placeholder text or duplicate content.
        skipSection = /internal links?/i.test(headingText) || /frequently asked questions/i.test(headingText)
        if (skipSection) continue
        bodyParts.push(`<h2>${headingText}</h2>`)
        continue
      }
      if (/^H3:/i.test(text)) {
        if (skipSection) continue
        bodyParts.push(`<h3>${text.replace(/^H3:\s*/i, '')}</h3>`)
        continue
      }
      if (/^H4:/i.test(text)) {
        if (skipSection) continue
        bodyParts.push(`<h4>${text.replace(/^H4:\s*/i, '')}</h4>`)
        continue
      }
      if (skipSection || /^\[INTERNAL LINK:/i.test(text)) continue
      bodyParts.push(linkifyUrls(el.outerHTML))
      continue
    }

    if (phase === 'schema') {
      schemaLines.push(text)
    }
  }

  if (!h1) {
    console.warn(`  ! No "H1:" marker found in ${fileName} — skipping`)
    return null
  }

  // Some docs leave an editorial char-count note on the meta lines, e.g.
  // "...Complete Guide) Length: 81 characters" — strip it before using the value.
  const stripLengthNote = (s: string) => s.replace(/\s*\(?Length:\s*\d+\s*characters\)?\.?\s*$/i, '').trim()
  metaTitle = stripLengthNote(metaTitle)
  metaDescription = stripLengthNote(metaDescription)

  // A handful of docs write H1 in ALL CAPS (a formatting artifact, not an intentional
  // shouty heading) — prefer the already well-cased Meta Title for on-page display.
  const displayTitle = /[a-z]/.test(h1) ? h1 : metaTitle || h1

  const faqs = await extractFaqs(schemaLines.join('\n'))
  const category = guessCategory(`${h1} ${metaTitle}`)

  return {
    sourceFile: fileName,
    // Slug is derived from the raw h1 (not displayTitle) so it stays stable across
    // re-parses even when the on-page title swaps to the Meta Title fallback below —
    // changing the slug basis would orphan already-created posts as duplicates.
    slug: toSlug(h1) || toSlug(fileName),
    metaTitle: metaTitle || displayTitle,
    metaDescription,
    h1: displayTitle,
    bodyHtml: bodyParts.join('\n'),
    faqs,
    category,
    matchedProduct: null,
    matchScore: 0,
    matchStatus: 'no-match',
  }
}

async function main() {
  const { getPayload } = await import('payload')
  const config = (await import('../../src/payload.config')).default
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({ collection: 'products', limit: 1000, depth: 0 })
  const normalizedProducts = products.map((p: any) => ({
    id: String(p.id),
    name: p.name as string,
    slug: p.slug as string,
    normName: normalize(p.name),
    normSlug: normalize(p.slug || ''),
  }))

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'))
  console.log(`Found ${files.length} .docx files in ${SOURCE_DIR}\n`)

  const results: ParsedPost[] = []

  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file)
    const parsed = await parseFile(filePath)
    if (!parsed) continue

    const normFile = normalize(file)
    let best = { score: 0, product: null as (typeof normalizedProducts)[number] | null }
    for (const p of normalizedProducts) {
      const exactName = normFile === p.normName ? 1 : 0
      const exactSlug = normFile === p.normSlug ? 1 : 0
      const overlap = Math.max(tokenOverlapScore(normFile, p.normName), tokenOverlapScore(normFile, p.normSlug))
      const score = Math.max(exactName, exactSlug, overlap)
      if (score > best.score) best = { score, product: p }
    }

    if (best.product && best.score >= 0.99) {
      parsed.matchedProduct = { id: best.product.id, name: best.product.name, slug: best.product.slug }
      parsed.matchScore = best.score
      parsed.matchStatus = 'matched'
    } else if (best.product && best.score >= 0.6) {
      parsed.matchedProduct = { id: best.product.id, name: best.product.name, slug: best.product.slug }
      parsed.matchScore = best.score
      parsed.matchStatus = 'needs-review'
    } else {
      parsed.matchStatus = 'no-match'
    }

    fs.writeFileSync(path.join(OUT_DIR, `${parsed.slug}.json`), JSON.stringify(parsed, null, 2))
    results.push(parsed)
  }

  const matched = results.filter((r) => r.matchStatus === 'matched')
  const review = results.filter((r) => r.matchStatus !== 'matched')

  console.log(`\n=== Auto-matched (${matched.length}) ===`)
  for (const r of matched) {
    console.log(`  ${r.sourceFile.padEnd(35)} -> ${r.matchedProduct?.name} (${r.matchedProduct?.slug})`)
  }

  console.log(`\n=== NEEDS REVIEW (${review.length}) ===`)
  for (const r of review) {
    console.log(`  ${r.sourceFile.padEnd(35)} -> ${r.matchedProduct ? `best guess: ${r.matchedProduct.name} (score ${r.matchScore.toFixed(2)})` : 'NO MATCH FOUND'}`)
  }

  console.log(`\nWrote ${results.length} parsed post(s) to ${OUT_DIR}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
