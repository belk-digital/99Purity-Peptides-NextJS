'use client'

import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { Space_Grotesk } from 'next/font/google'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export default function LoginPage() {
  return (
    <AuthSplitLayout mode="login">
      <SignIn 
        path="/login"
        routing="path"
        signUpUrl="/register"
        forceRedirectUrl="/account"
        appearance={{
          variables: {
            colorPrimary: '#007a7a', // Cyan color for buttons
            colorText: '#111111', 
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#111111',
            borderRadius: '12px',
            fontFamily: 'inherit',
            colorTextOnPrimaryBackground: '#ffffff',
          },
          elements: {
            rootBox: 'w-full flex justify-center !overflow-visible',
            cardBox: 'shadow-none bg-transparent !overflow-visible',
            card: 'bg-white shadow-none w-full p-0 m-0 border-none ring-0 !overflow-visible',
            headerTitle: `text-2xl font-bold tracking-tight text-ink mb-2 ${spaceGrotesk.className}`,
            headerSubtitle: 'text-sm text-ink/60 mb-6',
            footerAction: 'hidden', // Hidden because it's handled by AuthSplitLayout
            formButtonPrimary: 'bg-[#111] hover:bg-black text-white w-full rounded-full h-12 md:h-[52px] text-[10px] sm:text-[11px] md:text-sm font-heading font-bold tracking-[0.15em] uppercase shadow-none transition-all flex items-center justify-center mt-4 border-none',
            formFieldInput: 'custom-auth-input bg-white h-12 text-ink rounded-xl placeholder:text-ink/40 transition-all duration-300 px-4 shadow-sm text-sm',
            formFieldLabel: 'text-xs font-bold text-ink/80 mb-1.5',
            dividerLine: 'bg-ink/10',
            dividerText: 'text-xs font-medium text-ink/40 px-4',
            socialButtonsBlockButton: 'bg-white hover:bg-gray-50 h-12 rounded-xl transition-colors duration-300 mb-4 relative !overflow-visible shadow-sm border-none',
            socialButtonsBlockButtonText: 'text-sm font-bold text-ink',
            formFieldAction: 'text-ink hover:text-primary text-xs font-bold transition-colors',
            identityPreview: 'bg-cream border border-ink/10 rounded-xl text-ink p-4 mb-4',
            identityPreviewText: 'text-sm font-medium text-ink',
            identityPreviewEditButton: 'text-ink/50 hover:text-ink transition-colors',
            footer: 'hidden', 
          }
        }} 
      />
    </AuthSplitLayout>
  )
}
