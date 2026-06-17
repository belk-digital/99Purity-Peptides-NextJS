'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
    slug: 'cold-chain-logistics'
  }
]

export function BlogSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] 
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
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase">
              Latest<br />Intelligence.
            </h2>
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
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
        >
          {/* Left Column */}
          <div className="md:col-span-3 flex flex-col gap-4 md:gap-6 h-full">
            <motion.div variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full min-h-[300px]">
              <Link href={`/journal/${BLOG_POSTS[0].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
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
            <motion.div variants={itemVariants} className="w-[80%] aspect-square self-end rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
          </div>

          {/* Middle Column */}
          <div className="md:col-span-6 flex flex-col gap-4 md:gap-6 h-full">
            <motion.div variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden h-[400px] md:h-[600px] bg-white/5 border border-white/10 w-full">
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
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 flex flex-col gap-4 md:gap-6 h-full">
            <motion.div variants={itemVariants} className="w-[80%] aspect-square self-start rounded-[32px] bg-white/5 border border-white/5 hidden md:block" />
            <motion.div variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full min-h-[300px]">
              <Link href={`/journal/${BLOG_POSTS[2].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[2].image} 
                  alt={BLOG_POSTS[2].title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
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
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
    </section>
  )
}
