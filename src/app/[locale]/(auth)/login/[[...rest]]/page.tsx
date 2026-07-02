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
        className="w-full rounded-xl"
        onClick={handleGoogle}
        isLoading={isGoogleLoading}
      >
        {t('google')}
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
