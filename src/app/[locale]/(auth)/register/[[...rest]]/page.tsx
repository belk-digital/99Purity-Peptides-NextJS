'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Space_Grotesk } from 'next/font/google'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { registerUser } from '../actions'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setServerError('')
    const result = await registerUser(data)

    if (!result.success) {
      setServerError(result.error === 'emailInUse' ? t('emailInUse') : t('genericError'))
      return
    }

    const signInResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/account',
    })

    if (!signInResult || signInResult.error) {
      setServerError(t('genericError'))
      return
    }

    router.push('/account')
    router.refresh()
  }

  const handleGoogle = () => {
    setIsGoogleLoading(true)
    signIn('google', { callbackUrl: '/account' })
  }

  return (
    <AuthSplitLayout mode="register">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input id="firstName" error={errors.firstName?.message} {...register('firstName')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input id="lastName" error={errors.lastName?.message} {...register('lastName')} />
            </div>
          </div>
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
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
    </AuthSplitLayout>
  )
}
