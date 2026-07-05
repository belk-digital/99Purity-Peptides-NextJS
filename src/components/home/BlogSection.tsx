'use client'

import React, { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { FluidButton } from '@/components/ui/fluid-button'

import { BLOG_POSTS as BLOG_POSTS_EN } from '@/data/blog-posts'
import { BLOG_POSTS as BLOG_POSTS_ES } from '@/data/blog-posts.es'

export function BlogSection() {
  const t = useTranslations('home.blogSection')
  const locale = useLocale()
  const BLOG_POSTS = locale === 'es' ? BLOG_POSTS_ES : BLOG_POSTS_EN
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
      scale: 0.85
    }),
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0, 
      rotate: 0,
      scale: 1,
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
              {t('titleLine1')}<br />{t('titleLine2')}
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-start md:justify-end mt-6 md:mt-0">
            <FluidButton
              href="/blog"
              text={t('ctaText')}
              variant="white"
            />
          </div>
        </motion.div>

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
              <Link href={`/${BLOG_POSTS[0].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[0].imageSrc} 
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
              <Link href={`/${BLOG_POSTS[1].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[1].imageSrc} 
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
            <motion.div layout custom={4} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/${BLOG_POSTS[2].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[2].imageSrc} 
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
            <motion.div layout custom={6} variants={itemVariants} className="group cursor-pointer relative rounded-[32px] overflow-hidden flex-1 bg-white/5 border border-white/10 w-full">
              <Link href={`/${BLOG_POSTS[3].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[3].imageSrc} 
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
              <Link href={`/${BLOG_POSTS[4].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[4].imageSrc} 
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
              <Link href={`/${BLOG_POSTS[5].slug}`} className="block w-full h-full relative">
                <Image 
                  src={BLOG_POSTS[5].imageSrc} 
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
          </motion.div>
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
    </section>
  )
}
