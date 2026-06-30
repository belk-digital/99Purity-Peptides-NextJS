'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tab } from './ProductTabs'

interface ProductDetailTabsProps {
  tabs: Tab[]
}

export function ProductDetailTabs({ tabs }: ProductDetailTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id || '')
  const stripRef = useRef<HTMLDivElement>(null)

  if (!tabs || tabs.length === 0) return null

  const active = tabs.find(t => t.id === activeId) || tabs[0]

  const handleTabClick = (id: string) => {
    setActiveId(id)
    const btn = stripRef.current?.querySelector(`[data-tab="${id}"]`) as HTMLElement
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="w-full flex flex-col items-center mx-auto">
      {/* Floating Pill Tab Strip */}
      <div className="w-full flex justify-center mb-8 lg:mb-12 px-4 sm:px-0">
        <div className="w-full lg:w-max lg:max-w-full overflow-x-auto scrollbar-none rounded-2xl lg:rounded-full">
          <div
            ref={stripRef}
            className="grid grid-cols-2 lg:inline-flex gap-1.5 lg:gap-0 p-1.5 bg-black/[0.04] rounded-2xl lg:rounded-full border border-black/[0.06] shadow-inner w-full lg:w-max"
          >
          {tabs.map((tab) => {
            const isActive = activeId === tab.id
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "relative shrink-0 px-2 sm:px-4 lg:px-8 py-3 lg:py-3.5 text-[9px] sm:text-[10px] lg:text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 focus:outline-none rounded-xl lg:rounded-full text-center flex items-center justify-center min-h-[52px] lg:min-h-0",
                  isActive ? "text-black" : "text-black/40 hover:text-black/70"
                )}
              >
                <span className="relative z-10">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-tab-pill"
                    className="absolute inset-0 bg-white rounded-xl lg:rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-black/[0.04]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>

      {/* Content Container */}
      <div className="w-full max-w-[1200px] mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-[0_8px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.25, 0, 0.1, 1] }}
            className="px-6 py-10 lg:px-16 lg:py-16"
          >
            {typeof active?.content === 'string' ? (
              <div
                className="text-black/60 leading-[1.8] text-[15px] lg:text-[16px] prose prose-lg max-w-none prose-headings:text-black prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-black prose-a:underline-offset-4 prose-strong:text-black prose-li:text-black/60"
                dangerouslySetInnerHTML={{ __html: active.content }}
              />
            ) : (
              <div className="text-black/60 leading-[1.8] text-[15px] lg:text-[16px]">
                {active?.content}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
