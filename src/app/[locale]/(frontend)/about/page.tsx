import React from 'react'
import { getTranslations } from 'next-intl/server'
import { AboutHero } from '@/components/about/AboutHero'
import { MissionPhilosophyJourney } from '@/components/about/MissionPhilosophyJourney'
import { WhyChooseUsGrid } from '@/components/about/WhyChooseUsGrid'
import { OurServices } from '@/components/about/OurServices'
import { ComplianceStatement } from '@/components/about/ComplianceStatement'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const ABOUT_FAQ_KEYS = ['trustworthySupplier', 'analyticalQuality', 'laboratoryResearchOnly', 'documentationProvided']

export const metadata = {
  title: 'About Us - 99 Purity Peptides',
  description: 'Trusted Research Peptide Company in the USA. We specialise exclusively in laboratory-grade peptides designated for controlled research environments.',
}

export default async function AboutPage() {
  const t = await getTranslations('content.aboutPage')

  const aboutFaqs = ABOUT_FAQ_KEYS.map((key) => ({
    question: t(`faqs.${key}.question`),
    answer: t(`faqs.${key}.answer`),
  }))

  return (
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
  )
}
