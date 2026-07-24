import React from 'react'
import '@/app/globals.css'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider'
import { TidioWidget } from '@/components/shared/TidioWidget'
import { routing } from '@/i18n/routing'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const TIDIO_PUBLIC_KEY = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY

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
          {GA_MEASUREMENT_ID && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
              <Script id="ga4-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `}
              </Script>
            </>
          )}

          {/* Google Tag Manager */}
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KQDPXVVW');
            `}
          </Script>
        </head>
        <body className="font-sans antialiased bg-[#FAF7F2] text-[#0A0A0A] flex flex-col min-h-screen" suppressHydrationWarning>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=GTM-KQDPXVVW"
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
          {TIDIO_PUBLIC_KEY && <TidioWidget publicKey={TIDIO_PUBLIC_KEY} />}
        </body>
      </html>
    </AuthSessionProvider>
  )
}
