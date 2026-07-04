'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Settings2, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { updatePayoutCurrency } from './actions'

interface SettingsClientProps {
  initialCurrency: string;
}

export function SettingsClient({ initialCurrency }: SettingsClientProps) {
  const t = useTranslations('affiliate.dashboardSettings')
  const [currency, setCurrency] = React.useState(initialCurrency || 'USD')
  const [isPending, startTransition] = React.useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updatePayoutCurrency(currency)
      if (!result.success) {
        toast.error(result.error || 'Failed to save preferences')
        return
      }
      toast.success('Preferences saved')
    })
  }
  // Animation variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="flex flex-col gap-8 max-w-3xl"
    >
      <motion.div variants={itemVars}>
        <h1 className="text-3xl font-bold tracking-tight text-[#1e5661] mb-2 font-heading">
          {t('title')}
        </h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVars} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-400 pointer-events-none">
          <Settings2 size={120} />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-black">{t('payoutMethodTitle')}</h3>
            <p className="text-sm text-gray-500">{t('payoutMethodDesc')}</p>
          </div>

          <form className="space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">{t('preferredCurrencyLabel')}</label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-black text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                >
                  <option value="USD">{t('currencyUsd')}</option>
                  <option value="BTC">{t('currencyBtc')}</option>
                  <option value="ETH">{t('currencyEth')}</option>
                  <option value="USDT_ERC20">{t('currencyUsdtErc20')}</option>
                  <option value="USDT_TRC20">{t('currencyUsdtTrc20')}</option>
                  <option value="STORE_CREDIT">{t('currencyStoreCredit')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-xl h-12 px-8 text-xs font-bold uppercase tracking-widest gap-2 bg-[#008B8B] hover:bg-blue-600 text-white border-none shadow-md disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {t('savePreferencesButton')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

