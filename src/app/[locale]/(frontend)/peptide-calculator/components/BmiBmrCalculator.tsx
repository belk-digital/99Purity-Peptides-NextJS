'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeUp } from '@/components/motion/FadeUp'
import { Activity, Scale, Info } from 'lucide-react'

type System = 'imperial' | 'metric';
type Gender = 'male' | 'female';

export function BmiBmrCalculator() {
  const t = useTranslations('calculator.bmiBmr')
  const [system, setSystem] = useState<System>('imperial');
  const [gender, setGender] = useState<Gender>('male');
  
  const [age, setAge] = useState('30');
  
  // Imperial
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('10');
  const [lbs, setLbs] = useState('170');
  
  // Metric
  const [cm, setCm] = useState('178');
  const [kg, setKg] = useState('77');

  const handleSystemChange = (newSystem: System) => {
    if (newSystem === system) return;
    
    if (newSystem === 'metric') {
      // convert imperial to metric
      const f = parseInt(feet) || 0;
      const i = parseInt(inches) || 0;
      const hCm = (f * 12 + i) * 2.54;
      setCm(Math.round(hCm).toString());
      
      const wKg = (parseFloat(lbs) || 0) / 2.20462;
      setKg(wKg.toFixed(1));
    } else {
      // convert metric to imperial
      const hCm = parseFloat(cm) || 0;
      const totalInches = hCm / 2.54;
      const f = Math.floor(totalInches / 12);
      const i = Math.round(totalInches % 12);
      setFeet(f.toString());
      setInches(i.toString());
      
      const wKg = parseFloat(kg) || 0;
      const wLbs = wKg * 2.20462;
      setLbs(Math.round(wLbs).toString());
    }
    
    setSystem(newSystem);
  }

  // Math
  let heightCm = 0;
  let weightKg = 0;
  let parsedAge = parseInt(age) || 0;

  if (system === 'imperial') {
    const f = parseInt(feet) || 0;
    const i = parseInt(inches) || 0;
    heightCm = (f * 12 + i) * 2.54;
    weightKg = (parseFloat(lbs) || 0) / 2.20462;
  } else {
    heightCm = parseFloat(cm) || 0;
    weightKg = parseFloat(kg) || 0;
  }

  let bmi = 0;
  let bmr = 0;
  let category = '—';
  let categoryColor = 'text-white/40';

  if (heightCm > 0 && weightKg > 0 && parsedAge > 0) {
    const heightM = heightCm / 100;
    bmi = weightKg / (heightM * heightM);
    
    // Mifflin-St Jeor
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * parsedAge;
    bmr += (gender === 'male' ? 5 : -161);

    if (bmi < 18.5) { category = t('categoryUnderweight'); categoryColor = 'text-blue-400'; }
    else if (bmi < 25) { category = t('categoryNormal'); categoryColor = 'text-primary'; }
    else if (bmi < 30) { category = t('categoryOverweight'); categoryColor = 'text-yellow-400'; }
    else { category = t('categoryObese'); categoryColor = 'text-red-500'; }
  }

  const isValid = bmi > 0;
  
  // For the radial dial
  const maxBmi = 40;
  const bmiPercentage = isValid ? Math.min(Math.max((bmi / maxBmi) * 100, 0), 100) : 0;
  const strokeDasharray = 283; // 2 * pi * r (r=45)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * bmiPercentage) / 100;

  return (
    <section className="w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 p-6 sm:p-8 md:p-12 border border-white/10 relative shadow-2xl">
      
      {/* Subtle Background Effects */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] mix-blend-overlay z-0">
        <filter id="noiseDashboard2">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseDashboard2)" />
      </svg>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <FadeUp className="mb-10 text-center md:text-left relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black uppercase text-white tracking-tighter leading-none mb-3">
            {t('titleBmiBmr')} <span className="text-white/40 font-light">{t('titleCalculator')}</span>
          </h1>
          <p className="text-white/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
            <Info className="w-4 h-4 shrink-0" /> {t('bodyMetricsDashboard')}
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        
        {/* Left Dashboard Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          
          {/* Top Readout Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <FadeUp delay={0.1} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Scale className="w-4 h-4 text-primary" />
                 </div>
                 <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em]">{t('bodyMassIndex')}</p>
               </div>
               <div className="flex items-baseline gap-4">
                 <p className="text-5xl md:text-6xl font-display tracking-tighter text-white">
                   {isValid ? bmi.toFixed(1) : '—'}
                 </p>
                 <span className={`text-sm md:text-base font-medium ${categoryColor}`}>{category}</span>
               </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                   <Activity className="w-4 h-4 text-gold" />
                 </div>
                 <p className="text-[10px] uppercase font-mono text-white/40 tracking-[0.2em]">{t('basalMetabolicRate')}</p>
               </div>
               <div className="flex items-baseline gap-2">
                 <p className="text-5xl md:text-6xl font-display tracking-tighter text-white">
                   {isValid ? Math.round(bmr).toLocaleString() : '—'}
                 </p>
                 <span className="text-xs font-mono text-white/20 uppercase tracking-widest">{t('kcalDay')}</span>
               </div>
            </FadeUp>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Toggles */}
            <FadeUp delay={0.3} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-3">{t('measurementSystem')}</label>
                <div className="flex bg-white/5 p-1 rounded-2xl w-full border border-white/5 relative">
                  {(['imperial', 'metric'] as System[]).map((opt) => (
                    <button
                      key={opt} onClick={() => handleSystemChange(opt)}
                      className={`flex-1 relative py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${system === opt ? 'text-zinc-900' : 'text-white/40 hover:text-white'}`}
                    >
                      {system === opt && <motion.div layoutId="bmiSystemToggle" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
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
                      {gender === opt && <motion.div layoutId="bmiGenderToggle" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{opt === 'male' ? t('genderMale') : t('genderFemale')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Age */}
            <FadeUp delay={0.4} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
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

            {/* Height */}
            <FadeUp delay={0.5} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-6">{t('height')}</label>
              <div className="flex-1 flex flex-col justify-end">
                {system === 'imperial' ? (
                  <div className="flex gap-4 mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-end flex-1">
                      <input type="number" value={feet} onChange={e => setFeet(e.target.value)} className="bg-transparent text-4xl sm:text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <span className="text-xl font-display text-white/30 ml-2">FT</span>
                    </div>
                    <div className="w-[1px] bg-white/10" />
                    <div className="flex items-end flex-1">
                      <input type="number" value={inches} onChange={e => setInches(e.target.value)} className="bg-transparent text-4xl sm:text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      <span className="text-xl font-display text-white/30 ml-2">IN</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <input type="number" value={cm} onChange={e => setCm(e.target.value)} className="bg-transparent text-4xl sm:text-5xl font-display tracking-tighter text-white focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-2xl font-display text-white/30">CM</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => system === 'imperial' ? setInches(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString()) : setCm(prev => Math.max(1, (parseInt(prev) || 0) - 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">-</button>
                  <button onClick={() => system === 'imperial' ? setInches(prev => ((parseInt(prev) || 0) + 1).toString()) : setCm(prev => ((parseInt(prev) || 0) + 1).toString())} className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors">+</button>
                </div>
              </div>
            </FadeUp>

            {/* Weight */}
            <FadeUp delay={0.6} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 backdrop-blur-md flex flex-col">
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
            
          </div>
        </div>

        {/* Right Panel: Visualization Dashboard */}
        <div className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden p-8 min-h-[400px]">
          
          {/* Decorative ambient lights */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gold/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Radial Gauge */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center z-10">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            </svg>
            
            {/* Animated Fill */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" viewBox="0 0 100 100">
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke={bmi < 18.5 ? '#60a5fa' : bmi < 25 ? '#d4af37' : bmi < 30 ? '#facc15' : '#ef4444'} 
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: strokeDasharray }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
              />
            </svg>

            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">{t('status')}</p>
              <p className={`text-2xl sm:text-3xl font-display tracking-tight ${categoryColor}`}>{isValid ? category : t('ready')}</p>
            </div>
          </div>
          
          <div className="mt-12 text-center max-w-[200px]">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              {t('mifflinDisclaimer')}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
