'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { FluidButton } from '@/components/ui/fluid-button'

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [exitDirection, setExitDirection] = useState<'up' | 'down'>('down')
  const [waitingForPreloader, setWaitingForPreloader] = useState(false)
  const [isDenied, setIsDenied] = useState(false)
  
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
    return () => {
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
    setIsDenied(true)
  }

  const handleGoBack = () => {
    setIsDenied(false)
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
            className={`fixed inset-0 backdrop-blur-md z-0 transition-colors duration-700 ${isDenied ? 'bg-red-950/60' : 'bg-black/40'}`}
          />

          {/* Outer wrapper handles the entry/exit intro animations */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: exitDirection === 'up' ? "-100vh" : "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed inset-0 pointer-events-none z-10"
          >
            {/* Inner wrapper */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 bg-cream shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden pointer-events-auto border-t border-white/50 transition-[border-radius,opacity,transform] duration-700 ease-in-out h-auto min-h-[85vh] md:min-h-[70vh] max-h-[95vh] rounded-t-[2rem] md:rounded-t-[3rem] opacity-100 translate-y-0`}
            >
              <AnimatePresence mode="wait">
                {!isDenied ? (
                  <motion.div 
                    key="verify"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full md:w-[55%] lg:w-[60%] px-5 py-6 sm:p-10 md:p-16 flex flex-col bg-transparent shrink-0 flex-1 overflow-y-auto min-h-0 order-last md:order-first"
                  >
                    
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
                          By clicking confirm, you acknowledge the intended use of these compounds and verify you are of legal age.
                        </p>
                      </div>

                      {/* Dual Buttons */}
                      <div className="flex flex-col sm:flex-row w-full gap-4 mt-2 max-w-sm mx-auto sm:mx-0">
                        <div className="flex-1">
                          <FluidButton 
                            onClick={handleVerify}
                            text="18+ Older"
                            variant="dark"
                            className="w-full min-w-full"
                          />
                        </div>
                        <button 
                          onClick={handleDeny}
                          className="flex-1 bg-transparent text-ink border border-ink/20 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-black/5 hover:border-black/30 transition-colors active:scale-95 duration-200"
                        >
                          Under 18
                        </button>
                      </div>
                    </div>

                    <div className="flex-auto min-h-[1rem]"></div>

                    <div className="mt-8 text-ink/30 text-[9px] uppercase tracking-[0.2em] text-center sm:text-left shrink-0 max-w-xl w-full mx-auto pb-4 md:pb-0">
                      By entering, you agree to our <Link href="/terms-and-conditions" className="hover:text-primary transition-colors underline underline-offset-2 opacity-80 hover:opacity-100">Terms of Service</Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="denied"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-full md:w-[55%] lg:w-[60%] px-5 py-6 sm:p-10 md:p-16 flex flex-col items-center justify-center bg-red-50/50 shrink-0 flex-1 overflow-y-auto min-h-0 order-last md:order-first text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 15, delay: 0.2 }}
                      className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] mb-8"
                    >
                      <Lock className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black text-red-600 mb-4 tracking-tighter font-heading uppercase leading-none">
                      Access Denied
                    </h2>
                    
                    <div className="w-12 h-[3px] bg-red-600 mb-6" />

                    <div className="text-ink/80 text-sm md:text-base leading-relaxed mb-10 max-w-md font-medium">
                      <p>
                        Due to the strict nature of research chemicals, you must be 18 years of age or older to enter this site.
                      </p>
                    </div>

                    <button 
                      onClick={handleGoBack}
                      className="text-xs uppercase tracking-widest font-bold text-ink/60 hover:text-ink transition-colors border-b border-ink/20 pb-1 hover:border-ink"
                    >
                      Wait, I made a mistake
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Pane */}
              <div className="relative w-full md:w-[45%] lg:w-[40%] h-[20vh] sm:h-[30vh] md:h-auto bg-black shrink-0 order-first md:order-last overflow-hidden">
                <Image 
                  src="/99 Images/vial-closeup.webp" 
                  alt="Peptide Vial" 
                  fill
                  priority
                  className={`object-cover transition-[transform,opacity,filter] duration-1000 will-change-[transform,opacity,filter] ${isDenied ? 'opacity-30 scale-110 grayscale blur-sm' : 'opacity-70 hover:scale-105'}`}
                />
                {/* Default Black Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
                
                {/* Red Denied Gradient (Fades in) */}
                <div className={`absolute inset-0 bg-gradient-to-t from-red-950/90 via-red-950/40 to-black/80 pointer-events-none transition-opacity duration-1000 will-change-opacity ${isDenied ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Logo Overlay */}
                <div className={`absolute top-6 right-6 md:top-10 md:right-10 w-24 md:w-48 h-12 md:h-24 pointer-events-none transition-opacity duration-500 will-change-opacity ${isDenied ? 'opacity-20' : 'opacity-100'}`}>
                  <Image 
                    src="/99 Images/99pp-Logo.png" 
                    alt="99Purity Peptides Logo" 
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                <div className={`absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pointer-events-none transition-[opacity,transform] duration-700 will-change-[opacity,transform] ${isDenied ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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
