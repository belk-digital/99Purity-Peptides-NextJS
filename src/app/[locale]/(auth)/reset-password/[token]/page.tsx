'use client'

import React, { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Space_Grotesk } from 'next/font/google'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { resetPassword } from '../actions'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const t = useTranslations('auth.resetPassword')
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError('')
    const result = await resetPassword(token, data)
    if (!result.success) {
      setServerError(result.error === 'invalidToken' ? t('invalidToken') : t('mismatch'))
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <AuthSplitLayout mode="login">
      <div className="w-full flex flex-col gap-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight text-ink mb-2 ${spaceGrotesk.className}`}>
            {t('title')}
          </h1>
          <p className="text-sm text-ink/60">{t('subtitle')}</p>
        </div>

        {success ? (
          <p className="text-sm font-medium text-ink">{t('success')}</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t('newPassword')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message ? t('mismatch') : undefined}
                {...register('confirmPassword')}
              />
            </div>
            {serverError && <p className="text-sm font-medium text-red-500">{serverError}</p>}
            <Button type="submit" variant="dark" size="lg" className="w-full rounded-full mt-2" isLoading={isSubmitting}>
              {t('submit')}
            </Button>
          </form>
        )}

        <Link href="/login" className="text-xs font-bold text-ink hover:underline self-center">
          {t('backToLogin')}
        </Link>
      </div>
    </AuthSplitLayout>
  )
}
