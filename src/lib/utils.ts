import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getOgImageUrl(title: string, description?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const url = new URL('/api/og', baseUrl)
  url.searchParams.set('title', title)
  if (description) {
    url.searchParams.set('description', description)
  }
  return url.toString()
}
