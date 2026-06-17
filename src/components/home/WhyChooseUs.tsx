'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ShieldCheck, Award, FileCheck } from 'lucide-react'
import Link from 'next/link'

const CHOOSE_US_DATA = [
  {
    tag: "Trusted & Verified",
    title: "HPLC-Verified Purity",
    description: "Every research peptide includes reversed-phase HPLC chromatograms confirming ≥99% purity for reliable laboratory results.",
    link: "/about",
    icon: ShieldCheck
  },
  {
    tag: "Test It Free",
    title: "MS Identity Confirmation",
    description: "Peptide identity verified by liquid chromatography-mass spectrometry (LC-MS) with documented molecular weight accuracy.",
    link: "/about",
    icon: Award
  },
  {
    tag: "Receptor Agonist Research",
    title: "Complete COA Documentation",
    description: "Detailed certificates of analysis include purity percentages, impurity profiles, and analytical test methods for full research traceability.",
    link: "/about",
    icon: FileCheck
  }
]

export function WhyChooseUs() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  return (
    <section className="bg-cream py-24 md:py-32 relative z-30 font-sans overflow-hidden border-t border-ink/5">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 md:px-10 max-w-7xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Why Choose Us</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-none tracking-tighter uppercase">
            Transparency<br />You Can Trust.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {CHOOSE_US_DATA.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group relative bg-white border border-ink/5 rounded-[32px] p-8 md:p-10 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-primary/20 transition-all duration-500 min-h-[450px]"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-ink/40 mb-8 border-b border-ink/10 pb-2">
                    {item.tag}
                  </span>
                  
                  {/* Badge Image Placeholder */}
                  <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-ink/5">
                    <item.icon className="w-10 h-10 text-primary transition-colors duration-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-ink/70 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-ink/10 flex items-center justify-between">
                  <Link href={item.link} className="inline-flex items-center gap-2 text-primary group-hover:text-ink font-bold text-xs tracking-[0.2em] uppercase transition-colors">
                    DETAILS <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
