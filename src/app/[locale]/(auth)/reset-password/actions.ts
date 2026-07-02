'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'

export async function resetPassword(token: string, input: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: 'invalid' as const }
  }

  const payload = await getPayload({ config })

  try {
    const result = await payload.resetPassword({
      collection: 'users',
      data: { token, password: parsed.data.password },
      overrideAccess: true,
    })
    if (!result?.user) {
      return { success: false as const, error: 'invalidToken' as const }
    }
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'invalidToken' as const }
  }
}
