'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { Microscope, ShieldCheck, FlaskConical } from 'lucide-react'
import Image from 'next/image'

export function MissionPhilosophyJourney() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Premium crisp entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  return (
    <section ref={containerRef} className="py-32 lg:py-48 px-6 bg-cream relative perspective-1000">
      
      {/* Crisp Technical Geometry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle Dot Grid Base */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Large Rotating Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-[20%] w-[60vw] h-[60vw] border-[1px] border-ink/5 rounded-full"
        />

        {/* Vertical Technical Typography */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 -rotate-90 origin-left text-ink/5 font-mono text-[8vw] whitespace-nowrap font-bold tracking-widest select-none">
          RESEARCH &bull; PURITY
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-24 lg:mb-40"
        >
          <motion.div 
            variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} 
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
            <h2 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary font-bold">
              Our Foundation
            </h2>
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
          </motion.div>
          <motion.h3 variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0}}} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black text-ink tracking-tighter uppercase leading-[0.95]">
            Principles & Values
          </motion.h3>
        </motion.div>

        <div className="relative w-full pb-[20vh]">
          
          {/* Card 1: Mission */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="sticky top-16 lg:top-24 w-full rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 bg-ink text-white shadow-2xl overflow-hidden group mb-8 lg:mb-12 flex flex-col lg:flex-row transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{ zIndex: 10 }}
          >
            {/* Left Content */}
            <div className="relative z-10 w-full lg:w-[60%] lg:group-hover:w-[50%] p-8 lg:p-12 flex flex-col justify-center bg-ink transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {/* Performant static noise texture for Mobile */}
              <div className="md:hidden pointer-events-none absolute inset-0 h-full w-full opacity-10 mix-blend-screen bg-noise z-0" />
              {/* Premium SVG Noise for Desktop */}
              <svg className="hidden md:block pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-screen z-0">
                <filter id="noise1">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise1)" />
              </svg>
              
              <div className="relative z-10 flex flex-col justify-center py-2 lg:py-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6 group-hover:border-primary/50 transition-colors duration-500">
                  <span className="text-4xl lg:text-6xl font-serif text-white tracking-tighter leading-none opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">01</span>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-xl lg:rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:rotate-12 transition-all duration-500">
                    <Microscope className="w-6 h-6 lg:w-8 lg:h-8 text-primary transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mb-3 text-primary font-mono tracking-widest text-xs lg:text-sm font-bold uppercase transition-colors duration-500">Our Mission</div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase text-white mb-4 tracking-tight leading-[1.1] transition-colors duration-500 break-words">
                  Advancing Scientific Research Standards
                </h3>
                <p className="text-base lg:text-lg text-white/70 leading-relaxed font-light transition-colors duration-500">
                  The mission of 99 Purity Peptides as a research peptide company is to support laboratory professionals by providing access to laboratory-grade peptides that meet documented analytical quality standards.
                </p>
              </div>
            </div>
            {/* Right Image - Expands on hover */}
            <div className="w-full lg:w-[40%] lg:group-hover:w-[50%] h-[300px] lg:h-auto relative overflow-hidden hidden md:block bg-ink transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <Image src="/99 Images/semax-bg.webp" alt="Mission" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-ink/20 lg:to-ink pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-700" />
            </div>
          </motion.div>

          {/* Card 2: Philosophy */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="sticky top-20 lg:top-[8.5rem] w-full rounded-[2.5rem] lg:rounded-[3rem] border border-ink/10 bg-cream text-ink shadow-2xl overflow-hidden group mb-8 lg:mb-12 flex flex-col lg:flex-row-reverse transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            style={{ zIndex: 20 }}
          >
            {/* Left Content (Actually on right) */}
            <div className="relative z-10 w-full lg:w-[60%] lg:group-hover:w-[50%] p-8 lg:p-12 flex flex-col justify-center bg-cream transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {/* Performant static noise texture for Mobile */}
              <div className="md:hidden pointer-events-none absolute inset-0 h-full w-full opacity-20 mix-blend-multiply bg-noise z-0" />
              {/* Premium SVG Noise for Desktop */}
              <svg className="hidden md:block pointer-events-none absolute inset-0 h-full w-full opacity-[0.4] mix-blend-multiply z-0">
                <filter id="noise2">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise2)" />
              </svg>
              
              <div className="relative z-10 flex flex-col justify-center py-2 lg:py-4">
                <div className="flex items-center justify-between border-b border-ink/10 pb-6 mb-6 group-hover:border-primary/50 transition-colors duration-500">
                  <span className="text-4xl lg:text-6xl font-serif text-ink tracking-tighter leading-none opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">02</span>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-ink/5 rounded-xl lg:rounded-2xl flex items-center justify-center border border-ink/10 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:rotate-12 transition-all duration-500">
                    <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-primary transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mb-3 text-primary font-mono tracking-widest text-xs lg:text-sm font-bold uppercase transition-colors duration-500">Our Philosophy</div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase text-ink mb-4 tracking-tight leading-[1.1] transition-colors duration-500 break-words">
                  Research Integrity and Transparency
                </h3>
                <p className="text-base lg:text-lg text-ink/70 leading-relaxed font-light transition-colors duration-500">
                  Our operational philosophy centers on research integrity, compliance clarity, and material traceability. As a compliance-focused peptide supplier, we categorize all products clearly as synthetic research peptides intended solely for laboratory research applications.
                </p>
              </div>
            </div>
            {/* Right Image (Expands on hover) */}
            <div className="w-full lg:w-[40%] lg:group-hover:w-[50%] h-[300px] lg:h-auto relative overflow-hidden hidden md:block bg-cream transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <Image src="/99 Images/transparant-vial.png" alt="Philosophy" fill className="object-contain object-left scale-125 group-hover:scale-110 transition-transform duration-700 ease-out" />
            </div>
          </motion.div>

          {/* Card 3: Journey */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="sticky top-24 lg:top-[11rem] w-full rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 bg-[#1A1A1A] text-white shadow-2xl overflow-hidden group flex flex-col lg:flex-row transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{ zIndex: 30 }}
          >
            {/* Left Content */}
            <div className="relative z-10 w-full lg:w-[60%] lg:group-hover:w-[50%] p-8 lg:p-12 flex flex-col justify-center bg-[#1A1A1A] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {/* Performant static noise texture for Mobile */}
              <div className="md:hidden pointer-events-none absolute inset-0 h-full w-full opacity-10 mix-blend-screen bg-noise z-0" />
              {/* Premium SVG Noise for Desktop */}
              <svg className="hidden md:block pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-screen z-0">
                <filter id="noise3">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise3)" />
              </svg>
              
              <div className="relative z-10 flex flex-col justify-center py-2 lg:py-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6 group-hover:border-primary/50 transition-colors duration-500">
                  <span className="text-4xl lg:text-6xl font-serif text-white tracking-tighter leading-none opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">03</span>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-xl lg:rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:rotate-12 transition-all duration-500">
                    <FlaskConical className="w-6 h-6 lg:w-8 lg:h-8 text-primary transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="mb-3 text-primary font-mono tracking-widest text-xs lg:text-sm font-bold uppercase transition-colors duration-500">Our Journey</div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black uppercase text-white mb-4 tracking-tight leading-[1.1] transition-colors duration-500 break-words">
                  A Focus on Laboratory Research Supply
                </h3>
                <p className="text-base lg:text-lg text-white/70 leading-relaxed font-light transition-colors duration-500">
                  99 Purity Peptides was established to address the need for clearly classified synthetic research peptides within the scientific community. The organization's development has been guided by analytical rigor, controlled handling practices and adherence to research use designation across all offerings.
                </p>
              </div>
            </div>
            {/* Right Image (Expands on hover) */}
            <div className="w-full lg:w-[40%] lg:group-hover:w-[50%] h-[300px] lg:h-auto relative overflow-hidden hidden md:block bg-[#1A1A1A] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <Image src="/99 Images/identity.webp" alt="Journey" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-60 group-hover:opacity-100" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
