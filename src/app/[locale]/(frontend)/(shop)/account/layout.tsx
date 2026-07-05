import React from 'react'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { MobileSidebar } from '@/components/account/MobileSidebar'

import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  title: 'My Account | 99 Purity Peptides',
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('account.layout')
  const user = await getPayloadUser()
  const userName = user?.firstName || user?.email?.split('@')[0] || 'User'
  const purityPoints = user?.purityPoints || 0

  let affiliateStatus: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended' = 'none'
  if (user) {
    const payload = await getPayload({ config })
    const { docs: affiliates } = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    })
    if (affiliates.length > 0) {
      affiliateStatus = affiliates[0].status || 'pending'
    }
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen selection:bg-black/10 flex flex-col lg:flex-row">
      {/* Static Sidebar for Desktop */}
      <div className="hidden lg:block w-[280px] shrink-0 z-40 bg-white lg:rounded-r-3xl border-r border-gray-100 shadow-sm">
        <AccountSidebar userName={userName} purityPoints={purityPoints} affiliateStatus={affiliateStatus} />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar>
        <AccountSidebar userName={userName} purityPoints={purityPoints} affiliateStatus={affiliateStatus} />
      </MobileSidebar>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 px-4 py-8 md:p-10 lg:p-12">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
