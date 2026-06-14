import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Are these peptides for human consumption?",
    answer: "No. All products sold by Sparta Labs are strictly for laboratory and research use only. They are not approved for human consumption, diagnostic, or therapeutic purposes."
  },
  {
    question: "Do you provide Certificates of Analysis (COAs)?",
    answer: "Yes. Every batch is sent to an independent, accredited third-party laboratory for HPLC (High-Performance Liquid Chromatography) and MS (Mass Spectrometry) testing. We publish these verified COAs directly on our product pages."
  },
  {
    question: "How are the products shipped to maintain stability?",
    answer: "Our peptides are lyophilized, making them highly stable at room temperature for extended periods during transit. Once reconstituted in your lab, they must be refrigerated to maintain their structural integrity."
  },
  {
    question: "Where do you ship from and how long does it take?",
    answer: "All orders are dispatched from our fulfillment center in the USA. We ship via USPS Priority. Most domestic orders arrive within 2-4 business days."
  }
];

const FaqItem = ({ faq, index }) => {
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

const FaqSection = () => {
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
};

export default FaqSection;
