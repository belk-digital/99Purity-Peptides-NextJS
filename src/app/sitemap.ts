import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import * as Sentry from '@sentry/nextjs'
import { BLOG_POSTS } from '@/data/blog-posts'
import { routing } from '@/i18n/routing'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'

const STATIC_PATHS = [
  '',
  '/about-us',
  '/shop',
  '/blog',
  '/faq',
  '/contact-us',
  '/peptide-calculator',
  '/certificates',
  '/affiliates',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/shipping-policy',
  '/medical-disclaimer',
]

function withLocales(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = locale === routing.defaultLocale ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`
  }
  return languages
}

function entry(path: string, lastModified?: Date) {
  return {
    url: `${baseUrl}${path}`,
    lastModified: lastModified || new Date(),
    alternates: { languages: withLocales(path) },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const path of STATIC_PATHS) {
    entries.push(entry(path))
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue
      entries.push(entry(`/${locale}${path}`))
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs: products } = await payload.find({
      collection: 'products',
      where: { status: { equals: 'active' } },
      limit: 1000,
      depth: 0,
    })

    for (const product of products) {
      const path = `/product/${product.slug}`
      entries.push(entry(path, product.updatedAt ? new Date(product.updatedAt) : undefined))
      for (const locale of routing.locales) {
        if (locale === routing.defaultLocale) continue
        entries.push(entry(`/${locale}${path}`, product.updatedAt ? new Date(product.updatedAt) : undefined))
      }
    }
  } catch (error) {
    console.error('sitemap: failed to fetch products', error)
    Sentry.captureException(error, { tags: { route: 'sitemap.xml' } })
  }

  for (const post of BLOG_POSTS) {
    const path = `/${post.slug}`
    entries.push(entry(path))
    for (const locale of routing.locales) {
      if (locale === routing.defaultLocale) continue
      entries.push(entry(`/${locale}${path}`))
    }
  }

  return entries
}
