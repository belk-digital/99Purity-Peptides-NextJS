import React from 'react'
import { redirect } from 'next/navigation'
import { AffiliateSidebar } from '@/components/affiliates/AffiliateSidebar'
import { AffiliateMobileSidebar } from '@/components/affiliates/AffiliateMobileSidebar'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'

export const metadata = {
  title: 'Affiliate Dashboard | 99 Purity Peptides',
}

export default async function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('affiliate.sidebar')
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })

  // Fetch Affiliate Data
  const { docs: affiliates } = await payload.find({
    collection: 'affiliates',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })

  // If no affiliate record or not approved, redirect to apply
  if (affiliates.length === 0 || affiliates[0].status !== 'approved') {
    redirect('/affiliates')
  }

  const affiliate = affiliates[0]
  const userName = affiliate.displayName || user?.firstName || user?.email?.split('@')[0] || t('defaultPartnerName')
  const tier = affiliate.tier || 'standard'

  return (
    <div className="bg-[#F8F9FA] min-h-screen selection:bg-black/10 flex flex-col lg:flex-row">
      {/* Static Sidebar for Desktop */}
      <div className="hidden lg:block w-[280px] shrink-0 z-40 bg-white lg:rounded-r-3xl border-r border-gray-100 shadow-sm">
        <AffiliateSidebar userName={userName} tier={tier} />
      </div>

      {/* Mobile Sidebar */}
      <AffiliateMobileSidebar>
        <AffiliateSidebar userName={userName} tier={tier} />
      </AffiliateMobileSidebar>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 px-4 py-8 md:p-10 lg:p-12">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
