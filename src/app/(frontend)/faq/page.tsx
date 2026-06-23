import React from 'react'
import { Metadata } from 'next'
import { FaqClient } from '@/components/faq/FaqClient'
import { faqData } from '@/data/faqs'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | 99 Purity Peptides',
  description: 'Comprehensive answers regarding research peptides, analytical standards, ordering processes, and laboratory handling from 99 Purity Peptides.',
}

export default function FaqPage() {
  // Generate structured data for SEO
  // Combine all FAQs from all categories for the JSON-LD
  const allFaqs = faqData.flatMap(category => 
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

  return (
    <>
      <FaqClient />
      
      {/* JSON-LD Structured Data */}
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
