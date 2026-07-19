'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Microscope, Activity, FileText, FlaskConical, Hexagon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

// Custom hook for the scramble/decode text effect
const ScrambleText = ({ text, activeIndex }: { text: string, activeIndex: number }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|<>?';
    let frame = 0;
    const maxFrames = 12; // Controls duration of the scramble
    
    const interval = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        clearInterval(interval);
        setDisplayText(text);
      } else {
        const scrambled = text.split('').map(char => {
          if (char === ' ' || char === '\n') return char;
          // As frames progress, lock in correct characters left to right
          if (Math.random() < frame / maxFrames) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        setDisplayText(scrambled);
      }
    }, 30); // Speed of character changes
    
    return () => clearInterval(interval);
  }, [text, activeIndex]);

  return <span>{displayText}</span>;
}

const ADVANTAGE_KEYS = [
  { key: 'purityStandards', icon: Microscope },
  { key: 'massSpecValidation', icon: Activity },
  { key: 'comprehensiveDocs', icon: FileText },
  { key: 'researchOnly', icon: FlaskConical }
]

export function WhatSetsUsApart() {
  const t = useTranslations('home.whatSetsUsApart')
  const ADVANTAGES = ADVANTAGE_KEYS.map(({ key, icon }) => ({
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`),
    icon
  }))
  const [activeIndex, setActiveIndex] = useState(0)

  // Custom Cursor Logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.5 })
  const cursorY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.5 })
  
  const [isHoveringSection, setIsHoveringSection] = useState(false)
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)

  // Auto-cycle through the nodes every 6 seconds
  useEffect(() => {
    if (isHoveringSection) return; // Pause auto-rotation when user is interacting

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ADVANTAGES.length)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [activeIndex, isHoveringSection])

  // Mouse movement is now handled directly on the section's onMouseMove to avoid global tracking

  // Node coordinates pushed outwards to fill the space, combined with precise 45-degree circuit paths
  const nodes = [
    { x: '15%', y: '15%', path: 'M 50 50 L 35 50 L 15 30 L 15 15' }, // Top Left
    { x: '85%', y: '20%', path: 'M 50 50 L 50 35 L 65 20 L 85 20' }, // Top Right
    { x: '20%', y: '85%', path: 'M 50 50 L 50 65 L 30 85 L 20 85' }, // Bottom Left
    { x: '85%', y: '85%', path: 'M 50 50 L 70 50 L 85 65 L 85 85' }, // Bottom Right
  ]
  const center = { x: '50%', y: '50%' }

  const activeAdvantage = ADVANTAGES[activeIndex]
  const ActiveIcon = activeAdvantage.icon

  return (
    <section 
      onMouseEnter={() => setIsHoveringSection(true)}
      onMouseLeave={() => setIsHoveringSection(false)}
      onMouseMove={(e) => {
        mouseX.set(e.clientX - 50)
        mouseY.set(e.clientY - 50)
      }}
      className={`bg-gradient-to-b from-white to-cream py-24 md:py-32 relative z-30 font-sans overflow-hidden min-h-screen flex items-center ${!isHoveringClickable ? 'cursor-none' : 'cursor-auto'}`}
    >
      {/* Custom Cursor matching Categories section */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-full bg-primary text-white font-bold text-[10px] uppercase tracking-widest text-center shadow-[0_10px_40px_rgba(0,139,139,0.4)]"
        style={{ width: 100, height: 100, x: cursorX, y: cursorY }}
        animate={{ 
          scale: isHoveringSection && !isHoveringClickable ? 1 : 0,
          opacity: isHoveringSection && !isHoveringClickable ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.5,
        }}
      >
        <span className="max-w-[70px] leading-tight text-[11px] font-bold">{t('clickCursorLine1')}<br/>{t('clickCursorLine2')}</span>
      </motion.div>

      <div className="w-full mx-auto px-4 sm:px-12 md:px-16 max-w-[120rem] relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16 lg:mb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block border border-primary/20 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm"
          >
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{t('eyebrow')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-7xl font-black text-ink leading-none tracking-tighter uppercase mb-6"
          >
            {t('titleLine1')}<br />{t('titleLine2')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-ink-muted text-lg leading-relaxed max-w-4xl font-medium"
          >
            {t.rich('description', { strong: (chunks) => <strong className="text-ink">{chunks}</strong> })}
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Interactive Molecular Diagram */}
          <div className="w-full lg:w-1/2 relative aspect-square max-w-[800px] mx-auto z-10">
            
            {/* SVG Connecting Fiber Optics & Web */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              
              {/* Background intricate web elements */}
              <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0,0,0,0.02)" strokeWidth="0.2" strokeDasharray="1 1.5" />
              <path d="M 25 50 A 25 25 0 0 1 50 25" fill="none" stroke="rgba(0,139,139,0.15)" strokeWidth="0.4" />
              <path d="M 75 50 A 25 25 0 0 1 50 75" fill="none" stroke="rgba(0,139,139,0.15)" strokeWidth="0.4" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,0,0,0.02)" strokeWidth="0.1" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.02)" strokeWidth="0.1" />

              {nodes.map((n, i) => {
                const isActive = activeIndex === i;
                return (
                  <g key={`bond-${i}`}>
                    {/* Inactive Fiber Base (looks like a clear physical tube) */}
                    <path 
                      d={n.path}
                      fill="none"
                      stroke="rgba(0,0,0,0.04)" 
                      strokeWidth="1.2" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path 
                      d={n.path}
                      fill="none"
                      stroke="rgba(255,255,255,0.8)" 
                      strokeWidth="0.4" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Active Solid Connection Line */}
                    {isActive && (
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        d={n.path}
                        fill="none"
                        stroke="#008B8B" 
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Data Pulses */}
                    <motion.path 
                      d={n.path}
                      fill="none"
                      stroke={isActive ? "rgba(0,139,139,1)" : "rgba(255,255,255,0.6)"} 
                      strokeWidth={isActive ? "0.8" : "0.4"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={isActive ? "2 12" : "1 25"}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -100 }}
                      transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: isActive ? 1.5 : 4 
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center Core (Physical Glass Dial) */}
            <div className="absolute z-10 w-28 h-28 lg:w-36 lg:h-36 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,1),_0_12px_40px_rgba(0,0,0,0.08)]" style={{ top: center.y, left: center.x, transform: 'translate(-50%, -50%)' }}>
              {/* Inner metallic/glass rim */}
              <div className="absolute inset-2 border-2 border-white/50 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 border-[1.5px] border-primary/40 rounded-full border-dashed"
                />
              </div>
              
              <div className="relative z-10 w-16 h-16 lg:w-24 lg:h-24 -ml-3">
                <Image 
                  src="/99 Images/99pp-Logo-small.png" 
                  alt="99 Purity Peptides Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>

            {/* Orbiting Nodes (Frosted Lenses) */}
            {ADVANTAGE_KEYS.map(({ key, icon: NodeIcon }, i) => {
              const n = nodes[i];
              const isActive = activeIndex === i;
              return (
                <div 
                  key={`node-${i}`}
                  className="absolute z-20 w-16 h-16 lg:w-20 lg:h-20"
                  style={{ top: n.y, left: n.x, transform: 'translate(-50%, -50%)' }}
                >
                  {/* Pulse Ring Affordance for Inactive Nodes */}
                  {!isActive && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.8, opacity: [0, 0.4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: i * 0.2 }}
                      className="absolute inset-0 rounded-full border border-primary pointer-events-none will-change-transform"
                    />
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setIsHoveringClickable(true)}
                    onMouseLeave={() => setIsHoveringClickable(false)}
                    aria-label={t(`items.${key}.shortLabel`)}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-full transition-all duration-500 backdrop-blur-sm ${
                      isActive 
                        ? 'bg-primary border-4 border-white shadow-[0_12px_30px_rgba(0,139,139,0.25)] scale-110 z-10' 
                        : 'bg-white/40 border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,1),_0_8px_20px_rgba(0,0,0,0.06)] hover:bg-white/60 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),_0_12px_30px_rgba(0,0,0,0.1)] z-10'
                    }`}
                  >
                    <NodeIcon className={`w-6 h-6 lg:w-8 lg:h-8 transition-colors duration-500 relative z-20 ${isActive ? 'text-white' : 'text-ink-muted'}`} />
                  </motion.button>

                  {/* Node Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-32 text-center pointer-events-none z-30">
                    <span className={`inline-block px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 ${isActive ? 'text-primary' : 'text-ink-muted'}`}>
                      {t(`items.${key}.shortLabel`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Content Display */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] flex flex-col justify-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative bg-white/40 border border-white/60 rounded-[40px] p-8 md:p-12 backdrop-blur-md shadow-[0_24px_64px_rgba(0,0,0,0.06),_inset_0_1px_1px_rgba(255,255,255,1)] overflow-hidden will-change-transform"
              >
                {/* Ultra-premium glass reflection line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                
                {/* Huge faded background icon */}
                <div className="absolute -right-10 -bottom-10 opacity-[0.02] pointer-events-none mix-blend-overlay">
                  <ActiveIcon className="w-64 h-64 text-ink" />
                </div>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/50 border border-white shadow-sm flex items-center justify-center backdrop-blur-md">
                    <ActiveIcon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-primary font-mono text-xs tracking-widest uppercase font-bold bg-white/50 px-3 py-1 rounded-full border border-white shadow-sm">
                    {t('nodeLabel', { number: activeIndex + 1 })}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-ink mb-6 tracking-tight relative z-10 drop-shadow-sm font-mono tracking-tighter">
                  <ScrambleText text={activeAdvantage.title} activeIndex={activeIndex} />
                </h3>
                
                <p className="text-ink-muted leading-relaxed text-lg md:text-xl font-medium relative z-10 font-mono tracking-tight">
                  <ScrambleText text={activeAdvantage.description} activeIndex={activeIndex} />
                </p>

                <div className="mt-12 pt-8 border-t border-white/60 relative z-10 flex items-center justify-between">
                  <Link
                    href="/about-us"
                    onMouseEnter={() => setIsHoveringClickable(true)}
                    onMouseLeave={() => setIsHoveringClickable(false)}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors uppercase tracking-[0.2em] text-xs font-bold group"
                  >
                    {t('viewProtocolData')}
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}


