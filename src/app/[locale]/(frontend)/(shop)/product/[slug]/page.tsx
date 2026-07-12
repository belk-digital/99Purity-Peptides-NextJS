import React from 'react'
import { ProductClient } from './ProductClient'
import { getOgImageUrl } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import { BLOG_POSTS as BLOG_POSTS_EN } from '@/data/blog-posts'
import { BLOG_POSTS as BLOG_POSTS_ES } from '@/data/blog-posts.es'
import { getCategoryDisplayName } from '@/lib/categoryDisplay'

function getBlogPosts(locale: string) {
  return locale === 'es' ? BLOG_POSTS_ES : BLOG_POSTS_EN
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1, // Need media depth for images
    locale: locale as 'en' | 'es',
    fallbackLocale: 'en',
  })

  if (!docs || docs.length === 0) {
    return { title: 'Product Not Found' }
  }

  const product = docs[0]
  const title = product.seoTitle || product.name || 'Product'
  const description = product.seoDescription || product.description?.substring(0, 160) || ''

  // Get primary image for open graph
  let imageUrl = undefined
  if (product.images && product.images.length > 0 && typeof product.images[0].image === 'object' && product.images[0].image?.url) {
    imageUrl = product.images[0].image.url
    if (imageUrl.startsWith('/')) {
      imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'}${imageUrl}`
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: getOgImageUrl(title, description) }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [getOgImageUrl(title, description)],
    },
    alternates: {
      canonical: locale === 'en' ? `/product/${slug}` : `/${locale}/product/${slug}`,
      languages: {
        en: `/product/${slug}`,
        es: `/es/product/${slug}`,
      },
    },
    // Spanish product content isn't translated yet — Payload falls back to the English copy,
    // so /es/product/* is currently a duplicate of the English page. Keep it out of Google's
    // index until real Spanish translations exist, to avoid duplicate-content dilution.
    robots: locale === 'es' ? { index: false, follow: true } : undefined,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  console.log('--- STARTING SERVER RENDER FOR PRODUCT PAGE ---')
  const { slug, locale } = await params
  console.log(`Resolved slug: ${slug}, Initializing Payload...`)
  
  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized, querying product...')
  
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // To fetch categories and media
    locale: locale as 'en' | 'es',
    fallbackLocale: 'en',
  })

  if (!docs || docs.length === 0) {
    notFound()
  }

  const rawProduct = docs[0]

  // Map images
  const mappedImages = rawProduct.images?.map((img: any) => {
    if (typeof img.image === 'object' && img.image?.url) {
      return img.image.url
    }
    return ''
  }).filter(Boolean) || []

  // If no images are uploaded, provide a fallback
  if (mappedImages.length === 0) {
    mappedImages.push('/temp-products/product-image.png')
  }

  // Map categories
  const mappedCategories = rawProduct.categories?.map((cat: any) => {
    return typeof cat === 'object' ? getCategoryDisplayName(cat.name) : 'Category'
  }).filter(Boolean) || []

  // Map variants
  let mappedVariants = []
  if (rawProduct.hasVariants && rawProduct.variants?.length) {
    mappedVariants = rawProduct.variants.map((v: any, index: number) => {
      const mappedImages = v.images?.map((img: any) => {
        if (typeof img.image === 'object' && img.image?.url) {
          return img.image.url
        }
        return ''
      }).filter(Boolean) || []

      return {
        id: v.sku || `v-${index}`,
        sku: v.sku || '',
        title: v.options?.map((o: any) => o.value).join(' ') || `Variant ${index + 1}`,
        price: `$${Number(v.price || 0).toFixed(2)}`,
        salePrice: v.salePrice ? `$${Number(v.salePrice).toFixed(2)}` : undefined,
        inStock: (v.stock || 0) > 0,
        images: mappedImages,
      }
    })
  } else {
    mappedVariants = [
      {
        id: rawProduct.sku || String(rawProduct.id),
        sku: rawProduct.sku || '',
        title: 'Standard',
        price: `$${Number(rawProduct.price || 0).toFixed(2)}`,
        salePrice: rawProduct.salePrice ? `$${Number(rawProduct.salePrice).toFixed(2)}` : undefined,
        inStock: (rawProduct.stock || 0) > 0,
      }
    ]
  }

  // Map tabs (Pass as strings to avoid Turbopack RSC serialization panics)
  const mappedTabs = []
  if (rawProduct.productDetailsDescription) {
    mappedTabs.push({
      id: 'product-details',
      label: rawProduct.productDetailsTitle || 'Product Details',
      content: rawProduct.productDetailsDescription
    })
  }
  if (rawProduct.researchFocusDescription) {
    mappedTabs.push({
      id: 'research-focus',
      label: rawProduct.researchFocusTitle || 'Research Focus & Mechanism Overview',
      content: rawProduct.researchFocusDescription
    })
  }
  if (rawProduct.qualityPurityDescription) {
    mappedTabs.push({
      id: 'quality-purity',
      label: rawProduct.qualityPurityTitle || 'Quality & Purity Standards',
      content: rawProduct.qualityPurityDescription
    })
  }
  if (rawProduct.complianceNoticeDescription) {
    mappedTabs.push({
      id: 'compliance-notice',
      label: rawProduct.complianceNoticeTitle || 'Compliance Notice',
      content: rawProduct.complianceNoticeDescription
    })
  }

  if (mappedTabs.length === 0 && rawProduct.description) {
    mappedTabs.push({
      id: 'description',
      label: 'Description',
      content: rawProduct.description
    })
  }

  // Map FAQs
  const mappedFaqs = rawProduct.faqs?.map((faq: any, i: number) => ({
    id: `faq-${i}`,
    question: faq.question,
    answer: faq.answer
  })) || []

  // Extract COA URL
  let coaFileUrl = undefined
  if (typeof rawProduct.coaFile === 'object' && rawProduct.coaFile?.url) {
    coaFileUrl = rawProduct.coaFile.url
  }

  // Map to ProductData interface
  const productData = {
    id: String(rawProduct.id),
    name: rawProduct.name,
    slug: rawProduct.slug || slug,
    subtitle: rawProduct.seoDescription || '',
    category: mappedCategories[0] || 'Product',
    categories: mappedCategories,
    sku: rawProduct.sku,
    weight: rawProduct.weight,
    dimensions: rawProduct.dimensions,
    badges: rawProduct.status === 'active' ? [] : ['DRAFT'],
    description: rawProduct.description || '',
    shortDescription: rawProduct.description || rawProduct.seoDescription || '',
    averageRating: rawProduct.averageRating || 5.0,
    reviewCount: rawProduct.reviewCount || 0,

    bulkBundles: rawProduct.bulkBundles?.map((b: any) => ({
      id: b.id,
      name: b.name,
      quantity: b.quantity,
      discountPercentage: b.discountPercentage,
      price: b.price,
      salePrice: b.salePrice,
      image: typeof b.image === 'object' && b.image?.url ? b.image.url : undefined,
      variantOverrides: b.variantOverrides?.map((vo: any) => ({
        variantSku: vo.variantSku,
        price: vo.price,
        salePrice: vo.salePrice
      })) || []
    })) || [],
    images: mappedImages,
    variants: mappedVariants,
    coaFile: coaFileUrl,
    tabs: mappedTabs,
    faqs: mappedFaqs,
    reviews: [] as any[],
    relatedProducts: [] as any[],
    suggestedBlogs: [] as any[],
  }

  // Fetch related products (same category)
  if (rawProduct.categories && rawProduct.categories.length > 0) {
    const categoryIds = rawProduct.categories.map((c: any) => typeof c === 'object' ? c.id : c).filter(Boolean)
    
    if (categoryIds.length > 0) {
      const { docs: relatedDocs } = await payload.find({
        collection: 'products',
        where: {
          and: [
            {
              id: {
                not_equals: rawProduct.id,
              }
            },
            {
              'categories': {
                in: categoryIds,
              }
            },
            {
              status: {
                equals: 'active'
              }
            }
          ]
        },
        limit: 4,
        depth: 1, // Only need basic info and main image
      })

      productData.relatedProducts = relatedDocs.map((p: any) => {
        let imageUrl = '/temp-products/product-image.png'
        let hoverImageUrl = undefined
        if (p.images && p.images.length > 0 && typeof p.images[0].image === 'object' && p.images[0].image?.url) {
          imageUrl = p.images[0].image.url
        }
        if (p.images && p.images.length > 1 && typeof p.images[1].image === 'object' && p.images[1].image?.url) {
          hoverImageUrl = p.images[1].image.url
        }

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: imageUrl,
          hoverImage: hoverImageUrl,
          shortDescription: p.seoDescription || 'High-purity research peptide for laboratory use.',
          category: typeof p.categories?.[0] === 'object' ? p.categories[0].title : '',
          priceRange: `$${p.price?.toFixed(2) || '0.00'}`,
          originalPrice: p.salePrice ? `$${p.salePrice.toFixed(2)}` : undefined,
          isFrom: p.bulkBundles && p.bulkBundles.length > 0,
        }
      })
    }
  }

  // If we couldn't find related products by category, just get the newest ones
  if (productData.relatedProducts.length === 0) {
    const { docs: recentDocs } = await payload.find({
      collection: 'products',
      where: {
        id: {
          not_equals: rawProduct.id,
        },
        status: {
          equals: 'active'
        }
      },
      sort: '-createdAt',
      limit: 4,
      depth: 1,
    })

    productData.relatedProducts = recentDocs.map((p: any) => {
      let imageUrl = '/temp-products/product-image.png'
      let hoverImageUrl = undefined
      if (p.images && p.images.length > 0 && typeof p.images[0].image === 'object' && p.images[0].image?.url) {
        imageUrl = p.images[0].image.url
      }
      if (p.images && p.images.length > 1 && typeof p.images[1].image === 'object' && p.images[1].image?.url) {
        hoverImageUrl = p.images[1].image.url
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: imageUrl,
        hoverImage: hoverImageUrl,
        shortDescription: p.seoDescription || 'High-purity research peptide for laboratory use.',
        category: typeof p.categories?.[0] === 'object' ? p.categories[0].title : '',
        priceRange: `$${p.price?.toFixed(2) || '0.00'}`,
        originalPrice: p.salePrice ? `$${p.salePrice.toFixed(2)}` : undefined,
        isFrom: p.bulkBundles && p.bulkBundles.length > 0,
      }
    })
  }

  // Generate JSON-LD Schemas
  
  // Fetch Suggested Blogs
  const { docs: blogDocs } = await payload.find({
    collection: 'blog-posts',
    where: {
      status: {
        equals: 'published'
      }
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
  })

  let mappedBlogs = blogDocs.map((post: any) => {
    let imageUrl = '/temp-products/product-image.png'
    if (post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url) {
      imageUrl = post.heroImage.url
    }
    return {
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      author: typeof post.author === 'object' ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Admin' : 'Admin',
      date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      readTime: '5 min read',
      category: typeof post.categories?.[0] === 'object' ? post.categories[0].title : 'Research',
      excerpt: post.meta?.description || post.excerpt || 'Explore the latest research and clinical studies on this compound.',
      imageSrc: imageUrl
    }
  })

  if (mappedBlogs.length === 0) {
    mappedBlogs = getBlogPosts(locale).slice(0, 3).map((post, i) => ({
      ...post,
      id: `dummy-${i}`,
      author: 'Admin'
    }))
  }

  productData.suggestedBlogs = mappedBlogs

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const productUrl = `${baseUrl}/product/${slug}`
  
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productData.name,
    description: productData.shortDescription,
    image: productData.images[0] ? (productData.images[0].startsWith('http') ? productData.images[0] : `${baseUrl}${productData.images[0]}`) : undefined,
    sku: productData.sku || productData.id,
    brand: {
      '@type': 'Brand',
      name: '99 Purity Peptides'
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: typeof productData.variants[0]?.price === 'string' ? productData.variants[0].price.replace('$', '') : '0',
      availability: productData.variants[0]?.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      offerCount: productData.variants.length > 0 ? productData.variants.length : 1,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'd'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
      }
    },
    aggregateRating: productData.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: productData.averageRating,
      reviewCount: productData.reviewCount
    } : {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '1'
    },
    review: (productData.reviews && productData.reviews.length > 0) ? productData.reviews : [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Verified Customer'
        }
      }
    ]
  }

  const faqSchema = productData.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productData.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : undefined

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Research Peptides',
        item: `${baseUrl}/shop`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productData.categories[0] || 'Category',
        item: `${baseUrl}/category/${(productData.categories[0] || 'category').toLowerCase().replace(/ /g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productData.name,
        item: productUrl
      }
    ]
  }

  console.log('--- FINISHED SERVER RENDER FOR PRODUCT PAGE ---')

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-1">
        <ProductClient product={productData as any} />
      </main>
    </div>
  )
}
