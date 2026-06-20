'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Menu, Search, X, User } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { useCartStore } from '@/lib/cart/store'
import { useWishlistStore } from '@/lib/wishlist/store'
import dynamic from 'next/dynamic'
import { SearchOverlay } from './SearchOverlay'
import GlassSurface from '@/components/ui/GlassSurface'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then(mod => mod.CartDrawer), { ssr: false })

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS OVER $150",
  "NEW PEPTIDE BLENDS JUST DROPPED",
  "SUBSCRIBE FOR 15% OFF YOUR FIRST ORDER"
]

export function ClientHeader({ cartItemCount = 0, wishlistItemCount = 0, isLoggedIn = false, categories: initialCategories = [], initialWishlistItems = [], initialCartItems = [] }: any) {
  const cartStore = useCartStore()
  const setCartItems = useCartStore((state) => state.setItems)
  const setWishlistItems = useWishlistStore((state) => state.setItems)
  const activeCartCount = cartStore.items.reduce((acc: any, i: any) => acc + i.quantity, 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const [announcementClosed, setAnnouncementClosed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const [categoriesData, setCategoriesData] = useState<any[]>(initialCategories)
  const [isLoadingMenu, setIsLoadingMenu] = useState(initialCategories.length === 0)

  useEffect(() => {
    if (initialCategories.length === 0) {
      import('@/app/(frontend)/actions/megaMenu').then(module => {
        module.getMegaMenuData().then(data => {
          setCategoriesData(data)
          setIsLoadingMenu(false)
        })
      })
    }
  }, [initialCategories])

  const cartHydrated = useRef(false)
  const wishlistHydrated = useRef(false)

  // Sync Cart with Backend
  useEffect(() => {
    if (isLoggedIn && !cartHydrated.current) {
      const localItems = cartStore.items
      if (initialCartItems.length > 0) {
        setCartItems(initialCartItems)
      } else if (localItems.length > 0) {
        import('@/app/(frontend)/actions/cart').then(m => m.syncCartToPayload(localItems))
      }
      cartHydrated.current = true
    }
  }, [isLoggedIn, initialCartItems])

  // Sync Wishlist with Backend
  useEffect(() => {
    if (isLoggedIn && !wishlistHydrated.current) {
      const localItems = useWishlistStore.getState().items
      if (initialWishlistItems.length > 0) {
        setWishlistItems(initialWishlistItems)
      } else if (localItems.length > 0) {
        import('@/app/(frontend)/actions/wishlist').then(m => {
          localItems.forEach(item => m.toggleWishlistInPayload(item.id, true))
        })
      }
      wishlistHydrated.current = true
    }
  }, [isLoggedIn, initialWishlistItems])

  // Global Search Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/en'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Reset announcement state on route change
    setAnnouncementClosed(false)
    document.body.classList.remove('announcement-closed')
    
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
    }, 4000)
    
    return () => clearInterval(timer)
  }, [pathname])

  const closeAnnouncement = () => {
    setAnnouncementClosed(true)
    document.body.classList.add('announcement-closed')
  }
  
  const { scrollY } = useScroll()
  const lastYRef = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsScrolled(y > 50)
    const difference = y - lastYRef.current
    if (Math.abs(difference) > 20) {
      if (difference > 0 && y > 150) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastYRef.current = y
    }
  })

  // Force dark theme text/icons since 99 Purity Peptides is dark
  const textColor = 'text-white'
  const textHoverColor = 'hover:text-primary transition-colors'
  const iconColor = '#ffffff'
  const buttonBorder = 'border-white/20 hover:bg-white/10'

  const headerContent = (
    <div className={`flex items-center justify-between transition-all duration-300 px-6 w-full text-white ${isHome && !isScrolled ? 'py-4' : 'py-2'}`}>
      {/* Left: Logo */}
      <div className="flex-1 xl:flex-none flex justify-start">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity gap-2">
          <img src="/99 Images/99pp-Logo.png" alt="99Purity Peptides" className="h-12 sm:h-16 w-auto object-contain" />
        </Link>
      </div>

      {/* Center: Nav */}
      <nav className="hidden xl:flex items-center justify-center gap-4 xl:gap-8 flex-1 h-full">
        {(() => {
          const getNavLinkClass = (path: string) => {
            const targetPath = path.replace('/en', '');
            const isActive = targetPath === '' ? pathname === '/en' || pathname === '/' : pathname.includes(targetPath);
            return `text-[11px] xl:text-[12px] font-sans tracking-[0.2em] uppercase transition-all h-full flex items-center py-2 ${
              isActive 
                ? `font-bold text-primary opacity-100` 
                : `font-medium ${textColor} opacity-70 hover:opacity-100 hover:text-primary`
            }`;
          };

          return (
            <>
              <Link href="/shop" className={getNavLinkClass('/shop')}>
                SHOP
              </Link>
              
              <div 
                className="h-full flex items-center cursor-pointer"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Link href="/shop" onClick={() => setIsMegaMenuOpen(false)} className={`flex items-center gap-1 text-[11px] xl:text-[12px] font-sans tracking-[0.2em] uppercase transition-all h-full py-2 font-medium ${textColor} opacity-70 hover:opacity-100 hover:text-primary`}>
                  CATEGORIES
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="m6 9 6 6 6-6"/></svg>
                </Link>
              </div>
              
              <Link href="/peptide-calculator" className={getNavLinkClass('/peptide-calculator')}>
                CALCULATOR
              </Link>
              <Link href="/about" className={getNavLinkClass('/about')}>
                ABOUT
              </Link>
              <Link href="/journal" className={getNavLinkClass('/journal')}>
                JOURNAL
              </Link>
              <Link href="/faq" className={getNavLinkClass('/faq')}>
                FAQ
              </Link>
              <Link href="/contact" className={getNavLinkClass('/contact')}>
                CONTACT
              </Link>
              <Link href="/affiliates" className={getNavLinkClass('/affiliates')}>
                AFFILIATES
              </Link>
            </>
          )
        })()}
      </nav>

      {/* Right: Search, SHOP NOW Button & Cart */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 xl:gap-5 flex-1 xl:flex-none text-sm relative z-20">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className={`p-1.5 transition-colors relative flex items-center justify-center ${textColor} ${textHoverColor}`}
          aria-label="Open search"
        >
          <Search size={18} strokeWidth={1.5} />
        </button>

        <button onClick={cartStore.openCart} className={`p-1.5 transition-colors relative flex items-center justify-center ${textColor} ${textHoverColor}`}>
          <ShoppingBag size={18} strokeWidth={1.5} />
          <AnimatePresence>
            {activeCartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`absolute -top-1 -right-1 text-[9px] font-bold w-[14px] h-[14px] flex items-center justify-center rounded-full bg-primary text-white`}
              >
                {activeCartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        
        <div className="flex items-center justify-center">
          {mounted ? (
            isLoggedIn ? (
              <Link href="/account" className={`p-1.5 transition-colors flex items-center justify-center ${textColor} ${textHoverColor}`}>
                <User size={18} strokeWidth={1.5} />
              </Link>
            ) : null
          ) : null}
        </div>
        
        <Link href="/shop" className={`hidden md:inline-flex border rounded-full px-8 py-3 text-[13px] font-semibold tracking-[0.2em] uppercase transition-all ${textColor} ${buttonBorder} xl:-mr-2`}>
          SHOP NOW
        </Link>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileMenuOpen(true)} className={`xl:hidden p-1 -mr-1 transition-colors ${textColor} hover:text-primary`}>
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-sticky flex flex-col pointer-events-none print:hidden">
        
        <motion.div
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: -100, opacity: 0 }
          }}
          initial="hidden"
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full flex flex-col"
        >
          {/* Announcement Bar */}
          <AnimatePresence>
            {!announcementClosed && (
              <motion.div 
                initial={{ height: 32, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#008B8B] text-white flex items-center justify-center pointer-events-auto overflow-hidden relative"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={announcementIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] font-bold tracking-[0.2em] uppercase absolute text-center w-full px-4"
                  >
                    {ANNOUNCEMENTS[announcementIndex]}
                  </motion.p>
                </AnimatePresence>
                <button 
                  onClick={closeAnnouncement}
                  className="absolute right-4 text-white/70 hover:text-white transition-colors z-10"
                  aria-label="Close announcement"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`w-[calc(100%-2rem)] md:w-[calc(100%-6rem)] mx-auto relative pointer-events-auto rounded-full transition-all duration-500 ${isHome && !isScrolled ? 'mt-4 sm:mt-5 md:mt-8 shadow-none' : 'mt-4 shadow-2xl'}`}>
            {isHome && !isScrolled ? (
              <div className="w-full transition-all duration-500 border border-transparent rounded-full">
                {headerContent}
              </div>
            ) : (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={999}
                brightness={40}
                opacity={4}
                blur={10}
                displace={6}
                distortionScale={-80}
                redOffset={2}
                greenOffset={5}
                blueOffset={10}
                className="w-full !bg-black/20 border border-white/10"
              >
                {headerContent}
              </GlassSurface>
            )}
          </div>
        </motion.div>

      </div>

      {/* Render the Mega Menu OUTSIDE the motion.div wrapper so backdrop-filter is NOT broken by the stacking context! */}
      <div 
        className="fixed inset-x-0 z-[45] transition-transform duration-300 ease-out"
        style={{ 
          top: announcementClosed ? '53px' : '85px',
          transform: hidden ? 'translateY(-100px)' : 'translateY(0)'
        }}
      >
        {/* Background Blur Overlay for Mega Menu */}
        <div 
          className={`fixed inset-0 bg-black/10 transition-opacity duration-300 ${isMegaMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onMouseEnter={() => setIsMegaMenuOpen(false)}
        />

        {/* Full-Width Mega Menu Dropdown */}
        <div 
          className={`absolute left-0 right-0 w-[calc(100%-2rem)] md:w-[calc(100%-6rem)] mx-auto rounded-3xl bg-[#0a0a0a]/95 border border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${isMegaMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
          style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          {/* Noise Texture Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />

          <div className="w-full px-8 py-10 flex gap-12 xl:gap-20 relative z-10 text-white">
              
              {/* Left: Category List */}
              <div className="w-1/4 flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">Explore</h4>
                {isLoadingMenu ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="py-4 border-b border-white/5 flex items-center justify-between">
                      <div className="h-4 w-48 bg-white/10 animate-pulse rounded-sm" />
                    </div>
                  ))
                ) : categoriesData.map((cat: any, index: number) => {
                  const isActive = activeCategory === cat.id || (activeCategory === null && index === 0);
                  return (
                    <Link 
                      key={cat.id ? `${cat.id}-${index}` : index} 
                      href={`/shop?category=${encodeURIComponent(cat.name)}#products-grid`}
                      onClick={() => setIsMegaMenuOpen(false)}
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      className={`group/link flex items-center justify-between py-3 border-b transition-colors ${isActive ? 'text-white border-white/20' : 'text-gray-500 border-white/5 hover:text-white hover:border-white/20'}`}
                    >
                      <span className="text-[14px] xl:text-[16px] font-light uppercase tracking-[0.15em]">{cat.name}</span>
                      <svg 
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                        className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-primary' : '-translate-x-4 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-50 group-hover/link:text-primary'}`}
                      >
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </Link>
                  )
                })}
              </div>

              {/* Right: Products Area */}
              <div className="w-3/4 flex flex-col relative min-h-[400px]">
                {isLoadingMenu ? (
                  <div className="flex flex-col w-full h-full">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <div className="h-6 w-64 bg-white/10 animate-pulse rounded-sm mb-3" />
                        <div className="h-3 w-32 bg-white/5 animate-pulse rounded-sm" />
                      </div>
                      <div className="h-4 w-24 bg-white/10 animate-pulse rounded-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-8 xl:gap-12 flex-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-4">
                          <div className="w-full aspect-[3/4] bg-white/10 animate-pulse rounded-sm" />
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-4 w-32 bg-white/10 animate-pulse rounded-sm" />
                            <div className="h-3 w-16 bg-white/5 animate-pulse rounded-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : categoriesData.map((cat: any, index: number) => {
                  const isActive = activeCategory === cat.id || (activeCategory === null && index === 0);
                  return (
                    <div 
                      key={cat.id ? `${cat.id}-${index}` : index} 
                      className={`absolute inset-0 transition-opacity duration-300 flex flex-col ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                    >
                      <div className="flex justify-between items-end mb-8">
                        <Link 
                          href={`/shop?category=${encodeURIComponent(cat.name)}#products-grid`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="group/collection-title block"
                        >
                          <h3 className="text-2xl font-light text-white mb-2 group-hover/collection-title:text-primary transition-colors">{cat.name} Collection</h3>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Featured Selections</p>
                        </Link>
                        <Link 
                          href={`/shop?category=${encodeURIComponent(cat.name)}#products-grid`}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="text-[10px] font-bold text-white uppercase tracking-[0.2em] border-b border-white/20 pb-1 hover:text-primary hover:border-primary transition-colors"
                        >
                          Shop All {cat.name} &rarr;
                        </Link>
                      </div>
                      
                      {cat.products && cat.products.length > 0 ? (
                        <div className="grid grid-cols-3 gap-8 xl:gap-12 flex-1">
                          {cat.products.slice(0, 3).map((prod: any, prodIndex: number) => (
                            <Link 
                              key={prod.id ? `${prod.id}-${prodIndex}` : prodIndex} 
                              href={`/products/${prod.slug}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="group/product flex flex-col cursor-pointer"
                            >
                              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative mb-5 bg-white/5 border border-white/5 transition-transform duration-700 group-hover/product:-translate-y-2 flex items-center justify-center p-4">
                                {/* Subtle glowing aura behind bottle on hover */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full bg-primary/20 opacity-0 group-hover/product:opacity-50 blur-2xl transition-opacity duration-700 z-0" />
                                
                                <div className="relative w-full h-full">
                                  <Image 
                                    src={prod.image} 
                                    alt={prod.name} 
                                    fill 
                                    className="object-contain transition-all duration-700 group-hover/product:scale-105 z-10 drop-shadow-2xl" 
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-start px-1 border-l border-transparent group-hover/product:border-primary transition-colors duration-300 pl-3">
                                <h5 className="text-[11px] xl:text-[12px] font-bold text-white uppercase tracking-[0.15em] mb-1.5 line-clamp-1 group-hover/product:text-primary transition-colors">{prod.name}</h5>
                                <div className="flex items-center gap-3">
                                  <p className="text-[10px] font-bold text-gray-400 tracking-widest">${prod.price}</p>
                                  <span className="text-[10px] text-primary opacity-0 -translate-x-2 group-hover/product:opacity-100 group-hover/product:translate-x-0 transition-all duration-300">&rarr;</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">New formulations arriving soon</span>
                          <Link 
                            href={`/shop?category=${encodeURIComponent(cat.name)}#products-grid`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors rounded-full"
                          >
                            View Catalog
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
      </div>
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        isLoggedIn={isLoggedIn}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
