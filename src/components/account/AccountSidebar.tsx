'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, MapPin, Heart, Settings, LogOut, ArrowRight, Bot, Truck, LifeBuoy, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { signOut } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'

const NAV_ITEMS = [
  { key: 'overview', href: '/account', icon: LayoutDashboard },
  { key: 'orders', href: '/account/orders', icon: Package },
  { key: 'addresses', href: '/account/addresses', icon: MapPin },
  { key: 'wishlist', href: '/account/wishlist', icon: Heart },
  { key: 'settings', href: '/account/settings', icon: Settings },
]

export function AccountSidebar({ 
  userName = 'User', 
  purityPoints = 0,
  affiliateStatus = 'none' 
}: { 
  userName?: string
  purityPoints?: number
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended'
}) {
  const t = useTranslations('account.sidebar')
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)

  return (
    <aside className="w-full h-full flex flex-col gap-6 p-6 lg:py-10 lg:px-6">
      
      {/* Logo & Section Title */}
      <div className="flex flex-col gap-1 px-4 lg:px-0">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity gap-2 mb-6">
          <img src="/99 Images/99pp-Logo.png" alt="99Purity Peptides" className="h-10 sm:h-12 w-auto object-contain filter invert opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(18%) saturate(1637%) hue-rotate(143deg) brightness(97%) contrast(93%)' }} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/account' 
            ? pathname.endsWith('/account') 
            : pathname.includes(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center justify-start gap-4 px-5 py-3 rounded-xl text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300
                ${isActive 
                  ? 'text-white shadow-md' 
                  : 'text-[#1e5661] hover:bg-gray-100/50 bg-transparent'
                }
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-[#2b646c] rounded-xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={16} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="relative z-10 font-heading">{t(`nav.${item.key}`)}</span>
            </Link>
          )
        })}

        <div className="w-full h-px bg-gray-200 my-4" />

        {/* Sign out */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-start gap-4 px-5 py-3 rounded-xl text-[12px] font-bold uppercase tracking-[0.1em] text-black hover:bg-gray-100/50 transition-all duration-300 group bg-transparent">
              <LogOut size={16} className="text-gray-400 group-hover:text-black transition-colors duration-300 transform rotate-180" />
              <span className="relative z-10 font-heading">{t('signOut')}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className={`text-2xl font-bold tracking-tight text-black font-heading`}>
                {t('signOutDialogTitle')}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-2">
                {t('signOutDialogDescription')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
              <DialogClose asChild>
                <button className="px-6 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-black bg-gray-100 hover:bg-gray-200 transition-colors w-full sm:w-auto text-center">
                  {t('cancel')}
                </button>
              </DialogClose>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-6 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md w-full sm:w-auto text-center"
              >
                {t('confirmSignOut')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>

      {/* Partner Program Banner */}
      <div className="mt-4 flex flex-col gap-4 bg-[#112a2e] rounded-2xl relative overflow-hidden shadow-lg border border-[#2b646c] min-h-[280px]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/denskvdyt/image/upload/v1783098784/partner_program_ub13f7.webp" 
            alt="Partner Program Background" 
            className="absolute inset-0 w-full h-full object-cover object-right opacity-60 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 p-6 flex flex-col gap-3 h-[280px] justify-start">
          <span className="text-xs font-bold text-white tracking-widest font-heading uppercase">{t('partnerProgram')}</span>
          <p className="text-[13px] text-gray-200 leading-snug max-w-[80%] font-heading">
            {t.rich('partnerProgramDescription', { strong: (chunks) => <strong className="text-white font-bold">{chunks}</strong> })}
          </p>
          <Link href="/affiliates" className="mt-2 w-max inline-flex items-center gap-2 bg-white text-[#112a2e] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors font-heading">
            {t('applyNow')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* AI Assistant & Quick Links */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center bg-green-500/10 text-green-700 py-3 px-4 rounded-xl mb-4">
              <span className="text-sm font-medium">Purity Points</span>
              <span className="font-bold text-lg">{Number(purityPoints).toFixed(2)}</span>
            </div>
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-[#2b646c]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-black font-heading">{t('aiAssistant')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={t('askMeAnything')}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#2b646c] pr-12 font-heading"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/account/orders" className="flex-1 flex items-center justify-center gap-2 bg-white rounded-xl py-3 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <Truck size={14} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black whitespace-nowrap font-heading">{t('trackOrder')}</span>
          </Link>
          <Link href="/contact-us" className="flex-1 flex items-center justify-center gap-2 bg-white rounded-xl py-3 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <LifeBuoy size={14} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black whitespace-nowrap font-heading">{t('helpCenter')}</span>
          </Link>
        </div>
      </div>

    </aside>
  )
}

