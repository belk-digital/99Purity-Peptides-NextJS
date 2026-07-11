import { HomePreloaderWrapper } from '@/components/home/HomePreloaderWrapper'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { TrustBadges } from '@/components/shared/TrustBadges'
import { FaqSection } from '@/components/home/FaqSection'
import { BlogSection } from '@/components/home/BlogSection'
import { ParallaxImageSection } from '@/components/home/ParallaxImageSection'
import { WhatSetsUsApart } from '@/components/home/WhatSetsUsApart'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { DifferenceSection } from '@/components/home/DifferenceSection'
import { BestSellerSection } from '@/components/home/BestSellerSection'
import { MerchandiseSection } from '@/components/home/MerchandiseSection'
import { MilitaryDiscountSection } from '@/components/home/MilitaryDiscountSection'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('home')
  const title = t('metaTitle')
  const description = t('metaDescription')
  const path = locale === 'en' ? '/' : `/${locale}`

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: '/',
        es: '/es',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images: ['/99 Images/99pp-Logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/99 Images/99pp-Logo.png'],
    },
  }
}

import { getShopProducts } from '@/app/[locale]/(frontend)/(shop)/actions'
import { getVisibleCategories } from '@/app/[locale]/(frontend)/actions/categories'

export default async function Homepage() {
  const t = await getTranslations('home')
  const title = t('metaTitle')
  const description = t('metaDescription')
  let products: any[] = []
  let categories: any[] = []
  try {
    categories = await getVisibleCategories()
  } catch (e) {
    console.error("Failed to fetch categories", e)
  }
  try {
    const bestSellers = await getShopProducts({ limit: 8, sort: 'newest', bestSellersOnly: true })
    products = bestSellers.success && bestSellers.products ? (bestSellers.products as any[]) : []

    // Fill any remaining slots with other live products so the section is never sparse
    // before best sellers have been curated in the admin.
    if (products.length < 8) {
      const fallback = await getShopProducts({ limit: 8, sort: 'newest' })
      if (fallback.success && fallback.products) {
        const existingIds = new Set(products.map((p: any) => p.id))
        const filler = (fallback.products as any[]).filter(p => !existingIds.has(p.id))
        products = [...products, ...filler].slice(0, 8)
      }
    }
  } catch (e) {
    console.error("Failed to fetch featured products", e)
  }

  return (
    <HomePreloaderWrapper>
      <div className="flex flex-col w-full min-h-screen relative z-10 bg-black overflow-x-clip">
        <Hero />
        <BestSellerSection products={products} />
        <DifferenceSection />
        <TrustBadges />
        <CategoriesSection categories={categories} />
        {/* <MerchandiseSection /> */}
        <WhatSetsUsApart />
        <MilitaryDiscountSection />
        <ParallaxImageSection />
        <WhyChooseUs />
        <BlogSection />
        <FaqSection />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://99puritypeptides.com/#webpage",
              "url": "https://99puritypeptides.com/",
              "name": title,
              "description": description
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://99puritypeptides.com/#breadcrumb",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://99puritypeptides.com/" }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the purity standard for your research peptides?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Every research peptide must meet or exceed ≥99% purity, verified by independent third-party HPLC and LC-MS testing on every production batch. Any batch below this threshold is discarded."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I access the Certificate of Analysis (COA)?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "COAs for every active batch are publicly available in our COA Library at /certificates. Every order includes a batch number traceable to its specific test documentation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are these products intended for human consumption?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. All products are strictly for laboratory and research use only. Not intended to diagnose, treat, cure, or prevent any disease, and not for human or animal consumption."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is 99 Purity Peptides and how do peptides relate to it?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "99 Purity Peptides is the practice of optimizing physical appearance through controllable factors. Research peptides are studied in relation to skin collagen, tissue recovery, body composition, and hair density. Our compounds are research use only."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do you offer wholesale pricing for research institutions?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We offer tiered wholesale pricing for qualified research institutions, university labs, and clinical facilities. Contact our team to apply for an institutional account."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "99 Purity Peptides",
              "url": "https://99puritypeptides.com",
              "description": "US-based research peptide supplier providing ≥99% HPLC-pure compounds with third-party COA verification."
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://99puritypeptides.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://99puritypeptides.com/shop?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }
          ])
        }}
      />
    </HomePreloaderWrapper>
  )
}
