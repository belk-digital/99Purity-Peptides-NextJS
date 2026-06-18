'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useLenis } from 'lenis/react'

export function CustomScrollbar() {
  const { scrollYProgress } = useScroll()
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  
  // Use Lenis to integrate perfectly with the site's global smooth scrolling
  const lenis = useLenis()

  // Handle clicking on the track to jump to a specific point
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const percentage = clickY / rect.height
    
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    if (lenis) {
      lenis.scrollTo(scrollableHeight * percentage, { lerp: 0.05 })
    } else {
      window.scrollTo({ top: scrollableHeight * percentage, behavior: 'smooth' })
    }
  }

  // Handle dragging the thumb
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    document.body.style.userSelect = 'none' // Prevent text highlighting while dragging
    
    // Use window events so drag continues even if mouse leaves the scrollbar area
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return
    
    const rect = trackRef.current.getBoundingClientRect()
    // Calculate new position
    let y = e.clientY - rect.top
    // Clamp to track bounds
    y = Math.max(0, Math.min(y, rect.height))
    const percentage = y / rect.height
    
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (lenis) {
      // Feed the target to Lenis to allow smooth interpolation (lerp) of the page scroll
      lenis.scrollTo(scrollableHeight * percentage, { immediate: false, lerp: 0.1 })
    } else {
      window.scrollTo({ top: scrollableHeight * percentage, behavior: 'auto' })
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
    document.body.style.userSelect = ''
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  return (
    <div className="fixed top-0 bottom-0 right-0 py-12 w-8 pointer-events-none z-[9999] hidden sm:flex justify-end">
      
      {/* Interactive Track Area */}
      <div 
        ref={trackRef}
        className="relative h-full w-8 pointer-events-auto cursor-pointer flex justify-center group"
        onClick={handleTrackClick}
      >
        {/* Subtle Line Track */}
        <div className="w-[1px] h-full bg-white/5 transition-colors group-hover:bg-white/10" />
        
        {/* Glowing Tracker Node */}
        <motion.div 
          className="absolute right-[11px] pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ 
            top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            translateY: "-50%"
          }}
          onPointerDown={handlePointerDown}
        >
          {/* Expanded hit area for easier dragging */}
          <div className="absolute inset-[-16px] bg-transparent" />
          
          {/* The Diamond shape */}
          <div className="relative w-3 h-3 bg-[#008B8B] rotate-45 border border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.8)] flex items-center justify-center">
            <div className="w-1 h-1 bg-white" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
