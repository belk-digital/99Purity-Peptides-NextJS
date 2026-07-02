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
    await payload.forgotPassword({
      collection: 'users',
      data: { email: parsed.data.email },
      disableEmail: false,
    })
  } catch {
    // swallow — same reasoning as above
  }

  return { success: true as const }
}
