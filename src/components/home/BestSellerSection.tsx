'use client'

import { ShoppingCart, Heart, Loader2, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
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

// Move helpers outside to maintain stable references for React.memo
const getImageUrl = (prod: any) => prod.image || prod.images?.[0]?.image?.url || '/99 Images/product-image.webp';
const getCategory = (prod: any) => prod.category || prod.categories?.[0]?.title;
const getDescription = (prod: any) => prod.shortDescription || prod.meta?.description;
const getPrice = (prod: any) => prod.priceRange ?? prod.price;

const BestSellerCard = React.memo(function BestSellerCard({
  product,
  isFallback,
  isActive,
  t,
}: {
  product: any
  isFallback: boolean
  isActive: boolean
  t: ReturnType<typeof useTranslations>
}) {
  const addWishlistItem = useWishlistStore(state => state.addItem)
  const removeWishlistItem = useWishlistStore(state => state.removeItem)
  const isWishlistedGlobal = useWishlistStore(state => product.id ? state.hasItem(product.id) : false)
  const { status } = useSession()
  const isSignedIn = status === 'authenticated'
  const cartStore = useCartStore()
  const router = useRouter()

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

    if (product.hasVariants) {
      router.push(`/product/${product.slug}`)
      return
    }

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
    <div 
      className={`w-[280px] sm:w-[320px] lg:w-[380px] shrink-0 will-change-transform transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] origin-left ${isActive ? 'scale-100 opacity-100' : 'scale-[0.85] opacity-90'}`}
      style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
    >
      <div className="w-full h-full bg-white rounded-[20px] sm:rounded-[32px] p-2 sm:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-ink/5 group cursor-pointer relative origin-center transition-all duration-500 hover:z-30 hover:shadow-2xl">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20" aria-label={product.name} />

        {/* Top Text Content & Wishlist */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-5 flex flex-col gap-1.5 sm:gap-3 relative">
          <div className="absolute top-1 sm:top-3 right-1 sm:right-3 z-30">
            <button
              disabled={isPending}
              onClick={handleWishlistClick}
              aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              className={`transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-full ${inWishlist ? 'text-red-500' : 'text-ink/30 hover:text-red-500 hover:scale-110'}`}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />}
            </button>
          </div>
          <div className="pr-10 sm:pr-12">
            <h3 className="text-sm sm:text-2xl font-semibold text-ink tracking-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="text-primary text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 sm:mt-1">
              {getCategory(product) || t('fallbackCategory')}
            </p>
          </div>
          <p className="text-ink/60 text-[9px] sm:text-[13px] leading-tight sm:leading-relaxed line-clamp-2 min-h-[2em] sm:min-h-[3em]">
            {isFallback && product.key ? t(`products.${product.key}`) : (getDescription(product) || t('fallbackDescription'))}
          </p>
        </div>

        {/* Inner Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-[14px] sm:rounded-[24px] overflow-hidden bg-ink/5">
          <Image
            src={getImageUrl(product)}
            alt=""
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
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
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110 z-30 hover:bg-ink hover:text-white pointer-events-auto"
          >
            <ShoppingCart className="w-5 h-5 text-current transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
})

export function BestSellerSection({ products = [] }: { products?: any[] }) {
  const t = useTranslations('home.bestSeller')
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDistance, setSlideDistance] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  
  // Touch swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50
  
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sourceProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;
  const isFallback = products.length === 0;

  // 12 items for a solid infinite-feeling loop
  const displayProducts = sourceProducts.length >= 12 
    ? sourceProducts.slice(0, 12) 
    : [...sourceProducts, ...sourceProducts, ...sourceProducts, ...sourceProducts].slice(0, 12);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  useEffect(() => {
    const updateMetrics = () => {
      if (trackRef.current && containerRef.current && trackRef.current.children.length > 1) {
        const first = trackRef.current.children[0] as HTMLElement
        const second = trackRef.current.children[1] as HTMLElement
        const distance = second.offsetLeft - first.offsetLeft
        setSlideDistance(distance)
        
        const visibleWidth = containerRef.current.offsetWidth
        const visibleCards = Math.floor(visibleWidth / distance)
        
        const calculatedMax = Math.max(0, displayProducts.length - visibleCards)
        setMaxIndex(calculatedMax)
        
        setCurrentIndex(prev => Math.min(prev, calculatedMax))
      }
    }
    
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    return () => window.removeEventListener('resize', updateMetrics)
  }, [displayProducts.length])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0
      return prev + 1
    })
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex
      return prev - 1
    })
  }, [maxIndex])

  // 3-second auto-slider interval
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="bg-[#fcfbf9] py-24 md:py-32 font-sans relative z-30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Content & Navigation */}
        <div className="w-full lg:w-[35%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary-dark text-xs font-bold tracking-[0.2em] uppercase">{t('eyebrow')}</span>
          </div>
          
          <h2 className="font-heading text-5xl lg:text-7xl font-black text-ink leading-[0.9] tracking-tighter uppercase mb-6 flex flex-col">
            {t('title')}
          </h2>
          
          <p className="text-ink/70 text-base md:text-lg font-medium leading-relaxed mb-8 lg:mb-12 max-w-md">
            {t('description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <FluidButton
              href="/shop"
              text={t('ctaText')}
              variant="dark"
            />
          </div>
        </div>

        {/* Right Side: Auto-Slider Track & Navigation */}
        <div 
          className="w-full lg:w-[65%] relative z-20 mt-8 lg:mt-0 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={containerRef} className="w-full relative">
            {/* 
              Clipping Wrapper:
              - overflow-hidden prevents cards from bleeding left over the text.
              - marginRight: '-50vw' pushes the right clipping bound off-screen.
              - px-4 sm:px-8 -mx-4 sm:-mx-8 prevent clipping shadows while adapting to mobile edge.
            */}
            <div className="overflow-hidden px-4 sm:px-8 -mx-4 sm:-mx-8 py-12 -my-12" style={{ marginRight: '-50vw' }}>
              {/* Hardware accelerated transform track for buttery smoothness */}
              <div 
                ref={trackRef}
                className="flex gap-4 sm:gap-6 lg:gap-10 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform items-center"
                style={{ 
                  transform: `translate3d(-${currentIndex * slideDistance}px, 0, 0)` 
                }}
              >
                {displayProducts.map((product, idx) => (
                  <BestSellerCard
                    key={`${product.slug}-${idx}`}
                    product={product}
                    isFallback={isFallback}
                    isActive={idx === currentIndex}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Nav Arrows */}
          <div className="flex justify-center sm:justify-end gap-4 mt-8 lg:mt-12 lg:pr-10">
            <button 
              onClick={prevSlide} 
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-ink shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300"
              aria-label="Previous Slide"
            >
              <Play className="w-5 h-5 rotate-180 -ml-1" />
            </button>
            <button 
              onClick={nextSlide} 
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-ink shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300"
              aria-label="Next Slide"
            >
              <Play className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
