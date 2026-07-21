'use client'

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const PreloaderContext = createContext({ isReady: true })
export const usePreloader = () => useContext(PreloaderContext)

// Temporarily disabled — flip back to false to re-enable the intro animation.
const PRELOADER_DISABLED = true

export function HomePreloaderWrapper({ children }: { children: React.ReactNode }) {
  if (PRELOADER_DISABLED) {
    return <PreloaderContext.Provider value={{ isReady: true }}>{children}</PreloaderContext.Provider>
  }

  const [isReady, setIsReady] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(true)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const bondsRef = useRef<SVGPathElement>(null)
  const nodesRef = useRef<SVGGElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Check Session Storage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('hasSeenPreloader')
      if (hasSeen) {
        setShouldAnimate(false)
        setIsReady(true)
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none'
        }
        window.dispatchEvent(new Event('preloader-done'))
      }
    }
  }, [])

  useGSAP(() => {
    if (!shouldAnimate) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsReady(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hasSeenPreloader', 'true')
        }
        gsap.set(preloaderRef.current, { display: 'none' })
        window.dispatchEvent(new Event('preloader-done'))
      }
    })

    // Setup initial states
    gsap.set(wrapperRef.current, { opacity: 1 })
    gsap.set(nodesRef.current?.children || [], { opacity: 0, scale: 0, transformOrigin: 'center' })
    gsap.set(brandRef.current, { opacity: 0, y: 10 })
    
    // Draw the bonds (lines)
    if (bondsRef.current) {
      const length = bondsRef.current.getTotalLength()
      gsap.set(bondsRef.current, { strokeDasharray: length, strokeDashoffset: length })
      tl.to(bondsRef.current, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" })
    } else {
      tl.to({}, { duration: 1.0 }) // fallback timing
    }

    // Pop the atoms (circles) in sequence
    tl.to(nodesRef.current?.children || [], { 
      opacity: 1, 
      scale: 1, 
      duration: 0.4, 
      stagger: 0.05, 
      ease: "back.out(1.7)" 
    }, "-=0.3")

    // Instantly apply glow (do not animate filter as it causes extreme frame drops)
    tl.set(wrapperRef.current, {
      filter: "drop-shadow(0px 0px 30px rgba(0,139,139,0.5))"
    }, "<")

    // Fade in brand text
    tl.to(brandRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")

    // Hold for a moment so the user sees it
    tl.to({}, { duration: 0.5 })

    // Fade out everything smoothly (no fast upward parallax, no zooming, no dizziness)
    tl.to([wrapperRef.current, brandRef.current], { opacity: 0, scale: 0.95, duration: 0.5, ease: "power2.inOut" })
    
    // Slide the black background up off the screen smoothly
    tl.to(preloaderRef.current, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "<0.1")

  }, { scope: preloaderRef, dependencies: [shouldAnimate] })

  return (
    <PreloaderContext.Provider value={{ isReady }}>
      {children}

      <div 
        ref={preloaderRef}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden transform-gpu will-change-transform"
      >
         <div className="relative flex flex-col items-center justify-center z-10 gap-8">
           
           {/* The Molecule SVG */}
           <div ref={wrapperRef} className="relative w-[100px] sm:w-[120px] md:w-[160px] aspect-square flex items-center justify-center opacity-0 mb-4 md:mb-0">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                <g stroke="#008B8B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Hexagon ring with internal branches */}
                  <path ref={bondsRef} d="M 100,20 L 170,60 L 170,140 L 100,180 L 30,140 L 30,60 Z M 100,20 L 100,70 L 140,95 M 100,70 L 60,95 M 100,180 L 100,130" />
                </g>
                <g fill="#00AAAA" ref={nodesRef}>
                  <circle cx="100" cy="20" r="10" className="opacity-0" />
                  <circle cx="170" cy="60" r="8" className="opacity-0" />
                  <circle cx="170" cy="140" r="8" className="opacity-0" />
                  <circle cx="100" cy="180" r="10" className="opacity-0" />
                  <circle cx="30" cy="140" r="8" className="opacity-0" />
                  <circle cx="30" cy="60" r="8" className="opacity-0" />
                  <circle cx="100" cy="70" r="6" className="opacity-0" />
                  <circle cx="140" cy="95" r="6" className="opacity-0" />
                  <circle cx="60" cy="95" r="6" className="opacity-0" />
                  <circle cx="100" cy="130" r="6" className="opacity-0" />
                </g>
              </svg>
           </div>

           {/* Branding */}
           <div ref={brandRef} className="flex flex-col items-center gap-1.5 md:gap-2 opacity-0 px-6 max-w-[90vw]">
              <div className="text-white text-base sm:text-lg md:text-2xl font-heading tracking-[0.15em] sm:tracking-widest text-center leading-tight">
                99 PURITY PEPTIDES
              </div>
              <p className="text-white/40 text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.3em] font-medium uppercase text-center leading-relaxed">
                Clinical Research Synthesis
              </p>
           </div>

         </div>
      </div>
    </PreloaderContext.Provider>
  )
}
