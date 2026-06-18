'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck, Award, FileCheck, Activity } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const CHOOSE_US_DATA = [
  {
    tag: "Trusted & Verified",
    title: "HPLC-Verified Purity",
    description: "Every research peptide includes reversed-phase HPLC chromatograms confirming ≥99% purity for reliable laboratory results.",
    link: "/about",
    media: "/99 Images/purity.webp",
    icon: ShieldCheck,
    status: "HPLC Scanned"
  },
  {
    tag: "Test It Free",
    title: "MS Identity Confirmation",
    description: "Peptide identity verified by liquid chromatography-mass spectrometry (LC-MS) with documented molecular weight accuracy.",
    link: "/about",
    media: "/99 Images/identity.webp?v=2",
    icon: Award,
    status: "MS Verified"
  },
  {
    tag: "Receptor Agonist Research",
    title: "Complete COA Documentation",
    description: "Detailed certificates of analysis include purity percentages, impurity profiles, and analytical test methods for full research traceability.",
    link: "/about",
    media: "/99 Images/coa.webp",
    icon: FileCheck,
    status: "COA Loaded"
  }
]

export function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-cycle through the tabs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CHOOSE_US_DATA.length)
    }, 4000)
    
    // Clear interval on unmount or when activeIndex changes manually
    return () => clearInterval(interval)
  }, [activeIndex])

  return (
    <section className="bg-cream py-24 md:py-32 relative z-30 font-sans overflow-hidden border-t border-ink/5 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-10 max-w-[120rem] relative z-10">
        
        <div className="text-center md:text-left mb-16">
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Why Choose Us</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-none tracking-tighter uppercase drop-shadow-sm">
            Transparency<br />You Can Trust.
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left: Interactive Tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {CHOOSE_US_DATA.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`text-left p-6 md:p-8 rounded-3xl transition-all duration-500 border relative overflow-hidden ${
                    isActive 
                      ? 'bg-white border-primary/20 scale-[1.03] md:translate-x-4 z-10 shadow-sm' 
                      : 'bg-white/40 border-ink/5 hover:bg-white/80 hover:border-ink/10 scale-100 translate-x-0'
                  }`}
                >
                  {/* Premium Active Accent Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-2/3 bg-primary rounded-r-full" />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'bg-ink/5 text-ink/40'}`}>
                      <item.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-primary' : 'text-ink/40'}`}>
                      {item.tag}
                    </span>
                  </div>
                  
                  <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight transition-colors ${isActive ? 'text-ink mb-4' : 'text-ink/60 mb-0'}`}>
                    {item.title}
                  </h3>
                  
                  {/* Expandable description using AnimatePresence */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-ink/70 leading-relaxed text-sm md:text-base mb-6 pt-2">
                          {item.description}
                        </p>
                        
                        <Link href={item.link} className="inline-flex items-center gap-2 text-primary hover:text-ink font-bold text-xs tracking-[0.2em] uppercase transition-colors group">
                          View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>

          {/* Right: Laboratory Monitor */}
          <div className="w-full lg:w-2/3 h-[400px] sm:h-[500px] lg:h-auto lg:min-h-[700px] relative">
            <div className="absolute inset-0 bg-white/60 rounded-[40px] border border-ink/5 shadow-[0_20px_80px_rgba(0,0,0,0.05)] overflow-hidden backdrop-blur-3xl flex items-center justify-center p-2 md:p-3">
              
              {/* Inner screen frame */}
              <div className="relative w-full h-full rounded-[32px] md:rounded-[28px] overflow-hidden bg-white border border-ink/5 shadow-inner">
                
                {/* Tech grid background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 139, 139, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 139, 139, 0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image 
                      src={CHOOSE_US_DATA[activeIndex].media} 
                      alt={CHOOSE_US_DATA[activeIndex].title} 
                      fill 
                      className="object-cover opacity-95 transition-transform duration-1000"
                    />
                    
                    {/* Glowing overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-primary/10 pointer-events-none mix-blend-overlay" />
                    
                    {/* Realistic Scanning Laser with Trail */}
                    <motion.div 
                      className="absolute left-0 w-full h-32 pointer-events-none z-10 flex flex-col justify-end"
                      animate={{ top: ['-30%', '120%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      {/* Fading laser trail */}
                      <div className="w-full h-full bg-gradient-to-t from-primary/10 via-primary/5 to-transparent opacity-80" />
                      {/* Intense focused laser line */}
                      <div className="w-full h-[2px] bg-primary/60 shadow-[0_0_25px_rgba(0,139,139,1)]" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Data HUD Details */}
                <div className="absolute bottom-6 left-6 z-20 pointer-events-none bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-ink/5">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-ink/80 font-sans font-bold text-[10px] uppercase tracking-widest">{CHOOSE_US_DATA[activeIndex].status}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
