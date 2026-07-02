'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Heart, ChevronRight, ChevronLeft, Download, Check, ShieldCheck, FlaskConical, MapPin, Zap, ShoppingCart, Truck, Sparkles, Loader2, Award } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StockIndicator } from '@/components/ui/stock-indicator'
import { useCartStore } from '@/lib/cart/store'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useAuth } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { ImageGallery } from '@/components/shop/ImageGallery'
import { VariantSelector, Variant } from '@/components/shop/VariantSelector'
import { QuantityStepper } from '@/components/shop/QuantityStepper'
import { ProductTabs, Tab } from '@/components/shop/ProductTabs'
import { ProductAccordion } from '@/components/shop/ProductAccordion'
import { ProductDetailTabs } from '@/components/shop/ProductDetailTabs'
import { PrimaryProductCard } from '@/components/shop/PrimaryProductCard'
import { ProductCard } from '@/components/shared/ProductCard'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { FadeUp } from '@/components/motion/FadeUp'
import { FluidButton } from '@/components/ui/fluid-button'

interface ProductData {
  id: string
  name: string
  subtitle: string
  category: string
  categories?: string[]
  averageRating?: number
  reviewCount?: number

  sku?: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  badges?: string[]
  bulkBundles?: {
    id?: string
    name: string
    quantity: number
    discountPercentage?: number
    price?: number
    salePrice?: number
    image?: string
  }[]
  description: string
  shortDescription?: string
  images: string[]
  variants: Variant[]
  coaFile?: string
  tabs: Tab[]
  faqs?: any[]
  reviews: any[]
  relatedProducts: any[]
  suggestedBlogs?: any[]
}

interface ProductClientProps {
  product: ProductData
}

function SlideToCartButton({ onAdd, disabled, isAdded }: { onAdd: () => void, disabled: boolean, isAdded: boolean }) {
  const t = useTranslations('shop.productDetail')
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const handleDragEnd = (event: any, info: any) => {
    if (disabled || isAdded) return
    // threshold to trigger add to cart
    if (info.offset.x > 60) {
      onAdd()
    }
  }

  React.useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const stop = (e: Event) => e.stopPropagation()
    node.addEventListener('pointerdown', stop)
    node.addEventListener('touchstart', stop, { passive: false })
    node.addEventListener('mousedown', stop)
    return () => {
      node.removeEventListener('pointerdown', stop)
      node.removeEventListener('touchstart', stop)
      node.removeEventListener('mousedown', stop)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`relative flex-1 h-16 bg-white border border-ink/10 rounded-full flex items-center overflow-hidden z-10 transition-colors hover:border-ink/30 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="absolute inset-0 flex items-center justify-center pl-10 text-[13px] font-bold text-ink uppercase tracking-widest pointer-events-none select-none">
        {isAdded ? t('addedToCart') : <>{t('slideToAdd')} <ChevronRight size={16} className="inline ml-1 opacity-50" /></>}
      </div>
      
      <motion.button
        type="button"
        drag={disabled || isAdded ? false : "x"}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragSnapToOrigin={true}
        onDragEnd={handleDragEnd}
        whileTap={disabled || isAdded ? {} : { scale: 0.95 }}
        className={`absolute left-2 w-12 h-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-sm transition-colors duration-300 ${
          isAdded ? 'bg-green-600 text-white' : 'bg-ink text-white'
        }`}
      >
        {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
      </motion.button>
    </div>
  )
}

export function ProductClient({ product }: ProductClientProps) {
  const t = useTranslations('shop.productDetail')
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [descOpen, setDescOpen] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(true)

  React.useEffect(() => {
    // Force scroll to top on mount to fix Next.js scroll restoration issues
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [product.id])

  // Mobile Sticky Bar Logic
  const [showMobileBar, setShowMobileBar] = useState(false)
  const { scrollY } = useScroll()

  // Swipe Cursor Logic
  const [isHoveringSlider, setIsHoveringSlider] = useState(false)
  const [isSliderAtEnd, setIsSliderAtEnd] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX - 36)
    cursorY.set(e.clientY - 36)
  }



  useEffect(() => {
    // Show initially on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const pageHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const isNearBottom = window.scrollY + viewportHeight >= pageHeight - 300
      setShowMobileBar(!isNearBottom)
    }
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const pageHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      // Hide when near the footer (bottom 300px)
      const isNearBottom = latest + viewportHeight >= pageHeight - 300

      if (!isNearBottom) {
        setShowMobileBar(true)
      } else {
        setShowMobileBar(false)
      }
    }
  })

  const [relatedEmblaRef, relatedEmblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  ])

  useEffect(() => {
    if (!relatedEmblaApi) return
    
    let isDragging = false
    
    const checkEnd = () => {
      if (isDragging) {
        setIsSliderAtEnd(!relatedEmblaApi.canScrollNext())
      }
    }

    const onPointerDown = () => {
      isDragging = true
      checkEnd()
    }
    
    const onPointerUp = () => {
      isDragging = false
      setIsSliderAtEnd(false) // Instantly reset to SWIPE when they let go
    }

    relatedEmblaApi.on('pointerDown', onPointerDown)
    relatedEmblaApi.on('pointerUp', onPointerUp)
    relatedEmblaApi.on('scroll', checkEnd)
    relatedEmblaApi.on('select', checkEnd)
  }, [relatedEmblaApi])



  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
  const currentStock = selectedVariant?.inStock ? 50 : 0 // Fake stock level for testing

  const [justAdded, setJustAdded] = useState(false)
  const cartStore = useCartStore()
  
  const addItemToWishlist = useWishlistStore(state => state.addItem)
  const removeItemFromWishlist = useWishlistStore(state => state.removeItem)
  const isWishlistedGlobal = useWishlistStore(state => state.hasItem(product.id))
  const { isSignedIn } = useAuth()
  
  const [inWishlist, setInWishlist] = useState(false)
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    setInWishlist(isWishlistedGlobal)
  }, [isWishlistedGlobal])

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      toast.error(t('signInRequired'), {
        description: t('signInRequiredDescription'),
      })
      return
    }

    setIsWishlistPending(true)

    try {
      if (inWishlist) {
        await removeItemFromWishlist(product.id)
        toast(t('removedFromWishlist'), {
          id: `wishlist-${product.id}`,
          description: t('removedFromWishlistDescription', { name: product.name }),
        })
      } else {
        await addItemToWishlist({
          id: product.id,
          name: product.name,
          slug: product.id, // Or product.slug if we had it
          image: product.images[0],
          priceRange: selectedVariant?.price || ''
        })

        setShowParticles(true)
        setTimeout(() => setShowParticles(false), 1000)

        toast.success(t('addedToWishlist'), {
          id: `wishlist-${product.id}`,
          description: t('addedToWishlistDescription', { name: product.name }),
          action: {
            label: t('viewWishlist'),
            onClick: () => window.location.href = '/account/wishlist',
          },
        })
      }
    } catch (error: any) {
      toast.error(t('failedToUpdateWishlist'), {
        description: error.message || t('unexpectedError'),
      })
    } finally {
      setIsWishlistPending(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.inStock) return

    cartStore.addItem(
      { id: product.id, name: product.name, imageUrl: product.images[0] },
      selectedVariant.sku || selectedVariant.title,
      quantity,
      parseFloat((selectedVariant.salePrice || selectedVariant.price).replace(/[^0-9.]/g, '')),
      selectedVariant.title
    )

    setJustAdded(true)
    toast.success(t('addedToCart'), {
      action: { label: t('view'), onClick: cartStore.openCart }
    })

    // Auto-open drawer as per standard e-com flows, or just rely on pulse
    cartStore.openCart()

    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-cream">
      {/* 1. Hero Section */}
      <section className="w-full relative z-10 flex flex-col lg:flex-row bg-cream">

        {/* Left: Sticky Image Panel */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex items-start lg:items-center justify-center bg-cream-warm relative">
          <div className="w-full px-4 sm:px-6 lg:px-0 lg:w-[84%] pt-[130px] pb-6 sm:pt-[140px] sm:pb-10 lg:pt-[130px] lg:pb-14">
            <ImageGallery images={product.images} />
          </div>
        </div>

        {/* Right: Editorial Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 py-8 lg:px-16 xl:px-20 lg:pt-[160px] lg:pb-28 relative z-10">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-black/30 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-black/60 transition-colors">{t('home')}</Link>
            <ChevronRight size={10} className="text-black/20" />
            <Link href="/shop" className="hover:text-black/60 transition-colors">{t('shop')}</Link>
          </div>

          {/* Meta Row: Category · Badges */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/35">
              {(product.category as any)?.name || product.category || t('researchPeptide')}
            </span>
            {product.badges?.slice(0, 2).map((badge) => (
              <React.Fragment key={badge}>
                <span className="text-black/15 text-xs select-none">·</span>
                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-primary-dark/70">{badge}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Product Name */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[30px] sm:text-[40px] lg:text-[52px] xl:text-[60px] leading-[0.92] font-black text-black mb-5 tracking-tighter uppercase break-words"
          >
            {product.name}
          </motion.h1>

          {/* Price */}
          <motion.div
            key={`price-${selectedVariantId}`}
            initial={{ opacity: 0.6, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-baseline gap-3 mb-8"
          >
            <span className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold text-black leading-none tracking-tight">
              {selectedVariant?.salePrice || selectedVariant?.price}
            </span>
            {selectedVariant?.salePrice && (
              <>
                <span className="text-base text-black/25 line-through font-medium">{selectedVariant.price}</span>
                <span className="inline-flex items-center text-[9px] font-black tracking-[0.12em] uppercase bg-black text-white px-2.5 py-1.5 rounded-full">
                  {t('savePercent', { percent: Math.round(((parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) - parseFloat(selectedVariant.salePrice.replace(/[^0-9.]/g, ''))) / parseFloat(selectedVariant.price.replace(/[^0-9.]/g, ''))) * 100) })}
                </span>
              </>
            )}
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-black/[0.06] mb-8" />

          {/* Short Description */}
          <p className="text-black/50 leading-[1.75] text-[14px] lg:text-[15px] max-w-[400px] mb-8">
            {product.shortDescription || product.description?.substring(0, 200) + '...'}
          </p>

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[9px] font-black text-black/35 uppercase tracking-[0.22em]">{t('selectSize')}</span>
                <span className="text-[10px] text-black/30 font-medium">{selectedVariant?.title}</span>
              </div>
              <VariantSelector
                variants={product.variants}
                value={selectedVariantId}
                onChange={setSelectedVariantId}
              />
            </div>
          )}

          {/* Stock */}
          <div className="mb-7">
            <StockIndicator stock={currentStock} />
          </div>

          {/* CTA Area */}
          <div className="flex flex-col gap-2.5 mb-7">
            {/* Row: Quantity + Add to Cart + Wishlist */}
            <div className="flex items-stretch gap-2 sm:gap-2.5">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                className="h-14 w-[90px] sm:w-[120px] shrink-0 rounded-2xl border border-black/10 bg-white text-black hover:border-black/20 transition-colors flex"
              />
              <button
                className={`flex-1 h-14 rounded-2xl text-[9.5px] sm:text-[11px] font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 ${
                  !selectedVariant?.inStock
                    ? 'bg-black/[0.07] text-black/25 cursor-not-allowed'
                    : justAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-black text-white hover:bg-black/80'
                }`}
                onClick={handleAddToCart}
                disabled={!selectedVariant?.inStock}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} /> {t('added')}
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                      {selectedVariant?.inStock ? t('addToCart') : t('outOfStock')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={handleWishlistClick}
                disabled={isWishlistPending}
                className={`h-14 w-12 sm:w-14 flex items-center justify-center shrink-0 rounded-2xl border transition-colors duration-200 ${
                  inWishlist
                    ? 'border-black/20 bg-black/[0.05]'
                    : 'border-black/10 bg-white hover:border-black/20'
                }`}
              >
                {isWishlistPending
                  ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-black/35" />
                  : <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? "fill-black text-black" : "text-black/40"}`} strokeWidth={inWishlist ? 2 : 1.5} />
                }
              </button>
            </div>

            {/* Buy Now */}
            <button
              className="w-full h-14 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase text-black border border-black/10 bg-white hover:bg-black hover:text-white hover:border-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => {
                handleAddToCart()
                setTimeout(() => window.location.href = '/checkout', 300)
              }}
              disabled={!selectedVariant?.inStock}
            >
              {t('buyNow')}
            </button>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-between gap-y-4 py-5 border-t border-b border-black/[0.06] mb-8">
            <div className="flex items-center gap-2 shrink-0 w-[45%] lg:w-auto lg:pr-5">
              <Truck size={12} className="text-black/30 shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-bold text-black/40 uppercase tracking-[0.18em]">{t('trustFastShipping')}</span>
            </div>
            <div className="hidden lg:block h-3 w-px bg-black/10 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 w-[45%] lg:w-auto lg:px-5">
              <FlaskConical size={12} className="text-black/30 shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-bold text-black/40 uppercase tracking-[0.18em]">{t('trustPurity')}</span>
            </div>
            <div className="hidden lg:block h-3 w-px bg-black/10 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 w-[45%] lg:w-auto lg:px-5">
              <ShieldCheck size={12} className="text-black/30 shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-bold text-black/40 uppercase tracking-[0.18em]">{t('trustThirdPartyTested')}</span>
            </div>
            <div className="hidden lg:block h-3 w-px bg-black/10 shrink-0" />
            <div className="flex items-center gap-2 shrink-0 w-[45%] lg:w-auto lg:pl-5">
              <Award size={12} className="text-black/30 shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-bold text-black/40 uppercase tracking-[0.18em]">{t('trustGuaranteed')}</span>
            </div>
          </div>

          {/* COA Download (mobile / no left panel) */}
          {product.coaFile && (
            <a
              href={product.coaFile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[9px] font-bold text-black/30 uppercase tracking-[0.18em] hover:text-black/55 transition-colors mb-8 lg:hidden"
            >
              <Download size={11} />
              {t('certificateOfAnalysis')}
            </a>
          )}

          {/* Bulk Bundles */}
          {product.bulkBundles && product.bulkBundles.length > 0 && (
            <div className="pt-8 border-t border-black/[0.06]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[9px] font-black text-black/35 uppercase tracking-[0.22em]">{t('bulkPricing')}</span>
                <span className="text-[9px] text-black/25 font-medium tracking-wide">{t('buyMoreSaveMore')}</span>
              </div>
              <div className="flex flex-col gap-2">
                {product.bulkBundles.map((bundle, idx) => {
                  let priceNum = 0;
                  let salePriceNum = 0;
                  let discount = 0;
                  let bundleVariantSku = bundle.name;
                  let bundleVariantTitle = bundle.name;

                  const currentVariantSku = selectedVariant?.sku || selectedVariant?.title || t('variant');
                  const currentVariantTitle = selectedVariant?.title || t('variant');

                  const override = (bundle as any).variantOverrides?.find((vo: any) => vo.variantSku === currentVariantSku || vo.variantSku === selectedVariant?.sku || vo.variantSku === selectedVariant?.title);

                  if (override) {
                    priceNum = override.price;
                    salePriceNum = override.salePrice || 0;
                    discount = salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0;
                    bundleVariantSku = `${currentVariantSku} - ${bundle.name}`;
                    bundleVariantTitle = `${currentVariantTitle} - ${bundle.name}`;
                  } else if (typeof bundle.discountPercentage === 'number' && bundle.discountPercentage > 0) {
                    const basePrice = parseFloat(String(selectedVariant?.salePrice || selectedVariant?.price || 0).replace(/[^0-9.]/g, ''))
                    priceNum = basePrice * bundle.quantity
                    salePriceNum = priceNum * (1 - (bundle.discountPercentage / 100))
                    discount = bundle.discountPercentage
                    bundleVariantSku = `${currentVariantSku} - ${bundle.name}`
                    bundleVariantTitle = `${currentVariantTitle} - ${bundle.name}`;
                  } else {
                    priceNum = typeof bundle.price === 'number' ? bundle.price : parseFloat(String(bundle.price || 0).replace(/[^0-9.]/g, ''))
                    salePriceNum = bundle.salePrice ? (typeof bundle.salePrice === 'number' ? bundle.salePrice : parseFloat(String(bundle.salePrice).replace(/[^0-9.]/g, ''))) : 0
                    discount = salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0
                  }

                  return (
                    <button
                      key={bundle.id || idx}
                      onClick={() => {
                        cartStore.addItem({ id: product.id, name: product.name, imageUrl: product.images[0] }, bundleVariantSku, 1, salePriceNum || priceNum, bundleVariantTitle)
                        setJustAdded(true)
                        toast.success(t('addedBundleToCart'), { action: { label: t('view'), onClick: cartStore.openCart } })
                        setTimeout(() => setJustAdded(false), 1500)
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-black/[0.06] hover:border-black/[0.12] hover:shadow-sm transition-all duration-200 text-left"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-black text-[13px] uppercase tracking-wider">{bundle.name}</span>
                        {discount > 0 && (
                          <span className="text-[9px] font-bold text-black/35 uppercase tracking-[0.15em]">{t('savePercent', { percent: discount })}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-bold text-black text-[17px] tracking-tight">${(salePriceNum || priceNum).toFixed(2)}</span>
                        {salePriceNum > 0 && priceNum > 0 && salePriceNum !== priceNum && (
                          <span className="text-[10px] text-black/20 line-through">${priceNum.toFixed(2)}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 2. Dark Credentials Section */}
      <section className="w-full relative overflow-hidden bg-ink">
        {/* Ghost watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-heading font-black text-white/[0.025] select-none pointer-events-none leading-none tracking-tighter text-[180px] sm:text-[260px] lg:text-[380px] pr-4">
          99.9
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28 relative z-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 lg:mb-20">
            <div>
              <span className="text-white/25 text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase mb-4 block">{t('compoundProfile')}</span>
              <h2 className="font-heading text-[28px] sm:text-[36px] lg:text-[48px] font-black text-white leading-[0.9] tracking-tighter uppercase break-words">
                {t('theScienceLine1')}<br />{t('theScienceLine2')}
              </h2>
            </div>
            {product.coaFile && (
              <a
                href={product.coaFile}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto inline-flex items-center gap-2.5 border border-white/[0.12] text-white/40 hover:text-white hover:border-white/30 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-all"
              >
                <Download size={11} />
                {t('downloadCertificate')}
              </a>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { value: '≥99%',    label: t('statVerifiedPurityLabel'),  desc: t('statVerifiedPurityDesc')          },
              { value: t('statLabTestedValue'), label: t('statLabTestedLabel'),       desc: t('statLabTestedDesc')    },
              { value: t('statGradeQualityValue'),  label: t('statGradeQualityLabel'),    desc: t('statGradeQualityDesc')        },
              { value: 'COA',       label: t('statDocumentedLabel'),       desc: t('statDocumentedDesc')       },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                className="border border-white/[0.07] rounded-2xl p-4 sm:p-5 lg:p-7 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="font-heading text-[20px] sm:text-[24px] lg:text-[32px] font-black text-white leading-none tracking-tighter mb-3 break-words">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-white/55 uppercase tracking-[0.18em] mb-1.5">{stat.label}</div>
                <div className="text-[11px] text-white/25 leading-relaxed">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Details Tab Section */}
      <section className="w-full relative z-10 py-20 lg:py-32 bg-cream">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailTabs tabs={product.tabs} />
        </div>
      </section>

      {/* 5. Related Editorial Carousel */}
      <section className="w-full py-24 bg-cream overflow-hidden relative">
        <Container size="wide" className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-primary text-[9px] sm:text-label-sm uppercase tracking-[0.2em] font-bold mb-3 sm:mb-4 block">{t('continueExploring')}</span>
              <h2 className="font-heading text-[28px] sm:text-[36px] lg:text-[48px] leading-none font-black tracking-tighter text-ink uppercase break-words">
                {t('alsoConsidered')}
              </h2>
            </div>

            {/* Carousel Navigation */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => relatedEmblaApi?.scrollPrev()}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30 flex items-center justify-center text-ink hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm bg-white"
                aria-label={t('previousProducts')}
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => relatedEmblaApi?.scrollNext()}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/30 flex items-center justify-center text-ink hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm bg-white"
                aria-label={t('nextProducts')}
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div 
            className="relative -mx-4 px-4 sm:mx-0 sm:px-0 md:cursor-none md:[&_*]:!cursor-none"
            onMouseEnter={() => setIsHoveringSlider(true)}
            onMouseLeave={() => setIsHoveringSlider(false)}
            onMouseMove={handleSliderMouseMove}
          >
            <div className="overflow-hidden -m-6 p-6" ref={relatedEmblaRef}>
              <div className="flex gap-6 lg:gap-8 pb-6">
                {product.relatedProducts.map((p) => (
                  <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_45%] lg:flex-[0_0_calc(25%-1.5rem)] min-w-0">
                    <ProductCard product={p as any} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2.5 FAQs Section (Moved to Bottom) */}
      {product.faqs && product.faqs.length > 0 && (
        <SharedFaqSection
          title={t('frequentlyAsked')}
          faqs={product.faqs}
        />
      )}

      {/* 3. Suggested Blogs Section */}
      {product.suggestedBlogs && product.suggestedBlogs.length > 0 && (
        <section className="w-full py-24 bg-cream border-t border-gray-100">
          <Container size="wide">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-primary text-label-sm uppercase tracking-[0.2em] font-bold mb-4 block">{t('educationAndResearch')}</span>
                <h2 className="font-heading text-[44px] sm:text-[56px] lg:text-[64px] leading-none font-black tracking-tighter text-ink uppercase">
                  {t('furtherReading')}
                </h2>
              </div>
              <Button variant="outline" className="rounded-full font-bold border-ink/20 hover:bg-ink hover:text-white transition-all shadow-sm w-fit shrink-0">
                {t('viewAllResearch')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {product.suggestedBlogs.map((post) => (
                <BlogPostCard key={post.id} {...(post as any)} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mobile Fixed Action Bar */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200 flex items-center gap-3 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.05)] pb-safe"
          >
            <motion.button 
              whileHover={isWishlistPending ? {} : { scale: 1.05 }}
              whileTap={isWishlistPending ? {} : { scale: 0.9 }}
              className={`relative w-11 h-11 p-0 flex-shrink-0 rounded-full font-bold border transition-colors duration-300 flex items-center justify-center group outline-none disabled:opacity-70 ${
                inWishlist ? 'border-red-500 bg-red-50 text-red-500 shadow-sm' : 'border-ink/10 bg-white text-ink/60 hover:text-ink hover:bg-gray-50'
              }`}
              aria-label={t('toggleWishlist')}
              onClick={handleWishlistClick}
              disabled={isWishlistPending}
            >
              <AnimatePresence>
                {showParticles && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45 * Math.PI) / 180;
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
                          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                          animate={{
                            x: Math.cos(angle) * 35,
                            y: Math.sin(angle) * 35,
                            scale: [0, 1.5, 0],
                            opacity: [1, 1, 0]
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )
                    })}
                  </div>
                )}
              </AnimatePresence>
              <motion.div
                animate={inWishlist && !isWishlistPending ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {isWishlistPending ? (
                  <Loader2 size={18} className={`animate-spin ${inWishlist ? 'text-red-500' : 'text-ink/60'}`} />
                ) : (
                  <Heart size={18} className={`transition-colors duration-300 ${inWishlist ? 'fill-current' : ''}`} strokeWidth={inWishlist ? 2.5 : 2} />
                )}
              </motion.div>
            </motion.button>

            <Button 
              variant="outline" 
              className="w-11 h-11 p-0 flex-shrink-0 rounded-full font-bold text-ink border border-ink bg-white hover:bg-ink hover:text-white transition-all duration-300 flex items-center justify-center group"
              aria-label={t('addToCart')}
              onClick={handleAddToCart}
              disabled={!selectedVariant?.inStock || justAdded}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={18} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingCart size={18} strokeWidth={1.5} className="group-hover:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            <Button 
              variant="dark" 
              className="flex-1 h-11 rounded-full font-bold text-white bg-gradient-to-r from-ink to-gray-800 hover:from-black hover:to-ink transition-all duration-300 text-[11px] uppercase tracking-widest border-none shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
              onClick={() => {
                handleAddToCart()
                setTimeout(() => window.location.href = '/checkout', 300)
              }}
              disabled={!selectedVariant?.inStock}
            >
              {t('buyNow')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Swipe Cursor */}
      <AnimatePresence>
        {isHoveringSlider && (
          <motion.div
            initial={{ scale: 0, opacity: 0, padding: '0px' }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              padding: isSliderAtEnd ? '0 24px' : '0px'
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 h-[72px] bg-white/90 backdrop-blur-md text-ink rounded-full flex items-center justify-center pointer-events-none z-[100] text-[10px] font-bold tracking-[0.2em] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-ink/10 hidden md:flex overflow-hidden"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              minWidth: '72px',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isSliderAtEnd ? 'end' : 'swipe'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="whitespace-nowrap"
              >
                {isSliderAtEnd ? t('sliderEnd') : t('swipe')}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
