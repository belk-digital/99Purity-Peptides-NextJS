'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'
import { ShieldCheck } from 'lucide-react'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

const SLIDES = [
  {
    id: 0,
    title: "Uncompromising Purity",
    description: "Every batch is rigorously tested via 3rd party HPLC and Mass Spectrometry to guarantee 99%+ purity.",
    image: "/99 Images/vial-ice-closeup.webp"
  },
  {
    id: 1,
    title: "Research Grade Quality",
    description: "Synthesized in state-of-the-art facilities ensuring strictly controlled laboratory environments.",
    image: "/99 Images/vial-closeup.webp"
  },
  {
    id: 2,
    title: "Rapid Fulfillment",
    description: "Orders process immediately with secure, reliable shipping directly to your research facility.",
    image: "/99 Images/multiple-products-bg.webp"
  }
]

interface AuthSplitLayoutProps {
  children: React.ReactNode
  mode: 'login' | 'register'
}

export function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 3000) // Changed to 3 seconds as requested
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white p-0 md:p-4 lg:p-6 flex items-center justify-center">
      
      {/* Main Container */}
      <div className="w-full h-full min-h-screen md:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] bg-white rounded-none md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Column - Slider */}
        <div className="flex h-[40vh] min-h-[350px] lg:h-auto lg:w-[45%] relative flex-col justify-between p-6 md:p-8 lg:p-12 bg-[#111] overflow-hidden rounded-b-[2rem] md:rounded-[2rem] lg:rounded-[2.5rem] m-0 lg:m-2">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <Image 
                src={SLIDES[currentSlide].image}
                alt="Background"
                fill
                className="object-cover opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top empty space or subtle branding */}
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <Image 
                src="/99 Images/99pp-Logo.png" 
                alt="99 Purity Peptides" 
                width={200} 
                height={66} 
                className="h-12 md:h-16 w-auto" 
              />
            </Link>
          </div>

          {/* Center Content / Text */}
          <div className="relative z-10 flex flex-col items-center text-center mt-auto mb-12">
            
            {/* Mock Logo / Icon (Like in screenshot) */}
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-xl lg:rounded-[1.25rem] backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 lg:mb-8 shadow-xl">
               <ShieldCheck className="text-white w-6 h-6 lg:w-8 lg:h-8" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <h2 className={`text-xl md:text-2xl xl:text-3xl font-bold text-white mb-2 md:mb-4 ${spaceGrotesk.className}`}>
                  {SLIDES[currentSlide].title}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-[320px]">
                  {SLIDES[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2 mt-6 lg:mt-12">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i ? 'w-4 lg:w-6 bg-white' : 'bg-white/30'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-[55%] bg-white p-6 sm:p-12 lg:p-16 flex flex-col relative lg:min-h-0 flex-grow">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full mb-8 sm:mb-12 lg:mb-0 gap-4 sm:gap-0">
            <Link href="/" className="flex items-center gap-2 text-xs md:text-sm font-medium text-ink/60 hover:text-ink transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Return to Home
            </Link>
          </div>

          {/* Form Area */}
          <div className="flex-grow flex flex-col items-center justify-center w-full my-8 sm:my-12 lg:my-0">
            <div className="w-full max-w-[400px]">
              {children}
              
              <div className="text-sm font-medium text-ink/60 text-center mt-6">
                {mode === 'login' ? (
                  <>Don't have an account? <Link href="/register" className="text-ink font-bold hover:underline underline-offset-4">Sign Up</Link></>
                ) : (
                  <>Already have an account? <Link href="/login" className="text-ink font-bold hover:underline underline-offset-4">Sign In</Link></>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between items-center text-[11px] text-ink/50 mt-auto pt-8">
            <span>© 2026 99 Purity Peptides</span>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-ink transition-colors font-medium">Privacy Policy</Link>
              <Link href="/contact-us" className="hover:text-ink transition-colors font-medium">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
