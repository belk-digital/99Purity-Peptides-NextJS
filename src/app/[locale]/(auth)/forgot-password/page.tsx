'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Space_Grotesk } from 'next/font/google'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { requestPasswordReset } from './actions'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword')
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordInput) => {
    await requestPasswordReset(data)
    setSubmitted(true)
  }

  return (
    <AuthSplitLayout mode="login">
      <div className="w-full flex flex-col gap-6">
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <MailCheck size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h1 className={`text-2xl font-bold tracking-tight text-ink ${spaceGrotesk.className}`}>
                Check your email
              </h1>
              <p className="text-sm text-ink/60 max-w-[280px] mx-auto">
                {t('success')}
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="dark" size="lg" className="w-full rounded-full">
                {t('backToLogin')}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight text-ink mb-2 ${spaceGrotesk.className}`}>
                {t('title')}
              </h1>
              <p className="text-sm text-ink/60">{t('subtitle')}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Button type="submit" variant="dark" size="lg" className="w-full rounded-full mt-2" isLoading={isSubmitting}>
                {t('submit')}
              </Button>
            </form>
            <Link href="/login" className="text-xs font-bold text-ink hover:underline self-center">
              {t('backToLogin')}
            </Link>
          </>
        )}
      </div>
    </AuthSplitLayout>
  )
}
