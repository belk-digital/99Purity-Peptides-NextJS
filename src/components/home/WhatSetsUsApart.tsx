'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Microscope, Activity, FileText, FlaskConical } from 'lucide-react'
import Link from 'next/link'

const ADVANTAGES = [
  {
    title: "Verified Purity Standards",
    description: "All peptides meet ≥99% purity verified by reversed-phase HPLC. Chromatograms are included with every order, enabling you to confirm reagent quality before integration into experimental protocols.",
    icon: Microscope
  },
  {
    title: "Mass Spectrometry Validation",
    description: "LC-MS analysis confirms peptide identity and molecular weight accuracy. This dual-verification approach reduces risk of sequence errors that could compromise assay results or mechanistic studies.",
    icon: Activity
  },
  {
    title: "Comprehensive Documentation",
    description: "Each certificate of analysis includes detailed analytical data: HPLC purity percentages, MS identity confirmation, peptide concentration, storage recommendations, and amino acid sequence verification. Documentation supports laboratory quality systems and research publication requirements.",
    icon: FileText
  },
  {
    title: "Research-Only Positioning",
    description: "Our peptides are clearly designated for research use only (RUO) and intended exclusively for laboratory applications including assay development, receptor binding studies, enzyme kinetics, and non-clinical research investigations.",
    icon: FlaskConical
  }
]

export function WhatSetsUsApart() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  return (
    <section className="bg-[#050505] py-24 md:py-32 relative z-30 font-sans overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0" />

      <div className="container mx-auto px-4 md:px-10 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column (Sticky Intro) */}
          <div className="w-full lg:w-5/12">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-block border border-white/10 rounded-full px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-sm">
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Advantage</span>
                </div>
                
                <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8">
                  What Sets<br />Us Apart.
                </h2>
                
                <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium">
                  <strong className="text-white">99PurityPeptides</strong> specializes in high-purity synthetic peptides engineered specifically for research laboratory environments. Our commitment to analytical rigor and documentation transparency addresses the core needs of scientific research:
                </p>

                <Link href="/about" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Learn More About Us <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column (Scrolling Cards) */}
          <div className="w-full lg:w-7/12">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col gap-6"
            >
              {ADVANTAGES.map((adv, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="group relative bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 overflow-hidden hover:bg-white/10 transition-colors duration-500 cursor-default"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                      <adv.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-500" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                      {adv.title}
                    </h3>
                    
                    <p className="text-white/60 leading-relaxed text-base md:text-lg">
                      {adv.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}


