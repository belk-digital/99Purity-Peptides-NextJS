import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FadeUp } from '@/components/motion/FadeUp'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { ReadingProgress } from '@/components/editorial/ReadingProgress'
import { TableOfContents } from '@/components/editorial/TableOfContents'
import { BlogPostHero } from '@/components/editorial/BlogPostHero'
import { BLOG_POSTS as BLOG_POSTS_EN } from '@/data/blog-posts'
import { BLOG_POSTS as BLOG_POSTS_ES } from '@/data/blog-posts.es'
import { BLOG_SEO as BLOG_SEO_EN } from '@/data/blog-seo'
import { BLOG_SEO_ES } from '@/data/blog-seo.es'
import { getBlogPosts } from '@/lib/data/blog'
import { getBlogSeo } from '@/lib/seo/blog'
import { getOgImageUrl } from '@/lib/utils/getOgImageUrl'

const BLOG_POSTS = BLOG_POSTS_EN

function getBlogPosts(locale: string) {
  return locale === 'es' ? BLOG_POSTS_ES : BLOG_POSTS_EN
}

function getBlogSeo(locale: string) {
  return locale === 'es' ? BLOG_SEO_ES : BLOG_SEO_EN
}

const BREADCRUMB_LABELS: Record<string, { home: string; blog: string }> = {
  en: { home: 'Home', blog: 'Research Blog' },
  es: { home: 'Inicio', blog: 'Blog de Investigación' },
}

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
}

// post.date is a human-readable string in either English ("May 21, 2026") or Spanish
// ("21 de mayo de 2026"); schema.org/Google Rich Results require ISO 8601 for datePublished.
function toIsoDate(dateStr: string): string {
  const en = dateStr.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/)
  if (en) {
    const month = MONTHS[en[1].toLowerCase()]
    if (month) return `${en[3]}-${month}-${en[2].padStart(2, '0')}`
  }
  const es = dateStr.match(/^(\d{1,2})\s+de\s+([A-Za-zñÑ]+)\s+de\s+(\d{4})$/i)
  if (es) {
    const month = MONTHS[es[2].toLowerCase()]
    if (month) return `${es[3]}-${month}-${es[1].padStart(2, '0')}`
  }
  return dateStr
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const post = getBlogPosts(locale).find((p) => p.slug === slug)

  if (!post) {
    return { title: locale === 'es' ? 'Publicación No Encontrada | 99 Purity Peptides' : 'Post Not Found | 99 Purity Peptides' }
  }

  const seoData = getBlogSeo(locale)[slug]

  const title = seoData?.title ? seoData.title : `${post.title} | 99 Purity Peptides`
  const description = seoData?.description ? seoData.description : post.excerpt
  const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const imageUrl = post.imageSrc ? `${baseUrl}${post.imageSrc}` : undefined

  return {
    title: title,
    description: description,
    alternates: {
      canonical: path,
      languages: {
        en: `/${slug}`,
        es: `/es/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      images: imageUrl ? [{ url: imageUrl }] : [getOgImageUrl(title, description)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [getOgImageUrl(title, description)],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const localePosts = getBlogPosts(locale)
  const post = localePosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Get 3 related posts (just the first 3 that aren't the current one)
  const relatedPosts = localePosts.filter((p) => p.slug !== slug).slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const postPath = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
  const postUrl = `${baseUrl}${postPath}`
  const breadcrumbLabels = BREADCRUMB_LABELS[locale] || BREADCRUMB_LABELS.en
  const isoDate = toIsoDate(post.date)
  // post.imageSrc contains literal spaces (e.g. "/99 Blog Images/..."); encodeURI so the
  // resulting absolute URL is valid per the JSON-LD/schema.org URL requirement.
  const encodedImage = encodeURI(`${baseUrl}${post.imageSrc}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        headline: post.title,
        description: post.excerpt,
        image: encodedImage,
        datePublished: isoDate,
        dateModified: isoDate,
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
          '@id': postUrl
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: breadcrumbLabels.home, item: locale === 'en' ? baseUrl : `${baseUrl}/${locale}` },
          { '@type': 'ListItem', position: 2, name: breadcrumbLabels.blog, item: locale === 'en' ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: '99 Purity Peptides',
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: '99 Purity Peptides',
        url: baseUrl,
      },
    ]
  }

  const customSchemas = getBlogSeo(locale)[slug]?.schemas || []

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

        <BlogPostHero post={post} />

        {/* Two Column Layout for Desktop (TOC + Content) */}
        <div className="px-6 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 xl:gap-24 items-start pt-8">
          
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block relative">
            <TableOfContents />
          </aside>

          {/* Article Content */}
          <article className="prose-article max-w-[720px] w-full mx-auto lg:mx-0">
            <FadeUp>
              <div className="text-body-lg text-ink leading-loose space-y-8">
                {post.content}
              </div>
            </FadeUp>
          </article>
        </div>

        {/* Related Posts */}
        <section className="px-6 max-w-[1280px] mx-auto mt-32 pt-16 border-t border-ink/10">
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
