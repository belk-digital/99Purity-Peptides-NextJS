import React from 'react'
import type { Metadata } from 'next'

const title = 'Refund Policy | 99 Purity Peptides'
const description = 'Read 99 Purity Peptides’ Refund Policy for research-use products, eligibility, process, damaged orders and return guidelines.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const path = locale === 'en' ? '/refund-policy' : `/${locale}/refund-policy`

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: '/refund-policy',
        es: '/es/refund-policy',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function RefundPolicyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const path = locale === 'en' ? '/refund-policy' : `/${locale}/refund-policy`
  const url = `${baseUrl}${path}`

  const schema = {
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Refund Policy' },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  )
}
