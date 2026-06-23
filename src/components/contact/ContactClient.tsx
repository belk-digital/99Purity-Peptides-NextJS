'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Info, ShoppingCart } from 'lucide-react'
import { ContactHero } from './ContactHero'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'
import { ContactForm } from './ContactForm'
import { PinterestGlassCard } from '@/components/home/PinterestGlassCard'

const contactFaqs = [
  {
    question: "What is the contact information for 99PurityPeptides in the United States?",
    answer: (
      <>
        Reach us at 5768 Wyncliff Drive, North Charleston, South Carolina 29418, US Phone: <a href="tel:8437439007" className="text-primary font-bold underline underline-offset-4 hover:text-ink transition-colors !cursor-pointer pointer-events-auto" data-hide-cursor="true">843 743 9007</a>, and email: <a href="mailto:support@99puritypeptides.com" className="text-primary font-bold underline underline-offset-4 hover:text-ink transition-colors !cursor-pointer pointer-events-auto" data-hide-cursor="true">support@99puritypeptides.com</a> for lab inquiries.
      </>
    )
  },
  {
    question: "How can US laboratories contact 99PurityPeptides for research peptide orders?",
    answer: "Use our US contact form, call during EST/PST hours, or chat for quick lab supply quotes, serving all 50 states."
  },
  {
    question: "Where is 99PurityPeptides located for US shipping and support?",
    answer: "We operate nationwide from US facilities, ensuring fast domestic shipping to labs in California, Texas, New York, and beyond."
  },
  {
    question: "What are your customer service hours for US researchers?",
    answer: "Our US-based support team is available Monday through Friday, 9 AM to 5 PM EST, to assist with peptide specifications and bulk orders."
  }
];

export function ContactClient() {
  return (
    <div className="bg-cream min-h-screen relative font-sans text-ink overflow-hidden">
      
      <ContactHero />

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-10 py-20 md:py-32 relative z-10">
        
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 mb-24 relative">
          
          <motion.a 
            href="mailto:Support@99puritypeptides.com"
            className="block w-full h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500 ease-out"
          >
            <PinterestGlassCard 
              title="Support Email"
              description="Drop us an email anytime for lab inquiries, product specifications, or general support."
              icon={<Mail className="w-5 h-5" />}
              tag="Support@99"
              microcopy="24/7 TICKET SYSTEM"
              scrollFanning={true}
            />
          </motion.a>

          <motion.a 
            href="mailto:Orders@99puritypeptides.com"
            className="block w-full h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500 ease-out"
          >
            <PinterestGlassCard 
              title="Orders Email"
              description="For order tracking, bulk procurement, and wholesale account assistance."
              icon={<ShoppingCart className="w-5 h-5" />}
              tag="Orders@99"
              microcopy="PRIORITY HANDLING"
              scrollFanning={true}
            />
          </motion.a>

          <motion.a 
            href="tel:8433307365"
            className="block w-full h-full cursor-pointer hover:-translate-y-2 transition-transform duration-500 ease-out"
          >
            <PinterestGlassCard 
              title="Support Phone"
              description="Speak directly with our US-based support team for immediate research assistance."
              icon={<Phone className="w-5 h-5" />}
              tag="843-330-7365"
              microcopy="9AM - 5PM EST"
              scrollFanning={true}
            />
          </motion.a>

        </div>

        {/* Contact Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <ContactForm />
        </motion.div>

        {/* FAQ Section */}
        <div className="w-screen relative left-1/2 -ml-[50vw]">
          <SharedFaqSection 
            title="Questions" 
            subtitle="(faqs)" 
            faqs={contactFaqs} 
          />
        </div>

          {/* Disclaimer Alert Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mt-16 pt-8 border-t border-ink/10"
          >
            <div className="relative overflow-hidden rounded-3xl bg-ink/10 p-[1px] group transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative bg-ink h-full w-full rounded-[23px] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden">
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-screen z-0">
                  <filter id="contact-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#contact-noise)" />
                </svg>
                
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative z-10">
                  <Info size={24} strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10 text-cream/70 text-sm md:text-base font-light leading-relaxed">
                  <span className="font-heading font-bold text-primary tracking-[0.15em] uppercase text-xs block mb-1.5">
                    Disclaimer
                  </span>
                  This page is provided for general and operational inquiries related to <strong className="text-white font-medium">orders, documentation, account access</strong> or <strong className="text-white font-medium">website-related matters</strong>.
                </div>
              </div>
            </div>
          </motion.div>

      </main>
    </div>
  )
}
