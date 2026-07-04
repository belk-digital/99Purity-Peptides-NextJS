'use client'

import React, { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Space_Grotesk } from 'next/font/google'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

function LoginForm() {
  const t = useTranslations('auth.login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const [serverError, setServerError] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setServerError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl,
    })

    if (!result || result.error) {
      setServerError(t('invalidCredentials'))
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  const handleGoogle = () => {
    setIsGoogleLoading(true)
    signIn('google', { callbackUrl })
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight text-ink mb-2 ${spaceGrotesk.className}`}>
          {t('title')}
        </h1>
        <p className="text-sm text-ink/60">{t('subtitle')}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full rounded-xl flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-ink border-slate-200 shadow-sm"
        onClick={handleGoogle}
        isLoading={isGoogleLoading}
      >
        {!isGoogleLoading && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {t('google') || 'Continue with Google'}
      </Button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-xs font-medium text-ink/40">{t('or')}</span>
        <div className="h-px flex-1 bg-ink/10" />
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
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center mb-1.5">
            <Label htmlFor="password" className="!mb-0">
              {t('password')}
            </Label>
            <Link href="/forgot-password" className="text-xs font-bold text-ink hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>
        {serverError && <p className="text-sm font-medium text-red-500">{serverError}</p>}
        <Button type="submit" variant="dark" size="lg" className="w-full rounded-full mt-2" isLoading={isSubmitting}>
          {t('submit')}
        </Button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthSplitLayout mode="login">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  )
}
