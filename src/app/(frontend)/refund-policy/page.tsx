'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

export default function RefundPolicyPage() {
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
            99 Purity Peptides'<br />Refund Policy
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
              At 99 Purity Peptides, we are committed to providing high-quality research peptides, compounds and biochemical products. Please read our Refund Policy carefully before placing an order to understand your rights and responsibilities.
            </p>

            <div className="space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">01.</span> Purpose of This Policy
                </h2>
                <p>
                  This Refund Policy explains the circumstances under which refunds or exchanges are available. All products sold by 99 Purity Peptides are strictly for research use only – not for human or veterinary use, diagnosis or treatment. Refunds are provided to ensure customer satisfaction while maintaining the integrity and safety of our products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> Eligibility for Refunds
                </h2>
                <p>To qualify for a refund or exchange, your order must meet the following criteria:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Product must be unused, unopened and in its original packaging.</li>
                  <li>Refund requests must be submitted within 7 calendar days of receipt.</li>
                  <li>You must provide your order number and proof of purchase.</li>
                </ul>
                <p className="mt-4 font-medium text-ink">
                  Important: Due to the sensitive and perishable nature of research peptides, we cannot accept returns for opened or partially used products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> Non-Refundable Items
                </h2>
                <p>The following items are not eligible for a refund:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Products that are sold under any sales campaign or through affiliates</li>
                  <li>Any product that has been opened or used.</li>
                  <li>Products that have exceeded their expiration date or have been mishandled by the buyer.</li>
                  <li>Custom or bulk orders if explicitly marked as non-refundable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> Refund Process
                </h2>
                <p>To request a refund, please follow these steps:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Contact our Customer Support team at <a href="mailto:support@99puritypeptides.com" className="hover:text-primary transition-colors break-all">support@99puritypeptides.com</a> or <a href="tel:843-743-9007" className="hover:text-primary transition-colors break-all">843 743 9007</a> with your order number and reason for the refund.</li>
                  <li>Provide photos of the product and packaging if requested.</li>
                  <li>Our team will review your request and notify you within 3–5 business days regarding approval.</li>
                  <li>If approved, refunds will be issued via the original payment method or as store credit, depending on your preference.</li>
                  <li>Refund processing may take up to 10 business days after approval.</li>
                </ul>
                <p className="mt-4 font-medium text-ink">
                  Tip: Always review your order carefully before purchasing, as research-use products cannot be resold once opened.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">05.</span> Shipping & Returns
                </h2>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Customers are responsible for the cost of return shipping, unless the return is due to a shipping error or damaged product.</li>
                  <li>Products must be securely packaged for return.</li>
                  <li>For temperature-sensitive items, ensure proper handling during shipping to avoid product compromise.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">06.</span> Damaged or Incorrect Orders
                </h2>
                <p>If you receive a product that is damaged or incorrect, contact us immediately:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Order-related queries: <a href="mailto:orders@99puritypeptides.com" className="hover:text-primary transition-colors break-all">orders@99puritypeptides.com</a></li>
                </ul>
                <p className="mt-4">
                  We will arrange a replacement or refund at no additional cost. Please report issues within 48 hours of receiving your order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">07.</span> Legal Disclaimers
                </h2>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>All products are for laboratory and research purposes only. Misuse of any product for human or veterinary purposes voids any refund eligibility.</li>
                  <li>Refunds are subject to verification and company discretion, in accordance with applicable laws.</li>
                  <li>99 Purity Peptides reserves the right to modify this Refund Policy at any time.</li>
                </ul>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl mt-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl uppercase mb-6 font-black font-heading tracking-tighter">
                    Contact Us
                  </h2>
                  <p className="mb-8 text-ink/70">
                    For any questions regarding refunds, please contact our support team:
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
                    <p className="text-ink/70 font-medium leading-relaxed">
                      We are here to assist you with any concerns and ensure a smooth research experience with our products.
                    </p>
                    <p className="text-ink/70 font-medium leading-relaxed mt-4 italic">
                      Key Takeaway: Always check your order, follow handling guidelines and contact us promptly for any issues. Our goal is to maintain safety, quality and transparency for all research-use products.
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
