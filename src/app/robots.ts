import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

// Paths that exist under the [locale] segment — each needs both the unprefixed (default
// locale) form and a /es/ prefixed form disallowed.
const LOCALIZED_PRIVATE_PATHS = [
  '/account',
  '/cart',
  '/checkout',
  '/wishlist',
  '/order-confirmation',
  '/affiliates/dashboard',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  // Internal dev/design-review pages — not customer-facing content.
  '/test-design',
  '/test-motion',
]

// Paths outside the [locale] segment — no locale-prefixed variant exists.
const GLOBAL_PRIVATE_PATHS = [
  '/admin',
  '/api',
  '/my-route',
  '/ref',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'

  const disallow = [
    ...GLOBAL_PRIVATE_PATHS,
    ...LOCALIZED_PRIVATE_PATHS,
    ...routing.locales
      .filter((locale) => locale !== routing.defaultLocale)
      .flatMap((locale) => LOCALIZED_PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
  ]

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
