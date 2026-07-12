import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { FaqClient } from '@/components/faq/FaqClient'
import { faqData as faqDataEn } from '@/data/faqs'
import { faqData as faqDataEs } from '@/data/faqs.es'
import { getOgImageUrl } from '@/lib/utils'

const slug = 'faq'

function getFaqData(locale: string) {
  return locale === 'es' ? faqDataEs : faqDataEn
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('content.faqPage')
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

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('content.faqPage')
  const title = t('metaTitle')
  const description = t('metaDescription')

  // Generate structured data for SEO
  // Combine all FAQs from all categories for the JSON-LD
  const allFaqs = getFaqData(locale).flatMap(category =>
    category.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        // Strip HTML tags for clean text in structured data
        "text": item.answer.replace(/<[^>]*>?/gm, '')
      }
    }))
  );

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
  const url = `${baseUrl}${path}`

  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: locale === 'es' ? 'Inicio' : 'Home', item: locale === 'en' ? baseUrl : `${baseUrl}/${locale}` },
          { '@type': 'ListItem', position: 2, name: locale === 'es' ? 'Preguntas Frecuentes' : 'FAQ' },
        ],
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
      <FaqClient />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": allFaqs
          })
        }}
      />
    </>
  )
}
