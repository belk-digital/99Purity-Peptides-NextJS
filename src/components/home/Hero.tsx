'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex flex-col font-sans bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
      >
        <source src="https://res.cloudinary.com/dgrrovta3/video/upload/v1781206084/Sparta_Hero_video_etnndz.mp4" type="video/mp4" />
      </video>

      {/* Main Content Overlay */}
      <div className="relative z-20 flex-1 flex flex-col items-start justify-center text-left px-6 sm:px-12 md:px-16 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] text-white tracking-tight uppercase font-bold drop-shadow-2xl max-w-4xl mb-6">
            THE FUTURE<br/>
            OF PEPTIDE<br/>
            SCIENCE
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed tracking-wide"
        >
          Precision-engineered peptides for researchers,
          <br className="hidden sm:block" /> demanding the highest standards
          <br className="hidden sm:block" /> of purity and performance.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/shop" className="flex items-center justify-center text-sm text-black bg-white hover:bg-gray-200 border border-transparent rounded-full px-8 py-3.5 transition-colors font-bold uppercase tracking-wider w-full sm:w-auto">
            Shop Now
          </Link>
          <Link href="/shop" className="flex items-center justify-center text-sm text-white border border-white/30 rounded-full px-8 py-3.5 hover:bg-white/10 transition-colors font-medium uppercase tracking-wider w-full sm:w-auto">
            View All Research Peptides <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>

      {/* Footer Ticker */}
      <div className="relative z-20 w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-4 sm:py-6 px-4 mb-8 rounded-2xl sm:rounded-3xl mx-4 max-w-[calc(100%-2rem)] sm:mx-8 sm:max-w-[calc(100%-4rem)] overflow-hidden self-center shadow-2xl">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-widest text-[10px] sm:text-lg">99.1% PURITY</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider text-[10px] sm:text-xl">LAB TESTED</span>
          </div>
          <div className="flex items-center">
            <span className="text-white font-bold tracking-wide text-[10px] sm:text-xl">RESEARCH GRADE</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-white font-bold tracking-wider text-sm sm:text-lg">USA MADE</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider text-sm sm:text-xl">FAST SHIPPING</span>
          </div>
        </div>
      </div>
    </div>
  )
}
