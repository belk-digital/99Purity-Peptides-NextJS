'use server'

import crypto from 'crypto'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'

const CODE_TTL_MS = 10 * 60 * 1000

function hashCode(code: string) {
  return crypto.createHmac('sha256', process.env.PAYLOAD_SECRET || '').update(code).digest('hex')
}

export async function updateProfile(formData: FormData) {
  const t = await getTranslations('account.settings')
  try {
    const user = await getPayloadUser()
    if (!user) return { success: false, error: t('errorUnauthorized') }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string

    const payload = await getPayload({ config })

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        firstName,
        lastName,
        phone,
      } as any,
      overrideAccess: true,
    })

    revalidatePath('/account/settings')
    revalidatePath('/account')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || t('errorUnexpected') }
  }
}

export async function updatePreferencesAction(input: {
  preferredLocale?: 'en' | 'es'
  acceptsMarketing?: boolean
  orderSmsUpdates?: boolean
}) {
  const t = await getTranslations('account.settings')
  const user = await getPayloadUser()
  if (!user) return { success: false, error: t('errorUnauthorized') }

  const payload = await getPayload({ config })
  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: input as any,
      overrideAccess: true,
    })
    revalidatePath('/account/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || t('errorUnexpected') }
  }
}

export async function updatePasswordAction(input: {
  currentPassword?: string
  newPassword: string
}) {
  const t = await getTranslations('account.securityDialogs')
  const user = await getPayloadUser()
  if (!user) return { success: false, error: t('passwordUpdateError') }

  const payload = await getPayload({ config })

  if ((user as any).authProvider !== 'google') {
    if (!input.currentPassword) return { success: false, error: t('passwordUpdateError') }
    try {
      await payload.login({
        collection: 'users',
        data: { email: user.email, password: input.currentPassword },
        overrideAccess: true,
      })
    } catch {
      return { success: false, error: t('passwordUpdateError') }
    }
  }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { password: input.newPassword } as any,
      overrideAccess: true,
    })
    return { success: true }
  } catch {
    return { success: false, error: t('passwordUpdateError') }
  }
}

export async function requestEmailChangeAction(newEmail: string) {
  const t = await getTranslations('account.securityDialogs')
  const user = await getPayloadUser()
  if (!user) return { success: false, error: t('emailPreparationError') }

  const payload = await getPayload({ config })
  const normalizedEmail = newEmail.toLowerCase()

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: normalizedEmail } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    return { success: false, error: t('emailPreparationError') }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        pendingEmail: normalizedEmail,
        pendingEmailCodeHash: hashCode(code),
        pendingEmailCodeExpiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      } as any,
      overrideAccess: true,
    })

    await payload.sendEmail({
      to: normalizedEmail,
      subject: 'Verify your new email address',
      html: `<p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p><p>This code expires in 10 minutes.</p>`,
    })

    return { success: true }
  } catch {
    return { success: false, error: t('emailPreparationError') }
  }
}

export async function verifyEmailChangeAction(code: string) {
  const t = await getTranslations('account.securityDialogs')
  const user = await getPayloadUser()
  if (!user) return { success: false, error: t('invalidVerificationCode') }

  const pendingEmail = (user as any).pendingEmail as string | null
  const pendingEmailCodeHash = (user as any).pendingEmailCodeHash as string | null
  const pendingEmailCodeExpiresAt = (user as any).pendingEmailCodeExpiresAt as string | null

  if (!pendingEmail || !pendingEmailCodeHash || !pendingEmailCodeExpiresAt) {
    return { success: false, error: t('invalidVerificationCode') }
  }
  if (new Date(pendingEmailCodeExpiresAt).getTime() < Date.now()) {
    return { success: false, error: t('invalidVerificationCode') }
  }
  if (hashCode(code) !== pendingEmailCodeHash) {
    return { success: false, error: t('invalidVerificationCode') }
  }

  const payload = await getPayload({ config })
  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        email: pendingEmail,
        pendingEmail: null,
        pendingEmailCodeHash: null,
        pendingEmailCodeExpiresAt: null,
      } as any,
      overrideAccess: true,
    })
    revalidatePath('/account/settings')
    return { success: true }
  } catch {
    return { success: false, error: t('emailPreparationError') }
  }
}
