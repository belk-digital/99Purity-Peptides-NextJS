'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { PeptideReconstitution } from './PeptideReconstitution'
import { BmiBmrCalculator } from './BmiBmrCalculator'
import { UnitConverter } from './UnitConverter'
import { CreatinineClearance } from './CreatinineClearance'
import { FadeUp } from '@/components/motion/FadeUp'
import { Syringe, Scale, ArrowRightLeft, FlaskConical } from 'lucide-react'

type CalculatorTab = 'reconstitution' | 'bmi' | 'unit' | 'creatinine';

export function CalculatorsHub() {
  const t = useTranslations('calculator.hub')
  const [activeTab, setActiveTab] = useState<CalculatorTab>('reconstitution');

  const TABS: { id: CalculatorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'reconstitution', label: t('tabReconstitution'), icon: <Syringe className="w-4 h-4" /> },
    { id: 'bmi', label: t('tabBmiBmr'), icon: <Scale className="w-4 h-4" /> },
    { id: 'unit', label: t('tabUnitConverter'), icon: <ArrowRightLeft className="w-4 h-4" /> },
    { id: 'creatinine', label: t('tabCreatinineClearance'), icon: <FlaskConical className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full flex flex-col items-center pt-20 lg:pt-32 pb-16 lg:pb-24 relative z-10 px-4 sm:px-6">
      
      <FadeUp className="w-full max-w-5xl mx-auto mb-10 lg:mb-16 flex justify-center">
        {/* Navigation Tabs - Floating Island Design */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 bg-zinc-950/90 backdrop-blur-3xl rounded-[2rem] sm:rounded-full border border-white/10 shadow-lg relative group transition-all duration-700 hover:shadow-xl hover:border-white/20 z-20">
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-[2rem] sm:rounded-full pointer-events-none" />
          
          {/* Ambient outer glow on hover - Toned down significantly */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gold/5 to-primary/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -z-10 rounded-full" />

          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-[1.5rem] sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-500 overflow-hidden ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5 hover:scale-105'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-primary via-[#95C2B4] to-primary rounded-[1.5rem] sm:rounded-full -z-10 bg-[length:200%_auto] animate-gradient shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Icon Container with pop effect */}
                <div className={`relative z-10 shrink-0 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 text-white' : ''}`}>
                  {tab.icon}
                </div>
                
                {/* Label with slide effect */}
                <span className={`relative z-10 hidden md:inline-block transition-transform duration-500 ${isActive ? 'translate-x-1' : ''}`}>
                  {tab.label}
                </span>
                
                {/* Active dot indicator for mobile instead of full text */}
                {isActive && <div className="md:hidden w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            )
          })}
        </div>
      </FadeUp>

      {/* Calculator Content Area */}
      <div className="w-full max-w-[1400px] mx-auto min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {activeTab === 'reconstitution' && (
            <motion.div
              key="reconstitution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PeptideReconstitution />
            </motion.div>
          )}
          {activeTab === 'bmi' && (
            <motion.div
              key="bmi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BmiBmrCalculator />
            </motion.div>
          )}
          {activeTab === 'unit' && (
            <motion.div
              key="unit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UnitConverter />
            </motion.div>
          )}
          {activeTab === 'creatinine' && (
            <motion.div
              key="creatinine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CreatinineClearance />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
