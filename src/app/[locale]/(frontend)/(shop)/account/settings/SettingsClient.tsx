'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExternalLink, Shield, Save, Bell, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'
import { UpdatePasswordDialog, ChangeEmailDialog } from '@/components/account/SecurityDialogs'

export interface AccountSettingsProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phone?: string | null;
    authProvider?: string;
    preferredLocale?: string;
    acceptsMarketing?: boolean;
    orderSmsUpdates?: boolean;
  }
}

export function SettingsClient({ user }: AccountSettingsProps) {
  const t = useTranslations('account.settings')
  const [isPending, startTransition] = React.useTransition()
  const [language, setLanguage] = React.useState(user.preferredLocale || 'en')
  const [marketingEmails, setMarketingEmails] = React.useState(user.acceptsMarketing ?? false)
  const [orderSms, setOrderSms] = React.useState(user.orderSmsUpdates ?? false)

  async function savePreferences(update: Partial<{ preferredLocale: 'en' | 'es'; acceptsMarketing: boolean; orderSmsUpdates: boolean }>) {
    const { updatePreferencesAction } = await import('./actions')
    const result = await updatePreferencesAction(update)
    if (!result.success) {
      toast.error(result.error || t('toastUpdateFailed'))
      return
    }
    toast.success(t('toastUpdateSuccess'))
  }

  // Custom dialog states
  const [passwordOpen, setPasswordOpen] = React.useState(false)
  const [emailOpen, setEmailOpen] = React.useState(false)

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const { updateProfile } = await import('./actions')
        const result = await updateProfile(formData)
        if (!result?.success) {
          toast.error(result?.error || t('toastUpdateFailed'))
          return
        }
        toast.success(t('toastUpdateSuccess'))
      } catch (error: any) {
        toast.error(error.message || t('toastUnexpectedError'))
      }
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full max-w-4xl"
    >
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-4xl text-black font-bold tracking-tighter font-heading">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Personal Info Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Shield size={14} />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-black font-heading">{t('personalInformation')}</h2>
          </div>

          <form action={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('firstName')}</Label>
                <Input name="firstName" id="firstName" defaultValue={user.firstName || ''} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('lastName')}</Label>
                <Input name="lastName" id="lastName" defaultValue={user.lastName || ''} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="phone" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('phoneNumber')}</Label>
                <Input name="phone" id="phone" type="tel" defaultValue={user.phone || ''} className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl font-heading" />
              </div>
              <div className="md:col-span-2 mt-4">
                <button disabled={isPending} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-lg disabled:opacity-50 font-heading">
                  <Save size={16} />
                  {isPending ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </div>
          </form>
        </motion.section>

        {/* Sign In & Security */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Shield size={14} />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-black font-heading">{t('signInAndSecurity')}</h2>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl flex flex-col gap-8 relative overflow-hidden group">

            <div className="flex items-start gap-5 relative z-10">
              <div className="w-12 h-12 bg-white rounded-full border border-gray-100 text-black flex items-center justify-center shadow-sm shrink-0">
                <Shield size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-black tracking-wide font-heading">{t('authManagedSecurely')}</span>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t.rich('authDescription', {
                    strong: (chunks) => <strong className="text-black font-semibold">{chunks}</strong>,
                    email: user.email,
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button
                type="button"
                onClick={() => setPasswordOpen(true)}
                className="flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white border border-gray-200 hover:border-black text-black rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors w-full sm:w-auto shadow-sm font-heading"
              >
                {t('updatePassword')} <ExternalLink size={14} />
              </button>
              <button
                type="button"
                onClick={() => setEmailOpen(true)}
                className="flex items-center justify-center gap-2 bg-white hover:bg-black hover:text-white border border-gray-200 hover:border-black text-black rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors w-full sm:w-auto shadow-sm font-heading"
              >
                {t('changeEmail')} <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Globe size={14} />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-black font-heading">{t('preferences')}</h2>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <Label htmlFor="language" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('language')}</Label>
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value)
                    startTransition(() => { savePreferences({ preferredLocale: value as 'en' | 'es' }) })
                  }}
                >
                  <SelectTrigger id="language" className="h-12 bg-gray-50 border-gray-100 focus:border-black focus:ring-black rounded-xl text-sm font-medium font-heading">
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-100 rounded-xl shadow-xl">
                    <SelectItem value="en" className="rounded-lg font-heading">{t('languageEnglishUs')}</SelectItem>
                    <SelectItem value="es" className="rounded-lg font-heading">{t('languageSpanish')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="currency" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] font-heading">{t('currency')}</Label>
                <div id="currency" className="h-12 flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-medium text-gray-500 font-heading">
                  {t('currencyUsd')}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Bell size={14} />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-black font-heading">{t('notifications')}</h2>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl flex flex-col gap-8">

            <div className="flex items-center justify-between gap-6 group hover:bg-gray-50 -mx-4 p-4 rounded-2xl transition-colors">
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-sm font-bold text-black font-heading">{t('marketingEmails')}</span>
                <span className="text-xs text-gray-500">{t('marketingEmailsDescription')}</span>
              </div>
              <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner shrink-0 relative z-10">
                <button
                  type="button"
                  onClick={() => { setMarketingEmails(true); startTransition(() => { savePreferences({ acceptsMarketing: true }) }) }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full transition-all font-heading ${marketingEmails ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t('on')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMarketingEmails(false); startTransition(() => { savePreferences({ acceptsMarketing: false }) }) }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full transition-all font-heading ${!marketingEmails ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t('off')}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 group hover:bg-gray-50 -mx-4 p-4 rounded-2xl transition-colors border-t border-gray-50 pt-8">
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-sm font-bold text-black font-heading">{t('orderSmsUpdates')}</span>
                <span className="text-xs text-gray-500">{t('orderSmsUpdatesDescription')}</span>
              </div>
              <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner shrink-0 relative z-10">
                <button
                  type="button"
                  onClick={() => { setOrderSms(true); startTransition(() => { savePreferences({ orderSmsUpdates: true }) }) }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full transition-all font-heading ${orderSms ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t('on')}
                </button>
                <button
                  type="button"
                  onClick={() => { setOrderSms(false); startTransition(() => { savePreferences({ orderSmsUpdates: false }) }) }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full transition-all font-heading ${!orderSms ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {t('off')}
                </button>
              </div>
            </div>

          </div>
        </motion.section>

      </div>

      <UpdatePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} isGoogleOnly={user.authProvider === 'google'} />
      <ChangeEmailDialog open={emailOpen} onOpenChange={setEmailOpen} />
    </motion.div>
  )
}
