'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { ProductCard } from '@/components/shared/ProductCard'
import { Product } from '@/components/shop/PrimaryProductCard' // Re-use interface for now
import { motion, useInView } from 'framer-motion'
import { X, Filter, Search, ShieldCheck, FlaskConical, Award, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { FluidButton } from '@/components/ui/fluid-button'
import { Category } from '@/components/shop/FilterSidebar'
import { getShopProducts } from '@/app/[locale]/(frontend)/(shop)/actions'
import { useTranslations } from 'next-intl'

import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const SHOP_FAQ_KEYS = [
  'availablePeptides',
  'purityQualityTested',
  'standardPurityLevels',
  'interpretCoa',
  'customSynthesis',
  'storageInstructions',
  'reconstitution',
  'shelfLife',
  'shippingDamage',
  'aliquotAfterReconstitution',
  'bulkDiscounts',
  'orderQuantities',
  'coaBeforeOrdering',
  'findSpecificPeptides',
  'productPageInfo',
  'manufacturedInUsa',
  'researchUseOnlyMeaning',
  'specialHandling',
  'nonResearchUse',
  'fdaApproval',
];

interface ShopClientProps {
  initialProducts: Product[]
  totalPages: number
  categories: Category[]
}

function ShopClientInner({ initialProducts, totalPages, categories }: ShopClientProps) {
  const t = useTranslations('shop.shopClient')
  const shopFaqs = SHOP_FAQ_KEYS.map((key) => ({
    question: t(`faqs.${key}.question`),
    answer: t(`faqs.${key}.answer`),
  }))
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(totalPages > 1)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollYRef = React.useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsScrollingDown(prev => {
             if (!prev) return true
             return prev
          })
        } else if (currentScrollY < lastScrollYRef.current) {
          setIsScrollingDown(prev => {
             if (prev) return false
             return prev
          })
        }
        lastScrollYRef.current = currentScrollY
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef, { margin: "400px" })

  // Filter update trigger
  useEffect(() => {
    const fetchFiltered = async () => {
      const categoriesParam = searchParams.getAll('category')
      const minP = searchParams.get('minPrice')
      const maxP = searchParams.get('maxPrice')
      
      const res = await getShopProducts({
        page: 1,
        categories: categoriesParam.length > 0 ? categoriesParam : undefined,
        inStock: searchParams.get('inStock') === 'true',
        onSale: searchParams.get('onSale') === 'true',
        minPrice: minP ? parseInt(minP) : undefined,
        maxPrice: maxP ? parseInt(maxP) : undefined,
        sort: searchParams.get('sort') || undefined,
      })

      if (res.success) {
        setProducts(res.products as Product[])
        setCurrentPage(1)
        setHasMore(res.hasNextPage || false)
      }
    }
    fetchFiltered()
  }, [searchParams])

  // Infinite scroll trigger
  useEffect(() => {
    if (isInView && hasMore && !isLoadingMore) {
      setIsLoadingMore(true)
      const fetchMore = async () => {
        const nextPage = currentPage + 1
        const categoriesParam = searchParams.getAll('category')
        const minP = searchParams.get('minPrice')
        const maxP = searchParams.get('maxPrice')

        const res = await getShopProducts({
          page: nextPage,
          categories: categoriesParam.length > 0 ? categoriesParam : undefined,
          inStock: searchParams.get('inStock') === 'true',
          onSale: searchParams.get('onSale') === 'true',
          minPrice: minP ? parseInt(minP) : undefined,
          maxPrice: maxP ? parseInt(maxP) : undefined,
          sort: searchParams.get('sort') || undefined,
        })

        if (res.success && res.products) {
          setProducts(prev => [...prev, ...(res.products as Product[])])
          setCurrentPage(nextPage)
          setHasMore(res.hasNextPage || false)
        } else {
          setHasMore(false)
        }
        setIsLoadingMore(false)
      }
      fetchMore()
    }
  }, [isInView, hasMore, isLoadingMore, currentPage, searchParams])

  const getActiveChips = () => {
    const chips: { key: string, label: string, value: string }[] = []
    searchParams.getAll('category').forEach(cat => chips.push({ key: `category-${cat}`, label: cat, value: cat }))
    if (searchParams.get('inStock') === 'true') chips.push({ key: 'inStock', label: t('inStock'), value: 'true' })
    if (searchParams.get('onSale') === 'true') chips.push({ key: 'onSale', label: t('onSale'), value: 'true' })
    return chips
  }

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key.startsWith('category-')) {
      const currentCats = params.getAll('category').filter(c => c !== value)
      params.delete('category')
      currentCats.forEach(c => params.append('category', c))
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const activeChips = getActiveChips()

  return (
    <div className="w-full bg-cream min-h-screen font-sans">
      
      {/* 1. Curve Cut Hero Section */}
      <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
        {/* Main Inner Container */}
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-center items-center">
          
          {/* Border Ring Overlay */}
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3 opacity-50" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 opacity-50" />

          {/* Background Image */}
          <Image
            src="/99 Images/vial-ice-closeup.webp"
            alt="Shop Background"
            fill
            priority
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-90 rounded-[2rem] md:rounded-[4rem]"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/50 to-black/60 z-10 pointer-events-none" />

          {/* Left Center Marquee Cutout */}
          <div className="absolute bottom-[32%] sm:bottom-[30%] md:bottom-[30%] -left-px bg-cream rounded-r-[3rem] md:rounded-r-[4rem] z-30 flex items-center w-[220px] sm:w-[280px] md:w-[360px] h-12 sm:h-16 md:h-20 shadow-xl">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] left-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Bottom Fillet (Inverted Corner) */}
            <div 
              className="absolute -bottom-[calc(3rem-1px)] left-0 w-12 h-12 md:-bottom-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 100V0h100A100 100 0 0 0 0 100Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            
            {/* Inner Masking Container */}
            <div className="w-full h-full relative overflow-hidden rounded-r-[3rem] md:rounded-r-[4rem] flex items-center">
              {/* Gradient mask for smooth fade in/out of marquee */}
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
              
              <motion.div 
                className="flex whitespace-nowrap items-center text-ink font-heading font-extrabold tracking-[0.2em] text-[10px] sm:text-xs md:text-sm w-max pointer-events-none"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <span className="flex items-center mx-4 md:mx-6">
                      <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                      {t('marqueeBuyTwoGetOne')}
                    </span>
                    <span className="flex items-center mx-4 md:mx-6">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                      {t('marqueeFreeShipping')}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Main Content inside the card */}
          <div className="relative z-20 flex flex-col items-center text-center px-5 sm:px-12 md:px-16 lg:px-24 w-full h-full max-w-8xl justify-center pb-32 sm:pb-0 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] md:leading-[1.1] text-white tracking-tight uppercase font-black drop-shadow-2xl mb-4 md:mb-6 max-w-7xl w-full mx-auto">
                {t('heroTitle')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-sm sm:text-base md:text-xl max-w-2xl font-light leading-relaxed tracking-wide mb-8"
            >
              {t('heroDescription')}
            </motion.p>

          </div>

          {/* Bottom Left Product Highlights - Vertical Stepper */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-[15%] sm:bottom-8 md:bottom-12 left-4 sm:left-8 md:left-12 z-20 flex flex-col gap-2 sm:gap-5"
          >
            {[
              { icon: ShieldCheck, text: t('highlightPurityText'), subtext: t('highlightPuritySubtext') },
              { icon: FlaskConical, text: t('highlightCoaText'), subtext: t('highlightCoaSubtext') },
              { icon: Award, text: t('highlightRuoText'), subtext: t('highlightRuoSubtext') }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 relative z-10 group cursor-default">
                {/* Icon Container */}
                <div className="flex items-center justify-center w-[26px] h-[26px] sm:w-[34px] sm:h-[34px] rounded-full bg-zinc-900 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0">
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                {/* Text */}
                <div className="flex flex-col justify-center">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-heading font-bold text-white/90 uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300 leading-tight">
                    {item.text}
                  </span>
                  {/* Subtext hidden on very small screens to avoid overlap with button */}
                  <span className="text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest font-medium hidden xs:block mt-0.5">
                    {item.subtext}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom Right Button Cutout */}
          <div className="absolute -bottom-px -right-px bg-cream rounded-tl-[3rem] md:rounded-tl-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 pl-6 md:pl-10 z-30 shadow-2xl">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] right-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Left Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -left-[calc(3rem-1px)] w-12 h-12 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            <FluidButton
              href="#products-grid"
              text={<><span className="md:hidden">{t('shopShort')}</span><span className="hidden md:inline">{t('browseCatalog')}</span></>}
              className="relative z-10"
            />
          </div>

        </div>
      </div>

      <Container size="page" className="pb-12" id="products-grid">
        {/* Modern Minimal Filter Bar */}
        <div className={`flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10 py-4 sticky z-40 transition-all duration-300 ${isScrollingDown ? 'top-4 sm:top-6 opacity-100 translate-y-0' : 'top-[130px] sm:top-[140px] md:top-[150px] opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between gap-4 w-full bg-white/95 backdrop-blur-2xl rounded-full px-2 py-2 border border-ink/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-2 pl-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full px-4 sm:px-6 gap-2 text-ink hover:bg-ink/5 transition-colors font-semibold uppercase tracking-widest text-[10px] sm:text-xs">
                    <Filter size={14} />
                    {t('filters')} {activeChips.length > 0 && <span className="bg-primary text-white w-4 h-4 flex items-center justify-center rounded-full text-[9px]">{activeChips.length}</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  sideOffset={16} 
                  className="w-[95vw] sm:w-[90vw] md:max-w-[800px] p-0 rounded-[2rem] border border-ink/10 ring-0 shadow-2xl bg-white/90 overflow-hidden backdrop-blur-3xl"
                >
                  <div className="relative z-10 max-h-[75vh] p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar">
                     <FilterSidebar categories={categories} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:block w-px h-6 bg-ink/10 mx-2"></div>
              
              <span className="text-[10px] sm:text-xs text-ink/50 font-semibold uppercase tracking-widest hidden md:inline-block">
                {t('resultsCount', { count: products.length })}
              </span>
            </div>

            <Select 
              defaultValue={searchParams.get('sort') || 'newest'}
              onValueChange={(val) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('sort', val)
                router.push(`${pathname}?${params.toString()}`, { scroll: false })
              }}
            >
              <SelectTrigger className="w-auto min-w-[140px] bg-transparent border-0 focus:ring-0 shadow-none hover:bg-ink/5 rounded-full px-4 h-10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-ink gap-2 transition-all">
                <SelectValue placeholder={t('sortByPlaceholder')} />
              </SelectTrigger>
              <SelectContent align="end" className="bg-white/95 backdrop-blur-3xl border-ink/10 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-2 min-w-[180px] sm:min-w-[200px] w-[90vw] max-w-[280px] sm:w-auto sm:max-w-none">
                <SelectItem value="newest" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">{t('sortNewest')}</SelectItem>
                <SelectItem value="price-asc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">{t('sortPriceAsc')}</SelectItem>
                <SelectItem value="price-desc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">{t('sortPriceDesc')}</SelectItem>
                <SelectItem value="name-asc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">{t('sortNameAsc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Chips Row */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 px-4 w-full">
              {activeChips.map(chip => (
                <button
                  key={chip.key}
                  onClick={() => removeFilter(chip.key.startsWith('category') ? 'category' : chip.key, chip.value)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-ink/[0.03] hover:bg-ink/[0.06] border border-ink/5 rounded-full transition-all group text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                >
                  <span className="text-ink">{chip.label}</span>
                  <X size={12} className="text-ink/40 group-hover:text-ink" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Area */}
        {products.length > 0 ? (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
              {products.map((product, index) => (
                <motion.div 
                  key={product.slug} 
                  className="flex h-full w-full"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 12) * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Trigger & Loader */}
            {hasMore && (
              <div ref={loadMoreRef} className="w-full flex justify-center pt-24 pb-12">
                {isLoadingMore && (
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="w-8 h-8 text-ink" />
                    <span className="text-[10px] sm:text-xs font-bold text-ink/50 uppercase tracking-widest">{t('loadingMore')}</span>
                  </div>
                )}
              </div>
            )}
            {!hasMore && (
              <div className="w-full text-center pt-24 pb-12 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/30">
                {t('reachedEndOfCatalog')}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Search}
            title={t('noProductsFound')}
            description={t('noProductsFoundDescription')}
            action={
              <FluidButton
                onClick={() => router.push('/shop')}
                text={t('clearAllFilters')}
                variant="dark"
              />
            }
          />
        )}
      </Container>
      <div className="-mt-16">
        <SharedFaqSection
          title={t('faqTitle')}
          description={t('faqDescription')}
          faqs={shopFaqs}
        />
      </div>
    </div>
  )
}

export function ShopClient(props: ShopClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream w-full" />}>
      <ShopClientInner {...props} />
    </Suspense>
  )
}
