'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Package, LifeBuoy, Heart, Calendar, MapPin, Users, BarChart3, Search, Bell, Hexagon, Star, ChevronRight, Truck, Headphones } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getMappedStatus, type DisplayOrderStatus } from '@/lib/orders/statusLabel'

export interface AccountOverviewProps {
  stats: {
    ordersPlaced: number;
    wishlistCount: number;
    purityPoints: number;
    memberSince: string;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    total: number;
  }[];
  defaultAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended';
  userName?: string;
  spending: {
    year: number;
    totalSpent: number;
    categories: { label: string; color: string; value: number; pct: number }[];
  };
}

export function AccountOverviewClient({ stats, recentOrders, defaultAddress, affiliateStatus = 'none', userName = 'User', spending }: AccountOverviewProps) {
  const DONUT_RADIUS = 35
  const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
  let cumulativePct = 0
  const t = useTranslations('account.overview')

  const STATUS_LABELS: Record<DisplayOrderStatus, string> = {
    Placed: t('statusPlaced'),
    Processing: t('statusProcessing'),
    Shipped: t('statusShipped'),
    Delivered: t('statusDelivered'),
  }

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 w-full"
    >
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1e5661] text-xl font-bold shrink-0 font-heading">
            99
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1 font-heading">{t('welcomeBack')}, <span className="text-sm">👋</span></span>
            <h1 className="text-3xl lg:text-[40px] font-bold text-[#1e5661] tracking-tighter leading-none mt-1 mb-1 font-heading uppercase">
              {userName}
            </h1>
            <span className="text-[11px] text-gray-500 mt-0.5">{t('subtitle')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-black hover:border-gray-300 transition-colors">
            <Search size={18} />
          </button>
          <button className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-black hover:border-gray-300 transition-colors">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#1e5661] rounded-full border-[1.5px] border-white" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <motion.div variants={itemVars} className="relative bg-[#112a2e] p-4 sm:p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[160px] lg:col-span-2">
          <div className="absolute inset-0 z-0">
            <img src="https://res.cloudinary.com/denskvdyt/image/upload/v1783098784/Maxx_points_dluokr.webp" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1">
              {t('purityPoints')} <Hexagon size={10} className="text-white ml-0.5 hidden sm:block" />
            </span>
            <Star size={32} strokeWidth={1.5} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] sm:w-[42px] sm:h-[42px]" />
          </div>
          <div className="relative z-10 flex flex-col mt-2 sm:mt-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
              <span className={`text-2xl sm:text-4xl text-white font-bold tracking-tighter font-heading`}>{Number(stats.purityPoints.toFixed(2))}</span>
              <span className="text-[10px] sm:text-xs text-gray-300 font-medium font-heading">(${stats.purityPoints.toFixed(2)})</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-300 mt-1 sm:mt-2 leading-tight hidden sm:block">{t('purityPointsDescription')}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-4 text-center min-h-[140px] sm:min-h-[160px]">
          <Package size={24} className="text-black sm:w-[32px] sm:h-[32px]" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-black font-heading mb-1 text-center">{t('ordersPlaced')}</span>
            <span className={`text-2xl sm:text-3xl text-black font-bold tracking-tighter font-heading`}>{stats.ordersPlaced}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-4 text-center min-h-[140px] sm:min-h-[160px]">
          <Heart size={24} className="text-black sm:w-[32px] sm:h-[32px]" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-black font-heading mb-1 text-center">{t('wishlistItems')}</span>
            <span className={`text-2xl sm:text-3xl text-black font-bold tracking-tighter font-heading`}>{stats.wishlistCount}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-4 text-center min-h-[140px] sm:min-h-[160px]">
          <Calendar size={24} className="text-black sm:w-[32px] sm:h-[32px]" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-black font-heading mb-1 text-center">{t('memberSince')}</span>
            <span className={`text-2xl sm:text-3xl text-black font-bold tracking-tighter font-heading`}>{stats.memberSince || new Date().getFullYear()}</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <motion.div variants={itemVars} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black font-heading">{t('recentOrders')}</h3>
            <Link href="/account/orders" className="text-[10px] font-bold uppercase tracking-widest text-[#2b646c] hover:underline font-heading">
              {t('viewAll')}
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col shadow-sm min-h-[320px]">
            {recentOrders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <Link href={`/account/orders/${order.id}`} key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-black">#{order.orderNumber}</span>
                      <span className="text-[10px] text-gray-500">{order.date}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-black">${order.total.toFixed(2)}</span>
                      {(() => {
                        const mappedStatus = getMappedStatus(order.status)
                        return (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${mappedStatus === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {STATUS_LABELS[mappedStatus]}
                          </span>
                        )
                      })()}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center h-full">
                <Package size={40} className="text-black mb-4" />
                <p className="text-[13px] font-medium text-black font-heading">{t('noOrdersYetTitle')}</p>
                <p className="text-[11px] text-gray-500 mt-1 font-heading">{t('noOrdersYetSubtitle')}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Default Address */}
        <motion.div variants={itemVars} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black font-heading">{t('defaultAddress')}</h3>
            <Link href="/account/addresses" className="text-[10px] font-bold uppercase tracking-widest text-[#2b646c] hover:underline font-heading">
              {t('edit')}
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col shadow-sm min-h-[320px]">
            {defaultAddress ? (
              <div className="flex flex-col text-[13px] text-gray-600 leading-relaxed pt-2">
                <span className="text-black font-bold uppercase tracking-widest text-[11px] bg-gray-50 px-3 py-1.5 rounded-full self-start inline-flex items-center gap-2 mb-4">
                  <MapPin size={12} className="text-gray-400" />
                  {defaultAddress.name}
                </span>
                <span className="font-medium text-black">{defaultAddress.street}</span>
                <span>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</span>
                <span>{defaultAddress.country}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center h-full">
                <MapPin size={40} className="text-black mb-4" />
                <p className="text-[13px] font-medium text-black font-heading">{t('noAddressYet')}</p>
                <Link href="/account/addresses" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg font-heading">
                  {t('addAddress')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Spending Overview */}
        <motion.div variants={itemVars} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black font-heading">{t('spendingOverview')}</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-black border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1 font-heading">
              {spending.year}
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-sm min-h-[320px]">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 sm:ml-4">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f0f8f9" strokeWidth="25" />
                {spending.categories.map((cat, i) => {
                  const segmentLength = (cat.pct / 100) * DONUT_CIRCUMFERENCE
                  const offset = -((cumulativePct / 100) * DONUT_CIRCUMFERENCE)
                  cumulativePct += cat.pct
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r={DONUT_RADIUS}
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth="25"
                      strokeDasharray={`${segmentLength} ${DONUT_CIRCUMFERENCE - segmentLength}`}
                      strokeDashoffset={offset}
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-4">
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-1 font-heading">{t('totalSpent')}</span>
                <span className="text-[15px] font-bold text-black leading-tight font-heading">${spending.totalSpent.toFixed(2)}</span>
              </div>
            </div>

            <div className="w-full sm:flex-1 flex flex-col gap-3 justify-center text-[11px] min-w-0">
              {spending.categories.length > 0 ? spending.categories.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 truncate">{item.label}</span>
                  </div>
                  <span className="font-medium text-black shrink-0 text-right">${item.value.toFixed(2)}</span>
                  <span className="text-gray-400 shrink-0 text-right w-9">{item.pct}%</span>
                </div>
              )) : (
                <p className="text-gray-400 text-center">{t('noPurchasesYet')}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Support & Programs */}
        <motion.div variants={itemVars} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black font-heading">{t('supportAndPrograms')}</h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col justify-center gap-1 shadow-sm min-h-[320px]">
            
            {affiliateStatus === 'approved' ? (
              <Link href="/affiliates/dashboard" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4 text-black">
                  <BarChart3 size={24} className="text-black" />
                  <div className="flex flex-col ml-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black font-heading">{t('affiliateDashboard')}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">{t('manageLinksAndPayouts')}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </Link>
            ) : (
              <Link href="/affiliates" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4 text-black">
                  <Users size={24} className="text-black" />
                  <div className="flex flex-col ml-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black font-heading">{t('earnCommission')}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5">{t('joinPartnerProgram')}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
              </Link>
            )}

            <div className="h-px bg-gray-100 w-[90%] mx-auto" />

            <Link href="/account/orders" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4 text-black">
                <Package size={24} className="text-black" />
                <div className="flex flex-col ml-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black font-heading">{t('trackOrder')}</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">{t('trackOrderDescription')}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
            </Link>

            <div className="h-px bg-gray-100 w-[90%] mx-auto" />
            
            <Link href="/contact-us" className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4 text-black">
                <Headphones size={24} className="text-black" />
                <div className="flex flex-col ml-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black font-heading">{t('contactUs')}</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">{t('contactUsDescription')}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-black transition-colors" />
            </Link>

          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
