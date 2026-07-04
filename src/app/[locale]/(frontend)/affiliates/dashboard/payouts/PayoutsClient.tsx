'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { WalletCards, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface PayoutsClientProps {
  payoutRequests: {
    id: string;
    date: string;
    amount: number; // in cents
    method: string;
    details: string;
    status: string;
  }[];
  availableBalance: number;
  totalPendingHold: number;
  minimumThreshold: number;
  pendingPeriodDays: number;
}

export function PayoutsClient({ payoutRequests, availableBalance, totalPendingHold, minimumThreshold, pendingPeriodDays }: PayoutsClientProps) {
  const t = useTranslations('affiliate.payouts')
  const router = useRouter()

  const statusLabel = (status: string) => {
    if (status === 'pending') return t('statusPending')
    if (status === 'paid') return t('statusPaid')
    if (status === 'rejected') return t('statusRejected')
    return t('statusProcessing')
  }

  const [amount, setAmount] = useState<string>('')
  const [method, setMethod] = useState<'zelle' | 'cashapp' | 'applepay'>('zelle')
  const [details, setDetails] = useState<string>('')
  
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t('errorInvalidAmount'))
      return
    }

    if (parsedAmount * 100 < minimumThreshold) {
      setError(t('errorMinimumAmount', { amount: formatMoney(minimumThreshold) }))
      return
    }

    if (parsedAmount * 100 > availableBalance) {
      setError(t('errorExceedsBalance'))
      return
    }

    if (!details.trim()) {
      setError(t('errorMissingDetails'))
      return
    }

    setIsRequesting(true)
    
    try {
      const res = await fetch('/api/affiliates/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          method,
          details,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(t('successRequestSubmitted'))
        setAmount('')
        setDetails('')
        router.refresh()
      } else {
        setError(data.error || t('errorSubmitFailed'))
      }
    } catch (err) {
      setError(t('errorUnexpected'))
    } finally {
      setIsRequesting(false)
    }
  }

  // Animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance Card */}
        <motion.div variants={itemVars} className="bg-black p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between min-h-[200px]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2 font-heading">
              {t('availableBalanceTitle')}
            </h1>
            <p className="text-gray-400 text-sm">{t('availableBalanceDesc')}</p>
          </div>
          <div className="mt-8">
            <span className="text-5xl font-black text-[#008B8B] tracking-tight">{formatMoney(availableBalance)}</span>
          </div>
        </motion.div>

        {/* Pending Hold Card */}
        <motion.div variants={itemVars} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h1 className="text-xl font-bold tracking-tight text-black font-heading">
                {t('dayHoldTitle', { days: pendingPeriodDays })}
              </h1>
            </div>
            <p className="text-gray-500 text-sm">{t('dayHoldDesc', { days: pendingPeriodDays })}</p>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-black text-gray-400 tracking-tight">{formatMoney(totalPendingHold)}</span>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVars} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-black mb-6 font-heading">
          {t('requestPayoutTitle')}
        </h2>

        <form onSubmit={handleRequestPayout} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t('amountLabel')}</label>
            <input
              type="number"
              step="0.01"
              min={(minimumThreshold / 100).toString()}
              max={(availableBalance / 100).toString()}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t('methodLabel')}</label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            >
              <option value="zelle">{t('methodZelle')}</option>
              <option value="cashapp">{t('methodCashapp')}</option>
              <option value="applepay">{t('methodApplePay')}</option>
            </select>
          </div>

          <div className="flex-[1.5] w-full flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t('detailsLabel')}</label>
            <input
              type="text"
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder={t('detailsPlaceholder')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isRequesting || availableBalance < minimumThreshold}
            className="w-full md:w-auto bg-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('requestButton')}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {success}
          </div>
        )}
      </motion.div>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-black px-2 font-heading">
          {t('payoutHistoryTitle')}
        </h2>
        {payoutRequests.length === 0 ? (
          <motion.div variants={itemVars} className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-4 text-gray-500">
            <WalletCards size={48} className="text-gray-200" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-black">{t('emptyTitle')}</h3>
              <p className="text-sm">{t('emptyDesc')}</p>
            </div>
          </motion.div>
        ) : (
          payoutRequests.map((req) => (
            <motion.div 
              key={req.id} 
              variants={itemVars}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg hover:shadow-black/5 hover:border-gray-200 transition-all duration-300 gap-6 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              
              <div className="flex flex-col gap-2 pl-2 md:w-1/4">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">{t('dateLabel')}</span>
                <span className="text-base font-bold text-black">{req.date}</span>
              </div>

              <div className="flex flex-col gap-2 md:w-1/4">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">{t('methodLabel')}</span>
                <span className="text-sm font-medium text-gray-600 capitalize">{req.method}</span>
                <span className="text-xs text-gray-400 truncate max-w-[150px]">{req.details}</span>
              </div>

              <div className="flex flex-col md:items-end gap-2 md:w-1/2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">{t('amountColumnLabel')}</span>
                <div className="flex items-center gap-4">
                  <span className="text-base text-black font-bold">{formatMoney(req.amount)}</span>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      req.status === 'pending' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' :
                      req.status === 'paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                      req.status === 'rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                      'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600">{statusLabel(req.status)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

