import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

const PROTECTED_PREFIXES = ['/account', '/affiliates/dashboard']
const PUBLIC_AUTH_PREFIXES = ['/login', '/register']

// Locale-prefixed URLs only exist for non-default locales (localePrefix: 'as-needed'),
// so this only ever strips a leading "/es" segment.
function stripLocalePrefix(pathname: string) {
  const match = pathname.match(/^\/(es)(?=\/|$)/)
  return match ? pathname.slice(match[0].length) || '/' : pathname
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/admin') || path.startsWith('/api')) {
    return NextResponse.next()
  }

  const intlResponse = handleI18nRouting(req)
  const pathWithoutLocale = stripLocalePrefix(path)

  if (PUBLIC_AUTH_PREFIXES.some((prefix) => pathWithoutLocale.startsWith(prefix))) {
    return intlResponse
  }

  if (PROTECTED_PREFIXES.some((prefix) => pathWithoutLocale.startsWith(prefix))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlResponse
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
