import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PeptideCalculatorPage from './PeptideCalculatorClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('calculator.page')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator',
      languages: {
        'en-US': 'https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator',
      },
    },
  }
}

export default async function Page() {
  const t = await getTranslations('calculator.page')

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
    "url": "https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator",
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
        "item": "https://the-99 Purity Peptides-lab.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t('breadcrumb.calculator'),
        "item": "https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator"
      }
    ]
  }

  return (
    <>
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
