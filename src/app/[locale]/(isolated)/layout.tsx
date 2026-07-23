import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { CustomScrollbar } from '@/components/shared/CustomScrollbar'

export default function IsolatedLayout({ children }: { children: React.ReactNode }) {
  // Premium light aesthetic, matching main site, completely isolated
  return (
    <div className="min-h-screen bg-cream text-ink font-sans antialiased overflow-x-hidden relative">
      <CustomScrollbar />
      <main className="flex-1 relative z-10 flex flex-col min-h-screen">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
