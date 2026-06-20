'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, ShieldCheck, FlaskConical, Award } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[700px] bg-cream p-3 pt-[44px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[52px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-16 [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
      {/* Main Inner Container */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
        
        {/* Border Ring Overlay (Rendered UNDER the cutouts but OVER gradients) */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-50" />

        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80 rounded-[2rem] md:rounded-[4rem]"
        >
          <source src="https://res.cloudinary.com/dgrrovta3/video/upload/v1781206084/Sparta_Hero_video_etnndz.mp4" type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay inside card */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Cutouts & UI Overlay (Inverted corners) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
          {/* Bottom Left Cutout */}
          <div className="absolute bottom-0 left-0 bg-cream rounded-tr-[3rem] md:rounded-tr-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 pr-6 md:pr-10">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] left-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Right Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -right-[calc(3rem-1px)] w-12 h-12 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            <Link href="/shop" className="group flex items-center justify-between gap-4 md:gap-8 text-sm sm:text-base md:text-lg text-white bg-black rounded-full pl-8 pr-2.5 py-2.5 md:pl-10 md:pr-3 md:py-3 hover:bg-zinc-900 transition-all font-bold uppercase tracking-wider hover:-translate-y-1 duration-300 relative z-10">
              <span>View Research Peptides</span>
              <div className="bg-cream text-black rounded-full p-3 md:p-4 group-hover:bg-primary transition-colors">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:-rotate-45 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content inside the card */}
        <div className="relative z-20 flex flex-col items-start justify-center text-left px-5 sm:px-12 md:px-24 w-full h-full max-w-6xl pb-32 pt-20 md:pb-24 md:pt-10 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="font-heading text-[10vw] sm:text-5xl md:text-[75px] lg:text-[90px] xl:text-[100px] leading-[0.95] md:leading-[0.9] text-white tracking-tighter uppercase font-black drop-shadow-2xl max-w-4xl mb-4 md:mb-6">
              THE FUTURE<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">OF PEPTIDE</span><br/>
              SCIENCE.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-xs sm:text-sm md:text-lg max-w-[260px] sm:max-w-md font-medium leading-relaxed tracking-wide drop-shadow-md border-l-2 border-primary pl-4 md:pl-5"
          >
            Precision-engineered peptides for researchers demanding the highest standards of purity and performance.
          </motion.p>
        </div>

        {/* --- Right Side Marquee Cutout --- */}
        <div className="absolute bottom-[20%] sm:bottom-24 md:bottom-32 right-0 bg-cream rounded-l-[3rem] md:rounded-l-[4rem] z-30 flex items-center w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] h-12 sm:h-16 md:h-20">
          {/* Top Fillet (Inverted Corner) */}
          <div 
            className="absolute -top-[calc(3rem-1px)] right-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
          />
          {/* Bottom Fillet (Inverted Corner) */}
          <div 
            className="absolute -bottom-[calc(3rem-1px)] right-0 w-12 h-12 md:-bottom-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0h100v100A100 100 0 0 0 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
          />
          
          {/* Inner masking container */}
          <div className="w-full h-full relative overflow-hidden rounded-l-[3rem] md:rounded-l-[4rem] flex items-center">
            {/* Gradient mask for smooth fade in/out of marquee */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              className="flex whitespace-nowrap items-center text-zinc-900 font-extrabold tracking-[0.25em] text-[10px] sm:text-xs md:text-sm w-max pointer-events-none"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            >
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="flex items-center">
                   <span className="flex items-center mx-4 md:mx-6">
                     <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     99.1% PURITY
                   </span>
                   <span className="flex items-center mx-4 md:mx-6">
                     <FlaskConical className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     LAB TESTED
                   </span>
                   <span className="flex items-center mx-4 md:mx-6">
                     <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                     USA MADE
                   </span>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}
