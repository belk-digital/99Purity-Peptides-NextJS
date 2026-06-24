'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

export default function TermsAndConditionsPage() {
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
            99 Purity Peptides'<br />Terms and Conditions
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
              Welcome to 99 Purity Peptides. By accessing or using our website, purchasing products or interacting with our services, you agree to be bound by the following Terms and Conditions. If you do not agree, please do not use our website or services.
            </p>

            <div className="space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">01.</span> Purpose
                </h2>
                <p>
                  99 Purity Peptides provides research-grade peptides, small molecules and related compounds. All products are intended for laboratory and research purposes only. They are not for human or veterinary use, diagnosis or treatment. These Terms govern your access, use, and purchase of our products and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> Research-Use Only Products
                </h2>
                <p>
                  All products sold through our website are strictly for research purposes. By purchasing or using our products, you confirm that:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>You understand and accept that products are not intended for consumption or medical use.</li>
                  <li>You will use all products solely in approved laboratory or experimental models.</li>
                  <li>You accept full responsibility for the safe handling, storage and disposal of products.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> Account & User Responsibilities
                </h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Users must be 18 years or older or of legal age in their jurisdiction.</li>
                  <li>Accurate and up-to-date personal and billing information must be provided.</li>
                  <li>You are responsible for safeguarding your account credentials and activity.</li>
                  <li>Any misuse of your account or unauthorized purchases must be reported immediately.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> Ordering & Payment
                </h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Orders are processed once payment is successfully completed.</li>
                  <li>We accept payment methods as listed on the checkout page.</li>
                  <li>All prices are in USD unless otherwise stated.</li>
                  <li>Orders may be canceled or modified before shipment, subject to approval.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">05.</span> Shipping & Delivery
                </h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>We ship to approved regions only. Certain products may have restrictions due to local laws.</li>
                  <li>Shipping timelines are estimates and may vary due to logistics or customs processing.</li>
                  <li>99 Purity Peptides is not responsible for delays or damages during transit.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">06.</span> Product Liability & Safety
                </h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Products are not approved for human or veterinary use.</li>
                  <li>Users assume all risks associated with storage, handling and research applications.</li>
                  <li>99 Purity Peptides is not liable for misuse, accidental ingestion or unapproved applications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">07.</span> Intellectual Property
                </h2>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>All website content, images, product descriptions, branding and designs are the property of 99 Purity Peptides.</li>
                  <li>Unauthorized reproduction, distribution or commercial use is strictly prohibited.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">08.</span> User Conduct
                </h2>
                <p>By using our website, you agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Engage in illegal activities using our products.</li>
                  <li>Distribute, sell or apply research products for unapproved purposes.</li>
                  <li>Violate any applicable laws or regulations in your jurisdiction.</li>
                </ul>
                <p className="mt-4 font-medium text-ink">Violations may result in order cancellation, account suspension or legal action.</p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">09.</span> Limitation of Liability
                </h2>
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>99 Purity Peptides is not liable for damages resulting from misuse, unauthorized applications or website errors.</li>
                  <li>Liability for product issues is limited to the purchase price of the product.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">10.</span> Indemnification
                </h2>
                <p>You agree to indemnify and hold harmless 99 Purity Peptides, its employees and affiliates from any claims, damages or expenses arising from:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Improper use of products.</li>
                  <li>Violation of Terms and Conditions.</li>
                  <li>Breach of local or federal laws related to product use.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">11.</span> Governing Law
                </h2>
                <p>
                  These Terms are governed by the laws of the jurisdiction in which 99 Purity Peptides operates. Any disputes will be resolved under these laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">12.</span> Privacy & Data Use
                </h2>
                <p>
                  Your use of 99 Purity Peptides is also subject to our Privacy Policy, which outlines how we collect, use and protect your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">13.</span> Changes to Terms
                </h2>
                <p>
                  99 Purity Peptides reserves the right to update or modify these Terms at any time. Changes will be effective upon posting on the website. Your continued use of our website or products constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl mt-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl uppercase mb-6 font-black font-heading tracking-tighter">
                    Customer Support
                  </h2>
                  <p className="mb-8 text-ink/70">
                    If you have questions about these Terms and Conditions, please contact:
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
                </div>
              </section>
            </div>
          </div>
        </FadeUp>
      </div>
    </main>
  )
}
