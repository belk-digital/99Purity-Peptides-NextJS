import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // The URL is the sole source of truth for locale — no cookie/Accept-Language-based
  // redirects overriding an explicit URL. Matches standard professional i18n behavior
  // (e.g. GitHub Docs, Stripe Docs): stripping the /es prefix always shows English.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
