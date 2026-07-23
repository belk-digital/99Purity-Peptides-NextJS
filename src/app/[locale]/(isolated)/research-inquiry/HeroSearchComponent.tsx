'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { SearchOverlay } from '@/components/shared/SearchOverlay'

export function HeroSearchComponent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div 
        className="w-full max-w-xl mx-auto mt-6 mb-2 cursor-pointer group" 
        onClick={() => setIsSearchOpen(true)}
      >
        <div className="flex items-center w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-full h-12 md:h-14 px-6 hover:bg-black/60 transition-colors shadow-xl">
          <Search className="w-5 h-5 text-white/70 mr-4 group-hover:text-primary transition-colors" />
          <span className="text-white/50 font-medium text-sm md:text-base">Search for research compounds...</span>
          <div className="ml-auto hidden sm:flex items-center gap-1">
            <kbd className="bg-white/10 border border-white/10 rounded px-2 py-0.5 text-xs text-white/50 font-mono tracking-widest shadow-sm">CTRL+K</kbd>
          </div>
        </div>
      </div>
      
      {/* Global Search Overlay imported from main site - Portaled to avoid z-index stacking issues */}
      {mounted && typeof document !== 'undefined' && (
        require('react-dom').createPortal(
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />,
          document.body
        )
      )}
    </>
  )
}
