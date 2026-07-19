"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface PinterestGlassCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  tag?: string;
  microcopy?: string;
  className?: string;
  iconPosition?: 'left' | 'top-left' | 'none';
  index?: number;
  scrollFanning?: boolean;
  theme?: 'cream' | 'black';
}

export function PinterestGlassCard({ title, description, icon, tag, microcopy, className = '', iconPosition = 'left', index = 0, scrollFanning = false, theme = 'cream' }: PinterestGlassCardProps) {
  const t = useTranslations('home.pinterestGlassCard')
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Magnetic scroll effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 5%", "start -30%"]
  });

  // Buttery smooth spring for that magnetic pull
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.2
  });
  
  // To prevent overlapping in horizontal rows, all Pinterest cards move straight up
  const xOffset = 0;
  const yOffset = scrollFanning ? -250 : 0; 
  
  // Apply buttery smooth progress
  const x = useTransform(smoothProgress, [0, 1], [0, xOffset]);
  const y = useTransform(smoothProgress, [0, 1], [0, yOffset]);
  const opacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 1, scrollFanning ? 0 : 1]);

  const cutoutBg = theme === 'black' ? 'bg-black' : 'bg-cream';
  const cutoutHex = theme === 'black' ? '%23000000' : '%23FAF7F2';

  return (
    <motion.div 
      ref={cardRef}
      style={{ x, y, opacity }}
      className={`relative w-full rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#003333]/95 to-[#001111]/95 border border-primary/20 p-6 sm:p-8 md:p-6 lg:p-8 overflow-visible group will-change-transform ${className}`}
    >
      
      {/* Premium Background Decor (Optimized for Mobile) */}
      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden z-0 pointer-events-none">
        {/* Top Right Glow (Static for performance) */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(0,183,168,0.3),transparent)] rounded-full pointer-events-none"
        />
        
        {/* Bottom Left Glow (Static for performance) */}
        <div 
          className="absolute -bottom-24 -left-10 w-56 h-56 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent)] rounded-full pointer-events-none"
        />
        
        {/* Precision Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        {/* Diagonal Glass Sheen */}
        <motion.div 
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
          className="absolute inset-0 w-[150%] bg-gradient-to-r from-transparent via-white/[0.25] to-transparent skew-x-[-45deg] pointer-events-none transform-gpu"
          style={{ willChange: "transform" }}
        />
        
        {/* Inner Glass Highlight */}
        <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] ring-1 ring-inset ring-white/5" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className={`relative z-20 pr-4 sm:pr-8 md:pr-4 lg:pr-6 pb-20 sm:pb-24 md:pb-24 lg:pb-20 ${
          iconPosition === 'top-left' 
            ? 'pl-20 sm:pl-28 md:pl-24 lg:pl-28 pt-2 sm:pt-4' // Extra space for top-left cutout
            : iconPosition === 'left'
            ? 'pl-10 sm:pl-14 md:pl-10 lg:pl-14' // Tighter spacing for the left cutout to give text more room
            : ''
        }`}
      >
        <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl font-heading font-bold text-white mb-3 leading-tight">{title}</h3>
        <p className="text-white/80 text-xs sm:text-sm md:text-xs lg:text-sm leading-relaxed font-medium">
          {description}
        </p>
        {microcopy && (
          <div className="mt-6 sm:mt-8">
            <p className="text-primary font-extrabold tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs uppercase drop-shadow-[0_0_12px_rgba(0,255,255,0.4)] break-words">
              {microcopy}
            </p>
          </div>
        )}
      </motion.div>

      {/* 
        FAKE CUTOUTS (Solid Overlays)
      */}

      {/* Optional Top-Left Corner Cutout */}
      {iconPosition === 'top-left' && (
        <div className={`absolute -top-[2px] -left-[2px] w-fit h-fit pr-4 sm:pr-6 md:pr-4 lg:pr-6 pb-4 sm:pb-6 md:pb-4 lg:pb-6 pl-4 sm:pl-6 md:pl-4 lg:pl-6 pt-4 sm:pt-6 md:pt-4 lg:pt-6 ${cutoutBg} rounded-br-[1.5rem] sm:rounded-br-[2rem] rounded-tl-[2rem] sm:rounded-tl-[2.5rem] flex items-center justify-center z-30`}>
          {/* Right Fillet (Top-Left) */}
          <div 
            className="absolute top-0 -right-[1.25rem] sm:-right-[1.5rem] w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 100 V 0 H 100 A 100 100 0 0 0 0 100 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
          />
          {/* Bottom Fillet (Top-Left) */}
          <div 
            className="absolute -bottom-[1.25rem] sm:-bottom-[1.5rem] left-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 100 V 0 H 100 A 100 100 0 0 0 0 100 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
          />
          
          {/* Floating Action Button */}
          {icon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#002222] border border-primary/30 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10"
            >
              {icon}
            </motion.div>
          )}
        </div>
      )}

      {/* Default Left Edge Cutout */}
      {iconPosition === 'left' && (
        <div className={`absolute top-1/2 -translate-y-1/2 -left-[2px] w-12 h-20 sm:w-16 sm:h-24 md:w-12 md:h-20 lg:w-16 lg:h-24 ${cutoutBg} rounded-r-[1.5rem] sm:rounded-r-[2rem] flex items-center justify-center z-30`}>
          {/* Top Fillet (Bottom-Left) */}
          <div 
            className="absolute -top-[1.25rem] sm:-top-[1.5rem] left-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 V 100 H 100 A 100 100 0 0 1 0 0 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
          />
          {/* Bottom Fillet (Top-Left) */}
          <div 
            className="absolute -bottom-[1.25rem] sm:-bottom-[1.5rem] left-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 H 0 V 100 A 100 100 0 0 1 100 0 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
          />
          
          {/* Floating Action Button */}
          {icon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-8 h-14 sm:w-10 sm:h-16 md:w-8 md:h-14 lg:w-10 lg:h-16 bg-[#002222] border border-primary/30 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 -ml-1 sm:-ml-2"
            >
              {icon}
            </motion.div>
          )}
        </div>
      )}

      {/* Bottom Right Edge Cutout */}
      <div className={`absolute -bottom-[2px] -right-[2px] w-fit h-12 sm:h-16 md:h-12 lg:h-16 pl-4 sm:pl-6 md:pl-4 lg:pl-6 pr-2 sm:pr-3 md:pr-2 lg:pr-3 ${cutoutBg} rounded-tl-[1.5rem] sm:rounded-tl-[2rem] rounded-br-[2rem] sm:rounded-br-[2.5rem] flex items-center justify-center z-30`}>
        {/* Top Fillet */}
        <div 
          className="absolute -top-[1.25rem] sm:-top-[1.5rem] right-0 w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
        />
        {/* Left Fillet */}
        <div 
          className="absolute bottom-0 -left-[1.25rem] sm:-left-[1.5rem] w-5 h-5 sm:w-6 sm:h-6 bg-contain bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='${cutoutHex}'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Pill (Dynamic fit) */}
        {(tag || t('defaultTag')) && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.6 }}
            viewport={{ once: true }}
            className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-4 md:py-2 lg:px-6 lg:py-2.5 bg-[#002222] border border-primary/30 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap relative z-10"
          >
            {tag || t('defaultTag')}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
