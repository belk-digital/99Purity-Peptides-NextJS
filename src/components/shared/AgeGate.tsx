'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [exitDirection, setExitDirection] = useState<'up' | 'down'>('down')
  const [waitingForPreloader, setWaitingForPreloader] = useState(false)
  
  const [isExpanding, setIsExpanding] = useState(false)
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    setHasHydrated(true)
    const isVerified = document.cookie.includes('age_verified=true')
    
    if (!isVerified) {
      if (pathname === '/') {
        setWaitingForPreloader(true)
        const handleDone = () => {
          setWaitingForPreloader(false)
          setIsVisible(true)
        }
        window.addEventListener('preloader-done', handleDone)
        
        // Fallback to show it eventually if event is missed
        const timeout = setTimeout(handleDone, 8000)
        
        return () => {
          window.removeEventListener('preloader-done', handleDone)
          clearTimeout(timeout)
        }
      } else {
        setIsVisible(true)
      }
    }
  }, [pathname])

  // Lock scroll and videos globally when visible
  useEffect(() => {
    const videos = document.querySelectorAll('video')
    if (isVisible) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      lenis?.stop()
      videos.forEach(v => v.pause())
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenis?.start()
      videos.forEach(v => v.play())
    }
  }, [isVisible, lenis])

  const handleVerify = () => {
    setExitDirection('down')
    document.cookie = "age_verified=true; max-age=31536000; path=/";
    setTimeout(() => {
      setIsVisible(false)
    }, 50)
  }

  const handleDeny = () => {
    setIsExpanding(true)
    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = 'https://www.google.com'
      }
    }, 600)
  }

  const handleDragEnd = (e: any, info: PanInfo) => {
    if (info.offset.x > 80) { // Dragged right
      handleVerify()
    } else if (info.offset.x < -80) { // Dragged left
      handleDeny()
    }
  }

  if (!hasHydrated || waitingForPreloader) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[999999] pointer-events-auto">
          
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-0"
          />

          {/* Outer wrapper handles the entry/exit intro animations */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: exitDirection === 'up' ? "-100vh" : "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed inset-0 pointer-events-none z-10"
          >
            {/* Inner wrapper applies the interactive drag offset */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 bg-cream shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden pointer-events-auto border-t border-white/50 transition-[border-radius,opacity,transform] duration-700 ease-in-out ${isExpanding ? 'rounded-none opacity-0 translate-y-10' : 'h-auto min-h-[85vh] md:min-h-[70vh] max-h-[95vh] rounded-t-[2rem] md:rounded-t-[3rem] opacity-100 translate-y-0'}`}
            >
              {/* Text Content Pane */}
              <div className="relative w-full md:w-[55%] lg:w-[60%] px-5 py-6 sm:p-10 md:p-16 flex flex-col bg-transparent shrink-0 flex-1 overflow-y-auto min-h-0 order-last md:order-first">
                
                {/* Top spacer for vertical centering without overflow clipping */}
                <div className="flex-auto min-h-[1rem]"></div>

                <div className="max-w-xl w-full flex flex-col items-center sm:items-start text-center sm:text-left shrink-0 mx-auto">
                  <p className="font-bold tracking-[0.2em] uppercase text-primary text-[10px] md:text-xs mb-3">
                    Restricted Access
                  </p>
                  <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink mb-6 tracking-tighter font-heading uppercase leading-none break-words w-full">
                    Age<br className="hidden sm:block" /> Verification
                  </h2>
                  
                  <div className="w-12 h-[3px] bg-primary mb-6 mx-auto sm:mx-0" />

                  <div className="text-ink/80 text-xs sm:text-sm md:text-base leading-relaxed mb-8 space-y-4 font-medium max-w-md">
                    <p>
                      <strong className="text-ink block mb-1 text-sm md:text-lg">RESEARCH PURPOSES ONLY</strong>
                      The products on this website are strictly for in-vitro laboratory research. They are <strong>not</strong> for human consumption, supplements, or drugs. 
                    </p>
                    <p className="font-bold text-ink">
                      By sliding to confirm, you acknowledge the intended use of these compounds and verify you are of legal age.
                    </p>
                  </div>

                  {/* Horizontal Slide-to-Verify Interactive Component */}
                  <div className="relative w-full max-w-[340px] h-[72px] bg-black/[0.04] border border-black/5 rounded-full shadow-inner flex items-center justify-between px-6 mx-auto sm:mx-0 mt-2">
                    
                    {/* Under 18 Text (Left) */}
                    <div className="absolute left-6 text-[10px] md:text-xs font-bold text-black/40 uppercase tracking-widest z-0 flex items-center pointer-events-none">
                      <ArrowLeft className="w-3 h-3 inline mr-1.5 -mt-0.5" /> Under 18
                    </div>
                    
                    {/* 18+ Text (Right) */}
                    <div className="absolute right-6 text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest z-0 flex items-center pointer-events-none">
                      18+ Older <ArrowRight className="w-3 h-3 inline ml-1.5 -mt-0.5" />
                    </div>

                    {/* Draggable Thumb */}
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -110, right: 110 }}
                      dragElastic={0.05}
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 25 }}
                      dragSnapToOrigin={true}
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute top-1/2 left-1/2 mt-[-28px] ml-[-28px] w-14 h-14 bg-black text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-shadow will-change-transform touch-none"
                    >
                      {/* Pulsing Ripple to indicate interactability */}
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-2 border-black/40 pointer-events-none"
                      />

                      {/* Subtle left-right nudge on the lines to indicate sliding direction */}
                      <motion.div 
                        animate={{ x: [0, 3, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1 }}
                        className="flex items-center gap-[3px] relative z-10"
                      >
                        <div className="w-[2px] h-3 bg-white/40 rounded-full pointer-events-none" />
                        <div className="w-[2px] h-4 bg-white rounded-full pointer-events-none" />
                        <div className="w-[2px] h-3 bg-white/40 rounded-full pointer-events-none" />
                      </motion.div>
                    </motion.div>
                  </div>

                </div>

                {/* Bottom spacer for vertical centering */}
                <div className="flex-auto min-h-[1rem]"></div>

                {/* Copyright/Terms Footer */}
                <div className="mt-8 text-ink/30 text-[9px] uppercase tracking-[0.2em] text-center sm:text-left shrink-0 max-w-xl w-full mx-auto pb-4 md:pb-0">
                  By entering, you agree to our <Link href="/terms-and-conditions" className="hover:text-primary transition-colors underline underline-offset-2 opacity-80 hover:opacity-100">Terms of Service</Link>
                </div>
              </div>

              {/* Image Pane */}
              <div className="relative w-full md:w-[45%] lg:w-[40%] h-[20vh] sm:h-[30vh] md:h-auto bg-black shrink-0 order-first md:order-last overflow-hidden">
                <Image 
                  src="/99 Images/vial-closeup.webp" 
                  alt="Peptide Vial" 
                  fill
                  priority
                  className="object-cover opacity-70 hover:scale-105 transition-transform duration-1000 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
                
                {/* Logo Overlay */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 w-24 md:w-48 h-12 md:h-24 pointer-events-none">
                  <Image 
                    src="/99 Images/99pp-Logo.png" 
                    alt="99Purity Peptides Logo" 
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pointer-events-none">
                  <p className="font-bold tracking-widest uppercase text-[9px] md:text-[10px] opacity-80 mb-1 md:mb-2">Purity Guaranteed</p>
                  <p className="font-heading text-xl md:text-3xl drop-shadow-lg leading-none">99.1% HPLC<br/>Verified</p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
