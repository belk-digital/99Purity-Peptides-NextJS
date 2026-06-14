'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is the purity standard for your research peptides?",
    answer: "Every research peptide sold by The Looksmaxxing Lab must meet or exceed a strictly enforced ≥99% purity threshold. We verify this standard through independent, third-party High-Performance Liquid Chromatography (HPLC) and Liquid Chromatography–Mass Spectrometry (LC-MS) testing for every production batch — not random samples. Any batch that tests below this threshold is immediately discarded."
  },
  {
    question: "How can I access the Certificate of Analysis (COA) for my order?",
    answer: "Lot-specific Certificates of Analysis for every active batch are publicly available in our COA Library at /certificates. Every order also includes a batch number that corresponds directly to that batch's test documentation. You can verify purity, molecular identity, and endotoxin status for every compound you receive."
  },
  {
    question: "Are these products intended for human consumption?",
    answer: "No. All products sold by The Looksmaxxing Lab are strictly for laboratory and research use only. They are not intended to diagnose, treat, cure, or prevent any disease, and are not for human or animal consumption. These statements have not been evaluated by the FDA."
  },
  {
    question: "What are your shipping and fulfillment times?",
    answer: "All orders are fulfilled from our US-based facilities. We offer standard shipping (3–5 business days) and expedited 2-day shipping on orders over $300. Orders placed before 2 PM EST typically ship same day. All peptides are dispatched using validated cold-chain packaging to maintain molecular integrity in transit."
  },
  {
    question: "What is looksmaxxing — and how do peptides relate to it?",
    answer: "Looksmaxxing is the practice of systematically optimizing one's physical appearance through controllable factors such as skincare, fitness, grooming, and diet. Research peptides are studied in the context of skin collagen, tissue recovery, body composition, and hair density — areas directly relevant to appearance optimization. Our compounds are for research use only and are not offered as cosmetic or medical products."
  },
  {
    question: "How are your research peptides synthesized?",
    answer: "We utilize advanced solid-phase peptide synthesis (SPPS) in US-based, ISO-certified laboratories. This method assembles amino acid chains sequentially on a resin support, allowing precise control over sequence fidelity and molecular structure. Post-synthesis purification removes truncated sequences and impurities to meet our ≥99% purity floor. Every batch is independently verified before fulfillment."
  },
  {
    question: "Do you offer bulk or wholesale pricing for research institutions?",
    answer: "Yes. We offer tiered wholesale pricing for qualified research institutions, university labs, clinical facilities, and approved wholesale accounts. Contact our support team to apply for an institutional account. Pricing scales with volume, and bulk orders still receive lot-specific COA documentation."
  },
  {
    question: "How do I verify that a peptide vendor is legitimate and properly tested?",
    answer: "The three non-negotiable markers of a legitimate research peptide supplier are: (1) independent third-party HPLC and LC-MS testing — not in-house testing — for every batch; (2) a publicly accessible COA library with lot-traceable documentation; and (3) US-based synthesis, not merely US-based fulfillment of overseas-sourced raw powders. The Looksmaxxing Lab meets all three criteria on every order."
  }
];

const FaqItem = ({ faq, index }: { faq: { question: string; answer: string }; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-white/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
      >
        <span className="font-heading text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors tracking-wide">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="ml-4 flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-gray-400 text-sm md:text-base leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function FaqSection() {
  return (
    <section className="bg-[#0a0a0a] w-full py-32 px-4 md:px-10 relative z-30 font-sans border-t border-white/5">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-[10px] tracking-[0.2em] uppercase mb-4 font-bold">Inquiries</p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase">
            Frequently Asked.
          </h2>
        </motion.div>

        <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl">
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

