'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { MagneticScrollWrapper } from '@/components/motion/MagneticScrollWrapper'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, DollarSign, Clock, ShieldCheck, Activity, BarChart3, Link as LinkIcon, XCircle, AlertTriangle, FileText, Share2, MousePointerClick, TrendingUp } from 'lucide-react'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'
import { PinterestGlassCard } from '@/components/home/PinterestGlassCard'
import { submitAffiliateApplication } from './actions'
import { useRouter } from 'next/navigation'
import { FluidButton } from '@/components/ui/fluid-button'

const FAQ_KEYS = [
  'faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6', 'faq7', 'faq8', 'faq9', 'faq10', 'faq11', 'faq12', 'faq13',
] as const

export type UserAffiliateStatus = 'guest' | 'user' | 'pending_application' | 'affiliate_approved' | 'affiliate_pending' | 'affiliate_rejected'

interface Props {
  userStatus: UserAffiliateStatus;
}

const MagneticScrollCard = ({ feature, i, staggerItemVariants }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this specific card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 5%", "start -30%"]
  });

  // Buttery smooth spring for that magnetic pull
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.2
  });

  const isLeft = i % 3 === 0;
  const isRight = i % 3 === 2;
  
  // Magnetic pull offsets
  const xOffset = isLeft ? -150 : isRight ? 150 : 0;
  const yOffset = -250; 
  
  // Apply buttery smooth progress
  const x = useTransform(smoothProgress, [0, 1], [0, xOffset]);
  const y = useTransform(smoothProgress, [0, 1], [0, yOffset]);
  const opacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 1, 0]);

  // Dynamic outward fanning hover animation based on grid position
  let hoverClasses = "hover:-translate-y-2 ";
  if (i % 2 === 0) hoverClasses += "md:hover:-translate-x-2 md:hover:-translate-y-2 ";
  else hoverClasses += "md:hover:translate-x-2 md:hover:-translate-y-2 ";
  if (i % 3 === 0) hoverClasses += "lg:hover:-translate-x-3 lg:hover:-translate-y-3 ";
  else if (i % 3 === 1) hoverClasses += "lg:hover:translate-x-0 lg:hover:-translate-y-3 ";
  else hoverClasses += "lg:hover:translate-x-3 lg:hover:-translate-y-3 ";

  return (
    <motion.div 
      ref={cardRef}
      variants={staggerItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      style={{ x, y, opacity }}
      className="w-full h-full will-change-transform"
    >
      <div className={`w-full h-full p-8 sm:p-10 rounded-[2rem] bg-white border border-ink/5 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-start cursor-default ${hoverClasses}`}>
        {/* Premium Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Heavy Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-multiply" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-8">
            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center border border-ink/10 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:-translate-y-1 transition-all duration-500">
              <CheckCircle2 className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-ink/10 to-transparent group-hover:from-primary/20 transition-all duration-500">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-heading font-black text-ink mb-4 tracking-tight leading-tight group-hover:text-primary transition-colors duration-300 drop-shadow-sm">
            {feature.title}
          </h3>
          
          <p className="text-sm md:text-base text-ink/80 leading-relaxed font-medium mt-auto group-hover:text-ink transition-colors duration-300">
            {feature.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export function AffiliatesLandingClient({ userStatus }: Props) {
  const t = useTranslations('affiliate.landing')
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const WHY_CHOOSE_KEYS = ['why1', 'why2', 'why3', 'why4', 'why5', 'why6', 'why7', 'why8', 'why9'] as const

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const result = await submitAffiliateApplication(formData)

    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      if (result.error === 'Unauthorized. Please log in to apply.') {
        router.push('/login?redirect=/affiliates#apply')
      } else {
        setError(result.error || t('formErrorGeneric'))
      }
    }
  }

  const scrollToApply = (e?: React.MouseEvent) => {
    e?.preventDefault();
    document.body.style.pointerEvents = 'none';
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { document.body.style.pointerEvents = ''; }, 1200); // Wait for scroll to finish
  };

  return (
    <div className="bg-cream min-h-screen relative font-sans text-ink overflow-hidden">
      
      {/* 1. Hero Section (Contact Style) */}
      <div className="relative w-full h-[65dvh] min-h-[400px] md:min-h-[500px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 overflow-hidden flex transition-[padding] duration-300">
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
          
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          <Image
            src="/99 Images/dark-velvet.webp"
            alt="Affiliate Program Background"
            fill
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Cutouts & UI Overlay (Inverted corners) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
            {/* Bottom Center Cutout for Button */}
            <div className="absolute -bottom-px left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
              <div 
                className="absolute bottom-0 -left-[calc(2.5rem-1px)] w-10 h-10 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              <div 
                className="absolute bottom-0 -right-[calc(2.5rem-1px)] w-10 h-10 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
              />
              <div onClick={scrollToApply}>
                <FluidButton
                  text={<><span className="hidden sm:inline">{t('heroJoinButtonLong')}</span><span className="sm:hidden">{t('heroJoinButtonShort')}</span></>}
                  className="relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Main Content inside the card */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-24 w-full h-full max-w-6xl pb-32 sm:pb-28 pt-16 md:pb-20 md:pt-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full max-w-5xl mx-auto px-2"
            >
              <h1 className="w-full font-heading text-[clamp(1.8rem,9vw,3rem)] sm:text-5xl md:text-7xl lg:text-[100px] leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-3 md:mb-6">
                {t('heroTitle')}
              </h1>
            </motion.div>
          </div>

        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-10 py-20 md:py-32 relative z-10">

        {/* 1. Intro Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeUp>
              <div className="text-left">
                <h2 className="text-label-md uppercase tracking-widest text-primary mb-6 font-bold flex items-center gap-3">
                  <span className="w-8 h-px bg-primary"></span>
                  {t('introEyebrow')}
                </h2>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-ink mb-6 tracking-tighter uppercase leading-[1.1]">
                  {t('introTitle')}
                </h2>
                <p className="font-light text-lg md:text-xl text-ink/70 leading-relaxed max-w-xl">
                  {t('introDescription')}
                </p>
              </div>
            </FadeUp>
            
            <div className="relative">
              {/* Background accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[100px] opacity-60 pointer-events-none -z-10" />
              
              <StaggerChildren className="flex flex-col gap-4">
                {(['benefit1', 'benefit2', 'benefit3', 'benefit4', 'benefit5'] as const).map((key, i) => (
                  <MagneticScrollWrapper key={i}>
                    <motion.div
                      variants={staggerItemVariants}
                      className="flex items-center gap-5 p-5 md:p-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-ink/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-bold text-ink text-base md:text-lg">{t(key)}</span>
                    </motion.div>
                  </MagneticScrollWrapper>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* 2. How it works */}
        <section className="mb-32">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase">{t('howItWorksTitle')}</h2>
              <p className="text-base sm:text-lg text-ink/70 font-light max-w-2xl mx-auto leading-relaxed">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
              <PinterestGlassCard
                title={t('commissionCardTitle')}
                description={t('commissionCardDesc')}
                icon={<DollarSign className="w-5 h-5" />}
                tag="15%"
                microcopy={t('commissionCardMicrocopy')}
                iconPosition="top-left"
                scrollFanning={true}
              />
              <PinterestGlassCard
                title={t('discountCardTitle')}
                description={t('discountCardDesc')}
                icon={<TrendingUp className="w-5 h-5" />}
                tag="15%"
                microcopy={t('discountCardMicrocopy')}
                iconPosition="top-left"
                scrollFanning={true}
              />
            </div>

            <div className="text-center mt-24 mb-10">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight px-4">{t('stepsTitle')}</h3>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 md:pb-24">
              <div className="md:translate-y-0 transition-transform duration-500 hover:-translate-y-2 relative bg-cream">
                <PinterestGlassCard
                  title={t('step1Title')}
                  description={t('step1Desc')}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  tag={t('step1Tag')}
                  microcopy={t('step1Microcopy')}
                  scrollFanning={true}
                />
                {/* Connecting Dotted Line 1 -> 2 */}
                <div className="hidden md:block absolute top-[45%] -right-[1.5rem] lg:-right-[2rem] w-[1.5rem] lg:w-[2rem] h-[32px] z-0 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none" className="text-primary overflow-visible">
                    <motion.path d="M 0 0 C 20 0, 20 40, 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  </svg>
                </div>
              </div>

              <div className="md:translate-y-8 transition-transform duration-500 hover:translate-y-6 relative bg-cream">
                <PinterestGlassCard
                  title={t('step2Title')}
                  description={t('step2Desc')}
                  icon={<LinkIcon className="w-5 h-5" />}
                  tag={t('step2Tag')}
                  microcopy={t('step2Microcopy')}
                  scrollFanning={true}
                />
                {/* Connecting Dotted Line 2 -> 3 */}
                <div className="hidden md:block absolute top-[45%] -right-[1.5rem] lg:-right-[2rem] w-[1.5rem] lg:w-[2rem] h-[32px] z-0 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none" className="text-primary overflow-visible">
                    <motion.path d="M 0 0 C 20 0, 20 40, 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  </svg>
                </div>
              </div>

              <div className="md:translate-y-16 transition-transform duration-500 hover:translate-y-14 relative bg-cream">
                <PinterestGlassCard
                  title={t('step3Title')}
                  description={t('step3Desc')}
                  icon={<Share2 className="w-5 h-5" />}
                  tag={t('step3Tag')}
                  microcopy={t('step3Microcopy')}
                  scrollFanning={true}
                />
                {/* Connecting Dotted Line 3 -> 4 */}
                <div className="hidden md:block absolute top-[45%] -right-[1.5rem] lg:-right-[2rem] w-[1.5rem] lg:w-[2rem] h-[32px] z-0 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none" className="text-primary overflow-visible">
                    <motion.path d="M 0 0 C 20 0, 20 40, 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" initial={{ strokeDashoffset: 16 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  </svg>
                </div>
              </div>

              <div className="md:translate-y-24 transition-transform duration-500 hover:translate-y-22 relative bg-cream">
                <PinterestGlassCard
                  title={t('step4Title')}
                  description={t('step4Desc')}
                  icon={<DollarSign className="w-5 h-5" />}
                  tag={t('step4Tag')}
                  microcopy={t('step4Microcopy')}
                  scrollFanning={true}
                />
              </div>
            </div>
          </FadeUp>
        </section>

        {/* 3. Commission Example & Metrics */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-7 bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col group">
               {/* Optimized: Removed heavy SVG feTurbulence noise filter for mobile performance */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 z-0" />

              <div className="relative z-10 flex flex-col h-full">
                <FadeUp>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tighter uppercase">{t('commissionStructureTitle')}</h2>
                  <p className="text-white/60 font-light mb-10 text-base sm:text-lg">{t('commissionStructureDesc')}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Commission Example */}
                    <MagneticScrollWrapper className="h-full">
                      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col h-full shadow-lg">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">{t('commissionExampleTitle')}</h3>
                        <div className="space-y-4 text-sm flex-1">
                          <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <span className="text-white/70">{t('commissionExampleOrderValueLabel')}</span>
                            <span className="font-bold text-white">$200</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <span className="text-white/70">{t('commissionExampleDiscountLabel')}</span>
                            <span className="font-bold text-red-400">-$30</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <span className="text-white/70">{t('commissionExampleCustomerPaysLabel')}</span>
                            <span className="font-bold text-white">$170</span>
                          </div>
                          <div className="flex justify-between items-start sm:items-center gap-3 pt-3">
                            <span className="text-white font-bold flex-1 pr-2 leading-tight">{t('commissionExampleYourCommissionLabel')}</span>
                            <span className="font-black text-3xl text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.4)] shrink-0">$30</span>
                          </div>
                        </div>
                      </div>
                    </MagneticScrollWrapper>

                    {/* Realistic Monthly Earnings */}
                    <MagneticScrollWrapper className="h-full">
                      <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col h-full shadow-lg">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">{t('monthlyEarningsTitle')}</h3>
                        <div className="space-y-4 flex-1">
                          <div className="flex justify-between items-center gap-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-sm leading-tight mb-1">{t('monthlyEarnings10Label')}</div>
                              <div className="text-[10px] text-white/50 uppercase tracking-wider leading-tight">{t('monthlyEarningsAvgOrder')}</div>
                            </div>
                            <div className="font-black text-xl text-primary shrink-0">$225</div>
                          </div>
                          <div className="flex justify-between items-center gap-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white text-sm leading-tight mb-1">{t('monthlyEarnings25Label')}</div>
                              <div className="text-[10px] text-white/50 uppercase tracking-wider leading-tight">{t('monthlyEarningsAvgOrder')}</div>
                            </div>
                            <div className="font-black text-xl text-primary shrink-0">$562.5</div>
                          </div>
                          <div className="flex justify-between items-center gap-3 bg-primary/10 p-3 sm:p-4 rounded-2xl border border-primary/30 relative overflow-hidden group/earning">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover/earning:translate-x-[100%] transition-transform duration-1000" />
                            <div className="relative z-10 flex-1 min-w-0">
                              <div className="font-bold text-white text-sm leading-tight mb-1">{t('monthlyEarnings50Label')}</div>
                              <div className="text-[10px] text-primary/70 uppercase tracking-wider leading-tight">{t('monthlyEarningsAvgOrder')}</div>
                            </div>
                            <div className="font-black text-xl text-primary relative z-10 shrink-0">$1,125</div>
                          </div>
                        </div>
                      </div>
                    </MagneticScrollWrapper>
                  </div>
                </FadeUp>
              </div>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 lg:gap-6">
              <FadeUp delay={0.1} className="h-full">
                <MagneticScrollWrapper className="h-full">
                  <div className="bg-white rounded-[2rem] p-6 h-full shadow-lg flex flex-col justify-center group hover:-translate-y-2 transition-transform duration-500 border border-ink/5">
                    <span className="block text-4xl md:text-5xl font-black text-ink mb-3 tracking-tighter group-hover:text-primary transition-colors">{t('statCookieValue')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{t('statCookieLabel')}</span>
                    <p className="text-xs text-ink/60 mt-3 font-medium">{t('statCookieDesc')}</p>
                  </div>
                </MagneticScrollWrapper>
              </FadeUp>
              <FadeUp delay={0.2} className="h-full">
                <MagneticScrollWrapper className="h-full">
                  <div className="bg-white rounded-[2rem] p-6 h-full shadow-lg flex flex-col justify-center group hover:-translate-y-2 transition-transform duration-500 border border-ink/5">
                    <span className="block text-4xl md:text-5xl font-black text-ink mb-3 tracking-tighter group-hover:text-primary transition-colors">{t('statDualValue')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{t('statDualLabel')}</span>
                    <p className="text-xs text-ink/60 mt-3 font-medium">{t('statDualDesc')}</p>
                  </div>
                </MagneticScrollWrapper>
              </FadeUp>
              <FadeUp delay={0.3} className="h-full">
                <MagneticScrollWrapper className="h-full">
                  <div className="bg-white rounded-[2rem] p-6 h-full shadow-lg flex flex-col justify-center group hover:-translate-y-2 transition-transform duration-500 border border-ink/5">
                    <span className="block text-4xl md:text-5xl font-black text-ink mb-3 tracking-tighter group-hover:text-primary transition-colors">{t('statRealValue')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{t('statRealLabel')}</span>
                    <p className="text-xs text-ink/60 mt-3 font-medium">{t('statRealDesc')}</p>
                  </div>
                </MagneticScrollWrapper>
              </FadeUp>
              <FadeUp delay={0.4} className="h-full">
                <MagneticScrollWrapper className="h-full">
                  <div className="bg-white rounded-[2rem] p-6 h-full shadow-lg flex flex-col justify-center group hover:-translate-y-2 transition-transform duration-500 border border-ink/5">
                    <span className="block text-4xl md:text-5xl font-black text-ink mb-3 tracking-tighter group-hover:text-primary transition-colors">{t('statMonthlyValue')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{t('statMonthlyLabel')}</span>
                    <p className="text-xs text-ink/60 mt-3 font-medium">{t('statMonthlyDesc')}</p>
                  </div>
                </MagneticScrollWrapper>
              </FadeUp>
            </div>
            
          </div>
        </section>

        {/* 4. Comprehensive Management Tools */}
        <section className="mb-32">
          <div className="text-center mb-10 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase">{t('managementToolsTitle')}</h2>
          </div>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <PinterestGlassCard
                title={t('tool1Title')}
                description={t('tool1Desc')}
                icon={<BarChart3 className="w-5 h-5" />}
                tag={t('tool1Tag')}
                microcopy={t('tool1Microcopy')}
                scrollFanning={true}
              />
              <PinterestGlassCard
                title={t('tool2Title')}
                description={t('tool2Desc')}
                icon={<LinkIcon className="w-5 h-5" />}
                tag={t('tool2Tag')}
                microcopy={t('tool2Microcopy')}
                scrollFanning={true}
              />
              <PinterestGlassCard
                title={t('tool3Title')}
                description={t('tool3Desc')}
                icon={<Activity className="w-5 h-5" />}
                tag={t('tool3Tag')}
                microcopy={t('tool3Microcopy')}
                scrollFanning={true}
              />
              <PinterestGlassCard
                title={t('tool4Title')}
                description={t('tool4Desc')}
                icon={<FileText className="w-5 h-5" />}
                tag={t('tool4Tag')}
                microcopy={t('tool4Microcopy')}
                scrollFanning={true}
              />
          </StaggerChildren>
        </section>

        {/* 5. Why Choose Grid */}
        <section className="mb-32">
          <div className="text-center mb-10 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink mb-6 tracking-tighter uppercase">{t('whyChooseTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {WHY_CHOOSE_KEYS.map((key, i) => (
              <MagneticScrollCard key={i} feature={{ title: t(`${key}Title`), desc: t(`${key}Desc`) }} i={i} staggerItemVariants={staggerItemVariants} />
            ))}
          </div>
        </section>

        {/* 6. Standards */}
        <section className="pb-32 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MagneticScrollWrapper className="h-full">
              <div className="bg-red-50/50 rounded-[2rem] p-8 md:p-12 border border-red-100 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-900 tracking-tight">{t('prohibitedTitle')}</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span className="text-red-900/80 text-sm font-medium">{t('prohibited1')}</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span className="text-red-900/80 text-sm font-medium">{t('prohibited2')}</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span className="text-red-900/80 text-sm font-medium">{t('prohibited3')}</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span className="text-red-900/80 text-sm font-medium">{t('prohibited4')}</span></li>
                  <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span className="text-red-900/80 text-sm font-medium">{t('prohibited5')}</span></li>
                </ul>
              </div>
            </MagneticScrollWrapper>
            
            <MagneticScrollWrapper className="h-full">
              <div className="bg-blue-50/50 rounded-[2rem] p-8 md:p-12 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-900 tracking-tight">{t('contentStandardsTitle')}</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span className="text-blue-900/80 text-sm font-medium">{t('content1')}</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span className="text-blue-900/80 text-sm font-medium">{t('content2')}</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span className="text-blue-900/80 text-sm font-medium">{t('content3')}</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span className="text-blue-900/80 text-sm font-medium">{t('content4')}</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span className="text-blue-900/80 text-sm font-medium">{t('content5')}</span></li>
                </ul>
              </div>
            </MagneticScrollWrapper>
          </div>
        </section>

        {/* 7. Application Form */}
        <section id="apply" className="pb-32 max-w-[1200px] mx-auto scroll-mt-32">
          <FadeUp>
            <div className="relative w-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] border border-white/10 overflow-visible text-left p-8 sm:p-12 md:p-16 font-sans group/form">
              
              {/* Glow / Noise inside the form container to match Contact form */}
              {/* Optimized: Removed heavy SVG feTurbulence noise filter for mobile performance */}
              <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-white/[0.02]" />
              </div>

              <div className="mb-12 relative z-10">
                <span className="font-heading font-bold text-primary tracking-[0.15em] uppercase text-xs block mb-3">
                  {t('applyEyebrow')}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight max-w-2xl">
                  {t('applyTitle')}
                </h2>
              </div>

              {userStatus === 'affiliate_approved' ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30">
                    <Activity className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{t('approvedTitle')}</h3>
                  <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed mb-10">
                    {t('approvedDesc')}
                  </p>
                  <Link href="/affiliates/dashboard">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-ink hover:bg-white transition-all duration-300 font-bold tracking-wider uppercase text-sm border-none">
                      {t('approvedButton')}
                    </Button>
                  </Link>
                </div>
              ) : userStatus === 'affiliate_pending' || userStatus === 'pending_application' || submitted ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                    <CheckCircle2 className="w-12 h-12 text-green-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{t('pendingTitle')}</h3>
                  <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed mb-10">
                    {t('pendingDesc')}
                  </p>
                </div>
              ) : userStatus === 'affiliate_rejected' ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                    <XCircle className="w-12 h-12 text-red-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{t('rejectedTitle')}</h3>
                  <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed mb-10">
                    {t('rejectedDesc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  
                  <div className="space-y-6">
                    {error && (
                      <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm font-semibold">
                        {error}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase border-b border-white/10 pb-3">{t('basicInfoTitle')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('displayNameLabel')} <span className="text-primary">*</span></Label>
                        <Input id="displayName" name="displayName" required placeholder={t('displayNamePlaceholder')} className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white placeholder:text-white/30 backdrop-blur-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('websiteUrlLabel')}</Label>
                        <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white placeholder:text-white/30 backdrop-blur-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase border-b border-white/10 pb-3 mt-8">{t('primaryPlatformTitle')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="platform" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('platformLabel')} <span className="text-primary">*</span></Label>
                        <Select defaultValue="youtube" required name="platform">
                          <SelectTrigger id="platform" className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white backdrop-blur-sm">
                            <SelectValue placeholder={t('platformPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl bg-zinc-800 border-white/10 text-white">
                            <SelectItem value="youtube">{t('platformYoutube')}</SelectItem>
                            <SelectItem value="instagram">{t('platformInstagram')}</SelectItem>
                            <SelectItem value="tiktok">{t('platformTiktok')}</SelectItem>
                            <SelectItem value="twitter">{t('platformTwitter')}</SelectItem>
                            <SelectItem value="reddit">{t('platformReddit')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialUrl" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('profileUrlLabel')}</Label>
                        <Input id="socialUrl" name="socialUrl" type="text" placeholder="https://youtube.com/c/... or @yourhandle" className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white placeholder:text-white/30 backdrop-blur-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white tracking-widest uppercase border-b border-white/10 pb-3 mt-8">{t('audienceStrategyTitle')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="reach" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('reachLabel')} <span className="text-primary">*</span></Label>
                        <Select defaultValue="1k-10k" required name="reach">
                          <SelectTrigger id="reach" className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white backdrop-blur-sm">
                            <SelectValue placeholder={t('reachPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl bg-zinc-800 border-white/10 text-white">
                            <SelectItem value="<1k">{t('reachLess1k')}</SelectItem>
                            <SelectItem value="1k-10k">{t('reach1k10k')}</SelectItem>
                            <SelectItem value="10k-100k">{t('reach10k100k')}</SelectItem>
                            <SelectItem value="100k+">{t('reach100kPlus')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="niche" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('nicheLabel')}</Label>
                        <Input id="niche" name="niche" placeholder={t('nichePlaceholder')} className="h-14 rounded-full bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary px-6 text-white placeholder:text-white/30 backdrop-blur-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="methods" className="text-xs font-bold tracking-widest uppercase text-white/70 ml-1">{t('methodsLabel')} <span className="text-primary">*</span></Label>
                      <Textarea
                        id="methods"
                        name="methods"
                        required
                        placeholder={t('methodsPlaceholder')}
                        className="min-h-[120px] rounded-[2rem] bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary p-6 text-white placeholder:text-white/30 resize-none backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-8 pb-16 md:pb-24 flex flex-col items-start gap-6">
                    <div className="flex flex-row items-start space-x-3 space-y-0 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <Checkbox id="terms" name="terms" required className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:text-ink" />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="terms" className="text-sm font-semibold text-white cursor-pointer">
                          {t('termsLabel')}
                        </Label>
                        <p className="text-xs text-white/50 font-light mt-2 leading-relaxed">
                          {t('termsDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="hidden" id="hidden-submit-btn"></button>
                </form>
              )}

              {/* Bottom Right Cutout for Submit Button (Matches Contact Form) */}
              {!submitted && (
                <div className="absolute -bottom-[1px] -right-[1px] w-fit bg-cream rounded-tl-[2rem] md:rounded-tl-[3.5rem] rounded-br-[2rem] md:rounded-br-[4rem] pointer-events-auto pl-5 sm:pl-6 md:pl-8 pt-4 sm:pt-5 md:pt-6 flex justify-center items-center z-20">
                  
                  {/* Top Fillet */}
                  <div 
                    className="absolute -top-[calc(2rem-1px)] md:-top-[calc(3rem-1px)] right-0 w-8 h-8 md:w-12 md:h-12 bg-contain bg-no-repeat pointer-events-none z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
                  />
                  
                  {/* Left Fillet */}
                  <div 
                    className="absolute bottom-0 -left-[calc(2rem-1px)] md:-left-[calc(3rem-1px)] w-8 h-8 md:w-12 md:h-12 bg-contain bg-no-repeat pointer-events-none z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
                  />

                  <div className="relative z-10">
                    <FluidButton
                      onClick={() => document.getElementById('hidden-submit-btn')?.click()}
                      text={<>{isSubmitting ? t('submitting') : t('submitNow')}</>}
                      className={isSubmitting ? 'opacity-70' : ''}
                    />
                  </div>
                </div>
              )}
            </div>
          </FadeUp>
        </section>

      </main>

      {/* 8. FAQ */}
      <div className="w-screen relative left-1/2 -ml-[50vw]">
        <SharedFaqSection
          title={t('faqTitle')}
          subtitle={t('faqSubtitle')}
          faqs={FAQ_KEYS.map((key) => ({ question: t(`${key}Question`), answer: t(`${key}Answer`) }))}
        />
      </div>

      {/* 9. Final CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-10 py-24 relative z-10">
        <div className="bg-ink rounded-[2rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center pb-32 md:pb-24">
             <h2 className="text-3xl md:text-5xl font-black text-cream uppercase tracking-tight mb-6">
               {t('finalCtaTitle')}
             </h2>
             <p className="text-cream/80 text-lg mb-8 leading-relaxed font-light">
               {t('finalCtaDesc')}
             </p>
             <p className="text-cream/60 text-sm font-medium">
               {t('finalCtaQuestions')} <a href="mailto:affiliates@99puritypeptides.com" className="text-primary hover:text-white transition-colors font-bold underline underline-offset-4">affiliates@99puritypeptides.com</a>
             </p>
          </div>
          
          {/* Bottom-left Curved Cutout with Button */}
          <div className="absolute bottom-0 left-0 bg-cream pt-4 pr-4 md:pt-6 md:pr-6 rounded-tr-[2rem] z-20">
            {/* Top inner curve */}
            <svg className="absolute -top-8 left-0 w-8 h-8 text-cream" viewBox="0 0 32 32" fill="currentColor">
              <path d="M0,32 L0,0 C0,17.67 14.33,32 32,32 Z" />
            </svg>
            {/* Right inner curve */}
            <svg className="absolute bottom-0 -right-8 w-8 h-8 text-cream" viewBox="0 0 32 32" fill="currentColor">
              <path d="M0,32 L0,0 C0,17.67 14.33,32 32,32 Z" />
            </svg>
            
            <FluidButton
              variant="dark"
              onClick={scrollToApply}
              text={<>{t('finalCtaButton')}</>}
            />
          </div>

          <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center pb-32 lg:pb-16">
             <ul className="space-y-4">
               {(['finalCtaBullet1', 'finalCtaBullet2', 'finalCtaBullet3', 'finalCtaBullet4', 'finalCtaBullet5', 'finalCtaBullet6'] as const).map((key, i) => (
                 <li key={i} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                     <CheckCircle2 className="w-5 h-5 text-primary" />
                   </div>
                   <span className="text-cream font-medium text-sm md:text-base">{t(key)}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center max-w-4xl mx-auto px-4">
          <p className="text-ink/60 text-[10px] md:text-xs leading-relaxed mb-4 font-medium uppercase tracking-widest">
            <span className="text-red-600 font-bold">{t('footerResearchLabel')}</span> {t('footerResearchText')}
          </p>
          <p className="text-ink/40 text-xs font-semibold">
            {t('footerCopyright')}
          </p>
        </div>
      </section>

    </div>
  )
}
