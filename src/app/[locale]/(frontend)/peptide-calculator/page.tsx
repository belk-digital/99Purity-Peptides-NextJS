import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PeptideCalculatorPage from './PeptideCalculatorClient'
import { getOgImageUrl } from '@/lib/utils'

const slug = 'peptide-calculator'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('calculator.page')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/${slug}`,
        es: `/es/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images: [getOgImageUrl(title, description)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [getOgImageUrl(title, description)],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('calculator.page')
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
  const url = `${baseUrl}${path}`

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq.q1Question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q1Answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q2Question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q2Answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q3Question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q3Answer')
        }
      }
    ]
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": t('webApp.name'),
    "url": url,
    "description": t('webApp.description'),
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "99 Purity Peptides"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('breadcrumb.home'),
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t('breadcrumb.calculator'),
        "item": url
      }
    ]
  }

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t('metaTitle'),
        description: t('metaDescription'),
        inLanguage: locale,
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: '99 Purity Peptides',
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: '99 Purity Peptides',
        url: baseUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PeptideCalculatorPage />
    </>
  )
}
