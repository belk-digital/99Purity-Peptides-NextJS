'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, FlaskConical, Award } from 'lucide-react'
import Image from 'next/image'
import { FluidButton } from '@/components/ui/fluid-button'

export function AboutHero() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[44px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[52px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-16 [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
      {/* Main Inner Container */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
        
        {/* Border Ring Overlay (Rendered UNDER the cutouts but OVER gradients) */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

        {/* Background Image */}
        <Image
          src="/99 Images/vial-closeup.webp"
          alt="Research Peptides Vials"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
          priority
        />

        {/* Dark Gradient Overlay inside card */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10 pointer-events-none" />

        {/* Cutouts & UI Overlay (Inverted corners) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
          {/* Bottom Center Cutout for Button */}
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
            {/* Left Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -left-[calc(2.5rem-1px)] w-10 h-10 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Right Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -right-[calc(2.5rem-1px)] w-10 h-10 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            <FluidButton 
              href="/shop" 
              text={<><span className="md:hidden">View Peptides</span><span className="hidden md:inline">View Research Peptides</span></>} 
              className="relative z-10" 
            />
          </div>
        </div>

        {/* Main Content inside the card */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-5 sm:px-12 md:px-24 w-full h-full max-w-6xl pb-32 pt-20 md:pb-24 md:pt-10 lg:pb-32 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto"
          >
            <h1 className="w-full font-heading text-[11vw] sm:text-[9vw] md:text-[7vw] lg:text-[80px] xl:text-[100px] leading-[1.1] md:leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-4 md:mb-6">
              ABOUT 99<span className="md:hidden"><br/></span>
              <span className="hidden md:inline"> </span>PURITY PEPTIDES
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 md:mt-4 text-white/80 text-sm sm:text-base md:text-xl max-w-2xl font-light leading-relaxed tracking-wide mx-auto"
          >
            99 Purity Peptides operates as a research-focused peptide company that USA laboratories and independent research professionals rely on when sourcing synthetic research peptides.
          </motion.p>
        </div>

      </div>
    </div>
  )
}
