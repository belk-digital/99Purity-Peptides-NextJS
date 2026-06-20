'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ShieldCheck, Award, FileCheck, X } from 'lucide-react'
import { MagazineGlassCard } from './MagazineGlassCard'
import Image from 'next/image'

const CHOOSE_US_DATA = [
  {
    tag: "Trusted & Verified",
    title: "HPLC-Verified Purity",
    description: "Every research peptide includes reversed-phase HPLC chromatograms confirming ≥99% purity for reliable laboratory results.",
    media: "/99 Images/purity.webp",
    icon: ShieldCheck,
  },
  {
    tag: "Test It Free",
    title: "MS Identity Confirmation",
    description: "Peptide identity verified by liquid chromatography-mass spectrometry (LC-MS) with documented molecular weight accuracy.",
    media: "/99 Images/identity.webp?v=2",
    icon: Award,
  },
  {
    tag: "Receptor Agonist Research",
    title: "Complete COA Documentation",
    description: "Detailed certificates of analysis include purity percentages, impurity profiles, and analytical test methods for full research traceability.",
    media: "/99 Images/coa.webp",
    icon: FileCheck,
  }
]

export function WhyChooseUs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // Custom Cursor state
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.2 } 
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", damping: 20, stiffness: 100 } 
    }
  };

  return (
    <section 
      onPointerMove={(e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }}
      className={`bg-cream py-24 md:py-32 relative font-sans overflow-hidden border-t border-ink/5 min-h-screen flex flex-col justify-center transition-all duration-300 ${selectedIndex !== null ? 'z-[999]' : 'z-30'}`}
    >
      {/* Custom Cursor (Desktop Only) */}
      <motion.div
        className="pointer-events-none fixed z-[90] hidden xl:flex items-center justify-center w-24 h-24 rounded-full shadow-2xl border border-black/5 bg-white/95 backdrop-blur-md text-ink"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          top: 0,
          left: 0,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isHoveringCard && selectedIndex === null ? 1 : 0, 
          opacity: isHoveringCard && selectedIndex === null ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-center leading-[1.4]">
          Click<br/>To<br/>View
        </span>
      </motion.div>

      <div className="container mx-auto px-4 md:px-10 max-w-[120rem] relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm"
          >
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Why Choose Us</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-[2.5rem] sm:text-4xl md:text-5xl lg:text-[6rem] font-black text-ink leading-[0.9] tracking-tighter uppercase drop-shadow-sm break-words"
          >
            Transparency<br />You Can Trust.
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-12 md:gap-16 lg:gap-24 max-w-[90rem] mx-auto"
        >
          {CHOOSE_US_DATA.map((item, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants} 
              className="flex justify-center w-full mx-auto"
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              <MagazineGlassCard 
                title={item.title}
                description={item.description}
                icon={item.icon}
                tag={item.tag}
                image={item.media}
                onClick={() => setSelectedIndex(index)}
                className="xl:!cursor-none"
              />
            </motion.div>
          ))}
        </motion.div>
        
      </div>

      {/* Fullscreen Image Lightbox Modal (Rendered via Portal to escape all stacking contexts) */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 p-4 sm:p-8 cursor-zoom-out"
            >
              {/* Close Button - Minimalist */}
              <button 
                onClick={() => setSelectedIndex(null)}
                className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white/50 hover:text-white transition-colors duration-300 z-50 group"
              >
                <X className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              </button>

              {/* Main Modal Content */}
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.1 }}
                className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center cursor-default z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Container - Pure and clean, no borders */}
                <div className="relative w-full flex-1 min-h-0 drop-shadow-2xl">
                  <Image 
                    src={CHOOSE_US_DATA[selectedIndex].media}
                    alt={CHOOSE_US_DATA[selectedIndex].title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
                
                {/* Ultra-Modern Minimalist Caption */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-10 shrink-0 flex flex-col items-center text-center"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-[1px] bg-primary/50"></span>
                    <span className="text-primary/90 text-xs tracking-[0.3em] uppercase font-medium">
                      {CHOOSE_US_DATA[selectedIndex].tag}
                    </span>
                    <span className="w-8 h-[1px] bg-primary/50"></span>
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-heading font-light text-white tracking-wide">
                    {CHOOSE_US_DATA[selectedIndex].title}
                  </h3>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
