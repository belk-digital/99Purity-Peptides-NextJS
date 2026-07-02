'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeUp } from '@/components/motion/FadeUp'

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal.privacyPolicy')
  return (
    <main className="bg-cream min-h-screen text-ink font-sans pb-32">
      {/* Header Section */}
      <div className="relative pt-40 pb-16 px-4 md:px-8 border-b border-ink/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4"
          >
            {t('eyebrow')}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-ink mb-6"
          >
            {t('titleLine1')}<br />{t('titleLine2')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-ink/40 font-bold"
          >
            {t('effectiveDate')}
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-16 md:pt-24">
        <FadeUp delay={0.3}>
          <div className="prose prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-ink prose-p:text-ink/80 prose-p:leading-relaxed prose-li:text-ink/80 prose-li:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-dark max-w-none">
            <p className="text-xl md:text-2xl leading-relaxed text-ink/70 font-medium mb-16">
              {t('intro')}
            </p>

            <div className="space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">01.</span> {t('section1Title')}
                </h2>
                <p>
                  {t('section1Text')}
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li><strong>{t('section1Item1Label')}</strong> {t('section1Item1Text')}</li>
                  <li><strong>{t('section1Item2Label')}</strong> {t('section1Item2Text')}</li>
                  <li><strong>{t('section1Item3Label')}</strong> {t('section1Item3Text')}</li>
                  <li><strong>{t('section1Item4Label')}</strong> {t('section1Item4Text')}</li>
                  <li><strong>{t('section1Item5Label')}</strong> {t('section1Item5Text')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> {t('section2Title')}
                </h2>
                <p>{t('section2Intro')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>{t('section2Item1')}</li>
                  <li>{t('section2Item2')}</li>
                  <li>{t('section2Item3')}</li>
                  <li>{t('section2Item4')}</li>
                  <li>{t('section2Item5')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> {t('section3Title')}
                </h2>
                <p>
                  {t('section3Intro')}
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li><strong>{t('section3Item1Label')}</strong> {t('section3Item1Text')}</li>
                  <li><strong>{t('section3Item2Label')}</strong> {t('section3Item2Text')}</li>
                  <li><strong>{t('section3Item3Label')}</strong> {t('section3Item3Text')}</li>
                  <li><strong>{t('section3Item4Label')}</strong> {t('section3Item4Text')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> {t('section4Title')}
                </h2>
                <p>
                  {t('section4Text1')}
                </p>
                <p className="mt-4">
                  {t('section4Text2')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">05.</span> {t('section5Title')}
                </h2>
                <p>{t('section5Intro')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>{t('section5Item1')}</li>
                  <li>{t('section5Item2')}</li>
                  <li>{t('section5Item3')}</li>
                  <li>{t('section5Item4')}</li>
                </ul>
                <p className="mt-4">
                  {t('section5ContactText')}<br/>
                  {t('section5EmailLabel')} <a href="mailto:support@99puritypeptide.com" className="hover:text-primary transition-colors break-all">support@99puritypeptide.com</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">06.</span> {t('section6Title')}
                </h2>
                <p>{t('section6Intro')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>{t('section6Item1')}</li>
                  <li>{t('section6Item2')}</li>
                  <li>{t('section6Item3')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">07.</span> {t('section7Title')}
                </h2>
                <p>
                  {t('section7Text1')}
                </p>
                <p className="mt-4">
                  {t('section7Text2')}
                </p>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl mt-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl uppercase mb-6 font-black font-heading tracking-tighter">
                    {t('contactTitle')}
                  </h2>
                  <p className="mb-8 text-ink/70">
                    {t('contactIntro')}
                  </p>
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">{t('orderQueriesLabel')}</span>
                      <a href="mailto:orders@99puritypeptides.com" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">orders@99puritypeptides.com</a>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">{t('supportIssuesLabel')}</span>
                      <a href="mailto:support@99puritypeptides.com" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">support@99puritypeptides.com</a>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">{t('contactLabel')}</span>
                      <a href="tel:843-330-7365" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">843-330-7365</a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </FadeUp>
      </div>
    </main>
  )
}
