'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { EyebrowHeading } from '@/components/editorial/EyebrowHeading'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { Button } from '@/components/ui/button'
import { FluidButton } from '@/components/ui/fluid-button'

const CATEGORIES = ['All', 'Emerging', 'Guidelines', 'Studies', 'Guides']
const MOCK_IMAGES = [
  "/99 Images/category-1.webp",
  "/99 Images/why-choose-us-1.webp",
  "/99 Images/purity.webp",
  "/99 Images/category-4.webp",
  "/99 Images/identity.webp",
  "/99 Images/coa.webp"
]

export default function JournalIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "100%"]);

  return (
    <main className="bg-cream min-h-screen text-ink font-sans overflow-hidden">
      {/* 1. Cinematic Hero Section */}
      <div className="relative w-full h-[65dvh] min-h-[500px] md:min-h-[600px] bg-cream p-3 pt-[44px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[52px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-16 [.announcement-closed_&]:md:pt-8 overflow-hidden flex transition-[padding] duration-300 mb-16 md:mb-24">
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          {/* Background Image */}
          <Image
            src="/99 Images/journal_hero_bg_white.png"
            alt="Science Journal Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-50 mix-blend-luminosity"
            priority
          />

          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Cutouts & UI Overlay (Inverted corners) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
              {/* Left Fillet */}
              <div 
                className="absolute bottom-0 -left-[calc(2.5rem-1px)] w-10 h-10 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              {/* Right Fillet */}
              <div 
                className="absolute bottom-0 -right-[calc(2.5rem-1px)] w-10 h-10 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              <FluidButton 
                text={<><span className="hidden sm:inline">Explore Latest Articles</span><span className="sm:hidden">Explore Articles</span></>} 
                className="relative z-10" 
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-5 sm:px-12 md:px-24 w-full h-full max-w-6xl pb-32 sm:pb-28 pt-20 md:pb-24 md:pt-10 lg:pb-32 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="w-full max-w-5xl mx-auto"
            >
              <h1 className="w-full font-heading text-[9vw] sm:text-[7vw] md:text-[6vw] lg:text-[64px] xl:text-[80px] leading-[1.1] md:leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-4 md:mb-6">
                RESEARCH & <br className="hidden md:block"/>GUIDELINES
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-2 text-white/80 text-sm sm:text-base md:text-xl max-w-2xl font-light leading-relaxed tracking-wide mx-auto"
            >
              Documented purity, detailed guidelines, and emerging studies in advanced peptide science.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <section className="px-4 md:px-6 mb-24 lg:mb-32 max-w-[1280px] mx-auto">
        <FadeUp delay={0.4}>
          <div className="mb-8 lg:mb-10 px-2 lg:px-4">
            <h2 className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-ink/40">Featured Article</h2>
          </div>
          <Link href="/journal/the-case-for-nad-in-mitochondrial-research" className="group flex flex-col lg:flex-row gap-8 lg:gap-16 items-center w-full bg-white p-4 lg:p-8 rounded-[2.5rem] border border-ink/5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-[16/10] rounded-[2rem] overflow-hidden border border-ink/5">
              <Image 
                src="/99 Images/magazine-1.webp" 
                alt="Featured post" 
                fill 
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]" 
              />
            </div>
            
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 lg:px-8 py-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono px-4 py-1.5 bg-cream-warm border border-ink/5 text-ink/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] group-hover:bg-primary/10 group-hover:text-primary transition-colors">Emerging</span>
                <span className="font-mono text-[10px] text-ink/40 font-bold uppercase tracking-[0.2em]">12 min read</span>
              </div>
              <h2 className="text-4xl lg:text-[50px] font-black font-heading text-ink mb-8 tracking-tighter leading-[1.05] uppercase group-hover:text-primary transition-colors duration-500">
                The case for NAD+ in mitochondrial research
              </h2>
              <p className="text-lg md:text-xl text-ink/60 mb-12 leading-relaxed font-medium">
                A comprehensive review of NAD+ precursors and their impact on cellular respiration, longevity markers, and tissue repair guidelines.
              </p>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-3 group-hover:text-primary transition-colors duration-500">
                Read the full article <span aria-hidden="true" className="transform group-hover:translate-x-2 transition-transform duration-500">→</span>
              </span>
            </div>
          </Link>
        </FadeUp>
      </section>

      {/* Filter Chips */}
      <section className="px-4 md:px-6 mb-16 max-w-[1280px] mx-auto flex justify-start lg:justify-center">
        <FadeUp delay={0.2} className="w-full lg:w-auto">
          <div 
            className="flex bg-white rounded-full p-2 shadow-md border border-ink/5 overflow-x-auto gap-2 snap-x w-full lg:w-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-6 md:px-8 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-ink text-white shadow-md' 
                    : 'bg-transparent text-ink/50 hover:text-primary hover:bg-cream-warm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 max-w-[1280px] mx-auto mb-32">
        <StaggerChildren staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {[1, 2, 3, 4, 5, 6].map((i, index) => (
            <motion.div 
              key={i} 
              variants={staggerItemVariants} 
              className={`h-full ${index % 3 === 1 ? 'lg:mt-32' : ''} ${index % 3 === 2 ? 'lg:mt-16' : ''} ${index % 2 === 1 ? 'md:mt-24 lg:mt-0' : ''}`}
            >
              <BlogPostCard 
                slug={`sample-post-${i}`}
                title={`Guideline: Reconstitution and storage guidelines ${i}`}
                category={i % 2 === 0 ? 'Guidelines' : 'Studies'}
                excerpt="Best practices for maintaining peptide stability, minimizing degradation, and ensuring accurate dosing in clinical environments."
                imageSrc={MOCK_IMAGES[index % MOCK_IMAGES.length]}
                readTime="5 min read"
              />
            </motion.div>
          ))}
        </StaggerChildren>
      </section>

      {/* Infinite Scroll trigger area */}
      <section className="pb-32 flex justify-center">
        <FadeUp>
          <FluidButton 
            text="Load More Posts" 
            className="w-full sm:w-auto"
          />
        </FadeUp>
      </section>
    </main>
  )
}

