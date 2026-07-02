'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: 'invalid' as const }
  }

  const { firstName, lastName, email, password } = parsed.data
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    return { success: false as const, error: 'emailInUse' as const }
  }

  try {
    await payload.create({
      collection: 'users',
      data: {
        firstName,
        lastName,
        email,
        password,
        role: 'customer',
        authProvider: 'credentials',
      },
      overrideAccess: true,
    })
    return { success: true as const }
  } catch {
    return { success: false as const, error: 'generic' as const }
  }
}
