'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdatePasswordDialog({ open, onOpenChange }: DialogProps) {
  const t = useTranslations('account.securityDialogs')
  const { user } = useUser()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    if (!user) return

    setIsLoading(true)
    try {
      if (user.passwordEnabled) {
        await user.updatePassword({
          currentPassword,
          newPassword
        })
      } else {
        await user.updatePassword({
          newPassword
        })
      }
      toast.success(t('passwordUpdateSuccess'))
      onOpenChange(false)
      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Password update error', err)
      const errCode = err.errors?.[0]?.code
      if (errCode === 'session_reverification_required') {
        setError(t('reverificationRequired'))
      } else {
        setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || t('passwordUpdateError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('updatePasswordTitle')}</DialogTitle>
          <DialogDescription>
            {t('updatePasswordDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          {user?.passwordEnabled && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="current">{t('currentPassword')}</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new">{t('newPassword')}</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">{t('confirmNewPassword')}</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('cancel')}</Button>
            </DialogClose>
            <Button type="submit" variant="dark" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('updatePasswordTitle')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ChangeEmailDialog({ open, onOpenChange }: DialogProps) {
  const t = useTranslations('account.securityDialogs')
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [emailId, setEmailId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!user) return

    setIsLoading(true)
    try {
      // 1. Create the new email address
      const newEmail = await user.createEmailAddress({ email })
      setEmailId(newEmail.id)
      
      // 2. Trigger the verification code
      await newEmail.prepareVerification({ strategy: 'email_code' })
      
      setStep('verify')
      toast.success(t('verificationCodeSent'))
    } catch (err: any) {
      console.error('Email preparation error', err)
      setError(err.errors?.[0]?.message || t('emailPreparationError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!user) return

    setIsLoading(true)
    try {
      // Get the email address object we just created
      const emailObj = user.emailAddresses.find((e) => e.id === emailId)
      if (!emailObj) throw new Error('Email object not found')

      // 1. Verify the code
      const verifiedEmail = await emailObj.attemptVerification({ code })

      if (verifiedEmail.verification.status === 'verified') {
        // 2. Optionally set it as primary (required if deleting the old one)
        // Clerk SDK uses setAsPrimary on the email object or user.update
        toast.success(t('emailUpdateSuccess'))
        onOpenChange(false)
        resetState()
      } else {
        setError(t('verificationFailed'))
      }
    } catch (err: any) {
      console.error('Email verification error', err)
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || t('invalidVerificationCode'))
    } finally {
      setIsLoading(false)
    }
  }

  const resetState = () => {
    setEmail('')
    setCode('')
    setStep('input')
    setError('')
    setEmailId('')
  }

  // Intercept dialog close to reset state
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetState()
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('changeEmailTitle')}</DialogTitle>
          <DialogDescription>
            {step === 'input'
              ? t('changeEmailDescriptionInput')
              : t('changeEmailDescriptionVerify', { email })}
          </DialogDescription>
        </DialogHeader>

        {step === 'input' ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t('newEmailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">{t('cancel')}</Button>
              </DialogClose>
              <Button type="submit" variant="dark" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {t('sendCode')}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">{t('verificationCode')}</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                className="tracking-widest font-mono text-center text-lg h-12"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setStep('input')}>{t('back')}</Button>
              <Button type="submit" variant="dark" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {t('verify')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
