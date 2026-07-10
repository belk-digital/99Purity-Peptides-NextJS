'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { FlaskConical, Search, Beaker, Home, ArrowRight } from 'lucide-react'
import { FluidButton } from '@/components/ui/fluid-button'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { SearchOverlay } from '@/components/shared/SearchOverlay'
import { useReducedMotion } from '@/components/motion/useReducedMotion'



function VialIllustration() {
  const reduced = useReducedMotion()
  const bubbles = [0, 1, 2, 3, 4]

  return (
    <motion.div
      className="relative w-24 h-32 sm:w-28 sm:h-36 mx-auto"
      animate={reduced ? undefined : { rotate: [-3, 3, -3] }}
      transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Vial cap */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 sm:w-12 sm:h-6 bg-ink rounded-t-md" />
      {/* Vial body */}
      <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-20 h-24 sm:w-24 sm:h-28 rounded-b-[1.5rem] rounded-t-md border-2 border-ink/15 bg-white/60 backdrop-blur-sm overflow-hidden shadow-lg">
        {/* Liquid fill */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-primary/70 to-primary/40">
          {/* Bubbles rising */}
          {bubbles.map((i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 rounded-full bg-white/70"
              style={{
                left: `${15 + i * 16}%`,
                width: 4 + (i % 3),
                height: 4 + (i % 3),
              }}
              animate={reduced ? undefined : { y: [-4, -80], opacity: [0, 1, 0] }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 2.4 + (i % 3) * 0.4,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'easeOut',
                    }
              }
            />
          ))}
        </div>
      </div>
      {/* Label */}
      <div className="absolute top-[54%] left-1/2 -translate-x-1/2 w-14 sm:w-16 h-8 sm:h-9 bg-white border border-ink/10 rounded-sm shadow-sm flex flex-col items-center justify-center gap-0.5">
        <span className="text-[6px] sm:text-[7px] font-mono font-bold tracking-widest text-ink/60">RUO</span>
        <span className="text-[8px] sm:text-[9px] font-mono font-black text-primary">404</span>
      </div>
    </motion.div>
  )
}

function MagneticHeadline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15 })
  const sy = useSpring(y, { stiffness: 150, damping: 15 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || reduced) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.06)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.06)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
    >
      {children}
    </motion.div>
  )
}

export default function NotFound() {
  const [searchOpen, setSearchOpen] = useState(false)
  const reduced = useReducedMotion()
  const t = useTranslations('notFound')

  return (
    <main className="relative min-h-screen bg-cream flex flex-col items-center text-center px-6 pt-24 pb-12 overflow-x-hidden overflow-y-auto">
      {/* Decorative background blobs, matching the site's ambient-glow pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center my-auto py-12">
        <MagneticHeadline>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[88px] sm:text-[130px] md:text-[170px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-ink to-ink/60 select-none tracking-tighter flex items-center justify-center gap-1 sm:gap-4 mb-2"
          >
            <span>4</span>
            <div className="-mt-1 sm:-mt-6 -mx-4 sm:mx-0 scale-[0.65] sm:scale-100 origin-center">
              <VialIllustration />
            </div>
            <span>4</span>
          </motion.h1>
        </MagneticHeadline>

        <p className="text-body-sm sm:text-body-md text-ink/50 max-w-[440px] mx-auto mt-8 mb-10 sm:mb-12">
          {t('title')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mx-auto mb-8">
          <FluidButton
            href="/"
            variant="cyan"
            text={
              <span className="flex items-center gap-2">
                <Home size={16} strokeWidth={2} />
                {t('returnHome')}
              </span>
            }
            className="w-full sm:w-auto"
          />
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full uppercase tracking-widest text-xs h-14 px-8 border-ink/20 hover:border-ink"
            >
              <span className="flex items-center gap-2">
                <FlaskConical size={16} strokeWidth={2} />
                {t('browseShop')}
              </span>
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="group inline-flex items-center gap-2 text-ink/50 hover:text-primary transition-colors duration-300 text-label-md uppercase tracking-widest"
        >
          <Search size={14} strokeWidth={2} />
          <span className="border-b border-transparent group-hover:border-primary/40 pb-0.5 transition-colors">
            {t('search')}
          </span>
          <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </main>
  )
}
