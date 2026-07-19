import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { JSDOM } from 'jsdom'
import { convertHTMLToLexical, defaultEditorConfig, sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const PARSED_DIR = path.resolve(process.cwd(), 'scripts/blog-import/parsed')
const TRANSLATED_DIR = path.resolve(process.cwd(), 'scripts/blog-import/translated')

// Only process these slugs (space-separated) if provided, e.g. for a sample run.
const ONLY_SLUGS = (process.env.ONLY_SLUGS || '').split(',').map((s) => s.trim()).filter(Boolean)

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

type TranslatedPost = {
  title: string
  metaTitle: string
  metaDescription: string
  bodyHtml: string
  faqs: { question: string; answer: string }[]
}

async function main() {
  const { getPayload } = await import('payload')
  const config = (await import('../../src/payload.config')).default
  const payload = await getPayload({ config })

  const resolvedConfig = await config
  const editorConfig = await sanitizeServerEditorConfig(defaultEditorConfig, resolvedConfig)

  const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL || 'access.99puritypeptides@gmail.com'
  const { docs: users } = await payload.find({
    collection: 'users',
    where: { email: { equals: AUTHOR_EMAIL } },
    limit: 1,
  })
  if (users.length === 0) {
    console.error(`No user found with email ${AUTHOR_EMAIL} — set AUTHOR_EMAIL to an existing admin account.`)
    process.exit(1)
  }
  const authorId = users[0].id

  let files = fs.readdirSync(PARSED_DIR).filter((f) => f.endsWith('.json'))
  if (ONLY_SLUGS.length > 0) {
    files = files.filter((f) => ONLY_SLUGS.includes(f.replace(/\.json$/, '')))
  }

  console.log(`Creating ${files.length} blog post(s)...\n`)

  let dayOffset = 0
  for (const file of files) {
    const parsed: ParsedPost = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, file), 'utf-8'))

    const translatedPath = path.join(TRANSLATED_DIR, file)
    const translated: TranslatedPost | null = fs.existsSync(translatedPath)
      ? JSON.parse(fs.readFileSync(translatedPath, 'utf-8'))
      : null

    const enLexical = convertHTMLToLexical({
      editorConfig,
      html: `<html><body>${parsed.bodyHtml}</body></html>`,
      JSDOM: JSDOM as any,
    })

    // Deliberately no featuredImage: these are research/guide articles, not product
    // photography. The frontend falls back to a deterministic generic placeholder
    // per-slug (see src/lib/blogPlaceholderImage.ts) when featuredImage is unset.

    const publishedAt = new Date()
    publishedAt.setDate(publishedAt.getDate() - (files.length - dayOffset))
    dayOffset++

    // Check for an existing post with this slug so re-running the script is idempotent.
    const { docs: existing } = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: parsed.slug } },
      limit: 1,
    })

    // Content fields only — deliberately excludes `status` and `publishedAt` so
    // re-running the script (e.g. after a parser fix) never clobbers a status or
    // date you've since set by hand in /admin.
    const contentPayload = {
      title: parsed.h1,
      slug: parsed.slug,
      author: authorId,
      excerpt: parsed.metaDescription,
      seoTitle: parsed.metaTitle,
      seoDescription: parsed.metaDescription,
      content: enLexical,
      // Posts written for a specific purchasable product are always "Product Guides",
      // regardless of the topical keyword match — the product link is the stronger signal.
      category: parsed.matchedProduct ? 'Product Guides' : parsed.category,
      faqs: parsed.faqs,
      relatedProduct: parsed.matchedProduct ? Number(parsed.matchedProduct.id) : undefined,
      featuredImage: null,
    }

    let docId: string
    let enFaqIds: (string | number)[] = []
    if (existing.length > 0) {
      docId = String(existing[0].id)
      const updated = await payload.update({ collection: 'blog-posts', id: docId, locale: 'en', data: contentPayload })
      enFaqIds = ((updated as any).faqs || []).map((f: any) => f.id)
      console.log(`  ↻ updated (en): ${parsed.slug}`)
    } else {
      const created = await payload.create({
        collection: 'blog-posts',
        locale: 'en',
        data: { ...contentPayload, publishedAt: publishedAt.toISOString(), status: 'draft' },
      })
      docId = String(created.id)
      enFaqIds = ((created as any).faqs || []).map((f: any) => f.id)
      console.log(`  + created (en): ${parsed.slug}`)
    }

    if (translated) {
      const esLexical = convertHTMLToLexical({
        editorConfig,
        html: `<html><body>${translated.bodyHtml}</body></html>`,
        JSDOM: JSDOM as any,
      })
      // Localized array item text (faqs[].question/answer) is stored per-array-row-id.
      // Sending a bare array with no `id`s makes Payload create NEW rows instead of
      // attaching the Spanish text to the existing English rows — which orphans (and
      // effectively deletes) the English FAQ text. Reuse the English row ids here so
      // both locales share the same rows.
      const esFaqs = translated.faqs.map((f, i) => ({
        ...(enFaqIds[i] !== undefined ? { id: enFaqIds[i] } : {}),
        question: f.question,
        answer: f.answer,
      }))
      if (translated.faqs.length !== enFaqIds.length) {
        console.warn(`    ! ${parsed.slug}: EN has ${enFaqIds.length} faqs but ES translation has ${translated.faqs.length} — extra/missing items will not share a row with EN`)
      }
      await payload.update({
        collection: 'blog-posts',
        id: docId,
        locale: 'es',
        data: {
          title: translated.title,
          excerpt: translated.metaDescription,
          seoTitle: translated.metaTitle,
          seoDescription: translated.metaDescription,
          content: esLexical,
          faqs: esFaqs,
        },
      })
      console.log(`    ↳ updated (es): ${parsed.slug}`)
    }
  }

  console.log(`\nDone. All posts created with status: draft.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  if (err?.data?.errors) console.error(JSON.stringify(err.data.errors, null, 2))
  process.exit(1)
})
