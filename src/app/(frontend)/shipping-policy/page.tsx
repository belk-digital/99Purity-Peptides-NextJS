'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

export default function ShippingPolicyPage() {
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
            99 Purity Peptides'<br />Shipping Policy
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
                  <span className="text-primary opacity-50">01.</span> Order Processing
                </h2>
                <p>
                  All orders are carefully reviewed and processed within 1-3 business days. During this time, our team verifies order details, checks product availability and ensures all items meet quality standards.
                </p>
                <p className="mt-4 font-medium text-ink">
                  Please note: Orders placed on weekends or public holidays will be processed on the next business day.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> Shipping Methods
                </h2>
                <p>We utilize trusted and secure shipping carriers to deliver your products. Options include:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li><strong>Standard Shipping:</strong> Reliable and cost-effective delivery.</li>
                  <li><strong>Expedited Shipping:</strong> Faster delivery for urgent research needs.</li>
                  <li><strong>Temperature-Controlled Shipping:</strong> For products sensitive to heat or cold (as applicable).</li>
                </ul>
                <p className="mt-4 font-medium text-ink">
                  Every order includes tracking information via email once it ships.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> Shipping Times
                </h2>
                <p>Estimated delivery times are:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Domestic (within the U.S.): 3 – 7 business days</li>
                  <li>International: 7 – 15 business days (depending on customs clearance and local delivery conditions)</li>
                </ul>
                <p className="mt-4 font-medium text-ink">
                  Delivery times may vary due to weather, remote locations or customs processing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> Shipping Costs
                </h2>
                <p>Shipping costs are calculated based on order weight, shipping method and destination.</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Domestic standard shipping may have a flat rate or be free for orders over a certain amount.</li>
                  <li>International shipping fees, duties and customs clearance costs are the responsibility of the recipient.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">05.</span> Packaging & Handling
                </h2>
                <p>Your research compounds are packaged with lab-grade care to preserve integrity:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Insulated packaging and cooling packs for temperature-sensitive products.</li>
                  <li>Secure and discreet packaging to ensure privacy and safety.</li>
                  <li>Clearly labeled for research use only & not for human or veterinary consumption.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">06.</span> International Shipping & Restrictions
                </h2>
                <p>We ship to a number of countries worldwide, but some destinations may have legal restrictions for research-use compounds.</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Customers are responsible for understanding local regulations and ensuring compliance.</li>
                  <li>Customs delays or restrictions may extend delivery timelines.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">07.</span> Damaged or Lost Shipments
                </h2>
                <p>If your order is damaged or lost in transit, please contact us within 48 hours of delivery:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Include your order number and photos of damaged packaging (if applicable).</li>
                  <li>We will review the issue and provide replacement or refund options as appropriate.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">08.</span> Legal & Safety Disclaimers
                </h2>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>All products sold are strictly for research use only. They are not intended for human or veterinary use, diagnosis or treatment.</li>
                  <li>99 Purity Peptides is not responsible for misuse, improper handling or shipping delays outside our control.</li>
                  <li>Shipping policies may be updated periodically; customers are encouraged to check this page for the latest information.</li>
                </ul>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl mt-24 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl uppercase mb-6 font-black font-heading tracking-tighter">
                    Contact Us
                  </h2>
                  <p className="mb-8 text-ink/70">
                    For any questions regarding shipping, delivery timelines, or tracking:
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
                      Our team is ready to assist you and ensure your order reaches you safely and promptly.
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
