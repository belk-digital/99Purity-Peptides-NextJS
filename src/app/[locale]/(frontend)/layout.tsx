import React from 'react'
import { getTranslations } from 'next-intl/server'
import { LayoutClientWrapper } from '@/components/shared/LayoutClientWrapper'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { Toaster } from '@/components/ui/sonner'
import { GlobalNavigationSpinner } from '@/components/shared/GlobalNavigationSpinner'
import { CustomScrollbar } from '@/components/shared/CustomScrollbar'
import { AgeGate } from '@/components/shared/AgeGate'
import { HomePreloaderWrapper } from '@/components/home/HomePreloaderWrapper'
import { getOgImageUrl } from '@/lib/utils'

// Fallback metadata for any page under this layout that doesn't supply its own generateMetadata.
export async function generateMetadata() {
  const t = await getTranslations('common')
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'),
    title: '99 Purity Peptides',
    description: t('siteTagline'),
    openGraph: {
      images: [{ url: getOgImageUrl('99 Purity Peptides', t('siteTagline')) }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [getOgImageUrl('99 Purity Peptides', t('siteTagline'))],
    },
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink font-sans antialiased print:bg-white print:min-h-0">
      <AgeGate />
      <React.Suspense fallback={null}>
        <GlobalNavigationSpinner />
      </React.Suspense>
      <SmoothScroll>
        <CustomScrollbar />
        <LayoutClientWrapper header={<Header />} footer={<Footer />}>
          <HomePreloaderWrapper>{children}</HomePreloaderWrapper>
        </LayoutClientWrapper>
        <Toaster />
      </SmoothScroll>
    </div>
  )
}
