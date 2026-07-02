'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeUp } from '@/components/motion/FadeUp'
import { Info, FlaskConical } from 'lucide-react'

type System = 'imperial' | 'metric';
type Gender = 'male' | 'female';

export function CreatinineClearance() {
  const t = useTranslations('calculator.creatinineClearance')
  const [system, setSystem] = useState<System>('imperial');
  const [gender, setGender] = useState<Gender>('male');
  
  const [age, setAge] = useState('50');
  const [lbs, setLbs] = useState('170');
  const [kg, setKg] = useState('77');
  const [creatinine, setCreatinine] = useState('1.2');

  const handleSystemChange = (newSystem: System) => {
    if (newSystem === system) return;
    
    if (newSystem === 'metric') {
      const wKg = (parseFloat(lbs) || 0) / 2.20462;
      setKg(wKg.toFixed(1));
    } else {
      const wKg = parseFloat(kg) || 0;
      const wLbs = wKg * 2.20462;
      setLbs(Math.round(wLbs).toString());
    }
    
    setSystem(newSystem);
  }

  let weightKg = 0;
  if (system === 'imperial') {
    weightKg = (parseFloat(lbs) || 0) / 2.20462;
  } else {
    weightKg = parseFloat(kg) || 0;
  }

  const parsedAge = parseInt(age) || 0;
  const parsedCreatinine = parseFloat(creatinine) || 0;

  let crcl = 0;
  let category = '—';
  let categoryColor = 'text-white/40';

  if (parsedAge > 0 && weightKg > 0 && parsedCreatinine > 0) {
    // Cockcroft-Gault Formula
    crcl = ((140 - parsedAge) * weightKg) / (72 * parsedCreatinine);
    if (gender === 'female') {
      crcl *= 0.85;
    }

    if (crcl > 90) { category = t('categoryNormalOrHigh'); categoryColor = 'text-primary'; }
    else if (crcl >= 60) { category = t('categoryMildlyDecreased'); categoryColor = 'text-yellow-400'; }
    else if (crcl >= 45) { category = t('categoryMildToModerateDecrease'); categoryColor = 'text-orange-400'; }
    else if (crcl >= 30) { category = t('categoryModerateToSevereDecrease'); categoryColor = 'text-orange-500'; }
    else if (crcl >= 15) { category = t('categorySeverelyDecreased'); categoryColor = 'text-red-400'; }
    else { category = t('categoryKidneyFailure'); categoryColor = 'text-red-600'; }
  }

  const isValid = crcl > 0;
  
  // For the radial dial
  const maxCrCl = 150;
  const crclPercentage = isValid ? Math.min(Math.max((crcl / maxCrCl) * 100, 0), 100) : 0;
  const strokeDasharray = 283; // 2 * pi * r (r=45)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * crclPercentage) / 100;

  return (
    <section className="w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 p-6 sm:p-8 md:p-12 border border-white/10 relative shadow-2xl">
      
      {/* Subtle Background Effects */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] mix-blend-overlay z-0">
        <filter id="noiseDashboard4">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseDashboard4)" />
      </svg>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <FadeUp className="mb-10 text-center md:text-left relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tighter leading-none mb-3">
            {t('titleCreatinine')} <span className="text-white/40 font-light">{t('titleClearance')}</span>
          </h1>
          <p className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
            <Info className="w-4 h-4 shrink-0" /> {t('renalFunctionDashboard')}
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Dashboard Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          
          {/* Top Readout Cards */}
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <FadeUp delay={0.1} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                   <FlaskConical className="w-4 h-4 text-blue-500" />
                 </div>
                 <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em]">{t('estimatedCrCl')}</p>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                 <div className="flex items-baseline gap-2">
                   <p className="text-5xl md:text-7xl font-display tracking-tighter text-white">
                     {isValid ? crcl.toFixed(1) : '—'}
                   </p>
                   <span className="text-lg md:text-2xl font-display text-white/30 uppercase">mL/min</span>
                 </div>
                 {isValid && <span className={`text-sm md:text-base font-medium ${categoryColor}`}>{category}</span>}
               </div>
            </FadeUp>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Toggles */}
            <FadeUp delay={0.2} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-3">{t('measurementSystem')}</label>
                <div className="flex bg-white/5 p-1 rounded-2xl w-full border border-white/5 relative">
                  {(['imperial', 'metric'] as System[]).map((opt) => (
                    <button
                      key={opt} onClick={() => handleSystemChange(opt)}
                      className={`flex-1 relative py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${system === opt ? 'text-zinc-900' : 'text-white/40 hover:text-white'}`}
                    >
                      {system === opt && <motion.div layoutId="crclSystemToggle" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{opt === 'imperial' ? t('systemImperial') : t('systemMetric')}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-3">{t('biologicalSex')}</label>
                <div className="flex bg-white/5 p-1 rounded-2xl w-full border border-white/5 relative">
                  {(['male', 'female'] as Gender[]).map((opt) => (
                    <button
                      key={opt} onClick={() => setGender(opt)}
                      className={`flex-1 relative py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${gender === opt ? 'text-zinc-900' : 'text-white/40 hover:text-white'}`}
                    >
                      {gender === opt && <motion.div layoutId="crclGenderToggle" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{opt === 'male' ? t('genderMale') : t('genderFemale')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Age */}
            <FadeUp delay={0.3} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('ageYears')}</label>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <input 
                    type="number" min="1" step="1" value={age} onChange={e => setAge(e.target.value)}
                    className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAge(prev => Math.max(1, (parseInt(prev) || 0) - 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => setAge(prev => ((parseInt(prev) || 0) + 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>

            {/* Weight */}
            <FadeUp delay={0.4} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('weight')}</label>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  {system === 'imperial' ? (
                    <>
                      <input type="number" value={lbs} onChange={e => setLbs(e.target.value)} className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <span className="text-2xl font-display text-white/30">LBS</span>
                    </>
                  ) : (
                    <>
                      <input type="number" value={kg} onChange={e => setKg(e.target.value)} className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <span className="text-2xl font-display text-white/30">KG</span>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => system === 'imperial' ? setLbs(prev => Math.max(1, (parseInt(prev) || 0) - 1).toString()) : setKg(prev => Math.max(1, (parseInt(prev) || 0) - 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => system === 'imperial' ? setLbs(prev => ((parseInt(prev) || 0) + 1).toString()) : setKg(prev => ((parseInt(prev) || 0) + 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>

            {/* Creatinine */}
            <FadeUp delay={0.5} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('serumCreatinine')}</label>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <input 
                    type="number" min="0" step="0.1" value={creatinine} onChange={e => setCreatinine(e.target.value)}
                    className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    placeholder="1.0"
                  />
                  <span className="text-xl font-display text-white/30 uppercase">MG/DL</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCreatinine(prev => Math.max(0.1, (parseFloat(prev) || 0) - 0.1).toFixed(1))} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => setCreatinine(prev => ((parseFloat(prev) || 0) + 0.1).toFixed(1))} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>
            
          </div>
        </div>

        {/* Right Panel: Visualization Dashboard */}
        <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden p-8 min-h-[400px]">
          
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Radial Gauge */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center z-10 mb-8 mt-4">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            </svg>
            
            {/* Animated Fill */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" viewBox="0 0 100 100">
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke={crcl >= 90 ? '#4ade80' : crcl >= 60 ? '#facc15' : crcl >= 30 ? '#f97316' : '#ef4444'} 
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: strokeDasharray }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
              />
            </svg>

            <div className="text-center px-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">{t('status')}</p>
              <p className={`text-xl sm:text-2xl font-display tracking-tight leading-none ${categoryColor}`}>{isValid ? category : t('ready')}</p>
            </div>
          </div>

          <FadeUp delay={0.4} className="bg-zinc-950/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 mt-auto w-full">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">{t('aboutCockcroftGault')}</h4>
            <p className="text-[10px] font-medium text-white/50 leading-relaxed uppercase tracking-wider">
              {t('cockcroftGaultDescription')}
            </p>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
