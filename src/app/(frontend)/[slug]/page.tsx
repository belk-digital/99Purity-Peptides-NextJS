import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FadeUp } from '@/components/motion/FadeUp'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { ReadingProgress } from '@/components/editorial/ReadingProgress'
import { BLOG_POSTS } from '@/data/blog-posts'
import { BLOG_SEO } from '@/data/blog-seo'

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) return { title: 'Post Not Found | 99 Purity Peptides' }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://99purity.com'
  
  const seoData = BLOG_SEO[slug]

  const title = seoData?.title ? seoData.title : `${post.title} | 99 Purity Peptides`
  const description = seoData?.description ? seoData.description : post.excerpt

  return {
    title: title,
    description: description
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Get 3 related posts (just the first 3 that aren't the current one)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://99purity.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${baseUrl}${post.imageSrc}`,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: '99 Purity Peptides',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: '99 Purity Peptides',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${slug}`
    }
  }

  const customSchemas = BLOG_SEO[slug]?.schemas || []

  return (
    <>
      {customSchemas.length > 0 ? (
        customSchemas.map((schema, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <main className="bg-cream min-h-screen pb-32">
      <ReadingProgress />

      {/* Hero Image */}
      <div className="w-full h-[60vh] relative mb-16 md:mb-24">
        <Image 
          src={post.imageSrc} 
          alt={post.title} 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <article className="px-6 max-w-[720px] mx-auto">
        <FadeUp>
          {/* Meta Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-label-md uppercase tracking-wider text-gold mb-8 text-center">
            <span>{post.category}</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{post.date}</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{post.readTime}</span>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg font-serif text-ink mb-8 text-center leading-[1.1]">
            {post.title}
          </h1>

          {/* Body */}
          <div className="text-body-lg text-ink leading-relaxed space-y-8">
            {post.content}
          </div>
        </FadeUp>
      </article>

      {/* Related Posts */}
      <section className="px-6 max-w-[1280px] mx-auto mt-32 pt-16 border-t border-border-subtle">
        <div className="mb-12">
          <span className="text-label-md uppercase tracking-wider text-gold mb-2 block">Related</span>
          <h3 className="text-editorial-lg font-serif text-ink">Continue reading</h3>
        </div>
        
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => (
            <div key={relatedPost.slug} className="h-full">
              <BlogPostCard 
                slug={relatedPost.slug}
                title={relatedPost.title}
                category={relatedPost.category}
                excerpt={relatedPost.excerpt}
                imageSrc={relatedPost.imageSrc}
                readTime={relatedPost.readTime}
              />
            </div>
          ))}
        </StaggerChildren>
      </section>
    </main>
    </>
  )
}
