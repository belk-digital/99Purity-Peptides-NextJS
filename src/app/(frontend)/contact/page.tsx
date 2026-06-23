import React from 'react'
import { Metadata } from 'next'
import { ContactClient } from '@/components/contact/ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | 99 Purity Peptides',
  description: '99 Purity Peptides supplies synthetic research peptides intended exclusively for laboratory and experimental research environments.',
}

export default function ContactPage() {
  return <ContactClient />
}
