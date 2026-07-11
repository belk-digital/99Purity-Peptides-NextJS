import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AffiliatesLandingClient, UserAffiliateStatus } from './AffiliatesLandingClient'
import { getOgImageUrl } from '@/lib/utils'

const slug = 'affiliates'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('affiliate.landing')
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

export default async function AffiliatesLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('affiliate.landing')
  const title = t('metaTitle')
  const description = t('metaDescription')
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Affiliate Program' },
        ],
      },
    ],
  }

  const user = await getPayloadUser()
  let status: UserAffiliateStatus = 'guest'

  if (user) {
    status = 'user'
    const payload = await getPayload({ config })

    // 1. Check if they are an active affiliate
    const { docs: affiliates } = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    })

    if (affiliates.length > 0) {
      status = `affiliate_${affiliates[0].status}` as UserAffiliateStatus
    } else {
      // 2. Check if they have a pending application
      const { docs: applications } = await payload.find({
        collection: 'affiliate-applications',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })

      if (applications.length > 0) {
        if (applications[0].status === 'pending') {
          status = 'pending_application'
        } else if (applications[0].status === 'rejected') {
          status = 'affiliate_rejected'
        }
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AffiliatesLandingClient userStatus={status} />
    </>
  )
}
