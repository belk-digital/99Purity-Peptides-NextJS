import { getPayload } from 'payload'
import configPromise from '@payload-config'
import BlogIndexPage from './BlogIndexClient'
import { getBlogPlaceholderImage } from '@/lib/blogPlaceholderImage'

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
  'Growth research': { en: 'Growth research', es: 'Investigación de crecimiento' },
  'Muscle studies': { en: 'Muscle studies', es: 'Estudios musculares' },
  'Recovery protocols': { en: 'Recovery protocols', es: 'Protocolos de recuperación' },
  'Metabolic research': { en: 'Metabolic research', es: 'Investigación metabólica' },
  'Product Guides': { en: 'Product Guides', es: 'Guías de Producto' },
}

async function getPayloadBlogPosts(locale: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      locale: locale as 'en' | 'es',
      fallbackLocale: 'en',
      sort: '-publishedAt',
      depth: 1,
      limit: 200,
    })

    return docs.map((post: any) => {
      const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage?.url : undefined
      const category = post.category || 'Product Guides'
      const displayCategory = CATEGORY_LABELS[category]?.[locale === 'es' ? 'es' : 'en'] || category
      const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)
      return {
        slug: post.slug,
        title: post.title,
        category: displayCategory,
        date: publishedAt.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        readTime: '5 min read',
        excerpt: post.excerpt || post.seoDescription || '',
        imageSrc: featuredImage || getBlogPlaceholderImage(post.slug),
      }
    })
  } catch {
    return []
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const payloadPosts = await getPayloadBlogPosts(locale)
  return <BlogIndexPage payloadPosts={payloadPosts} />
}
