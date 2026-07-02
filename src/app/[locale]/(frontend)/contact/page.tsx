import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ContactClient } from '@/components/contact/ContactClient'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('content.contactPage')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default function ContactPage() {
  return <ContactClient />
}
