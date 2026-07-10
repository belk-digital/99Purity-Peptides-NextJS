import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AboutHero } from '@/components/about/AboutHero'
import { MissionPhilosophyJourney } from '@/components/about/MissionPhilosophyJourney'
import { WhyChooseUsGrid } from '@/components/about/WhyChooseUsGrid'
import { OurServices } from '@/components/about/OurServices'
import { ComplianceStatement } from '@/components/about/ComplianceStatement'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const ABOUT_FAQ_KEYS = ['trustworthySupplier', 'analyticalQuality', 'laboratoryResearchOnly', 'documentationProvided']

const slug = 'about-us'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('content.aboutPage')
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('content.aboutPage')
  const title = t('metaTitle')
  const description = t('metaDescription')

  const aboutFaqs = ABOUT_FAQ_KEYS.map((key) => ({
    question: t(`faqs.${key}.question`),
    answer: t(`faqs.${key}.answer`),
  }))

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
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
          { '@type': 'ListItem', position: 1, name: locale === 'es' ? 'Inicio' : 'Home', item: locale === 'en' ? baseUrl : `${baseUrl}/${locale}` },
          { '@type': 'ListItem', position: 2, name: locale === 'es' ? 'Sobre Nosotros' : 'About Us' },
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
    <main className="bg-cream min-h-screen">
      <AboutHero />
      <MissionPhilosophyJourney />
      <WhyChooseUsGrid />
      <OurServices />
      <ComplianceStatement />

      {/* FAQ Section with dark theme context if desired, or default cream.
          SharedFaqSection sets its own bg-cream container, so we'll wrap it and override if needed,
          but its native styling works perfectly here. */}
      <SharedFaqSection
        title={t('faqTitle')}
        description={t('faqDescription')}
        faqs={aboutFaqs}
      />
    </main>
    </>
  )
}
