'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function ParallaxImageSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGlitching, setIsGlitching] = useState(false)
  const [showReward, setShowReward] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // By making the image 125% of the container's height and translating it by -20% of its own height 
  // (which equals exactly 25% of the container's height), we mathematically guarantee a flawless 
  // top-to-bottom parallax effect on ANY screen size, including tall mobile screens.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])

  const triggerGlitch = () => {
    if (isGlitching || showReward) return;
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setShowReward(true);
    }, 1200); // Glitch lasts 1.2 seconds
  }

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[35vh] md:h-[60vh] overflow-hidden bg-[#050505] z-20 border-t border-white/5"
    >
      <motion.div 
        className={`absolute inset-0 w-full h-[125%] transition-all duration-75 ${
          isGlitching ? 'filter saturate-[400%] hue-rotate-90 contrast-[200%] invert' : ''
        }`}
        style={{ y }}
        animate={
          isGlitching 
            ? { x: [-15, 15, -10, 10, -15, 15, 0], y: [-15, 10, -15, 15, -10, 10, 0] } 
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.2, repeat: isGlitching ? Infinity : 0, repeatType: 'mirror' }}
      >
        <Image 
          src="/99 Images/vial-closeup.webp"
          alt="The Pursuit of Purity Visual"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Secret "Do Not Click" Button */}
      <button 
        onClick={triggerGlitch}
        className="absolute top-6 right-6 text-[10px] tracking-[0.3em] font-bold text-white/15 hover:text-white/90 transition-colors duration-300 z-50 uppercase cursor-pointer"
      >
        Do Not Click
      </button>

      {/* Meme Overlay Text */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <h2 className="font-heading text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-[0.2em] text-center drop-shadow-xl leading-tight">
              GIGACHAD<br/>ACTIVATED
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-sm text-center flex flex-col items-center gap-3 md:gap-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
              <button 
                onClick={() => setShowReward(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors w-8 h-8 flex items-center justify-center text-lg md:text-base"
              >
                ✕
              </button>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 text-white border border-white/10 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-1 shadow-inner">
                🏆
              </div>
              <h3 className="text-white font-heading text-xl md:text-2xl font-bold uppercase tracking-tight">Secret Unlocked</h3>
              <p className="text-white/60 text-xs md:text-sm">
                You found the Gigachad button. Take 15% off your next research project.
              </p>
              <div className="bg-black border border-white/10 p-1.5 md:p-2 pl-4 md:pl-6 rounded-xl flex items-center justify-between w-full mt-2 shadow-inner">
                <span className="text-white font-mono font-bold text-base md:text-lg tracking-widest">GIGACHAD15</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('GIGACHAD15');
                    alert('Copied to clipboard!');
                  }}
                  className="text-[10px] md:text-xs bg-white text-black px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-bold uppercase tracking-wider hover:bg-white/80 transition-colors shrink-0 ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
