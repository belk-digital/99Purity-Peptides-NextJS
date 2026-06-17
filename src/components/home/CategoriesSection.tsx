'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  { name: 'Recovery', slug: 'recovery', description: 'Tissue repair and recovery peptides. Includes BPC-157 and TB-500.' },
  { name: 'Receptor Agonist', slug: 'receptor-agonist', description: 'Receptor-targeting peptides for advanced research protocols.' },
  { name: 'Metabolic', slug: 'metabolic', description: 'GLP-1 and metabolic peptides for body composition and metabolic research.' },
  { name: 'Growth Factor', slug: 'growth-factor', description: 'Growth factor peptides for tissue and recovery research. LC-MS verified.' },
  { name: 'Cognitive Function', slug: 'cognitive-function', description: 'Peptides associated with neurological and cognitive function research.' },
  { name: 'Cellular Health', slug: 'cellular-health', description: 'Compounds studied for cellular repair and longevity applications.' },
  { name: 'Bioregulators', slug: 'bioregulators', description: 'Short-chain peptide bioregulators. Research-grade purity, lot-specific COA.' },
  { name: 'Essentials', slug: 'essentials', description: 'Core research compounds — the foundational stack for any peptide lab.' }
]

const CATEGORY_IMAGES = [
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_42_37 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_43_44 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_46_17 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_47_16 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_49_29 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_50_28 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_52_11 AM.webp',
  '/99 Images/ChatGPT Image Jun 15, 2026, 04_53_07 AM.webp',
]

export function CategoriesSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  // Translate the flex container to the left as we scroll down.
  // We use a function to return a dynamic calc() string because framer-motion cannot interpolate between 0% and calc() strings automatically.
  const x = useTransform(scrollYProgress, (value) => `calc(-${value * 100}% + ${value * 100}vw)`)

  return (
    <section ref={targetRef} className="bg-cream w-full relative z-30 font-sans border-t border-ink/5 h-[300vh]">
      
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* Section Header */}
        <div className="container mx-auto px-4 md:px-10 mb-8 max-w-7xl shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col md:flex-row justify-between items-end"
          >
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-none tracking-tighter uppercase w-full md:w-1/2">
              RESEARCH<br />CATEGORIES.
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-md text-left md:text-right mt-6 md:mt-0 leading-relaxed font-medium">
              Explore our specialized catalogue of high-purity peptides synthesized for specific research pathways and biological systems.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scrolling Vertical Slice Gallery */}
        <motion.div style={{ x }} className="flex w-max h-[60vh] min-h-[400px] max-h-[700px]">
          {CATEGORIES.map((category, index) => (
            <Link 
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              key={category.slug} 
              className="shrink-0 w-[85vw] sm:w-[45vw] md:w-[33.333vw] lg:w-[25vw] h-full relative group overflow-hidden border-r border-ink/5 cursor-pointer block"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full bg-cream">
                <Image 
                  src={CATEGORY_IMAGES[index]} 
                  alt={category.name} 
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                />
                {/* Subtle bottom gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream/90 via-cream/40 to-transparent pointer-events-none transition-opacity duration-700" />
              </div>

              {/* Bottom Centered Text */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none px-4">
                  <h3 
                    className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-ink tracking-tight text-center drop-shadow-xl transition-all duration-500 group-hover:-translate-y-2 uppercase"
                  >
                    {category.name}
                  </h3>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
      
    </section>
  )
}

