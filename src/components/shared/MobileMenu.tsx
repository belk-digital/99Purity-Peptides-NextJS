import React, { useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import {
  X, Search, Heart, User, LogIn,
  Activity, Dna, Brain, ShieldPlus, Sparkles, Zap, Network, BatteryCharging,
  BookOpen, Microscope, Calculator, HelpCircle, Mail, Users, ArrowRight
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { getCategoryDisplayName } from '@/lib/categoryDisplay'

export interface MenuCategory {
  id: string | number
  name: string
  slug?: string
}

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn?: boolean
  onSearchClick?: () => void
  categories?: MenuCategory[]
}

// Payload has no per-category icon field, so icons are assigned by position.
const CATEGORY_ICONS = [Activity, Dna, Brain, ShieldPlus, Sparkles, Zap, Network, BatteryCharging]

const MAIN_LINKS = [
  { key: 'shopFormulations', href: '/shop' },
  { key: 'peptideCalculator', href: '/peptide-calculator' },
  { key: 'blog', href: '/blog' },
  { key: 'ourLaboratory', href: '/about-us' },
]

const SUPPORT_LINKS = [
  { key: 'faq', href: '/faq', icon: HelpCircle },
  { key: 'contactSupport', href: '/contact-us', icon: Mail },
  { key: 'affiliateProgram', href: '/affiliates', icon: Users },
]

export function MobileMenu({ isOpen, onClose, isLoggedIn = false, onSearchClick, categories = [] }: MobileMenuProps) {
  const t = useTranslations('mobileMenu')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, onClose])

  const menuVariants: Variants = {
    closed: { opacity: 0, scale: 0.98, y: 20 },
    open: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      } 
    },
    exit: { opacity: 0, scale: 0.98, y: 20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  }

  const itemVariants: Variants = {
    closed: { y: 20, opacity: 0, scale: 0.95 },
    open: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="exit"
          variants={menuVariants}
          className="fixed inset-0 z-[100] bg-cream flex flex-col pointer-events-auto transform-gpu will-change-transform"
        >
          {/* Performant static noise texture (0 GPU overhead) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-noise" />

          {/* Header Block */}
          <motion.div variants={itemVariants} className="h-[72px] flex items-center justify-between px-6 shrink-0 relative z-10 border-b border-black/5">
            <div className="flex-1 flex justify-start">
              <LanguageSwitcher variant="light" />
            </div>
            
            <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-ink/50 flex-1 text-center">
              {t('menu')}
            </span>
            
            <div className="flex flex-1 justify-end">
              <button onClick={onClose} className="p-2 -mr-2 text-ink hover:text-primary hover:bg-black/5 transition-colors rounded-full" aria-label={t('closeMenu')}>
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          {/* Scrollable Main Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pb-40">
            
            <div className="px-6 py-8 sm:py-12 flex flex-col gap-10">
              
              {/* Massive Main Links */}
              <div className="flex flex-col gap-6 sm:gap-8">
                {MAIN_LINKS.map((link) => (
                  <motion.div key={link.key} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between"
                    >
                      <h2 className="font-heading text-3xl sm:text-4xl font-black text-ink tracking-tight group-hover:text-primary transition-colors duration-300">
                        {t(`links.${link.key}`)}
                      </h2>
                      <ArrowRight size={24} className="text-ink/20 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="w-full h-px bg-black/5" />

              {/* Categories Sleek List */}
              <motion.div variants={itemVariants} className="flex flex-col">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">{t('exploreCategories')}</h3>
                <div className="flex flex-col gap-4">
                  {categories.map((cat, index) => {
                    const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
                    return (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 py-1"
                      >
                        <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-ink/50 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 shrink-0 shadow-sm">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-[15px] font-semibold text-ink/80 group-hover:text-ink transition-colors">{getCategoryDisplayName(cat.name)}</span>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>

              <div className="w-full h-px bg-black/5" />

              {/* Support Links */}
              <motion.div variants={itemVariants} className="flex flex-col">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-6">{t('support')}</h3>
                <div className="flex flex-col gap-4">
                  {SUPPORT_LINKS.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-1"
                    >
                      <link.icon size={18} strokeWidth={1.5} className="text-ink/40 group-hover:text-primary transition-colors" />
                      <span className="text-[15px] font-medium text-ink/60 group-hover:text-ink transition-colors">{t(`links.${link.key}`)}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

            </div>

          </div>

          {/* Floating Glass Pill Utility Dock */}
          <motion.div 
            variants={itemVariants} 
            className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 z-20 pb-safe"
          >
            <div className="bg-white/95 border border-black/10 p-2 rounded-[2rem] flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-sm mx-auto w-full">
              <button 
                onClick={() => {
                  onClose();
                  onSearchClick?.();
                }}
                className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                title={t('dock.search')}
              >
                <Search size={20} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{t('dock.search')}</span>
              </button>

              <div className="w-px h-8 bg-black/10 shrink-0" />

              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                title={t('dock.wishlist')}
              >
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{t('dock.wishlist')}</span>
              </Link>

              <div className="w-px h-8 bg-black/10 shrink-0" />

              {isLoggedIn ? (
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                  title={t('dock.account')}
                >
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{t('dock.account')}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                  title={t('dock.login')}
                >
                  <LogIn size={20} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{t('dock.login')}</span>
                </Link>
              )}
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
