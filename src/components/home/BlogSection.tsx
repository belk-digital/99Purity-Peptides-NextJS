'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
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

  // Use 7 posts to match the design (1 featured, 6 standard)
  const posts = BLOG_POSTS.slice(0, 7)

  const BlogCard = ({ post, isFeatured }: { post: any, isFeatured: boolean }) => {
    
    const TagBlock = () => (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-ink/70 text-[10px] font-semibold w-max mb-4">
        <span className="tracking-wide capitalize">{post.category}</span>
      </div>
    )

    const TitleBlock = ({ className = "" }: { className?: string }) => (
      <h3 className={`font-bold leading-[1.2] tracking-tight group-hover:opacity-80 transition-opacity ${className}`}>
        {post.title}
      </h3>
    )

    const FooterBlock = () => (
      <div className="flex items-center justify-between w-full mt-auto pt-4 md:pt-6">
        <div className="flex items-center gap-3">
          {/* Author avatar */}
          <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0 relative shadow-sm">
            <Image src="/99 Images/vial-closeup.webp" alt="Author" fill className="object-cover grayscale" />
          </div>
          <span className="text-xs font-bold text-ink/80">{post.author || '99 Purity Peptides'}</span>
        </div>
        <span className="text-[10px] sm:text-xs text-ink-muted/60 font-medium">
          {isFeatured ? (post.date || 'May 9, 2026') : (post.readTime || '8 min read')}
        </span>
      </div>
    )

    return (
      <motion.div variants={itemVariants} className="w-full h-full">
        <Link 
          href={`/${post.slug}`} 
          className={`flex h-full bg-white rounded-[2rem] border border-ink/5 hover:border-ink/10 hover:shadow-xl transition-all duration-500 group shadow-sm ${isFeatured ? 'flex-col lg:flex-row p-4 md:p-6 lg:p-8 gap-6 md:gap-8 lg:gap-12' : 'flex-col p-4 md:p-5 gap-5'}`}
        >
          {/* Image Container */}
          <div className={`relative rounded-2xl overflow-hidden bg-slate-100 shrink-0 ${isFeatured ? 'w-full lg:w-[55%] aspect-video lg:aspect-[4/3] xl:aspect-[16/10]' : 'w-full aspect-[4/3]'}`}>
            <Image src={post.imageSrc} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={post.title} unoptimized />
          </div>
          
          {/* Content Container */}
          <div className={`flex flex-col flex-1 ${isFeatured ? 'justify-center py-2 lg:py-6 lg:pr-8' : ''}`}>
            <div>
              <TagBlock />
              <TitleBlock className={isFeatured ? "text-ink text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6" : "text-ink text-lg md:text-xl mb-4 line-clamp-3"} />
              {isFeatured && (
                <p className="text-ink-muted text-sm md:text-base leading-relaxed font-medium line-clamp-4 lg:line-clamp-5 mb-8">
                  {post.excerpt}
                </p>
              )}
            </div>
            <FooterBlock />
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <section className="bg-cream py-24 md:py-32 relative z-30 font-sans overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div className="w-full md:w-2/3">
            <h2 className="font-heading text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-[0.9] tracking-tighter uppercase break-words mb-4">
              {t('titleLine1')}<br />{t('titleLine2')}
            </h2>
            <p className="text-ink-muted text-sm sm:text-base md:text-lg max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-start md:justify-end mt-6 md:mt-0">
            <FluidButton
              href="/blog"
              text={t('ctaText')}
              variant="dark"
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-6"
        >
          {/* Featured Post (Index 0) */}
          {posts.length > 0 && (
            <BlogCard post={posts[0]} isFeatured={true} />
          )}

          {/* Grid of 6 standard posts */}
          {posts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1, 7).map(post => (
                <BlogCard key={post.slug} post={post} isFeatured={false} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
