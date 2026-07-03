'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { EyebrowHeading } from '@/components/editorial/EyebrowHeading'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { BlogBentoGrid } from '@/components/editorial/BlogBentoGrid'
import { Button } from '@/components/ui/button'
import { FluidButton } from '@/components/ui/fluid-button'
import { useLocale, useTranslations } from 'next-intl'
import { BLOG_POSTS as BLOG_POSTS_EN } from '@/data/blog-posts'
import { BLOG_POSTS as BLOG_POSTS_ES } from '@/data/blog-posts.es'

const CATEGORIES_EN = ['View all', 'Growth research', 'Muscle studies', 'Recovery protocols', 'Metabolic research']
const CATEGORIES_ES = ['Ver todo', 'Investigación de crecimiento', 'Estudios musculares', 'Protocolos de recuperación', 'Investigación metabólica']
const MOCK_IMAGES = [
  "/99 Images/category-1.webp",
  "/99 Images/why-choose-us-1.webp",
  "/99 Images/purity.webp",
  "/99 Images/category-4.webp",
  "/99 Images/identity.webp",
  "/99 Images/coa.webp"
]

export default function BlogIndexPage() {
  const locale = useLocale()
  const t = useTranslations('blog')
  const BLOG_POSTS = locale === 'es' ? BLOG_POSTS_ES : BLOG_POSTS_EN
  const CATEGORIES = locale === 'es' ? CATEGORIES_ES : CATEGORIES_EN
  const ALL_LABEL = CATEGORIES[0]
  const [activeCategory, setActiveCategory] = useState(ALL_LABEL)
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(scrollContainerRef, { once: true, amount: 0.5 })

  useEffect(() => {
    // When the container comes into view, trigger a native "peek" scroll bounce
    if (isInView && scrollContainerRef.current) {
      // Check if it's actually scrollable first (i.e. on mobile)
      if (scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth) {
        const timer1 = setTimeout(() => {
          scrollContainerRef.current?.scrollBy({ left: 50, behavior: 'smooth' })
        }, 500)
        
        const timer2 = setTimeout(() => {
          scrollContainerRef.current?.scrollBy({ left: -50, behavior: 'smooth' })
        }, 1100) // Wait for first smooth scroll to finish before returning

        return () => {
          clearTimeout(timer1)
          clearTimeout(timer2)
        }
      }
    }
  }, [isInView])

  const handleTabsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget
    if (scrollWidth - clientWidth - scrollLeft < 10) {
      setIsScrolledToEnd(true)
    } else {
      setIsScrolledToEnd(false)
    }
  }

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "100%"]);

  const sortedPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [])

  const latestPost = sortedPosts[0]

  const filteredPosts = activeCategory === ALL_LABEL
    ? sortedPosts
    : sortedPosts.filter(post => post.category === activeCategory)

  const displayedPosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  return (
    <main className="bg-cream min-h-screen text-ink font-sans overflow-hidden">
      {/* ... Hero Section (Truncated for brevity) */}
      <div className="relative w-full h-[100dvh] min-h-[600px] md:min-h-[700px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 overflow-hidden flex transition-[padding] duration-300 mb-16 md:mb-24">
        {/* ... Hero Content ... */}
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          {/* Background Image */}
          <Image
            src="/99 Images/journal_hero_bg_white.png"
            alt="Science Blog Background"
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
                text={<><span className="hidden sm:inline">{t('hero.exploreLatestLong')}</span><span className="sm:hidden">{t('hero.exploreLatestShort')}</span></>} 
                className="relative z-10" 
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 w-full h-full max-w-7xl pb-32 sm:pb-28 pt-20 md:pb-24 md:pt-10 lg:pb-32 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="w-full max-w-6xl mx-auto"
            >
              <h1 className="w-full font-heading text-[8vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[56px] xl:text-[72px] leading-[1.1] md:leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-6">
                {t('hero.title')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-2 text-white/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl font-light leading-relaxed tracking-wide mx-auto"
            >
              {t('hero.description')}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <section className="px-4 md:px-6 mb-12 lg:mb-16 max-w-[1280px] mx-auto">
        <FadeUp delay={0.3}>
          <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
            <div className="shrink-0 bg-ink/5 p-3 rounded-full hidden sm:block">
              <svg className="w-6 h-6 text-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-ink text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-ink/60 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {t('compliance.title')}
              </h3>
              <p className="text-sm text-ink/70 leading-relaxed font-medium">
                {t('compliance.description')}
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Featured Post */}
      <section className="px-4 md:px-6 mb-24 lg:mb-32 max-w-[1280px] mx-auto">
        <FadeUp delay={0.4}>
          <div className="mb-6 lg:mb-8 px-2 lg:px-4">
            <h2 className="font-heading text-xl md:text-2xl font-black uppercase tracking-tighter text-ink/60">{t('latestArticle')}</h2>
          </div>
          <Link href={`/${latestPost?.slug}`} className="group flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch w-full bg-white p-4 sm:p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-ink/5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="relative w-full lg:w-[55%] aspect-[4/3] lg:aspect-auto rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border border-ink/5 shrink-0">
              <Image 
                src={latestPost?.imageSrc || MOCK_IMAGES[0]} 
                alt={latestPost?.title || "Featured post"} 
                fill 
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]" 
              />
            </div>
            
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-2 sm:px-4 lg:px-6 py-4 lg:py-8 min-w-0">
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 flex-wrap">
                <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-ink text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm">
                  {latestPost?.category || "Emerging"}
                </span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-[11px] sm:text-xs font-medium text-ink/50 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {latestPost?.date || "May 2026"}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-ink/50 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {latestPost?.readTime || "12 min read"}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-extrabold font-sans text-ink mb-4 sm:mb-6 tracking-tight leading-[1.1] group-hover:text-primary transition-colors duration-500">
                {latestPost?.title}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-ink/60 mb-8 sm:mb-10 leading-relaxed font-medium line-clamp-3 sm:line-clamp-4">
                {latestPost?.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="w-[155px] md:w-[215px] flex shrink-0 items-center">
                  <FluidButton text={t('readArticle')} className="scale-[0.75] origin-left" />
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: latestPost?.title,
                        text: latestPost?.excerpt,
                        url: window.location.origin + '/' + latestPost?.slug,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.origin + '/' + latestPost?.slug);
                      alert(t('linkCopied'));
                    }
                  }}
                  className="p-2 sm:p-3 bg-cream border border-ink/5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-ink/40 group-hover:border-primary/20 shrink-0"
                  aria-label={t('shareArticle')}
                  title={t('shareArticle')}
                >
                  <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        </FadeUp>
      </section>

      {/* Filter Chips */}
      <section className="px-4 md:px-6 mb-16 max-w-[1280px] mx-auto flex justify-start lg:justify-center">
        <div className="relative w-full lg:w-auto bg-white rounded-full shadow-sm border border-ink/5">
          {/* Subtle gradient to indicate scrollability on mobile */}
          <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none lg:hidden rounded-r-full z-10 transition-opacity duration-300 ${isScrolledToEnd ? 'opacity-0' : 'opacity-100'}`} />
          
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-2 md:gap-4 overflow-x-auto snap-x w-full p-2 relative z-0 rounded-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleTabsScroll}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleCount(6)
                }}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 snap-center shrink-0 relative z-20 ${
                  activeCategory === cat 
                    ? 'bg-ink text-white shadow-md' 
                    : 'bg-transparent text-ink/60 hover:text-ink hover:bg-ink/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-6 max-w-[1280px] mx-auto mb-32">
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {displayedPosts.map((post, index) => (
              <FadeUp key={post.slug} delay={0.1 * (index % 3)}>
                <BlogPostCard {...post} />
              </FadeUp>
            ))}
          </div>
        ) : (
          <FadeUp className="w-full flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-2xl font-black font-sans text-ink mb-4">{t('noArticlesFound')}</h3>
            <p className="text-ink/60">{t('noArticlesDesc', { category: activeCategory })}</p>
            <button 
              onClick={() => {
                setActiveCategory(ALL_LABEL)
                setVisibleCount(6)
              }} 
              className="mt-8 px-6 py-2.5 rounded-full bg-ink text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors"
            >
              {t('viewAllArticles')}
            </button>
          </FadeUp>
        )}
      </section>

      {/* Infinite Scroll trigger area */}
      {hasMore && (
        <section className="pb-32 flex justify-center">
          <FadeUp>
            <FluidButton 
              text={t('loadMore')} 
              className="w-full sm:w-auto"
              onClick={() => setVisibleCount(prev => prev + 6)}
            />
          </FadeUp>
        </section>
      )}
    </main>
  )
}

