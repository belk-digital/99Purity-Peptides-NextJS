import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Next 16 no longer runs ESLint as part of `next build` (the old `eslint.ignoreDuringBuilds`
  // option was removed from NextConfig) — lint separately with `pnpm lint`.
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-4c2ad32bd46946819b7bd8c103044a10.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        // Current R2 bucket (set via R2_PUBLIC_URL) — the old hostname above is kept in
        // case any already-stored media URLs still point at it.
        protocol: 'https',
        hostname: 'pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    // WordPress served category archives at /product-category/<slug>. This site has no
    // equivalent archive route — categories are a query-string filter on /shop, matched by
    // category *name* (not slug), so each destination below hardcodes the current Payload
    // category name, URL-encoded. If a category is renamed in Payload, its entry here must
    // be updated to match or the redirect will silently stop filtering.
    return [
      { source: '/product-category/uncategorized', destination: '/shop?category=Uncategorized', permanent: true },
      { source: '/:locale/product-category/uncategorized', destination: '/:locale/shop?category=Uncategorized', permanent: true },
      { source: '/product-category/sleep-cycle-investigation-research-peptides', destination: '/shop?category=Sleep%20Cycle%20Investigation%20%E2%80%93%20Research%20Peptides', permanent: true },
      { source: '/:locale/product-category/sleep-cycle-investigation-research-peptides', destination: '/:locale/shop?category=Sleep%20Cycle%20Investigation%20%E2%80%93%20Research%20Peptides', permanent: true },
      { source: '/product-category/recovery-research-peptides', destination: '/shop?category=Recovery%20Research%20Peptides', permanent: true },
      { source: '/:locale/product-category/recovery-research-peptides', destination: '/:locale/shop?category=Recovery%20Research%20Peptides', permanent: true },
      { source: '/product-category/receptor-agonist-research-peptides-compounds', destination: '/shop?category=Receptor%20Agonist%20Research%20Peptides%20%2F%20Compounds', permanent: true },
      { source: '/:locale/product-category/receptor-agonist-research-peptides-compounds', destination: '/:locale/shop?category=Receptor%20Agonist%20Research%20Peptides%20%2F%20Compounds', permanent: true },
      { source: '/product-category/pigmentation-research-peptides', destination: '/shop?category=Pigmentation%20Research%20Peptides', permanent: true },
      { source: '/:locale/product-category/pigmentation-research-peptides', destination: '/:locale/shop?category=Pigmentation%20Research%20Peptides', permanent: true },
      { source: '/product-category/metabolic-research-peptides', destination: '/shop?category=Metabolic%20Research%20Peptides', permanent: true },
      { source: '/:locale/product-category/metabolic-research-peptides', destination: '/:locale/shop?category=Metabolic%20Research%20Peptides', permanent: true },
      { source: '/product-category/growth-factor-research-peptides', destination: '/shop?category=Growth%20Factor%20Research%20Peptides', permanent: true },
      { source: '/:locale/product-category/growth-factor-research-peptides', destination: '/:locale/shop?category=Growth%20Factor%20Research%20Peptides', permanent: true },
      { source: '/product-category/essentials', destination: '/shop?category=Essentials', permanent: true },
      { source: '/:locale/product-category/essentials', destination: '/:locale/shop?category=Essentials', permanent: true },
      // NOTE: this category's Payload `name` field literally contains "&amp;" instead of "&"
      // (a data bug, not intentional encoding). The destination below matches that value as
      // stored today. If the name is fixed in Payload, update this redirect to match.
      { source: '/product-category/cognitive-function-studies-research-peptides-compounds', destination: '/shop?category=Cognitive%20Function%20Studies%20%E2%80%93%20Research%20Peptides%20%26amp%3B%20Compounds', permanent: true },
      { source: '/:locale/product-category/cognitive-function-studies-research-peptides-compounds', destination: '/:locale/shop?category=Cognitive%20Function%20Studies%20%E2%80%93%20Research%20Peptides%20%26amp%3B%20Compounds', permanent: true },
      { source: '/product-category/cellular-health-research', destination: '/shop?category=Cellular%20Health%20Research', permanent: true },
      { source: '/:locale/product-category/cellular-health-research', destination: '/:locale/shop?category=Cellular%20Health%20Research', permanent: true },
      { source: '/product-category/bioregulators', destination: '/shop?category=Bioregulators', permanent: true },
      { source: '/:locale/product-category/bioregulators', destination: '/:locale/shop?category=Bioregulators', permanent: true },
      { source: '/product-category/aminos', destination: '/shop?category=Aminos', permanent: true },
      { source: '/:locale/product-category/aminos', destination: '/:locale/shop?category=Aminos', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withSentryConfig(
  withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false }),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    silent: !process.env.CI,
  },
)
