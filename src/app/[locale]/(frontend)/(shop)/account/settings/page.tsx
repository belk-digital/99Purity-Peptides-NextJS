import React from 'react'
import { SettingsClient } from './SettingsClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Account Settings | 99 Purity Peptides',
}

export default async function SettingsPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || null,
    authProvider: (user as any).authProvider || 'credentials',
    preferredLocale: user.preferredLocale || 'en',
    acceptsMarketing: user.acceptsMarketing || false,
    orderSmsUpdates: (user as any).orderSmsUpdates || false,
  }

  return <SettingsClient user={userData} />
}
