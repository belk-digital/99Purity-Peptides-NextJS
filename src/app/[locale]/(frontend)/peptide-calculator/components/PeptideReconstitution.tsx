'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeUp } from '@/components/motion/FadeUp'
import { Info, ShieldCheck } from 'lucide-react'

type SyringeVolume = 0.3 | 0.5 | 1.0;
type MassUnit = 'mg' | 'mcg';

export function PeptideReconstitution() {
  const t = useTranslations('calculator.peptideReconstitution')
  // --- State ---
  const [peptideAmount, setPeptideAmount] = useState('5')
  const [waterMl, setWaterMl] = useState('2')
  const [desiredDose, setDesiredDose] = useState('250')
  const [doseUnit, setDoseUnit] = useState<MassUnit>('mcg')
  const [syringeVolume, setSyringeVolume] = useState<SyringeVolume>(1.0)

  // --- Math Logic ---
  const vAmt = parseFloat(peptideAmount) || 0
  const wMl = parseFloat(waterMl) || 0
  const dAmt = parseFloat(desiredDose) || 0

  const totalPeptideMcg = vAmt * 1000
  const targetDoseMcg = doseUnit === 'mg' ? dAmt * 1000 : dAmt

  let isValid = totalPeptideMcg > 0 && wMl > 0 && targetDoseMcg > 0
  let concentrationStr = '—'
  let volumePerDoseStr = '—'
  let tickMarksStr = '0'
  let errorMsg = ''
  
  let fillPercentage = 0
  const maxUnits = syringeVolume * 100

  if (isValid) {
    const concentration = totalPeptideMcg / wMl
    concentrationStr = `${concentration.toLocaleString(undefined, { maximumFractionDigits: 1 })} mcg/ml`
    
    const volumePerDose = targetDoseMcg / concentration
    volumePerDoseStr = `${volumePerDose.toLocaleString(undefined, { maximumFractionDigits: 3 })} ml`
    
    const tickMarks = volumePerDose * 100
    tickMarksStr = tickMarks.toLocaleString(undefined, { maximumFractionDigits: 1 })
    
    if (volumePerDose > syringeVolume) {
      errorMsg = t('doseExceedsCapacity', { doseVolume: volumePerDose.toFixed(2), syringeVolume })
      tickMarksStr = 'ERR'
      fillPercentage = 100
    } else {
      fillPercentage = (tickMarks / maxUnits) * 100
    }
  }

  const getSyringeTicks = () => {
    const steps = syringeVolume === 1.0 ? 10 : 5;
    const ticks = [];
    for (let i = maxUnits; i >= 0; i -= steps) {
      ticks.push(i);
    }
    return ticks;
  }

  return (
    <section className="w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 p-6 sm:p-8 md:p-12 border border-white/10 relative shadow-2xl">
      
      {/* Subtle Background Effects */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] mix-blend-overlay z-0">
        <filter id="noiseDashboard">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseDashboard)" />
      </svg>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <FadeUp className="mb-10 text-center md:text-left relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tighter leading-none mb-3">
            {t('titlePeptide')} <span className="text-white/40 font-light">{t('titleReconstitution')}</span>
          </h1>
          <a
            href="#how-to-use"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold font-mono text-primary/80 hover:text-primary uppercase tracking-widest border-b border-primary/30 hover:border-primary pb-0.5 transition-colors"
          >
            <Info className="w-4 h-4 shrink-0" />
            {t('guideLink')}
          </a>
        </div>
        <button
          onClick={() => {
            setPeptideAmount('')
            setWaterMl('')
            setDesiredDose('')
            setSyringeVolume(1.0)
          }}
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/5 backdrop-blur-md"
        >
          {t('resetCalculator')}
        </button>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Dashboard Panel (Inputs & Readouts) */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          
          {/* Top Readout Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <FadeUp delay={0.1} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em] mb-2">{t('requiredDraw')}</p>
               <div className="flex items-baseline gap-2">
                 <p className={`text-4xl sm:text-5xl md:text-6xl font-display tracking-tighter ${errorMsg ? 'text-red-400' : 'text-primary'}`}>
                   {tickMarksStr}
                 </p>
                 <span className="text-lg md:text-xl font-display text-white/20 italic">IU</span>
               </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner">
               <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em] mb-2">{t('drawVolume')}</p>
               <p className="text-2xl sm:text-3xl font-display text-white tracking-tight">{volumePerDoseStr}</p>
            </FadeUp>
            
            <FadeUp delay={0.3} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner col-span-2 md:col-span-1">
               <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em] mb-2">{t('concentration')}</p>
               <p className="text-2xl sm:text-3xl font-display text-white tracking-tight">{concentrationStr}</p>
            </FadeUp>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
              <Info className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-[10px] sm:text-xs font-mono text-red-200 uppercase tracking-widest">{errorMsg}</p>
            </div>
          )}

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Syringe Capacity */}
            <FadeUp delay={0.4} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('syringeCapacity')}</label>
              <div className="flex flex-col gap-3">
                {[
                  {label: '0.3 ML / 30 IU', v: 0.3},
                  {label: '0.5 ML / 50 IU', v: 0.5},
                  {label: '1.0 ML / 100 IU', v: 1.0},
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setSyringeVolume(opt.v as SyringeVolume)}
                    className={`relative w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-between ${
                      syringeVolume === opt.v ? 'text-zinc-900 shadow-md scale-[1.02]' : 'text-white/40 hover:text-white bg-white/5 border border-white/5'
                    }`}
                  >
                    {syringeVolume === opt.v && (
                      <motion.div layoutId="syringeCapToggle" className="absolute inset-0 bg-white rounded-2xl -z-10" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                    {syringeVolume === opt.v && <div className="w-2 h-2 rounded-full bg-primary relative z-10" />}
                  </button>
                ))}
              </div>
            </FadeUp>

            {/* Peptide Amount */}
            <FadeUp delay={0.5} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('peptideInVial')}</label>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <input 
                    type="number" min="0" step="any" value={peptideAmount} onChange={e => setPeptideAmount(e.target.value)}
                    className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-2/3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <span className="text-2xl font-display text-white/30">MG</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPeptideAmount(prev => Math.max(0, (parseFloat(prev) || 0) - 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => setPeptideAmount(prev => ((parseFloat(prev) || 0) + 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>

            {/* Bac Water */}
            <FadeUp delay={0.6} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 w-2/3">{t('bacteriostaticWater')}</label>
                <div className="flex flex-col gap-1 w-1/3 items-end">
                  {['1', '2', '3'].map(ml => (
                    <button key={ml} onClick={() => setWaterMl(ml)} className="text-[9px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">+{ml}ML</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <input 
                    type="number" min="0" step="any" value={waterMl} onChange={e => setWaterMl(e.target.value)}
                    className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setWaterMl(prev => Math.max(0, (parseFloat(prev) || 0) - 0.5).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => setWaterMl(prev => ((parseFloat(prev) || 0) + 0.5).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>

            {/* Target Dose */}
            <FadeUp delay={0.7} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 w-1/2">{t('targetDose')}</label>
                <div className="flex bg-white/5 p-1 rounded-xl w-1/2 border border-white/5 relative">
                  {(['mg', 'mcg'] as MassUnit[]).map(unit => (
                    <button
                      key={unit}
                      onClick={() => setDoseUnit(unit)}
                      className={`flex-1 relative py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${doseUnit === unit ? 'text-zinc-900' : 'text-white/40 hover:text-white'}`}
                    >
                      {doseUnit === unit && <motion.div layoutId="targetUnitToggle" className="absolute inset-0 bg-white rounded-lg -z-10" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{unit}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <input 
                    type="number" min="0" step="any" value={desiredDose} onChange={e => setDesiredDose(e.target.value)}
                    className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-primary focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDesiredDose(prev => Math.max(0, (parseFloat(prev) || 0) - (doseUnit === 'mg' ? 1 : 50)).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => setDesiredDose(prev => ((parseFloat(prev) || 0) + (doseUnit === 'mg' ? 1 : 50)).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>
            
          </div>
        </div>

        {/* Right Panel: Hyper-Realistic Syringe Visualization */}
        <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden py-16 min-h-[500px]">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          {/* The Syringe Body */}
          <div className="relative h-[400px] w-20 flex justify-center z-10">
            <div className="w-16 h-full relative flex flex-col items-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              
              {/* External Tick Marks (Printed on Glass) */}
              <div className="absolute right-full mr-2 top-0 bottom-0 flex flex-col justify-between py-[4px] pointer-events-none text-right z-30">
                {getSyringeTicks().map((tick, i) => (
                  <span key={i} className={`text-[9px] font-mono leading-none tracking-tighter ${tick % (syringeVolume === 1.0 ? 20 : 10) === 0 ? 'text-white/80 font-bold' : 'text-transparent'}`}>
                    {tick}
                  </span>
                ))}
              </div>

              {/* Plunger Handle (Top) */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-3.5 bg-gradient-to-r from-zinc-300 via-white to-zinc-400 border-x border-zinc-500 z-0 origin-bottom flex justify-center shadow-[inset_0_0_5px_rgba(0,0,0,0.2)]"
                style={{ bottom: "100%" }}
                animate={{ height: `${100 - fillPercentage}%`, minHeight: '20px' }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              >
                {/* Thumb rest (Top Disc) */}
                <div className="absolute -top-3 w-12 h-3 bg-gradient-to-b from-zinc-200 to-zinc-400 rounded-full border border-zinc-500 shadow-[0_5px_10px_rgba(0,0,0,0.4)]" />
                {/* Plunger ridges */}
                <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(transparent,transparent_6px,rgba(0,0,0,0.1)_6px,rgba(0,0,0,0.1)_7px)]" />
              </motion.div>

              {/* Flanges (Finger grips on barrel) */}
              <div className="w-24 h-3 bg-gradient-to-b from-white/40 to-white/10 rounded-full absolute top-0 -translate-y-1/2 border border-white/30 backdrop-blur-md z-40 shadow-[0_5px_15px_rgba(0,0,0,0.5)]" />
              
              {/* Main Barrel (Glass Cylinder) */}
              <div className="w-full h-full border-x-[2px] border-t-[2px] border-white/20 relative bg-gradient-to-r from-white/5 via-transparent to-white/10 overflow-hidden flex flex-col justify-end backdrop-blur-[2px] z-20 rounded-t-md shadow-[inset_0_0_20px_rgba(255,255,255,0.05),_inset_10px_0_15px_rgba(0,0,0,0.2),_inset_-10px_0_15px_rgba(0,0,0,0.2)]">
                
                {/* Volumetric Cylindrical Reflection (Glass Specular) */}
                <div className="absolute left-[15%] top-0 bottom-0 w-[6px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-50 mix-blend-overlay blur-[1px]" />
                <div className="absolute right-[10%] top-0 bottom-0 w-[2px] bg-white/30 pointer-events-none z-50 mix-blend-overlay" />

                {/* Rubber Stopper (Highly Detailed) */}
                <motion.div 
                  className="absolute left-0 right-0 h-5 z-40 flex flex-col justify-between"
                  animate={{ bottom: `${fillPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                >
                  {/* Top Ridge */}
                  <div className="w-full h-[5px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-t-md shadow-[0_2px_5px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                  {/* Middle Gap */}
                  <div className="w-[92%] h-[3px] bg-[#111] mx-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
                  {/* Bottom Ridge */}
                  <div className="w-full h-[5px] bg-gradient-to-b from-[#1a1a1a] to-[#050505] rounded-b-md shadow-[0_4px_10px_rgba(0,0,0,0.9)]" />
                  {/* Cone Tip of rubber */}
                  <div className="absolute -bottom-1 left-[20%] w-[60%] h-2 bg-gradient-to-b from-[#050505] to-transparent rounded-b-full blur-[1px]" />
                </motion.div>
                
                {/* Liquid Substance */}
                <motion.div 
                  className={`w-full ${errorMsg ? 'bg-red-500/80' : 'bg-primary/80'} backdrop-blur-sm relative z-30`}
                  initial={{ height: 0 }}
                  animate={{ height: `${fillPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  style={{ originY: 1 }}
                >
                  {/* Volumetric shading in liquid */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 mix-blend-multiply" />
                  {/* Surface Meniscus Tension */}
                  <div className="absolute top-0 w-full h-[3px] bg-gradient-to-b from-white/40 to-transparent shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                  {/* Bubbles / Imperfections */}
                  <div className="absolute bottom-4 left-2 w-1 h-1 rounded-full bg-white/20 blur-[0.5px]" />
                  <div className="absolute bottom-10 right-3 w-1.5 h-1.5 rounded-full bg-white/20 blur-[1px]" />
                </motion.div>
                
                {/* Black printed Ticks overlay */}
                <div className="absolute inset-0 flex flex-col justify-between py-[4px] pointer-events-none z-50">
                  {getSyringeTicks().map((tick, i) => {
                    const isMajor = tick % (syringeVolume === 1.0 ? 20 : 10) === 0;
                    const isMid = tick % (syringeVolume === 1.0 ? 10 : 5) === 0;
                    let width = 'w-[30%]';
                    if (isMajor) width = 'w-[85%]';
                    else if (isMid) width = 'w-[60%]';
                    
                    return (
                      <div key={i} className="flex items-center gap-1 w-full px-[2px]">
                        <div className={`h-[1px] bg-white/80 ${width} shadow-[0_1px_2px_rgba(0,0,0,0.8)] rounded-r-full`} />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Lower Cone (Hub Base) */}
              <div className="w-full h-8 relative flex justify-center z-30 overflow-hidden">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 z-10 drop-shadow-[0_5px_10px_rgba(0,0,0,0.4)]">
                    <path d="M0,0 L40,100 L60,100 L100,0" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  </svg>
                  {/* Liquid inside cone */}
                  <motion.div 
                    className={`absolute bottom-0 w-[30%] h-full ${errorMsg ? 'bg-red-500/80' : 'bg-primary/80'} z-20`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: fillPercentage > 0 ? 1 : 0 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 mix-blend-multiply" />
                  </motion.div>
                  {/* Glass Reflection on Cone */}
                  <div className="absolute left-[35%] top-0 bottom-0 w-[3px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none z-40 transform -skew-x-[15deg] blur-[0.5px]" />
              </div>

              {/* Luer Lock / Needle Hub */}
              <div className="flex flex-col items-center relative z-20">
                {/* Colored Plastic Hub (e.g. Orange for U-100) */}
                <div className="w-4 h-3 bg-gradient-to-b from-orange-400 to-orange-600 rounded-sm border border-orange-700 z-10 shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex flex-col justify-center gap-[1px]">
                  <div className="w-full h-[1px] bg-white/20" />
                  <div className="w-full h-[1px] bg-white/20" />
                </div>
                {/* Needle shaft */}
                <div className="w-[3px] h-16 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 relative z-0 shadow-lg border-x border-black/20 overflow-hidden">
                    {/* Metallic Specular */}
                    <div className="absolute top-0 bottom-0 left-[1px] w-[1px] bg-white/60" />
                    {/* Liquid Flow inside needle */}
                    <motion.div 
                      className={`absolute top-0 left-0 w-full h-full ${errorMsg ? 'bg-red-600/50' : 'bg-primary/50'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: fillPercentage > 0 ? 1 : 0 }}
                    />
                    {/* Angled Bevel tip (Sharp) */}
                    <div className="absolute -bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      
      {/* Disclaimer */}
      <FadeUp delay={0.8} className="mt-8 border-t border-white/10 pt-6 relative z-10">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-white/30 shrink-0" />
          <p className="text-[9px] uppercase font-mono text-white/30 tracking-[0.2em] leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </FadeUp>

    </section>
  )
}
