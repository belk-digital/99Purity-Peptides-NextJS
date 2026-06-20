'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
    const isVerified = document.cookie.includes('age_verified=true')
    if (!isVerified) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    }
  }, [])

  const handleVerify = () => {
    document.cookie = "age_verified=true; max-age=31536000; path=/";
    setIsVisible(false)
    document.body.style.overflow = 'unset'
  }

  const handleDeny = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = 'https://www.google.com'
    }
  }

  if (!hasHydrated) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-auto p-4 md:p-8 overflow-y-auto">
          {/* Solid Cream Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#FDFBF7] z-0"
          />

          {/* Modal Container - Split Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            className="relative z-10 w-full max-w-4xl my-auto bg-white/50 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden border border-black/5"
          >
            {/* Left Image Pane (Top on Mobile, Left on Desktop) */}
            <div className="relative w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] md:h-auto bg-black flex flex-col items-center justify-center overflow-hidden shrink-0">
              <Image 
                src="/99 Images/vial-closeup.webp" 
                alt="Peptide Vial" 
                fill
                className="object-cover opacity-60 hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/60 pointer-events-none" />
              
              {/* Big Logo over image */}
              <div className="relative z-10 w-40 sm:w-48 md:w-64 h-20 sm:h-24 md:h-32 flex items-center justify-center pointer-events-none mb-6 md:mb-0">
                <Image 
                  src="/99 Images/99pp-Logo.png" 
                  alt="99Purity Peptides Logo" 
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              <div className="absolute bottom-4 md:bottom-8 left-5 md:left-8 text-white z-10 pointer-events-none">
                <p className="font-bold tracking-widest uppercase text-[9px] md:text-xs opacity-80 mb-1 drop-shadow-md">Purity Guaranteed</p>
                <p className="font-heading text-lg md:text-2xl drop-shadow-lg">99.9% HPLC Verified</p>
              </div>
            </div>

            {/* Right Content Pane */}
            <div className="relative w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col items-center text-center justify-center bg-transparent shrink-0">
              
              <h2 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tighter font-heading uppercase">
                Age Verification
              </h2>
              
              <div className="w-12 h-[3px] bg-primary mx-auto mb-8" />

              <div className="text-black/90 text-sm md:text-base leading-relaxed mb-10 space-y-5 max-w-[400px] mx-auto text-left font-medium">
                <p>
                  <strong className="text-black block mb-2 text-base md:text-lg">RESEARCH PURPOSES ONLY</strong>
                  The products on this website are strictly for in-vitro laboratory research. They are <strong>not</strong> for human consumption, supplements, or drugs. 
                </p>
                <p className="font-semibold text-black">
                  By clicking &quot;I am 18 or older&quot;, you confirm your age and acknowledge the intended use of these compounds.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[400px] px-2">
                <button
                  onClick={handleVerify}
                  className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-primary transition-colors duration-300"
                >
                  I am 18 or older
                </button>
                <button
                  onClick={handleDeny}
                  className="w-full py-4 bg-transparent text-black/50 font-bold uppercase tracking-widest text-[11px] rounded-full hover:text-black hover:bg-black/5 transition-colors border border-black/10"
                >
                  I am under 18
                </button>
              </div>

              <p className="text-black/30 text-[9px] mt-8 uppercase tracking-[0.2em]">
                By entering, you agree to our Terms of Service
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
