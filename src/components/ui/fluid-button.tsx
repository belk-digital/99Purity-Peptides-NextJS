'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FluidButtonProps {
  href: string;
  text: string;
  className?: string;
  variant?: "dark" | "cyan" | "white";
}

export function FluidButton({ href, text, className = "", variant = "dark" }: FluidButtonProps) {
  const filterId = React.useId().replace(/:/g, ""); // Ensure valid ID string
  const isCyan = variant === "cyan";
  const isWhite = variant === "white";
  
  const baseBgClasses = isCyan 
    ? "bg-primary group-hover:bg-[#007a7a]" 
    : isWhite
      ? "bg-white group-hover:bg-[#f5f5f5]"
      : "bg-[#111] group-hover:bg-black";
    
  const innerCircleClasses = isCyan
    ? "bg-[#007a7a] group-hover:bg-black"
    : isWhite
      ? "bg-[#f0f0f0] group-hover:bg-primary"
      : "bg-[#333] group-hover:bg-primary";
      
  const textColorClasses = isWhite 
    ? "text-ink" 
    : "text-white";

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
            Right offset = 30px (outer padding) + circle width (44px/72px)
          */}
          <div className={`absolute left-[30px] right-[calc(30px+44px)] md:right-[calc(30px+72px)] top-[30px] bottom-[30px] rounded-full transition-colors duration-500 ${baseBgClasses}`} />
          
          {/* Right Circle */}
          <div className={`absolute right-[30px] top-[30px] bottom-[30px] w-[44px] h-[44px] md:w-[72px] md:h-[72px] rounded-full transition-colors duration-500 ${baseBgClasses}`} />
        </div>
      </div>

      {/* Content Layer (Crisp, no shadows) */}
      <div className="relative z-10 flex items-center justify-between w-full h-[44px] md:h-[72px]">
        {/* Text Area */}
        <div className="pl-6 pr-4 md:pl-10 md:pr-8 py-2 md:py-4 h-full flex items-center justify-center">
          <span className={`${textColorClasses} font-heading font-bold text-[10px] sm:text-[11px] md:text-sm tracking-[0.15em] uppercase relative top-[1px]`}>
            {text}
          </span>
        </div>

        {/* Right Circle Area */}
        <div className="relative flex items-center justify-center w-[44px] h-[44px] md:w-[72px] md:h-[72px] shrink-0">
          
          {/* Subtle inner circle for physical definition, but NO SHADOWS as requested */}
          <div className={`absolute inset-1.5 md:inset-2.5 rounded-full transition-colors duration-500 ${innerCircleClasses}`} />
          
          {/* Icon */}
          <ArrowRight className={`w-3.5 h-3.5 md:w-6 md:h-6 relative z-10 group-hover:-rotate-45 transition-colors transition-transform duration-300 ease-in-out ${isWhite ? "text-ink group-hover:text-white" : "text-white"}`} strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  );
}
