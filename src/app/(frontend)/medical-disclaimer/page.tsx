'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

export default function MedicalDisclaimerPage() {
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
            Legal Information
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-ink mb-6"
          >
            99 Purity Peptides'<br />Medical Disclaimer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-ink/40 font-bold"
          >
            Effective Date: January 2026
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-16 md:pt-24">
        <FadeUp delay={0.3}>
          <div className="prose prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-ink prose-p:text-ink/80 prose-p:leading-relaxed prose-li:text-ink/80 prose-li:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-dark max-w-none">
            <p className="text-xl md:text-2xl leading-relaxed text-ink/70 font-medium mb-16">
              The information provided on this website and through our products is intended solely for research purposes. All peptides, compounds and related materials sold by 99 Purity Peptides are for laboratory and academic research only. These products are not intended for human or veterinary use, diagnosis or treatment.
            </p>

            <div className="space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">01.</span> No Medical Advice
                </h2>
                <p>
                  The content on this site, including product descriptions, research summaries and blog articles, does not constitute medical advice. 99 Purity Peptides is not a healthcare provider and the materials presented are for informational and educational purposes only. Always seek guidance from a licensed medical or scientific professional before acting on any information obtained from this site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> Product Usage Limitation
                </h2>
                <p>
                  All products offered by 99 Purity Peptides are intended for controlled laboratory or research environments. Any use outside of this context, including self-administration, is strictly prohibited and may violate local laws and regulations. Users are responsible for ensuring that all handling, storage and usage comply with applicable research protocols and safety standards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> Liability
                </h2>
                <p>
                  99 Purity Peptides assumes no responsibility or liability for the misuse of products, improper handling or any adverse effects resulting from unauthorized use. By using this website and purchasing our products, you acknowledge and agree that 99 Purity Peptides is not liable for any direct, indirect or consequential damages arising from your actions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> User Responsibility
                </h2>
                <p>It is the responsibility of all users to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Follow all local, state and federal laws regarding research chemicals.</li>
                  <li>Use products only in designated research or laboratory settings.</li>
                  <li>Exercise caution and adhere to proper safety protocols when handling compounds.</li>
                  <li>Consult a qualified professional for any questions regarding research procedures, legal compliance or scientific interpretation.</li>
                </ul>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl mt-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl uppercase mb-6 font-black font-heading tracking-tighter">
                    Contact Us
                  </h2>
                  <p className="mb-8 text-ink/70">
                    If you have questions regarding product use, safety or compliance, please contact our support team at:
                  </p>
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">Order-related queries</span>
                      <a href="mailto:orders@99puritypeptides.com" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">orders@99puritypeptides.com</a>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">Support & issues</span>
                      <a href="mailto:support@99puritypeptides.com" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">support@99puritypeptides.com</a>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 block mb-2">Contact</span>
                      <a href="tel:843-330-7365" className="text-base sm:text-lg md:text-xl font-medium hover:text-primary transition-colors break-all">843-330-7365</a>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-ink/5">
                    <p className="text-ink/70 font-medium leading-relaxed italic">
                      By accessing this website or purchasing our products, you agree to comply with this Medical Disclaimer and acknowledge that 99 Purity Peptides is not responsible for any misuse or unauthorized application of our research materials.
                    </p>
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
