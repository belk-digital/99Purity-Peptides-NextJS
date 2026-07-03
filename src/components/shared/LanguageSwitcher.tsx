'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function handleChange(nextLocale: string) {
    // Explicitly set the NEXT_LOCALE cookie to prevent the middleware from
    // reading the old cookie when navigating to the default locale (which lacks a URL prefix)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className={`flex items-center gap-1 text-[10px] font-bold tracking-wider ${className}`}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && <span className="opacity-40">/</span>}
          <button
            type="button"
            onClick={() => handleChange(loc)}
            aria-current={locale === loc}
            className={`uppercase transition-opacity ${
              locale === loc ? 'opacity-100' : 'opacity-50 hover:opacity-80'
            }`}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  )
}
