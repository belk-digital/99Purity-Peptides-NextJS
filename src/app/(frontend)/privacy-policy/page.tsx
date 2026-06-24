'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

export default function PrivacyPolicyPage() {
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
            99 Purity Peptides'<br />Privacy Policy
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
              At 99 Purity Peptides, your privacy is important to us. This Privacy Policy explains how we collect, use and protect your personal information when you interact with our website and services. By using our website, you consent to the practices described below.
            </p>

            <div className="space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">01.</span> Information We Collect
                </h2>
                <p>
                  We collect information to provide you with our services efficiently and securely. Types of information we may collect include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, billing/shipping address.</li>
                  <li><strong>Account Information:</strong> Login credentials, order history and account preferences.</li>
                  <li><strong>Financial Information:</strong> Payment details (processed securely through trusted providers).</li>
                  <li><strong>Website Usage & Technical Data:</strong> IP address, browser type, pages visited, device information and website interactions.</li>
                  <li><strong>Cookies & Tracking:</strong> Cookies and similar technologies to enhance your browsing experience, analyze website performance and provide targeted content.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">02.</span> How We Use Your Information
                </h2>
                <p>Your information is used for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Processing and fulfilling orders, including shipping and payment.</li>
                  <li>Communicating order updates, customer support and account notifications.</li>
                  <li>Improving website functionality and user experience.</li>
                  <li>Sending promotional emails and marketing communications (with opt-out options).</li>
                  <li>Compliance with legal obligations and protection of our rights.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">03.</span> Sharing Your Information
                </h2>
                <p>
                  We respect your privacy and do not sell your personal data. Information may be shared only in limited situations:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li><strong>Service Providers:</strong> Trusted partners for payment processing, shipping and technical support</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order or regulatory authority.</li>
                  <li><strong>Protection of Rights:</strong> To prevent fraud, enforce terms or protect safety and property.</li>
                  <li><strong>Third-Party Links:</strong> Our website may include links to external sites. We are not responsible for the privacy practices of these third-party websites</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">04.</span> Data Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your personal information. These include encryption, secure servers and restricted access.
                </p>
                <p className="mt-4">
                  However, no system is completely secure. By using our services, you acknowledge the inherent risks of online data transmission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">05.</span> Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Access, update or correct your personal information.</li>
                  <li>Request deletion of your information from our records.</li>
                  <li>Opt-out of marketing and promotional communications.</li>
                  <li>Restrict or object to the processing of your data.</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, contact us at:<br/>
                  Email: <a href="mailto:support@99puritypeptide.com" className="hover:text-primary transition-colors break-all">support@99puritypeptide.com</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">06.</span> Research-Use Products Disclaimer
                </h2>
                <p>All products sold by 99 Purity Peptides are strictly for research use only:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                  <li>Not for human or veterinary use.</li>
                  <li>Not intended for diagnosis, treatment or therapeutic purposes</li>
                  <li>Users are responsible for handling and complying with all applicable laws and safety regulations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl uppercase mb-6 flex items-center gap-4">
                  <span className="text-primary opacity-50">07.</span> Updates to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.
                </p>
                <p className="mt-4">
                  We encourage you to review this policy regularly to stay informed about how we protect your information.
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
