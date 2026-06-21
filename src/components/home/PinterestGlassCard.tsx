"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PinterestGlassCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag?: string;
  className?: string;
}

export function PinterestGlassCard({ title, description, icon, tag, className = '' }: PinterestGlassCardProps) {
  return (
    <div className={`relative w-full rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#003333]/95 to-[#001111]/95 border border-primary/20 p-6 sm:p-8 md:p-6 lg:p-8 overflow-visible group ${className}`}>
      
      {/* Premium Background Decor */}
      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden z-0 pointer-events-none">
        {/* Top Right Glow */}
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary/40 rounded-full blur-[80px] pointer-events-none" 
        />
        
        {/* Bottom Left Glow */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -left-10 w-56 h-56 bg-emerald-500/30 rounded-full blur-[64px]" 
        />
        
        {/* Precision Dot Pattern */}
        <motion.div 
          animate={{ x: [0, -24], y: [0, -24] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[24px] -left-[24px] w-[calc(100%+48px)] h-[calc(100%+48px)] opacity-[0.12]" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        {/* Fine Noise Texture for Frosted Glass feel */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Diagonal Glass Sheen */}
        <motion.div 
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
          className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/[0.25] to-transparent skew-x-[-45deg]" 
        />
        
        {/* Inner Glass Highlight */}
        <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] ring-1 ring-inset ring-white/5" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
        className="relative z-20 pl-6 sm:pl-10 md:pl-6 lg:pl-10 pr-2 sm:pr-4 md:pr-2 lg:pr-4 pb-16 sm:pb-6 md:pb-16 lg:pb-6"
      >
        <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl font-heading font-bold text-white mb-2 sm:mb-3 md:mb-2 lg:mb-3 leading-tight">{title}</h3>
        <p className="text-white/70 text-xs sm:text-sm md:text-xs lg:text-sm leading-relaxed font-medium pl-2 sm:pl-4 md:pl-2 lg:pl-4">
          {description}
        </p>
      </motion.div>

      {/* 
        FAKE CUTOUTS (Cream Solid Overlays)
        These perfectly match the `bg-cream` section background, creating 
        the illusion of flawless transparent cutouts in the glass card.
      */}

      {/* 1. Left Edge Cutout */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-[2px] w-12 h-20 sm:w-16 sm:h-24 md:w-12 md:h-20 lg:w-16 lg:h-24 bg-cream rounded-r-[1.5rem] sm:rounded-r-[2rem] flex items-center justify-center z-30">
        {/* Top Fillet (Bottom-Left Cream) */}
        <div 
          className="absolute -top-[1.25rem] sm:-top-[1.5rem] left-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 V 100 H 100 A 100 100 0 0 1 0 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }} 
        />
        {/* Bottom Fillet (Top-Left Cream) */}
        <div 
          className="absolute -bottom-[1.25rem] sm:-bottom-[1.5rem] left-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 H 0 V 100 A 100 100 0 0 1 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Floating Action Button (Vertical Pill style) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-8 h-14 sm:w-10 sm:h-16 md:w-8 md:h-14 lg:w-10 lg:h-16 bg-[#002222] border border-primary/30 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 -ml-1 sm:-ml-2"
        >
          {icon}
        </motion.div>
      </div>

      {/* 2. Bottom Right Edge Cutout */}
      <div className="absolute -bottom-[2px] -right-[2px] w-fit h-12 sm:h-16 md:h-12 lg:h-16 pl-4 sm:pl-6 md:pl-4 lg:pl-6 pr-2 sm:pr-3 md:pr-2 lg:pr-3 bg-cream rounded-tl-[1.5rem] sm:rounded-tl-[2rem] rounded-br-[2rem] sm:rounded-br-[2.5rem] flex items-center justify-center z-30">
        {/* Top Fillet (Bottom-Right Cream) */}
        <div 
          className="absolute -top-[1.25rem] sm:-top-[1.5rem] right-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }} 
        />
        {/* Left Fillet (Bottom-Right Cream) */}
        <div 
          className="absolute bottom-0 -left-[1.25rem] sm:-left-[1.5rem] w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Pill (Dynamic fit) */}
        <motion.div 
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.6 }}
          viewport={{ once: true }}
          className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-4 md:py-2 lg:px-6 lg:py-2.5 bg-[#002222] border border-primary/30 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap relative z-10"
        >
          {tag || 'Verified'}
        </motion.div>
      </div>

    </div>
  );
}
