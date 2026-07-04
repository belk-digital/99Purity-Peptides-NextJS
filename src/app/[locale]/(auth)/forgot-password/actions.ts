'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const }
  }

  const payload = await getPayload({ config })

  // Always return success regardless of whether the email exists, to avoid leaking account existence.
  try {
    const token = await payload.forgotPassword({
      collection: 'users',
      data: { email: parsed.data.email },
      disableEmail: true,
    })

    if (token && typeof token === 'string') {
      const userDocs = await payload.find({
        collection: 'users',
        where: { email: { equals: parsed.data.email } },
        limit: 1,
      })

      if (userDocs.docs.length > 0) {
        const user = userDocs.docs[0]
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
        const locale = (user as any)?.preferredLocale === 'es' ? '/es' : ''
        const url = `${base}${locale}/reset-password/${token}`
        
        const { generateForgotPasswordEmail } = await import('@/lib/emails/generateForgotPasswordEmail')
        const html = await generateForgotPasswordEmail(url, user)

        await payload.sendEmail({
          from: 'support@99puritypeptides.com',
          to: parsed.data.email,
          subject: 'Reset Your Password - 99 Purity Peptides',
          html,
        })
      }
    }
  } catch (err) {
    // swallow — same reasoning as above
  }

  return { success: true as const }
}
