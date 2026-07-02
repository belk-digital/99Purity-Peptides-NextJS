'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FluidButton } from '@/components/ui/fluid-button'

export function FaqHero() {
  const t = useTranslations('content.faqHero')
  return (
    <div className="relative w-full h-[75dvh] min-h-[450px] md:min-h-[600px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
      {/* Main Inner Container */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
        
        {/* Border Ring Overlay */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

        {/* Background Image */}
        <Image
          src="/99 Images/vial-ice-closeup.webp"
          alt="Research Peptides Vials on Ice"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
          priority
        />

        {/* Dark Gradient Overlay inside card */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10 pointer-events-none" />

        {/* Cutouts & UI Overlay (Inverted corners) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
          {/* Bottom Center Cutout for Button */}
          <div className="absolute -bottom-px left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
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
              text={<><span className="md:hidden">{t('viewPeptidesShort')}</span><span className="hidden md:inline">{t('viewPeptidesLong')}</span></>}
              className="relative z-10"
            />
          </div>
        </div>

        {/* Main Content inside the card */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-24 w-full h-full max-w-6xl pb-32 sm:pb-28 pt-16 md:pb-20 md:pt-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto px-2"
          >
            <h1 className="w-full font-heading text-4xl sm:text-[6.5vw] md:text-[6vw] lg:text-[70px] leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-3 md:mb-4">
              {t('titleLine1')}<br className="md:hidden" /> {t('titleLine2')}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 md:mt-4 text-white/80 text-xs sm:text-sm md:text-lg max-w-2xl font-light leading-relaxed tracking-wide mx-auto px-2"
          >
            {t('subtitle')}
          </motion.p>
        </div>

      </div>
    </div>
  )
}
