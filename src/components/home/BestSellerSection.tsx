'use client'

import { ShoppingCart, Heart, Loader2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useScroll, useTransform, motion, useSpring } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useCartStore } from '@/lib/cart/store'
import { toast } from 'sonner'
import { FluidButton } from '@/components/ui/fluid-button'

const FALLBACK_PRODUCTS = [
  {
    key: "tb500",
    name: "TB-500",
    categories: [{ title: "Muscle Repair" }],
    meta: { description: "Potent synthetic peptide researched for its role in cellular migration, actin regulation, and wound healing." },
    price: "55",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "tb-500",
  },
  {
    key: "bpc157",
    name: "BPC-157",
    categories: [{ title: "Recovery & Healing" }],
    meta: { description: "A highly purified synthetic peptide widely studied for its profound effects on tissue regeneration and angiogenesis." },
    price: "45",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "bpc-157",
  },
  {
    key: "semaglutide",
    name: "Semaglutide",
    categories: [{ title: "Metabolic Research" }],
    meta: { description: "A GLP-1 receptor agonist actively researched for its mechanisms in glycemic control and metabolic regulation." },
    price: "85",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "semaglutide",
  },
  {
    key: "ghkCu",
    name: "GHK-Cu",
    categories: [{ title: "Cellular Aging" }],
    meta: { description: "A naturally occurring copper complex peptide frequently studied for its role in collagen synthesis and anti-aging." },
    price: "35",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "ghk-cu",
  }
]

function BestSellerCard({
  product,
  rotationClass,
  y,
  isFallback,
  getImageUrl,
  getCategory,
  getDescription,
  getPrice,
  t,
}: {
  product: any
  rotationClass: string
  y: any
  isFallback: boolean
  getImageUrl: (prod: any) => string
  getCategory: (prod: any) => string | undefined
  getDescription: (prod: any) => string | undefined
  getPrice: (prod: any) => string | number
  t: ReturnType<typeof useTranslations>
}) {
  const addWishlistItem = useWishlistStore(state => state.addItem)
  const removeWishlistItem = useWishlistStore(state => state.removeItem)
  const isWishlistedGlobal = useWishlistStore(state => product.id ? state.hasItem(product.id) : false)
  const { status } = useSession()
  const isSignedIn = status === 'authenticated'
  const cartStore = useCartStore()

  const [inWishlist, setInWishlist] = useState(isWishlistedGlobal)
  const [isPending, setIsPending] = useState(false)

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) {
      toast.error('Sign in required', { description: 'Please log in to add items to your wishlist.' })
      return
    }

    if (!product.id) {
      toast.error('Product ID missing', { description: 'Unable to add this product to wishlist.' })
      return
    }

    setIsPending(true)
    try {
      if (inWishlist) {
        await removeWishlistItem(product.id)
        setInWishlist(false)
        toast('Removed from wishlist', { description: `${product.name} has been removed.` })
      } else {
        await addWishlistItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: getImageUrl(product),
          priceRange: String(getPrice(product) ?? ''),
        })
        setInWishlist(true)
        toast.success('Added to wishlist', { description: `${product.name} is now in your wishlist.` })
      }
    } catch (error: any) {
      toast.error('Failed to update wishlist', { description: error.message || 'An unexpected error occurred.' })
    } finally {
      setIsPending(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const priceRaw = getPrice(product)
    const priceVal = typeof priceRaw === 'string' ? parseFloat(priceRaw.replace(/[^0-9.]/g, '')) : Number(priceRaw)

    cartStore.addItem(
      { id: product.id || product.slug, name: product.name, imageUrl: getImageUrl(product), slug: product.slug },
      'Default',
      1,
      priceVal || 0
    )
    toast.success('Added to cart', { action: { label: 'VIEW', onClick: cartStore.openCart } })
    cartStore.openCart()
  }

  return (
    <motion.div
      style={{ y }}
      className="w-full max-w-[380px] will-change-transform"
    >
      {/* CSS Transition wrapped element MUST be separate from motion.div */}
      <div className={`w-full h-full bg-white rounded-[20px] sm:rounded-[32px] p-2 sm:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-ink/5 group cursor-pointer relative origin-center transition-all duration-500 hover:rotate-0 hover:z-30 hover:shadow-2xl ${rotationClass}`}>
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-20" aria-label={product.name} />

        {/* Top Text Content & Wishlist */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-5 flex flex-col gap-1.5 sm:gap-3 relative">
          <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-30">
            <button
              disabled={isPending}
              onClick={handleWishlistClick}
              className={`transition-all duration-300 ${inWishlist ? 'text-red-500' : 'text-ink/30 hover:text-red-500 hover:scale-110'}`}
            >
              {isPending ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={inWishlist ? 'currentColor' : 'none'} />}
            </button>
          </div>
          <div className="pr-6 sm:pr-8">
            <h3 className="text-sm sm:text-2xl font-semibold text-ink tracking-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="text-primary text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 sm:mt-1">
              {getCategory(product) || t('fallbackCategory')}
            </p>
          </div>
          <p className="text-ink/60 text-[9px] sm:text-[13px] leading-tight sm:leading-relaxed line-clamp-2">
            {isFallback && product.key ? t(`products.${product.key}`) : (getDescription(product) || t('fallbackDescription'))}
          </p>
        </div>

        {/* Inner Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-[14px] sm:rounded-[24px] overflow-hidden bg-ink/5">
          <Image
            src={getImageUrl(product)}
            alt={`${product.name} Best Seller`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Price */}
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 pointer-events-none">
            <div className="flex flex-col">
              <span className="text-white/80 text-[8px] sm:text-[10px] font-bold tracking-[0.15em] uppercase mb-0.5">
                {t('fromLabel')}
              </span>
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-sm font-medium text-white/60 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-white text-base sm:text-xl lg:text-2xl font-light tracking-tighter">
                  {(() => {
                    const price = getPrice(product)
                    return typeof price === 'string' && price.includes('$') ? price.replace('From ', '') : `$${price}`
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110 z-30 hover:bg-ink hover:text-white pointer-events-auto"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-current transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function BestSellerSection({ products = [] }: { products?: any[] }) {
  const t = useTranslations('home.bestSeller')
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Smooth the scroll progress to eliminate jank
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Increased values so the parallax triggers more noticeably
  const y1 = useTransform(smoothProgress, [0, 1], [80, -80])
  const y2 = useTransform(smoothProgress, [0, 1], [-80, 80])

  // Real products from getShopProducts() use flat `image`/`category`/`shortDescription`/`priceRange`
  // fields; FALLBACK_PRODUCTS uses the older nested shape — support both.
  const getImageUrl = (prod: any) => prod.image || prod.images?.[0]?.image?.url || '/99 Images/product-image.webp';
  const getCategory = (prod: any) => prod.category || prod.categories?.[0]?.title;
  const getDescription = (prod: any) => prod.shortDescription || prod.meta?.description;
  const getPrice = (prod: any) => prod.priceRange ?? prod.price;

  // Use passed products or fallback to hardcoded ones if API is empty
  const sourceProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;
  const isFallback = products.length === 0;

  // Ensure we have exactly 8 products to fill a 2-row, 4-column grid perfectly
  const displayProducts = sourceProducts.length >= 8 
    ? sourceProducts.slice(0, 8) 
    : [...sourceProducts, ...sourceProducts, ...sourceProducts, ...sourceProducts].slice(0, 8); // fallback loop

  return (
    <section ref={sectionRef} className="bg-cream py-24 md:py-32 font-sans relative z-30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] relative z-10">
        
        {/* Centered Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{t('eyebrow')}</span>
          </div>
          <h2 className="font-heading text-5xl lg:text-7xl font-black text-ink leading-[0.9] tracking-tighter uppercase mb-6">
            {t('title')}
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed max-w-2xl mb-10">
            {t('description')}
          </p>
          <FluidButton
            href="/shop"
            text={t('ctaText')}
            variant="dark"
          />
        </div>

        {/* 4-Column Masonry/Staggered Grid with Parallax */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-items-center">
          {displayProducts.map((product, idx) => {
            // Apply y1 to even columns (0, 2) and y2 to odd columns (1, 3)
            const isEvenColumn = idx % 2 === 0;
            // Also apply a very slight rotation to alternate cards to give the "slant way" funky look
            const rotationClass = isEvenColumn ? '-rotate-1' : 'rotate-1';

            return (
              <BestSellerCard
                key={idx}
                product={product}
                rotationClass={rotationClass}
                y={isEvenColumn ? y1 : y2}
                isFallback={isFallback}
                getImageUrl={getImageUrl}
                getCategory={getCategory}
                getDescription={getDescription}
                getPrice={getPrice}
                t={t}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
