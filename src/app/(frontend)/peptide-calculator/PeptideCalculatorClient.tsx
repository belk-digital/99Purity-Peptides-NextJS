'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { Beaker, Thermometer, Droplets, FlaskConical, AlertTriangle, BookOpen, Calculator, Syringe, XCircle, CheckCircle2, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'
import { PinterestGlassCard } from '@/components/home/PinterestGlassCard'
import { MagneticScrollWrapper } from '@/components/motion/MagneticScrollWrapper'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { CalculatorsHub } from './components/CalculatorsHub'
import { FluidButton } from '@/components/ui/fluid-button'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const CALCULATOR_FAQS = [
  {
    question: "How much bacteriostatic water do I add to a 5mg peptide vial?",
    answer: "The standard ratio for a 5mg peptide vial is 2mL of bacteriostatic water. This creates a concentration of 2.5mg/mL, where every 0.1mL (10 units on a U-100 insulin syringe) delivers exactly 250mcg. You can adjust this ratio — use our peptide calculator above to recalculate for any water volume."
  },
  {
    question: "How many units is 250mcg on an insulin syringe?",
    answer: "The number of units for a 250mcg dose depends on your reconstitution ratio. For a 5mg vial mixed with 2mL of BAC water, 250mcg equals exactly 10 units (0.1mL) on a U-100 syringe. Use the peptide dosage calculator to find the precise unit count for your specific vial and water volume."
  },
  {
    question: "What is the difference between a U-100 and U-40 syringe for peptide dosing?",
    answer: "A U-100 syringe contains 100 units per 1mL. A U-40 syringe contains only 40 units per 1mL. Nearly all peptide research sessions use U-100 syringes. Drawing the same number of markings on a U-40 syringe delivers 2.5 times more volume than a U-100 — a critical distinction that can lead to significant dosing errors if unrecognized."
  },
  {
    question: "Do you shake or roll a peptide vial after adding bacteriostatic water?",
    answer: "Always roll, never shake. Shaking a peptide vial creates mechanical stress that can disrupt the amino acid chains in the compound. Instead, gently roll the vial between your palms in a smooth, circular motion until the lyophilized powder is fully dissolved in the bacteriostatic water."
  },
  {
    question: "How long does a reconstituted peptide last in the refrigerator?",
    answer: "Most peptide solutions reconstituted with bacteriostatic water remain stable for 28–30 days when stored at 2–8°C (standard refrigerator temperature). After this window, degradation accelerates. For extended storage, some researchers prefer to keep unreconstituted lyophilized peptides frozen and reconstitute only what is needed per research session."
  },
  {
    question: "How much BAC water should I use for a 10mg peptide vial?",
    answer: "For a 10mg vial, adding 2mL of bacteriostatic water creates a 5mg/mL concentration, where a 250mcg dose equals 5 units on a U-100 syringe. Adding 5mL instead creates a 2mg/mL concentration, where the same dose equals 12.5 units — easier to measure precisely. Use the peptide reconstitution calculator above to find the optimal ratio for your dose range."
  },
  {
    question: "What is peptide reconstitution?",
    answer: "Peptide reconstitution is the process of dissolving a lyophilized (freeze-dried) peptide powder into a sterile liquid carrier — typically bacteriostatic water — to create an injectable solution ready for research use. The ratio of peptide to water determines the concentration of the final solution, which dictates how many syringe units correspond to any given dose."
  },
  {
    question: "How do I convert mcg to mg for peptide dosing?",
    answer: "To convert micrograms (mcg) to milligrams (mg), divide by 1,000. For example, 500mcg = 0.5mg. To convert mg to mcg, multiply by 1,000. So a 5mg vial contains 5,000mcg of peptide. This conversion is the foundation of all peptide dosage calculations."
  },
  {
    question: "Can I use sterile water instead of bacteriostatic water for peptides?",
    answer: "Sterile water can technically dissolve peptides, but it lacks the 0.9% benzyl alcohol preservative found in bacteriostatic water. Without this preservative, microbial growth is possible and the reconstituted solution’s shelf life is dramatically reduced — typically to 24 hours. For any research session extending beyond a single day, bacteriostatic water is strongly preferred."
  },
  {
    question: "Why does the BAC water volume I add matter for dosing accuracy?",
    answer: "The volume of bacteriostatic water you add determines your peptide solution’s concentration — and therefore how many syringe units correspond to your target dose. Using inconsistent water volumes across sessions creates inconsistent dosing, even with the same vial. Always note the exact water volume used and recalculate using the peptide calculator if you change your reconstitution ratio."
  }
]

const FloatingVial = ({ className, delay = 0, scale = 1, rotation = 0 }: { className?: string, delay?: number, scale?: number, rotation?: number }) => (
  <motion.div
    className={`absolute pointer-events-none z-0 will-change-transform ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: scale }}
    viewport={{ once: true }}
    animate={{ y: [0, -20, 0], rotate: [rotation, rotation + 5, rotation] }}
    transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay } }}
  >
    <Image src="/99 Images/transparant-vial.png" alt="Vial" width={400} height={400} className="w-full h-auto opacity-60" quality={60} />
  </motion.div>
)

export default function PeptideCalculatorPage() {
  const scrollToHub = (e?: React.MouseEvent) => {
    e?.preventDefault();
    document.getElementById('calculators-hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-cream min-h-screen relative overflow-x-clip font-sans text-ink">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 overflow-hidden flex transition-[padding] duration-300">
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
          
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          <Image
            src="/99 Images/vial-closeup.webp"
            alt="Peptide Calculator Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10 pointer-events-none" />

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
            <div className="absolute -bottom-px left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
              <div 
                className="absolute bottom-0 -left-[calc(2.5rem-1px)] w-10 h-10 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              <div 
                className="absolute bottom-0 -right-[calc(2.5rem-1px)] w-10 h-10 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              <div onClick={scrollToHub}>
                <FluidButton 
                  text={<><span className="hidden sm:inline">Use the Calculators</span><span className="sm:hidden">Calculate</span></>} 
                  className="relative z-10" 
                />
              </div>
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 lg:px-24 w-full h-full max-w-[1400px] pb-32 sm:pb-28 pt-16 md:pb-20 md:pt-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full max-w-7xl mx-auto px-2"
            >
              <h1 className="w-full font-heading text-[clamp(1.5rem,5vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-3 md:mb-6">
                Peptide Calculator: Reconstitution, Dosage & Syringe Conversion
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-6xl mx-auto leading-relaxed drop-shadow-md mb-4">
                The most precise peptide reconstitution calculator available for research use. Enter your vial size, bacteriostatic water volume, and target dose — and get your exact syringe draw in seconds.
              </p>
              <p className="text-white/60 text-sm md:text-base font-light max-w-5xl mx-auto leading-relaxed drop-shadow-md">
                Whether you’re working with a 2mg, 5mg, or 10mg peptide vial, accurate reconstitution math is non-negotiable. This peptide calculator eliminates dosing errors by converting your vial concentration into precise syringe units — no manual math required. Trusted by researchers, used daily, and built for precision.
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      <div className="max-w-[1600px] mx-auto relative">
        <FloatingVial className="-top-32 -left-20 w-[400px] h-[400px] opacity-10" rotation={-15} delay={0} />
        <FloatingVial className="top-64 -right-32 w-[500px] h-[500px] opacity-5" rotation={25} delay={1.5} />

        {/* 2. CALCULATORS HUB */}
        <div id="calculators-hub" className="scroll-mt-32">
          <CalculatorsHub />
        </div>

        {/* DOSAGE CALCULATOR EXPLANATION (Missing text added) */}
        <section className="mb-32 px-4 sm:px-8 md:px-10">
          <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 border border-ink/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 z-0">
             <div className="absolute inset-0 transform-gpu opacity-[0.08] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
             <FadeUp className="relative z-10">
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Required Inputs
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-ink">Calculator Parameters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-ink/[0.02] border border-ink/5 rounded-3xl p-6 hover:bg-ink/[0.04] transition-colors group/card">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover/card:scale-110 group-hover/card:bg-primary/20 transition-all duration-300">
                      <Syringe className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-ink mb-3 uppercase tracking-widest text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Vial Size (mg)</h4>
                    <p className="text-sm text-ink/70 leading-relaxed font-medium">Total peptide weight in your vial (e.g., 5mg, 10mg).</p>
                  </div>
                  
                  <div className="bg-ink/[0.02] border border-ink/5 rounded-3xl p-6 hover:bg-ink/[0.04] transition-colors group/card">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover/card:scale-110 group-hover/card:bg-primary/20 transition-all duration-300">
                      <Droplets className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-ink mb-3 uppercase tracking-widest text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> BAC Water (mL)</h4>
                    <p className="text-sm text-ink/70 leading-relaxed font-medium">Volume of bacteriostatic water used for reconstitution.</p>
                  </div>
                  
                  <div className="bg-ink/[0.02] border border-ink/5 rounded-3xl p-6 hover:bg-ink/[0.04] transition-colors group/card">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover/card:scale-110 group-hover/card:bg-primary/20 transition-all duration-300">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-ink mb-3 uppercase tracking-widest text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Desired Dose (mcg)</h4>
                    <p className="text-sm text-ink/70 leading-relaxed font-medium">Your exact target research dose in micrograms.</p>
                  </div>
                </div>
             </FadeUp>
          </div>
        </section>

        {/* 3. HOW TO USE STEP-BY-STEP */}
        <section id="how-to-use" className="mb-32 px-4 sm:px-8 md:px-10">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase">How to Use the Reconstitution Calculator</h2>
              <p className="text-base sm:text-lg text-ink/70 font-light max-w-2xl mx-auto leading-relaxed">
                This calculator is designed for researchers working with lyophilized (freeze-dried) peptide vials. Follow these three steps:
              </p>
            </div>
          </FadeUp>
            
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:translate-y-0 transition-transform duration-500 hover:-translate-y-2 relative bg-cream">
              <PinterestGlassCard 
                title="Enter Vial Size"
                description="Input the total peptide content of your vial in milligrams (mg). Common sizes include 2mg, 5mg, 10mg, and 30mg."
                icon={<Syringe className="w-5 h-5" />}
                tag="Step 1"
                microcopy="PEPTIDE MASS"
                scrollFanning={true}
              />
              <div className="hidden md:block absolute top-[45%] -right-[1.5rem] lg:-right-[2rem] w-[1.5rem] lg:w-[2rem] h-[32px] z-0 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none" className="text-primary overflow-visible">
                  <motion.path d="M 0 0 C 20 0, 20 40, 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </svg>
              </div>
            </div>

            <div className="md:translate-y-8 transition-transform duration-500 hover:translate-y-6 relative bg-cream">
              <PinterestGlassCard 
                title="Enter BAC Water"
                description="Input how many milliliters (mL) of BAC water you used or plan to use when reconstituting. Standard practice is 1–2mL."
                icon={<Droplets className="w-5 h-5" />}
                tag="Step 2"
                microcopy="DILUENT VOLUME"
                scrollFanning={true}
              />
              <div className="hidden md:block absolute top-[45%] -right-[1.5rem] lg:-right-[2rem] w-[1.5rem] lg:w-[2rem] h-[32px] z-0 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none" className="text-primary overflow-visible">
                  <motion.path d="M 0 0 C 20 0, 20 40, 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </svg>
              </div>
            </div>

            <div className="md:translate-y-16 transition-transform duration-500 hover:translate-y-14 relative bg-cream">
              <PinterestGlassCard 
                title="Enter Desired Dose"
                description="Input your target dose in micrograms (mcg). The calculator immediately outputs the exact units to draw on a U-100 syringe."
                icon={<Calculator className="w-5 h-5" />}
                tag="Step 3"
                microcopy="TARGET DOSAGE"
                scrollFanning={true}
              />
            </div>
          </div>

          <FadeUp delay={0.4} className="mt-24 text-center max-w-4xl mx-auto w-full px-4 md:px-0">
             <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start text-center md:text-left z-0">
                <div className="absolute inset-0 transform-gpu opacity-[0.08] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative z-10 shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                
                <div className="relative z-10">
                  <span className="block text-xs font-bold text-ink/40 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> The Result</span>
                  <p className="text-xl md:text-3xl font-black text-ink tracking-tighter uppercase leading-tight">A precise, error-free measurement <span className="text-primary">for every session.</span></p>
                </div>
             </div>
          </FadeUp>
        </section>

        {/* 4. UNDERSTANDING RECONSTITUTION & PROCESS & MISTAKES */}
        <section className="mb-32 px-4 sm:px-8 md:px-10">
          
          <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <FadeUp>
                <h2 className="text-label-md uppercase tracking-widest text-primary mb-6 font-bold flex items-center gap-3">
                  <span className="w-8 h-px bg-primary"></span>
                  How It Works
                </h2>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase leading-[1.1]">
                  Peptide Reconstitution
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-ink uppercase mb-2">Understanding Peptide Reconstitution</h3>
                    <p className="font-light text-lg text-ink/70 leading-relaxed">
                      Peptide reconstitution is the process of dissolving a lyophilized peptide powder into a liquid carrier — almost always bacteriostatic water (BAC water) — to create an injectable solution for research use.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink uppercase mb-2">Why BAC Water?</h3>
                    <p className="font-light text-lg text-ink/70 leading-relaxed">
                      Bacteriostatic water contains 0.9% benzyl alcohol, which inhibits microbial growth and extends the usable shelf life of your reconstituted peptide solution compared to sterile water alone. This makes it the gold standard carrier for peptide research.
                    </p>
                  </div>
                </div>
                
                <div className="mt-16 relative w-full group">
                  {/* Glowing Backdrop */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] sm:aspect-[16/9] w-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/40 group-hover:border-primary/20 transition-colors duration-500">
                    <Image src="/99 Images/purity.webp" alt="Peptide Purity" fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />
                    
                    {/* Inner Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10 pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/20 pointer-events-none rounded-[2.5rem]" />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-mono uppercase tracking-widest font-bold">Research Grade</p>
                        <p className="text-white/80 text-[10px] uppercase tracking-wider">99%+ Verified Purity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* ADDED: The Reconstitution Process — Step by Step */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-ink/5 shadow-xl relative overflow-hidden h-fit self-start lg:sticky lg:top-32">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px]" />
               <FadeUp>
                 <h3 className="text-2xl font-black text-ink uppercase tracking-tight mb-8">The Reconstitution Process — Step by Step</h3>
                 <ul className="space-y-4">
                  {[
                    "Wipe the vial septa with an alcohol swab and allow to dry completely.",
                    "Draw the desired volume of BAC water into a sterile syringe.",
                    "Insert the needle at an angle along the inner wall of the vial — never aim directly at the peptide cake.",
                    "Allow the water to run slowly down the glass rather than jetting directly onto the powder.",
                    "Gently roll the vial between your palms until the powder is fully dissolved. Do not shake.",
                    "Inspect the solution — it should be clear to slightly opaque. Discard if visibly particulate or discolored."
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <span className="text-ink/80 font-medium leading-relaxed">{step}</span>
                    </li>
                  ))}
                 </ul>
                 <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                   <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                   <p className="text-sm text-red-800 font-bold uppercase tracking-wider">Critical note: Shaking a peptide vial can denature the amino acid chains. Always roll, never shake.</p>
                 </div>
               </FadeUp>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="text-left">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase leading-[1.1]">
                  5 Mistakes to Avoid
                </h2>
                <p className="font-light text-lg md:text-xl text-ink/70 leading-relaxed max-w-xl mb-12">
                  Protect your compound integrity and ensure accurate dosing by avoiding these common reconstitution errors.
                </p>
              </FadeUp>
              
              <div className="relative">
                <FloatingVial className="top-1/2 -translate-y-1/2 -left-48 w-[600px] h-[600px] opacity-[0.03]" rotation={-35} delay={0.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />
                
                <StaggerChildren className="flex flex-col gap-4">
                  {[
                    { title: "Shaking the vial instead of rolling.", desc: "Mechanical agitation can disrupt the amino acid chains. Always roll gently between your palms." },
                    { title: "Injecting BAC water directly onto the peptide cake.", desc: "This causes localized denaturation. Angle the needle against the glass wall and let the water cascade down." },
                    { title: "Confusing mg with mcg.", desc: "1mg = 1,000mcg. If your vial is 5mg and your dose is 250mcg, your dose is 0.25mg — not 250mg. Use the calculator to eliminate this conversion error." },
                    { title: "Using the wrong syringe type.", desc: "U-40 and U-100 syringes have different unit values per mL. This is one of the most dangerous and common dosing errors. Always verify." },
                    { title: "Reconstituting too far in advance.", desc: "Once reconstituted, peptide solutions should be used within the timeframe appropriate for your storage conditions. See our storage guide for details." }
                  ].map((mistake, i) => (
                    <MagneticScrollWrapper key={i}>
                      <motion.div 
                        variants={staggerItemVariants}
                        className="flex items-start gap-4 p-5 md:p-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300 mt-1">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-ink text-base md:text-lg">{mistake.title}</span>
                          <span className="text-sm md:text-base text-ink/70 leading-relaxed font-medium">{mistake.desc}</span>
                        </div>
                      </motion.div>
                    </MagneticScrollWrapper>
                  ))}
                </StaggerChildren>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 h-fit self-start lg:sticky lg:top-32">
              <FadeUp delay={0.2}>
                <MagneticScrollWrapper>
                  <div className="bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-lg flex flex-col group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 transform-gpu opacity-[0.12] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                    <span className="block text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter group-hover:text-gold transition-colors relative z-10">Storage</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Best Practices</span>
                    
                    <h3 className="text-white font-bold mt-6 mb-2">Lyophilized (Unreconstituted) Peptides</h3>
                    <p className="text-sm text-white/70 mb-4">Store at –20°C (standard freezer) in a dark, dry location. Most lyophilized peptides maintain stability for 24–36 months under these conditions. Avoid repeated freeze-thaw cycles.</p>
                    
                    <h3 className="text-white font-bold mb-2">Reconstituted Peptide Solutions</h3>
                    <p className="text-sm text-white/70 mb-6">Once mixed with BAC water, store in the refrigerator at 2–8°C (36–46°F). Avoid freezing reconstituted solutions, as this can cause aggregation. Most research-grade peptide solutions remain stable for 28–30 days under refrigeration with BAC water as the carrier.</p>

                    <ul className="space-y-3 text-sm text-white/70 font-medium border-t border-white/10 pt-6">
                      <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" /> Keep vials away from direct light (use amber vials or wrap in foil if needed)</li>
                      <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" /> Never store near heat sources or leave at room temperature for extended periods</li>
                      <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" /> Label each vial with the reconstitution date</li>
                      <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" /> Do not use solutions that appear cloudy, discolored, or particulate (beyond expected slight opacity)</li>
                    </ul>
                  </div>
                </MagneticScrollWrapper>
              </FadeUp>
            </div>

          </div>
        </section>

        {/* 5. MATH & TABLES */}
        <section className="mb-32 px-4 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 gap-8">
            
            {/* BAC Water Table */}
            <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col group">
               <div className="absolute inset-0 transform-gpu opacity-[0.12] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
               
               <div className="relative z-10 flex flex-col h-full">
                <FadeUp>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tighter uppercase">BAC Water Mixing Reference</h2>
                  <p className="text-white/60 font-light mb-6 text-base sm:text-lg">The volume of bacteriostatic water you add directly determines the concentration of your solution — and therefore how many syringe units equal your target dose. Use this reference chart:</p>
                  <p className="text-white/60 font-light mb-10 text-base sm:text-lg">Choosing the Right BAC Water Volume<br/>More BAC water = lower concentration = more units per dose (easier to measure small doses accurately). Less BAC water = higher concentration = fewer units per dose (more practical for large doses, but precision decreases).<br/><br/>For most research protocols with common dosing ranges of 100–500mcg, 2mL of BAC water per 5–10mg vial is the widely-used baseline.</p>
                  
                  <MagneticScrollWrapper className="h-full">
                    <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col h-full shadow-lg overflow-x-auto">
                      <table className="w-full text-left min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="py-3 pr-4 text-xs font-bold uppercase tracking-widest text-primary">Vial Size</th>
                            <th className="py-3 pr-4 text-xs font-bold uppercase tracking-widest text-white/60">BAC Water Added</th>
                            <th className="py-3 pr-4 text-xs font-bold uppercase tracking-widest text-white/60">Concentration</th>
                            <th className="py-3 text-xs font-bold uppercase tracking-widest text-white/60">250mcg Dose =</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-white/5">
                            <td className="py-4 pr-4 text-white">2mg</td>
                            <td className="py-4 pr-4 text-white/70">1mL</td>
                            <td className="py-4 pr-4 text-white/70">2mg/mL</td>
                            <td className="py-4 font-bold text-white">12.5 units</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 pr-4 text-white">5mg</td>
                            <td className="py-4 pr-4 text-white/70">2mL</td>
                            <td className="py-4 pr-4 text-white/70">2.5mg/mL</td>
                            <td className="py-4 font-bold text-white">10 units</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 pr-4 text-white">10mg</td>
                            <td className="py-4 pr-4 text-white/70">2mL</td>
                            <td className="py-4 pr-4 text-white/70">5mg/mL</td>
                            <td className="py-4 font-bold text-white">5 units</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="py-4 pr-4 text-white">10mg</td>
                            <td className="py-4 pr-4 text-white/70">5mL</td>
                            <td className="py-4 pr-4 text-white/70">2mg/mL</td>
                            <td className="py-4 font-bold text-white">12.5 units</td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-4 text-white">30mg</td>
                            <td className="py-4 pr-4 text-white/70">3mL</td>
                            <td className="py-4 pr-4 text-white/70">10mg/mL</td>
                            <td className="py-4 font-bold text-white">2.5 units</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </MagneticScrollWrapper>
                  <p className="text-xs text-white/40 mt-4 text-right uppercase tracking-widest">All unit values calculated for U-100 insulin syringes.</p>
                </FadeUp>
               </div>
            </div>

            {/* Math and Syringe side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Math */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 relative overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 z-0">
                <div className="absolute inset-0 transform-gpu opacity-[0.08] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                <FadeUp className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-ink tracking-tighter uppercase leading-tight">Peptide Dosage Math<br/><span className="text-sm font-bold text-ink/40 tracking-widest">How the Calculation Works</span></h3>
                  </div>
                  
                  <p className="font-medium text-ink/70 mb-6 text-sm md:text-base">The underlying formula this calculator uses is:</p>
                  
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl mb-8 border border-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 transform-gpu opacity-[0.12] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                    <p className="font-mono text-sm font-bold text-primary mb-4 leading-relaxed relative z-10">Draw Volume (mL) = (Desired Dose in mcg ÷ Total Peptide in mcg) × Total BAC Water Volume (mL)</p>
                    <div className="h-px w-full bg-primary/20 mb-4" />
                    <p className="font-mono text-sm font-bold text-ink relative z-10"><span className="text-primary mr-2">Then:</span>Units on U-100 syringe = Draw Volume (mL) × 100</p>
                  </div>
                  
                  <h4 className="font-bold text-ink uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Example Calculation</h4>
                  <ul className="space-y-4 text-ink/80 font-medium mb-8 bg-ink/[0.02] p-5 sm:p-6 rounded-2xl border border-ink/5">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /><span className="font-bold w-auto sm:w-28 shrink-0">Vial:</span></div>
                      <div className="pl-7 sm:pl-0">5mg (= 5,000mcg)</div>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /><span className="font-bold w-auto sm:w-28 shrink-0">BAC water:</span></div>
                      <div className="pl-7 sm:pl-0">2mL</div>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /><span className="font-bold w-auto sm:w-28 shrink-0">Desired dose:</span></div>
                      <div className="pl-7 sm:pl-0">250mcg</div>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border-t border-ink/10 pt-4 mt-2">
                      <div className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" /><span className="font-bold w-auto sm:w-28 shrink-0 text-primary">Draw volume:</span></div>
                      <div className="pl-7 sm:pl-0 flex flex-wrap items-center gap-x-1 gap-y-0.5">
                        <span>(250 ÷ 5,000) × 2 = 0.1mL =</span> <span className="text-primary font-black">10 units</span>
                      </div>
                    </li>
                  </ul>
                  
                  <p className="font-medium text-sm text-ink/60 leading-relaxed italic border-l-2 border-primary/30 pl-4">This is the same calculation the peptide dosage calculator performs automatically — eliminating human error from every research session.</p>
                </FadeUp>
              </div>
              
              {/* Syringe Conversion */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 relative overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 z-0">
                <div className="absolute inset-0 transform-gpu opacity-[0.08] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                <FadeUp className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Syringe className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-ink tracking-tighter uppercase leading-tight">Syringe Unit Conversion<br/><span className="text-sm font-bold text-ink/40 tracking-widest">For Peptide Research</span></h3>
                  </div>
                  
                  <p className="font-medium text-sm md:text-base text-ink/70 mb-8 leading-relaxed">Understanding your syringe markings is essential for accurate peptide dosing. The vast majority of peptide research uses U-100 insulin syringes, which contain <span className="font-bold text-ink">100 units per 1mL</span>.</p>
                  
                  <h4 className="font-bold text-ink uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> U-100 Reference</h4>
                  <div className="border border-ink/10 rounded-2xl mb-8 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-ink/[0.03]">
                        <tr className="border-b border-ink/10">
                          <th className="py-3 px-4 text-xs font-bold uppercase text-ink/60 tracking-widest">Draw Volume</th>
                          <th className="py-3 px-4 text-xs font-bold uppercase text-ink/60 tracking-widest">= Units on U-100</th>
                        </tr>
                      </thead>
                      <tbody className="text-ink font-medium text-sm md:text-base">
                        <tr className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">0.05mL</td><td className="py-3 px-4 font-bold">5 units</td></tr>
                        <tr className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">0.10mL</td><td className="py-3 px-4 font-bold">10 units</td></tr>
                        <tr className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">0.20mL</td><td className="py-3 px-4 font-bold">20 units</td></tr>
                        <tr className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">0.25mL</td><td className="py-3 px-4 font-bold">25 units</td></tr>
                        <tr className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">0.50mL</td><td className="py-3 px-4 font-bold">50 units</td></tr>
                        <tr className="hover:bg-ink/[0.02] transition-colors"><td className="py-3 px-4 text-ink/70">1.00mL</td><td className="py-3 px-4 font-bold">100 units</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> U-100 vs. U-40 Syringes</h4>
                  <div className="bg-red-50 p-4 md:p-5 rounded-2xl border border-red-100 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="font-medium text-red-800 text-sm leading-relaxed">
                      Important: U-40 syringes contain only 40 units per mL and are used primarily for veterinary insulin. If you accidentally use a U-40 syringe while dosing based on U-100 calculations, your draw will be <span className="font-black text-red-600">2.5× higher</span> than intended. Always confirm your syringe type.
                    </p>
                  </div>
                </FadeUp>
              </div>
            </div>

          </div>
        </section>

        {/* 6. WHY ACCURACY MATTERS & CTA (ADDED BACK) */}
        <section className="mb-32 px-4 sm:px-8 md:px-10">
          <div className="max-w-[1000px] mx-auto text-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase leading-[1.1]">
                Why Accurate Peptide Calculation Matters for Research
              </h2>
              <p className="font-light text-lg md:text-xl text-ink/70 leading-relaxed mb-12">
                Manual dosage math introduces variables that compromise research reproducibility. A dedicated peptide reconstitution calculator:
              </p>
              
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 text-left mb-12">
                {[
                  { text: "Eliminates conversion errors between mg, mcg, mL, and syringe units", span: "lg:col-span-4 md:col-span-3" },
                  { text: "Standardizes protocols across research sessions and researchers", span: "lg:col-span-4 md:col-span-3" },
                  { text: "Saves time during setup without sacrificing precision", span: "lg:col-span-4 md:col-span-3" },
                  { text: "Supports documentation with consistent, repeatable measurements", span: "lg:col-span-6 md:col-span-3" },
                  { text: "Reduces waste by calculating exact draw volumes for your target dose", span: "lg:col-span-6 md:col-span-6" }
                ].map((item, i) => (
                  <motion.div key={i} variants={staggerItemVariants} className={`${item.span} col-span-1 bg-white p-8 rounded-[2rem] border border-ink/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[200px] z-0`}>
                    <div className="absolute inset-0 transform-gpu opacity-[0.08] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 relative z-10 shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-ink font-bold text-lg md:text-xl leading-snug relative z-10">{item.text}</p>
                    <div className="absolute -bottom-6 -right-2 text-[150px] font-black text-ink/[0.02] group-hover:text-ink/[0.04] transition-colors pointer-events-none select-none z-0 leading-none">
                      0{i+1}
                    </div>
                  </motion.div>
                ))}
              </StaggerChildren>
              <p className="font-bold text-lg md:text-xl text-ink mb-24 text-center max-w-4xl mx-auto leading-relaxed border-t border-ink/10 pt-12">
                For research requiring consistent inter-session dosing, calculator-assisted measurement is the most reliable method available without laboratory-grade volumetric equipment.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-16 text-white text-left relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 transform-gpu opacity-[0.15] pointer-events-none z-0 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                
                <div className="relative z-10 max-w-4xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-tight">
                      Precision in Peptide Research<br/><span className="text-primary text-lg sm:text-xl md:text-2xl tracking-widest">Why Every Unit Matters</span>
                    </h2>
                  </div>
                  
                  <div className="space-y-6 text-white/70 font-light text-lg md:text-xl leading-relaxed">
                    <p>
                      Peptide research outcomes are sensitive to dosing variability. A difference of even <span className="font-bold text-white">10–20 units</span> on a syringe can represent a <span className="font-bold text-white">25–50% deviation</span> from your target dose depending on concentration.
                    </p>
                    <p>
                      That deviation alters pharmacokinetic profiles in observational studies, reduces inter-session reproducibility, and compromises data integrity across longitudinal research.
                    </p>
                    <div className="h-px w-24 bg-white/20 my-8" />
                    <p className="font-medium text-white">
                      Using a validated peptide dosage calculator — and cross-referencing with a BAC water mixing chart — ensures your research sessions begin with the highest possible measurement accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="group/banner relative rounded-[3rem] overflow-hidden p-6 sm:p-12 md:p-24 text-center text-white shadow-2xl transition-transform duration-700 hover:-translate-y-2 mt-12 lg:mt-16 border border-white/5 bg-zinc-950">
                {/* Background image & gradient */}
                <Image
                  src="/99 Images/vial-ice-closeup.webp"
                  alt="Purity Peptides"
                  fill
                  className="absolute inset-0 object-cover z-0 opacity-30 mix-blend-luminosity group-hover/banner:scale-105 group-hover/banner:opacity-40 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/40 z-0" />
                
                {/* Premium Noise Overlay */}
                <div className="absolute inset-0 transform-gpu opacity-[0.12] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-8 px-5 py-2.5 border border-primary/20 rounded-full bg-primary/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Quality Assurance
                  </span>
                  
                  <h3 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-8 max-w-5xl mx-auto leading-[1.05] drop-shadow-2xl">
                    Start Your Research With <span className="text-primary">Verified-Purity</span> Peptides
                  </h3>
                  
                  <p className="text-white/60 max-w-3xl mx-auto mb-14 font-medium text-base md:text-lg leading-relaxed">
                    Precise dosing calculations mean nothing if your peptide isn’t what the label claims. Every product in our catalog is manufactured under strict quality standards and ships with third-party Certificate of Analysis (CoA) documentation — so your research data reflects compound behavior, not contamination.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto mt-4">
                    <FluidButton 
                      href="/shop" 
                      text="Browse Catalog" 
                      variant="cyan"
                    />
                    
                    <FluidButton 
                      href="/certificates" 
                      text="View COA Standards" 
                      variant="white"
                    />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>

      {/* 8. FAQS (USING SharedFaqSection exactly like About page) */}
      <SharedFaqSection 
        title="Calculator FAQ" 
        description="Common questions about peptide reconstitution and dosing mathematics."
        faqs={CALCULATOR_FAQS}
      />

    </main>
  )
}
