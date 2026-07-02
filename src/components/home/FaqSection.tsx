'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const FAQ_KEYS = [
  'ruoPeptide',
  'researchGradePurity',
  'coaContents',
  'massSpecIdentity',
  'lyophilizedStorage',
  'assayDevelopment',
  'commonImpurities',
  'batchConsistency',
  'receptorBindingStudies',
  'vendorQuestions',
];

export function FaqSection() {
  const t = useTranslations('home.faqSection')
  const faqs = FAQ_KEYS.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <SharedFaqSection
      title={
        <>
          {t('titleLine1')}<br />{t('titleLine2')}
        </>
      }
      faqs={faqs}
    />
  );
}

