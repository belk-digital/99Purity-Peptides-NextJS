'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { ArrowRightLeft, Info, Scale, Droplet } from 'lucide-react'

type ConversionType = 'mass' | 'volume';
type MassUnit = 'mg' | 'mcg';
type VolumeUnit = 'ml' | 'iu';

export function UnitConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>('mass');
  
  // Mass state
  const [massValue, setMassValue] = useState('5');
  const [massFrom, setMassFrom] = useState<MassUnit>('mg');
  const [massTo, setMassTo] = useState<MassUnit>('mcg');

  // Volume state
  const [volValue, setVolValue] = useState('0.1');
  const [volFrom, setVolFrom] = useState<VolumeUnit>('ml');
  const [volTo, setVolTo] = useState<VolumeUnit>('iu');

  const swapUnits = () => {
    if (conversionType === 'mass') {
      setMassFrom(massTo);
      setMassTo(massFrom);
    } else {
      setVolFrom(volTo);
      setVolTo(volFrom);
    }
  }

  // Math
  let result = 0;
  let formattedResult = '—';

  if (conversionType === 'mass') {
    const val = parseFloat(massValue) || 0;
    if (massFrom === 'mg' && massTo === 'mcg') {
      result = val * 1000;
    } else if (massFrom === 'mcg' && massTo === 'mg') {
      result = val / 1000;
    } else {
      result = val;
    }
    if (val > 0) formattedResult = result.toLocaleString(undefined, { maximumFractionDigits: 3 });
  } else {
    const val = parseFloat(volValue) || 0;
    if (volFrom === 'ml' && volTo === 'iu') {
      result = val * 100; // U-100 syringe
    } else if (volFrom === 'iu' && volTo === 'ml') {
      result = val / 100;
    } else {
      result = val;
    }
    if (val > 0) formattedResult = result.toLocaleString(undefined, { maximumFractionDigits: 3 });
  }

  return (
    <section className="w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 p-6 sm:p-8 md:p-12 border border-white/10 relative shadow-2xl">
      
      {/* Subtle Background Effects */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] mix-blend-overlay z-0">
        <filter id="noiseDashboard3">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseDashboard3)" />
      </svg>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <FadeUp className="mb-10 text-center md:text-left relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tighter leading-none mb-3">
            Unit <span className="text-white/40 font-light">Converter</span>
          </h1>
          <p className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
            <Info className="w-4 h-4 shrink-0" /> Research Measurements Dashboard
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Dashboard Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          
          {/* Top Readout Cards */}
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <FadeUp delay={0.1} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   {conversionType === 'mass' ? <Scale className="w-4 h-4 text-primary" /> : <Droplet className="w-4 h-4 text-primary" />}
                 </div>
                 <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em]">Converted Result</p>
               </div>
               <div className="flex items-baseline gap-4">
                 <p className="text-5xl sm:text-6xl md:text-7xl font-display tracking-tighter text-white">
                   {formattedResult}
                 </p>
                 <span className="text-2xl md:text-4xl font-display text-white/20 italic uppercase">
                   {conversionType === 'mass' ? massTo : volTo}
                 </span>
               </div>
            </FadeUp>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Toggles */}
            <FadeUp delay={0.2} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col justify-center">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-4">Conversion Type</label>
              <div className="flex bg-white/5 p-1 rounded-2xl w-full border border-white/5 relative mb-6">
                {[
                  { id: 'mass', label: 'Mass' }, 
                  { id: 'volume', label: 'Volume' }
                ].map((opt) => (
                  <button 
                    key={opt.id} onClick={() => setConversionType(opt.id as ConversionType)}
                    className={`flex-1 relative py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${conversionType === opt.id ? 'text-zinc-900' : 'text-white/40 hover:text-white'}`}
                  >
                    {conversionType === opt.id && <motion.div layoutId="unitConversionToggle" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={swapUnits}
                className="group flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white"
              >
                <ArrowRightLeft className="w-4 h-4" /> Swap Direction
              </button>
            </FadeUp>

            {/* Input Value */}
            <FadeUp delay={0.3} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col relative overflow-hidden">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">Value to Convert</label>
              <div className="flex-1 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={conversionType}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-end justify-between mb-4 border-b border-white/10 pb-4">
                      {conversionType === 'mass' ? (
                        <>
                          <input 
                            type="number" min="0" step="any" value={massValue} onChange={e => setMassValue(e.target.value)}
                            className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                          <span className="text-2xl font-display text-white/30 uppercase">{massFrom}</span>
                        </>
                      ) : (
                        <>
                          <input 
                            type="number" min="0" step="any" value={volValue} onChange={e => setVolValue(e.target.value)}
                            className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                          <span className="text-2xl font-display text-white/30 uppercase">{volFrom}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-2">
                  <button onClick={() => conversionType === 'mass' ? setMassValue(prev => Math.max(0, (parseFloat(prev) || 0) - 1).toString()) : setVolValue(prev => Math.max(0, (parseFloat(prev) || 0) - 0.1).toFixed(1))} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => conversionType === 'mass' ? setMassValue(prev => ((parseFloat(prev) || 0) + 1).toString()) : setVolValue(prev => ((parseFloat(prev) || 0) + 0.1).toFixed(1))} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>
            
          </div>
        </div>

        {/* Right Panel: Visualization & Reference */}
        <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden p-8 min-h-[400px]">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Quick Reference Chart */}
          <FadeUp delay={0.4} className="w-full relative z-10 flex flex-col h-full justify-between">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                <ArrowRightLeft className="w-6 h-6 text-white/40" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Quick Reference</p>
            </div>

            <div className="bg-zinc-950/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={conversionType}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {conversionType === 'mass' ? (
                    <ul className="space-y-4">
                      <li className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-xs font-mono text-white/50">1 <span className="uppercase">mg</span></span>
                        <span className="text-lg font-display text-white">1,000 <span className="text-xs text-white/40 uppercase">mcg</span></span>
                      </li>
                      <li className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-xs font-mono text-white/50">5 <span className="uppercase">mg</span></span>
                        <span className="text-lg font-display text-white">5,000 <span className="text-xs text-white/40 uppercase">mcg</span></span>
                      </li>
                      <li className="flex justify-between items-end">
                        <span className="text-xs font-mono text-white/50">10 <span className="uppercase">mg</span></span>
                        <span className="text-lg font-display text-white">10,000 <span className="text-xs text-white/40 uppercase">mcg</span></span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-4">
                      <li className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-xs font-mono text-white/50">0.1 <span className="uppercase">ml</span></span>
                        <span className="text-lg font-display text-white">10 <span className="text-xs text-white/40 uppercase">iu</span></span>
                      </li>
                      <li className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-xs font-mono text-white/50">0.5 <span className="uppercase">ml</span></span>
                        <span className="text-lg font-display text-white">50 <span className="text-xs text-white/40 uppercase">iu</span></span>
                      </li>
                      <li className="flex justify-between items-end">
                        <span className="text-xs font-mono text-white/50">1.0 <span className="uppercase">ml</span></span>
                        <span className="text-lg font-display text-white">100 <span className="text-xs text-white/40 uppercase">iu</span></span>
                      </li>
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {conversionType === 'volume' && (
              <p className="text-[9px] uppercase font-mono text-primary/60 tracking-widest mt-6 text-center">
                *Assumes standard U-100 syringe
              </p>
            )}
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
