import React, { Suspense } from 'react'
import '@/app/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { LayoutClientWrapper } from '@/components/shared/LayoutClientWrapper'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { SmoothScroll } from '@/components/shared/SmoothScroll'
import { Toaster } from '@/components/ui/sonner'
import { GlobalNavigationSpinner } from '@/components/shared/GlobalNavigationSpinner'
import { CustomScrollbar } from '@/components/shared/CustomScrollbar'
import { AgeGate } from '@/components/shared/AgeGate'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: 'Looksmaxxing Lab',
  description: 'Premium Peptides for Peak Performance',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="min-h-screen" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Michroma&family=Space+Grotesk:wght@300..700&family=Big+Shoulders+Display:wght@100..900&display=swap" rel="stylesheet" />
        </head>
        <body
          className="min-h-screen bg-cream text-ink font-sans antialiased"
          suppressHydrationWarning
        >
          <AgeGate />
          <React.Suspense fallback={null}>
            <GlobalNavigationSpinner />
          </React.Suspense>
          <SmoothScroll>
            <CustomScrollbar />
            <LayoutClientWrapper header={<Header />} footer={<Footer />}>
              {children}
            </LayoutClientWrapper>
            <Toaster />
          </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  )
}
