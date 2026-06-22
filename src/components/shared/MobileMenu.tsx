import React, { useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { 
  X, Search, Heart, User, LogIn, 
  Activity, Dna, Brain, ShieldPlus, Sparkles, Zap, Network, BatteryCharging,
  BookOpen, Microscope, Calculator, HelpCircle, Mail, Users, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn?: boolean
  onSearchClick?: () => void
}

const CATEGORIES = [
  { name: 'Bioregulators', icon: Activity },
  { name: 'Cellular Health', icon: Dna },
  { name: 'Cognitive', icon: Brain },
  { name: 'Essentials', icon: ShieldPlus },
  { name: 'Growth Factor', icon: Sparkles },
  { name: 'Metabolic', icon: Zap },
  { name: 'Receptor Agonist', icon: Network },
  { name: 'Recovery', icon: BatteryCharging }
]

const MAIN_LINKS = [
  { label: 'Shop Formulations', href: '/shop' },
  { label: 'Peptide Calculator', href: '/peptide-calculator' },
  { label: 'Scientific Journal', href: '/journal' },
  { label: 'Our Laboratory', href: '/about' },
]

const SUPPORT_LINKS = [
  { label: 'F.A.Q', href: '/faq', icon: HelpCircle },
  { label: 'Contact Support', href: '/contact', icon: Mail },
  { label: 'Affiliate Program', href: '/affiliates', icon: Users },
]

export function MobileMenu({ isOpen, onClose, isLoggedIn = false, onSearchClick }: MobileMenuProps) {

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
          className="fixed inset-0 z-[100] bg-cream flex flex-col pointer-events-auto"
        >
          {/* Performant static noise texture (0 GPU overhead) */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0 mix-blend-multiply bg-noise" />

          {/* Header Block */}
          <motion.div variants={itemVariants} className="h-[72px] flex items-center justify-between px-6 shrink-0 relative z-10 border-b border-black/5">
            <div className="flex-1" />
            
            <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-ink/50 flex-1 text-center">
              Menu
            </span>
            
            <div className="flex flex-1 justify-end">
              <button onClick={onClose} className="p-2 -mr-2 text-ink hover:text-primary hover:bg-black/5 transition-colors rounded-full">
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
                  <motion.div key={link.label} variants={itemVariants}>
                    <Link 
                      href={link.href} 
                      onClick={onClose}
                      className="group flex items-center justify-between"
                    >
                      <h2 className="font-heading text-3xl sm:text-4xl font-black text-ink tracking-tight group-hover:text-primary transition-colors duration-300">
                        {link.label}
                      </h2>
                      <ArrowRight size={24} className="text-ink/20 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="w-full h-px bg-black/5" />

              {/* Categories Sleek List */}
              <motion.div variants={itemVariants} className="flex flex-col">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Explore Categories</h3>
                <div className="flex flex-col gap-4">
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.name}
                      href={`/shop/${cat.name.toLowerCase().replace(' ', '-')}`} 
                      onClick={onClose}
                      className="group flex items-center gap-4 py-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-ink/50 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 shrink-0 shadow-sm">
                        <cat.icon size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[15px] font-semibold text-ink/80 group-hover:text-ink transition-colors">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <div className="w-full h-px bg-black/5" />

              {/* Support Links */}
              <motion.div variants={itemVariants} className="flex flex-col">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-6">Support</h3>
                <div className="flex flex-col gap-4">
                  {SUPPORT_LINKS.map((link) => (
                    <Link 
                      key={link.label}
                      href={link.href} 
                      onClick={onClose}
                      className="group flex items-center gap-4 py-1"
                    >
                      <link.icon size={18} strokeWidth={1.5} className="text-ink/40 group-hover:text-primary transition-colors" />
                      <span className="text-[15px] font-medium text-ink/60 group-hover:text-ink transition-colors">{link.label}</span>
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
            <div className="bg-white/80 backdrop-blur-xl border border-black/5 p-2 rounded-[2rem] flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)] max-w-sm mx-auto w-full">
              <button 
                onClick={() => {
                  onClose();
                  onSearchClick?.();
                }}
                className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                title="Search"
              >
                <Search size={20} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
              </button>
              
              <div className="w-px h-8 bg-black/10 shrink-0" />

              <Link 
                href="/account/wishlist" 
                onClick={onClose} 
                className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                title="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Wishlist</span>
              </Link>
              
              <div className="w-px h-8 bg-black/10 shrink-0" />

              {isLoggedIn ? (
                <Link 
                  href="/account" 
                  onClick={onClose} 
                  className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                  title="Account"
                >
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Account</span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  onClick={onClose} 
                  className="flex flex-col items-center justify-center gap-1.5 flex-1 py-2 text-ink/60 hover:text-primary hover:bg-black/5 rounded-2xl transition-all"
                  title="Login"
                >
                  <LogIn size={20} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Login</span>
                </Link>
              )}
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
