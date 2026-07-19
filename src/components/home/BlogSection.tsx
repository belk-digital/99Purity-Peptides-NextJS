'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { CornerDownRight, Tag } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { FluidButton } from '@/components/ui/fluid-button'

import { BLOG_POSTS as BLOG_POSTS_EN } from '@/data/blog-posts'
import { BLOG_POSTS as BLOG_POSTS_ES } from '@/data/blog-posts.es'

export function BlogSection() {
  const t = useTranslations('home.blogSection')
  const locale = useLocale()
  const BLOG_POSTS = locale === 'es' ? BLOG_POSTS_ES : BLOG_POSTS_EN

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
    }
  }

  // Use 6 posts to create 3 full rows
  const posts = BLOG_POSTS.slice(0, 6)

  const BlogCard = ({ post, isHorizontal }: { post: any, isHorizontal: boolean }) => {
    
    const TagBlock = () => (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] sm:text-xs font-semibold w-max shadow-sm backdrop-blur-sm">
        <Tag className="w-3 h-3 text-red-400" />
        <span className="tracking-wide uppercase">{post.category} • {post.readTime}</span>
      </div>
    )

    const TitleBlock = ({ className = "" }: { className?: string }) => (
      <h3 className={`text-white font-bold leading-[1.2] tracking-tight group-hover:text-primary transition-colors ${className}`}>
        {post.title}
      </h3>
    )

    const ButtonBlock = () => (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/80 text-[10px] uppercase tracking-widest font-bold group-hover:bg-white/10 group-hover:text-primary transition-all shadow-sm w-max">
        <CornerDownRight className="w-3.5 h-3.5" />
        <span>{t('ctaText') || 'Read Article'}</span>
      </div>
    )

    return (
      <motion.div variants={itemVariants} className={`w-full ${isHorizontal ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
        <Link href={`/${post.slug}`} className={`flex h-full bg-[#121212] rounded-[2rem] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] transition-all duration-500 group shadow-2xl ${isHorizontal ? 'flex-col md:flex-row p-4 md:p-6 gap-6 md:gap-8 lg:gap-10' : 'flex-col p-4 md:p-5 gap-5'}`}>
          
          {/* Image Container */}
          <div className={`relative rounded-2xl overflow-hidden bg-[#1a1a1a] shrink-0 ${isHorizontal ? 'w-full md:w-1/2 aspect-video md:aspect-square lg:aspect-auto' : 'w-full aspect-[4/3]'}`}>
            <Image src={post.imageSrc} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={post.title} unoptimized />
          </div>
          
          {/* Content Container */}
          <div className={`flex flex-col flex-1 ${isHorizontal ? 'justify-center py-2 lg:py-6' : 'justify-between'}`}>
            <div className="flex flex-col gap-4">
              <TagBlock />
              <TitleBlock className={isHorizontal ? "text-2xl md:text-3xl lg:text-[2rem]" : "text-xl md:text-2xl"} />
              <p className={`text-white/50 text-sm leading-relaxed font-medium ${isHorizontal ? 'line-clamp-4 lg:line-clamp-5' : 'line-clamp-3'}`}>
                {post.excerpt}
              </p>
            </div>
            <div className="mt-6 md:mt-8">
              <ButtonBlock />
            </div>
          </div>

        </Link>
      </motion.div>
    )
  }

  return (
    <section className="bg-[#050505] py-24 md:py-32 border-t border-white/5 relative z-30 font-sans overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
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

        {/* Grid Layout matching reference image exactly */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {posts.map((post, i) => {
            // Alternating Pattern:
            // Row 1: 0 (Vert), 1 (Horiz)
            // Row 2: 2 (Horiz), 3 (Vert)
            // Row 3: 4 (Vert), 5 (Horiz)
            const isHorizontal = i === 1 || i === 2 || i === 5;
            return <BlogCard key={post.slug} post={post} isHorizontal={isHorizontal} />
          })}
        </motion.div>
      </div>

      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" 
        style={{ background: 'radial-gradient(circle, rgba(28,228,201,0.08) 0%, transparent 60%)' }}
      />
    </section>
  )
}
