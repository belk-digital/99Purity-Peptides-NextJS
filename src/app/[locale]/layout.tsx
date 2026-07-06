import React from 'react'
import '@/app/globals.css'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// With localePrefix: 'as-needed', the default locale (en) and any locale served via a
// stale NEXT_LOCALE cookie can resolve to the exact same unprefixed URL. Without forcing
// dynamic rendering here, Next.js can statically cache one locale's HTML for that URL and
// serve it to every visitor regardless of their actual cookie/switcher state.
export const dynamic = 'force-dynamic'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <AuthSessionProvider>
      <html lang={locale} translate="no" className="min-h-screen notranslate" suppressHydrationWarning>
        <head>
          <meta name="google" content="notranslate" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@100..900&family=Michroma&family=Space+Grotesk:wght@300..700&family=Big+Shoulders+Display:wght@100..900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen antialiased" suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </body>
      </html>
    </AuthSessionProvider>
  )
}
