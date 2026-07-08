'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingCart, ShieldCheck, FlaskConical, Award, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { FluidButton } from '@/components/ui/fluid-button'

const HERO_PRODUCTS = [
  { key: "retatrutide", name: "Retatrutide", slug: "retatrutide", dose: "10mg", price: "$140.00", image: "/99 Images/transparant-vial.png" },
  { key: "tirzepatide", name: "Tirzepatide", slug: "tirzepatide", dose: "30mg", price: "$160.00", image: "/99 Images/transparant-vial.png" },
  { key: "semaglutide", name: "Semaglutide", slug: "semaglutide", dose: "5mg", price: "$65.00", image: "/99 Images/transparant-vial.png" },
  { key: "bpc157", name: "BPC-157", slug: "bpc-157", dose: "5mg", price: "$45.00", image: "/99 Images/transparant-vial.png" }
]

export function Hero() {
  const t = useTranslations('home.hero')
  const router = useRouter()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCardClosed, setIsCardClosed] = useState(false)
  const didDragRef = React.useRef(false)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Ensure defaultMuted is set for Safari/iOS autoplay policies
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    // Track the in-flight play() promise so we never call pause() while it's
    // still settling — doing so throws an unhandled AbortError in some browsers.
    let playPromise: Promise<void> | undefined

    const safePlay = () => {
      const p = video.play();
      if (p !== undefined) {
        playPromise = p.catch(() => {});
      }
    }

    const safePause = () => {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.pause();
        }).catch(() => {});
      } else {
        video.pause();
      }
    }

    // Attempt initial play on mount
    safePlay()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            safePlay()
          } else {
            safePause()
          }
        })
      },
      { threshold: 0.1 } // Trigger when at least 10% of the video is visible
    )

    observer.observe(video)

    const sliderTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_PRODUCTS.length)
    }, 4000)

    return () => {
      observer.disconnect()
      clearInterval(sliderTimer)
    }
  }, [])

  return (
    <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
      {/* Main Inner Container */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
        
        {/* Border Ring Overlay (Rendered UNDER the cutouts but OVER gradients) */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[64px] -translate-y-1/2 translate-x-1/3 opacity-50 transform-gpu" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[64px] translate-y-1/3 -translate-x-1/3 opacity-50 transform-gpu" />

        {/* Background Video */}
        <video
          suppressHydrationWarning
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-[5] pointer-events-none opacity-80 rounded-[2rem] md:rounded-[4rem]"
        >
          <source src="/videos/homepage-hero-video.mp4" type="video/mp4" />
          <source src="/videos/homepage-hero-video.webm" type="video/webm" />
        </video>

        {/* Dark Gradient Overlay inside card */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* Cutouts & UI Overlay (Inverted corners) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
          {/* Bottom Left Cutout */}
          <div className="absolute -bottom-px left-0 bg-cream rounded-tr-[3rem] md:rounded-tr-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 pr-6 md:pr-10">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] left-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Right Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -right-[calc(3rem-1px)] w-12 h-12 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            <FluidButton
              href="/shop"
              text={<><span className="md:hidden">{t('viewPeptidesShort')}</span><span className="hidden md:inline">{t('viewPeptidesLong')}</span></>}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Main Content inside the card */}
        <div className={`relative z-20 flex flex-col items-start ${isCardClosed ? 'justify-center pt-0' : 'justify-start pt-[160px]'} sm:justify-center text-left px-5 sm:px-12 md:px-24 w-full h-full max-w-6xl pb-32 sm:pt-20 md:pb-24 md:pt-10 lg:pb-32 transition-all duration-700 ease-in-out`}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-heading text-[9vw] sm:text-4xl md:text-[60px] lg:text-[70px] xl:text-[80px] leading-[1.1] md:leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl max-w-4xl mb-1 md:mb-2">
              {t('titleLine1')}<br/>
              {t('titleLine2')}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 md:mt-4 text-white/60 text-sm sm:text-base md:text-xl max-w-[280px] sm:max-w-xl font-light leading-relaxed tracking-wide"
          >
            {t.rich('subtitle', { white: (chunks) => <span className="text-white">{chunks}</span> })}
          </motion.p>
        </div>

        {/* --- Right Side Marquee Cutout --- */}
        <div className="absolute top-[90px] sm:top-[25%] md:top-[28%] right-0 bg-cream rounded-l-[3rem] md:rounded-l-[4rem] z-30 flex items-center w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] h-12 sm:h-16 md:h-20">
          {/* Top Fillet (Inverted Corner) */}
          <div 
            className="absolute -top-[calc(3rem-1px)] right-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
          />
          {/* Bottom Fillet (Inverted Corner) */}
          <div 
            className="absolute -bottom-[calc(3rem-1px)] right-0 w-12 h-12 md:-bottom-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0h100v100A100 100 0 0 0 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
          />
          
          {/* Inner masking container */}
          <div className="w-full h-full relative overflow-hidden rounded-l-[3rem] md:rounded-l-[4rem] flex items-center">
            {/* Gradient mask for smooth fade in/out of marquee */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              className="flex whitespace-nowrap items-center text-zinc-900 font-heading font-extrabold tracking-[0.25em] text-[10px] sm:text-xs md:text-sm w-max pointer-events-none"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
              style={{ willChange: "transform" }}
            >
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="flex items-center">
                   <span className="flex items-center mx-4 md:mx-6">
                     <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     {t('marqueePurity')}
                   </span>
                   <span className="flex items-center mx-4 md:mx-6">
                     <FlaskConical className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     {t('marqueeLabTested')}
                   </span>
                   <span className="flex items-center mx-4 md:mx-6">
                     <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     {t('marqueeUsaMade')}
                   </span>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

        {/* --- Glass Product Slider (Bottom Right) --- */}
        <div className={`absolute ${isCardClosed ? 'hidden sm:flex' : 'flex'} bottom-6 right-4 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-30 pointer-events-none origin-bottom-right scale-[0.60] sm:scale-[0.70] lg:scale-[0.80] xl:scale-100 sm:[@media(max-height:850px)]:!scale-[0.80] sm:[@media(max-height:750px)]:!scale-[0.70] transition-transform duration-300`}>
          
          <div className="relative w-[320px] h-[440px] pointer-events-auto">
            
            {/* Custom SVG Shadow (Perfectly traces the cutout, without translation to avoid leaking into the cutout) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 320 440">
              <path 
                d="M 0 24 A 24 24 0 0 1 24 0 L 296 0 A 24 24 0 0 1 320 24 L 320 346 A 24 24 0 0 1 296 370 L 274 370 A 24 24 0 0 0 250 394 L 250 416 A 24 24 0 0 1 226 440 L 24 440 A 24 24 0 0 1 0 416 L 0 24 Z" 
                fill="rgba(0,0,0,0.4)" 
                style={{ filter: 'blur(16px)' }}
              />
            </svg>

            {/* The Glass Card (Masked perfectly with CSS mask on the SAME element to avoid WebKit bounding box bugs) */}
            <div 
              className="absolute inset-0 bg-white/[0.05] backdrop-blur-md z-10 pointer-events-none transform-gpu"
              style={{
                maskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22440%22%20viewBox%3D%220%200%20320%20440%22%3E%3Cpath%20d%3D%22M%200%2024%20A%2024%2024%200%200%201%2024%200%20L%20296%200%20A%2024%2024%200%200%201%20320%2024%20L%20320%20346%20A%2024%2024%200%200%201%20296%20370%20L%20274%20370%20A%2024%2024%200%200%200%20250%20394%20L%20250%20416%20A%2024%2024%200%200%201%20226%20440%20L%2024%20440%20A%2024%2024%200%200%201%200%20416%20L%200%2024%20Z%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E")`,
                WebkitMaskImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22440%22%20viewBox%3D%220%200%20320%20440%22%3E%3Cpath%20d%3D%22M%200%2024%20A%2024%2024%200%200%201%2024%200%20L%20296%200%20A%2024%2024%200%200%201%20320%2024%20L%20320%20346%20A%2024%2024%200%200%201%20296%20370%20L%20274%20370%20A%2024%2024%200%200%200%20250%20394%20L%20250%20416%20A%2024%2024%200%200%201%20226%20440%20L%2024%20440%20A%2024%2024%200%200%201%200%20416%20L%200%2024%20Z%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E")`,
                maskSize: '100% 100%',
                WebkitMaskSize: '100% 100%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat'
              }}
            >
              {/* Glass glare effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none z-0" />

            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsCardClosed(true)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center sm:hidden backdrop-blur-md pointer-events-auto transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

              {/* Header */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 pointer-events-none">
                <span className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">{t('featured')}</span>
                <div className="flex gap-1.5">
                  {HERO_PRODUCTS.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`} />
                  ))}
                </div>
              </div>

              {/* Slider Content */}
              <div className="relative w-full h-[calc(100%-80px)] mt-12 overflow-hidden pointer-events-auto">
                <AnimatePresence>
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{
                      x: { type: "spring", stiffness: 120, damping: 26 },
                      opacity: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 flex flex-col items-start justify-center pb-8 cursor-pointer active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    whileTap={{ cursor: "grabbing" }}
                    onTap={() => {
                      if (didDragRef.current) {
                        didDragRef.current = false
                        return
                      }
                      router.push(`/product/${HERO_PRODUCTS[currentSlide].slug}`)
                    }}
                    onDragStart={() => {
                      didDragRef.current = true
                    }}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipePower = offset.x + velocity.x * 0.2;
                      if (swipePower < -40) {
                        setCurrentSlide((prev) => (prev + 1) % HERO_PRODUCTS.length)
                      } else if (swipePower > 40) {
                        setCurrentSlide((prev) => (prev - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length)
                      }
                    }}
                  >
                    <div className="relative w-full h-[180px] mb-6 drop-shadow-2xl flex items-center justify-center pointer-events-none shrink-0">
                      {/* Subtle Glow Behind Vial */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-primary/20 blur-[40px] rounded-full pointer-events-none" />
                      <Image 
                        src={HERO_PRODUCTS[currentSlide].image}
                        alt={HERO_PRODUCTS[currentSlide].name}
                        fill
                        className="object-contain relative z-10 px-4"
                      />
                    </div>
                    <div className="w-full text-left flex flex-col items-start shrink-0 relative z-20 px-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-white font-heading tracking-tight drop-shadow-md">{HERO_PRODUCTS[currentSlide].name}</h3>
                        <span className="text-white/80 px-2 py-0.5 text-[10px] font-medium bg-white/10 rounded-full border border-white/5 shadow-sm">{HERO_PRODUCTS[currentSlide].dose}</span>
                      </div>
                      <p className="hidden sm:block text-white/60 text-xs font-light leading-relaxed line-clamp-2">
                        {t(`products.${HERO_PRODUCTS[currentSlide].key}`)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Price Footer */}
              <div className="absolute bottom-0 left-0 w-full h-[80px] flex justify-between items-end z-20 pointer-events-none">
                <div className="pl-6 pb-6 flex flex-col pointer-events-auto">
                  <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{t('total')}</span>
                  <div className="relative h-8 overflow-hidden w-36">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 text-white text-2xl font-bold font-heading"
                      >
                        {HERO_PRODUCTS[currentSlide].price}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>

            {/* Perfect SVG Border (Drawn over the glass) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 320 440">
              <path 
                d="M 0 24 A 24 24 0 0 1 24 0 L 296 0 A 24 24 0 0 1 320 24 L 320 346 A 24 24 0 0 1 296 370 L 274 370 A 24 24 0 0 0 250 394 L 250 416 A 24 24 0 0 1 226 440 L 24 440 A 24 24 0 0 1 0 416 L 0 24 Z" 
                fill="none" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1.5" 
              />
            </svg>

            {/* The Floating Cart Button — opens the PDP so the shopper can pick a variant, same as the rest of the shop */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/product/${HERO_PRODUCTS[currentSlide].slug}`);
              }}
              className="absolute bottom-[11px] right-[11px] w-12 h-12 bg-primary hover:bg-white text-white hover:text-primary flex items-center justify-center rounded-full transition-colors duration-500 z-40 group shadow-[0_10px_30px_rgba(28,228,201,0.3)] hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)]"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}
