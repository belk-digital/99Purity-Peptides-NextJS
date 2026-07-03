'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function LanguageSwitcher({ className = '', variant = 'dark' }: { className?: string, variant?: 'dark' | 'light' }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const uniqueId = React.useId()

  function handleChange(nextLocale: string) {
    // Explicitly set the NEXT_LOCALE cookie to prevent the middleware from
    // reading the old cookie when navigating to the default locale (which lacks a URL prefix)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.replace(pathname, { locale: nextLocale })
  }

  const isDark = variant === 'dark'

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Globe size={14} className="opacity-40" strokeWidth={2} />
      <div className={`flex items-center rounded-full p-0.5 backdrop-blur-sm relative ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
        {routing.locales.map((loc) => {
          const isActive = locale === loc
          return (
            <button
              key={loc}
              type="button"
              onClick={() => handleChange(loc)}
              aria-current={isActive}
              className={`relative z-10 px-2 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                isActive 
                  ? (isDark ? 'text-black' : 'text-white') 
                  : (isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId={`activeLanguage-${uniqueId}`}
                  initial={false}
                  className={`absolute inset-0 rounded-full -z-10 ${isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)]'}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {loc}
            </button>
          )
        })}
      </div>
    </div>
  )
}
