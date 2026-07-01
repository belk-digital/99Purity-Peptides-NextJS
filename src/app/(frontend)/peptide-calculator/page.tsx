import { Metadata } from 'next'
import PeptideCalculatorPage from './PeptideCalculatorClient'

export const metadata: Metadata = {
  title: 'Peptide Calculator: Dosage & Reconstitution Tool | Purity Peptides',
  description: 'Use our free peptide calculator to get your exact dosage in seconds. Enter vial size, BAC water volume, and desired mcg - and see exactly how many units to draw. Also includes BMI, Unit Converter, and Creatinine Clearance tools.',
  alternates: {
    canonical: 'https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator',
    languages: {
      'en-US': 'https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator',
    },
  },
}

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much bacteriostatic water do I add to a 5mg peptide vial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The standard ratio for a 5mg peptide vial is 2mL of bacteriostatic water. This creates a concentration of 2.5mg/mL, where every 0.1mL (10 units on a U-100 insulin syringe) delivers exactly 250mcg."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a reconstituted peptide last in the refrigerator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most peptide solutions reconstituted with bacteriostatic water remain stable for 28–30 days when stored at 2–8°C (standard refrigerator temperature)."
        }
      },
      {
        "@type": "Question",
        "name": "Do you shake or roll a peptide vial after adding bacteriostatic water?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Always roll, never shake. Shaking a peptide vial creates mechanical stress that can disrupt the amino acid chains in the compound."
        }
      }
    ]
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Peptide Reconstitution & Research Calculators Hub",
    "url": "https://the-99 Purity Peptides-lab.vercel.app/peptide-calculator",
    "description": "Free online research calculators including peptide reconstitution dosage, BMI/BMR, unit conversion, and Creatinine Clearance.",
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
        "name": "Home",
        "item": "https://the-99 Purity Peptides-lab.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Peptide Calculator",
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
