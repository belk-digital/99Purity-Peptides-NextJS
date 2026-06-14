import { Inter, Michroma, Space_Grotesk } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontHeading = Michroma({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-heading',
})

export const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

// Temporary fallback for Big Shoulders
export const fontBigShoulders = fontSans

