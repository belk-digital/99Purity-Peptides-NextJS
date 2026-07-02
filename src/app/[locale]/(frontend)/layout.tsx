import React from 'react'
import { LayoutClientWrapper } from '@/components/shared/LayoutClientWrapper'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { Toaster } from '@/components/ui/sonner'
import { GlobalNavigationSpinner } from '@/components/shared/GlobalNavigationSpinner'
import { CustomScrollbar } from '@/components/shared/CustomScrollbar'
import { AgeGate } from '@/components/shared/AgeGate'
import { HomePreloaderWrapper } from '@/components/home/HomePreloaderWrapper'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: '99 Purity Peptides',
  description: 'Premium Peptides for Peak Performance',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink font-sans antialiased">
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
