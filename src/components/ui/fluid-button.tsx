'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FluidButtonProps {
  href: string;
  text: string;
  className?: string;
}

export function FluidButton({ href, text, className = "" }: FluidButtonProps) {
  const filterId = React.useId().replace(/:/g, ""); // Ensure valid ID string

  return (
    <Link href={href} className={`relative inline-flex items-center group w-fit ${className}`}>
      
      {/* SVG Gooey Filter Definition */}
      <svg className="absolute w-0 h-0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={`gooey-black-${filterId}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 20 -8" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Shapes layer - No shadows! */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Negative inset to prevent filter clipping */}
        <div 
          className="absolute inset-[-30px]" 
          style={{ filter: `url(#gooey-black-${filterId})` }}
        >
          {/* 
            Left Pill 
            We set the gap to EXACTLY 0px (right edge touches the circle's left edge).
            This creates the deepest possible 'U' shaped fluid neck without pinching!
            Right offset = 30px (outer padding) + circle width (64px/72px)
          */}
          <div className="absolute left-[30px] right-[calc(30px+64px)] md:right-[calc(30px+72px)] top-[30px] bottom-[30px] bg-[#111] rounded-full transition-colors duration-500 group-hover:bg-black" />
          
          {/* Right Circle */}
          <div className="absolute right-[30px] top-[30px] bottom-[30px] w-[64px] h-[64px] md:w-[72px] md:h-[72px] bg-[#111] rounded-full transition-colors duration-500 group-hover:bg-black" />
        </div>
      </div>

      {/* Content Layer (Crisp, no shadows) */}
      <div className="relative z-10 flex items-center justify-between w-full h-[64px] md:h-[72px]">
        {/* Text Area */}
        <div className="pl-8 pr-6 md:pl-10 md:pr-8 py-4 h-full flex items-center justify-center">
          <span className="text-white font-heading font-bold text-xs md:text-sm tracking-[0.15em] uppercase relative top-[1px]">
            {text}
          </span>
        </div>

        {/* Right Circle Area */}
        <div className="relative flex items-center justify-center w-[64px] h-[64px] md:w-[72px] md:h-[72px] shrink-0">
          
          {/* Subtle inner circle for physical definition, but NO SHADOWS as requested */}
          <div className="absolute inset-2 md:inset-2.5 rounded-full bg-[#1c1c1c] group-hover:bg-[#252525] transition-colors duration-500" />
          
          {/* Icon */}
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  );
}
