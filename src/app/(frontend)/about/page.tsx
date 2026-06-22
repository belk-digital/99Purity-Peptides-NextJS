import React from 'react'
import { AboutHero } from '@/components/about/AboutHero'
import { MissionPhilosophyJourney } from '@/components/about/MissionPhilosophyJourney'
import { WhyChooseUsGrid } from '@/components/about/WhyChooseUsGrid'
import { OurServices } from '@/components/about/OurServices'
import { ComplianceStatement } from '@/components/about/ComplianceStatement'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const aboutFaqs = [
  { 
    question: "What makes a peptide supplier trustworthy?", 
    answer: "A trusted peptide supplier demonstrates transparent documentation practices, research classification clarity, structured analytical evaluation, and clearly defined research use only positioning. Batch traceability and purity verification are key indicators of supplier credibility." 
  },
  { 
    question: "How does 99 Purity Peptides ensure analytical quality?", 
    answer: "We implement analytical peptide assessment procedures to verify molecular identity and purity benchmarks prior to release. Documentation access supports researchers evaluating peptides with COA and purity validation standards." 
  },
  { 
    question: "Are your peptides designated for laboratory research only?", 
    answer: "Yes. All products are classified as synthetic research peptides intended strictly for laboratory research use. They are not approved for human or veterinary applications." 
  },
  { 
    question: "What documentation is provided with products?", 
    answer: "Where applicable, documentation may include batch-specific purity data and analytical confirmation records. Researchers seeking peptides with COA can request available documentation prior to purchase." 
  }
];

export const metadata = {
  title: 'About Us - 99 Purity Peptides',
  description: 'Trusted Research Peptide Company in the USA. We specialise exclusively in laboratory-grade peptides designated for controlled research environments.',
}

export default function AboutPage() {
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
        title="Questions" 
        description="Common questions about research peptides, ordering, and lab standards"
        faqs={aboutFaqs}
      />
    </main>
  )
}
