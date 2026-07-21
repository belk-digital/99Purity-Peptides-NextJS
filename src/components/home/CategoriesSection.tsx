'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getCategoryDisplayName } from '@/lib/categoryDisplay'

export interface HomeCategory {
  id: string | number
  name: string
  slug?: string
}

export interface CategoriesSectionProps {
  categories?: HomeCategory[]
}

const CATEGORY_IMAGES = [
  '/99 Images/category-1.webp',
  '/99 Images/category-2.webp',
  '/99 Images/category-3.webp',
  '/99 Images/category-4.webp',
  '/99 Images/category-5.webp',
  '/99 Images/category-6.webp',
  '/99 Images/category-7.webp',
  '/99 Images/category-8.webp',
]

export function CategoriesSection({ categories = [] }: CategoriesSectionProps) {
  const t = useTranslations('home.categories')
  const targetRef = useRef<HTMLDivElement>(null)
  const [isHoveringCategory, setIsHoveringCategory] = useState(false);

  // Use MotionValues for high-performance cursor tracking without React re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 50);
      cursorY.set(e.clientY - 50);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  // Translate the flex container to the left as we scroll down.
  const x = useTransform(scrollYProgress, (value) => `calc(-${value * 100}% + ${value * 100}vw)`)

  const header = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0"
    >
      <h2 className="font-heading text-[2rem] sm:text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-[0.9] tracking-tighter uppercase w-full md:w-1/2 break-words">
        {t('titleLine1')}<br />{t('titleLine2')}
      </h2>
      <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-md text-left md:text-right leading-relaxed font-medium">
        {t('description')}
      </p>
    </motion.div>
  )

  return (
    <>
      {/* Desktop: scroll-jacking horizontal reveal */}
      <section ref={targetRef} className="hidden md:block bg-cream w-full relative z-30 font-sans h-[300vh]">

        {/* Custom Cursor */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-full bg-ink text-cream font-bold text-[10px] uppercase tracking-widest text-center shadow-2xl"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            width: 100,
            height: 100
          }}
          animate={{
            scale: isHoveringCategory ? 1 : 0,
            opacity: isHoveringCategory ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="max-w-[70px] leading-tight text-[11px] font-bold">{t('exploreCursor')}</span>
        </motion.div>

        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          {/* Section Header */}
          <div className="container mx-auto px-4 md:px-10 mb-8 max-w-7xl shrink-0">
            {header}
          </div>

          {/* Horizontal Scrolling Vertical Slice Gallery */}
          <motion.div style={{ x }} className="flex w-max h-[60vh] min-h-[400px] max-h-[700px] will-change-transform">
            {categories.map((category, index) => (
              <Link
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                key={category.id}
                className="shrink-0 w-[33.333vw] lg:w-[25vw] h-full relative group overflow-hidden border-r border-ink/5 cursor-none block"
                onMouseEnter={() => setIsHoveringCategory(true)}
                onMouseLeave={() => setIsHoveringCategory(false)}
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full bg-black/5">
                  <Image
                    src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle bottom gradient for text readability only */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none transition-opacity duration-700 opacity-70 group-hover:opacity-90" />
                </div>

                {/* Bottom Centered Text */}
                <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none px-4 z-10">
                    <h3
                      className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight text-center drop-shadow-md transition-all duration-500 group-hover:-translate-y-2 uppercase break-words w-full"
                    >
                      {getCategoryDisplayName(category.name)}
                    </h3>
                </div>
                </Link>
            ))}
          </motion.div>

          {/* Keep Scrolling Indicator */}
          <motion.div
            className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-40 group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            }}
          >
            <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-10 rounded-full border-2 border-ink/20 flex justify-center p-1.5 group-hover:border-ink/40 group-hover:shadow-md transition-all duration-300 relative overflow-hidden bg-cream/80 backdrop-blur-md">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-1.5 h-2.5 bg-ink/50 rounded-full group-hover:bg-ink/80 transition-colors duration-300"
                />
              </div>
            </div>
          </motion.div>

        </div>

      </section>

      {/* Mobile: plain swipeable carousel, no scroll-jacking */}
      <section className="md:hidden bg-cream w-full relative z-30 font-sans py-12">
        <div className="container mx-auto px-4 mb-6">
          {header}
        </div>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 no-scrollbar">
          {categories.map((category, index) => (
            <Link
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="shrink-0 snap-center w-[78vw] aspect-[4/5] rounded-[20px] relative overflow-hidden block"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full bg-black/5">
                <Image
                  src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                  alt={getCategoryDisplayName(category.name)}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Bottom Centered Text */}
              <div className="absolute inset-x-0 bottom-8 flex justify-center px-4 z-10">
                <h3 className="font-heading text-[1.1rem] font-semibold text-white tracking-tight text-center drop-shadow-md uppercase break-words w-full">
                  {getCategoryDisplayName(category.name)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

