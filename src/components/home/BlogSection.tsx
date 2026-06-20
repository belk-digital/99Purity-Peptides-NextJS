'use client'

import React, { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const BLOG_POSTS = [
  {
    title: 'The Role of BPC-157 in Cellular Recovery',
    excerpt: 'An in-depth look at how BPC-157 promotes angiogenesis and accelerates tissue regeneration in clinical models.',
    date: 'OCT 12, 2026',
    category: 'Recovery',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 04_56_02 AM.webp',
    slug: 'role-of-bpc-157'
  },
  {
    title: 'Understanding GLP-1 Agonists',
    excerpt: 'Examining the metabolic pathways and recent advancements in GLP-1 receptor agonist research.',
    date: 'SEP 28, 2026',
    category: 'Metabolic',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 04_57_45 AM.webp',
    slug: 'understanding-glp-1'
  },
  {
    title: 'Peptide Stability: Cold Chain Logistics',
    excerpt: 'Why strict temperature control is critical for maintaining peptide integrity and preventing degradation.',
    date: 'SEP 15, 2026',
    category: 'Logistics',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 05_03_53 AM.webp',
  },
  {
    title: 'GHK-Cu: The Copper Peptide Revolution',
    excerpt: 'Exploring the regenerative properties of GHK-Cu in skin remodeling and wound healing.',
    date: 'AUG 10, 2026',
    category: 'Regeneration',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 04_57_45 AM.webp',
    slug: 'ghk-cu-copper-peptide'
  },
  {
    title: 'The Pharmacokinetics of TB-500',
    excerpt: 'Understanding the systemic distribution and actin-binding mechanisms of Thymosin Beta-4.',
    date: 'JUL 22, 2026',
    category: 'Science',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 05_03_53 AM.webp',
    slug: 'pharmacokinetics-tb-500'
  },
  {
    title: 'Maximizing Bioavailability in Administration',
    excerpt: 'Comparing subcutaneous injection, nasal sprays, and oral routes for research peptide delivery.',
    date: 'JUN 05, 2026',
    category: 'Administration',
    image: '/99 Images/ChatGPT Image Jun 15, 2026, 04_56_02 AM.webp',
    slug: 'maximizing-bioavailability'
  }
]

export function BlogSection() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [hoveredCol2, setHoveredCol2] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const scatterData = [
    { x: -200, y: -150, rotate: -10 },
    { x: 150, y: -250, rotate: 15 },
    { x: 250, y: 150, rotate: -5 },
    { x: -150, y: 200, rotate: 12 },
    { x: -300, y: 50, rotate: -8 },
    { x: 200, y: -100, rotate: 5 },
    { x: 100, y: 250, rotate: -15 },
    { x: -250, y: -200, rotate: 10 }
  ]

  const itemVariants: Variants = {
    hidden: (i: number) => ({ 
      opacity: 0, 
      x: scatterData[i % scatterData.length]?.x || 0,
      y: scatterData[i % scatterData.length]?.y || 60,
      rotate: scatterData[i % scatterData.length]?.rotate || 0,
      scale: 0.85, 
      filter: 'blur(15px)' 
    }),
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0, 
      rotate: 0,
      scale: 1, 
      filter: 'blur(0px)',
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 100,
        mass: 1.5,
        duration: 1.2,
      } 
    }
  }

  return (
    <section className="bg-[#050505] py-24 md:py-32 border-t border-white/5 relative z-30 font-sans overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div className="w-full md:w-2/3">
            <h2 className="font-heading text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase break-words mb-4">
              Latest Peptide<br />Research Resources
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-xl">
              Insights from the lab and the field
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-start md:justify-end mt-6 md:mt-0">
            <Link href="/journal" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold">
              View All Journal Entries <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <div className="flex justify-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex rounded-full border border-white/10 p-1.5 bg-white/5 backdrop-blur-md"
          >
            <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold shadow-md">
              Peptide Science
            </button>
            <button className="px-6 py-2 rounded-full text-white/70 hover:text-white text-sm font-semibold transition-colors">
              Lab Updates
            </button>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:h-[600px]"
        >
          {/* Left Column */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol(0)}
            onMouseLeave={() => setHoveredCol(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol === 0 ? 'md:w-1/2' : (hoveredCol === null ? 'md:w-1/4' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={0} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[0].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-sm md:text-base font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[0].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
            <motion.div layout custom={1} variants={itemVariants} className="w-[80%] aspect-square md:aspect-auto md:flex-1 max-h-[30%] self-end rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
          </motion.div>

          {/* Middle Column */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol(1)}
            onMouseLeave={() => setHoveredCol(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol === 1 ? 'md:w-1/2' : (hoveredCol === null ? 'md:w-1/2' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={2} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden h-full bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[1].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[1].image} 
                  alt={BLOG_POSTS[1].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <h3 className="text-white text-lg md:text-2xl font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[1].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol(2)}
            onMouseLeave={() => setHoveredCol(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol === 2 ? 'md:w-1/2' : (hoveredCol === null ? 'md:w-1/4' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={3} variants={itemVariants} className="w-[80%] aspect-square md:aspect-auto md:flex-1 max-h-[30%] self-start rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
            <motion.div layout custom={4} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[2].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[2].image} 
                  alt={BLOG_POSTS[2].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-sm md:text-base font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[2].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Second Row of Posts (Alternating Layout) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:h-[600px] mt-4 md:mt-6"
        >
          {/* Left Column (Alternated: Spacer first) */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol2(0)}
            onMouseLeave={() => setHoveredCol2(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol2 === 0 ? 'md:w-1/2' : (hoveredCol2 === null ? 'md:w-1/4' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={5} variants={itemVariants} className="w-[80%] aspect-square md:aspect-auto md:flex-1 max-h-[30%] self-start rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
            <motion.div layout custom={6} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[3].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[3].image} 
                  alt={BLOG_POSTS[3].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-sm md:text-base font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[3].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Middle Column */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol2(1)}
            onMouseLeave={() => setHoveredCol2(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol2 === 1 ? 'md:w-1/2' : (hoveredCol2 === null ? 'md:w-1/2' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={7} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden h-full bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[4].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[4].image} 
                  alt={BLOG_POSTS[4].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <h3 className="text-white text-lg md:text-2xl font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[4].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column (Alternated: Post first) */}
          <motion.div 
            layout
            onMouseEnter={() => setHoveredCol2(2)}
            onMouseLeave={() => setHoveredCol2(null)}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={`w-full flex flex-col gap-4 md:gap-6 h-[400px] md:h-full overflow-hidden ${
              hoveredCol2 === 2 ? 'md:w-1/2' : (hoveredCol2 === null ? 'md:w-1/4' : 'md:w-1/4')
            }`}
          >
            <motion.div layout custom={0} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/journal/${BLOG_POSTS[5].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[5].image} 
                  alt={BLOG_POSTS[5].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <h3 className="text-white text-sm md:text-base font-medium leading-snug group-hover:text-primary transition-colors">
                    {BLOG_POSTS[5].title}
                  </h3>
                </div>
              </Link>
            </motion.div>
            <motion.div layout custom={1} variants={itemVariants} className="w-[80%] aspect-square md:aspect-auto md:flex-1 max-h-[30%] self-end rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
    </section>
  )
}
