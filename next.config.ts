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
      // WordPress's "glutathione" product was re-slugged to "glutathione-600-1500" in Payload
      // (dosage variant added to the slug). Without this, the indexed WP URL 404s post-cutover.
      { source: '/product/glutathione', destination: '/product/glutathione-600-1500', permanent: true },
      { source: '/:locale/product/glutathione', destination: '/:locale/product/glutathione-600-1500', permanent: true },
      // WordPress products not yet imported into Payload. These URLs are indexed and
      // ranking on the live WordPress site but have no Next.js product page yet, so they
      // redirect to the homepage rather than soft-404ing. Remove each entry here once its
      // product is added to Payload with a matching slug.
      { source: '/product/acetic-acid-water', destination: '/', permanent: true },
      { source: '/:locale/product/acetic-acid-water', destination: '/:locale', permanent: true },
      { source: '/product/acetyl-d-glucosamine-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/acetyl-d-glucosamine-20mg', destination: '/:locale', permanent: true },
      { source: '/product/aod-spray-aod-9604', destination: '/', permanent: true },
      { source: '/:locale/product/aod-spray-aod-9604', destination: '/:locale', permanent: true },
      { source: '/product/b12-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/b12-20mg', destination: '/:locale', permanent: true },
      { source: '/product/b6-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/b6-20mg', destination: '/:locale', permanent: true },
      { source: '/product/bcaa-2-1-1-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/bcaa-2-1-1-20mg', destination: '/:locale', permanent: true },
      { source: '/product/body-boost-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/body-boost-20mg', destination: '/:locale', permanent: true },
      { source: '/product/bpc-157-500mcg', destination: '/', permanent: true },
      { source: '/:locale/product/bpc-157-500mcg', destination: '/:locale', permanent: true },
      { source: '/product/bpc-157-spray', destination: '/', permanent: true },
      { source: '/:locale/product/bpc-157-spray', destination: '/:locale', permanent: true },
      { source: '/product/bronchogen', destination: '/', permanent: true },
      { source: '/:locale/product/bronchogen', destination: '/:locale', permanent: true },
      { source: '/product/cartalax', destination: '/', permanent: true },
      { source: '/:locale/product/cartalax', destination: '/:locale', permanent: true },
      { source: '/product/chonluten', destination: '/', permanent: true },
      { source: '/:locale/product/chonluten', destination: '/:locale', permanent: true },
      { source: '/product/cortagen', destination: '/', permanent: true },
      { source: '/:locale/product/cortagen', destination: '/:locale', permanent: true },
      { source: '/product/crystagen', destination: '/', permanent: true },
      { source: '/:locale/product/crystagen', destination: '/:locale', permanent: true },
      { source: '/product/dream-catcher-spray', destination: '/', permanent: true },
      { source: '/:locale/product/dream-catcher-spray', destination: '/:locale', permanent: true },
      { source: '/product/enclomiphene', destination: '/', permanent: true },
      { source: '/:locale/product/enclomiphene', destination: '/:locale', permanent: true },
      { source: '/product/enclomiphene-12-5mg-ml', destination: '/', permanent: true },
      { source: '/:locale/product/enclomiphene-12-5mg-ml', destination: '/:locale', permanent: true },
      { source: '/product/energy-lipo-blend-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/energy-lipo-blend-20mg', destination: '/:locale', permanent: true },
      { source: '/product/foxo4-10mg', destination: '/', permanent: true },
      { source: '/:locale/product/foxo4-10mg', destination: '/:locale', permanent: true },
      { source: '/product/hair-skin-and-nails-blend-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/hair-skin-and-nails-blend-20mg', destination: '/:locale', permanent: true },
      { source: '/product/hair-skin-and-nails-blend-20mg-2', destination: '/', permanent: true },
      { source: '/:locale/product/hair-skin-and-nails-blend-20mg-2', destination: '/:locale', permanent: true },
      { source: '/product/helios-extreme-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/helios-extreme-20mg', destination: '/:locale', permanent: true },
      { source: '/product/kpv-capsules', destination: '/', permanent: true },
      { source: '/:locale/product/kpv-capsules', destination: '/:locale', permanent: true },
      { source: '/product/livagen', destination: '/', permanent: true },
      { source: '/:locale/product/livagen', destination: '/:locale', permanent: true },
      { source: '/product/metabolic-fire-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/metabolic-fire-20mg', destination: '/:locale', permanent: true },
      { source: '/product/methylene-blue-10mg-ml', destination: '/', permanent: true },
      { source: '/:locale/product/methylene-blue-10mg-ml', destination: '/:locale', permanent: true },
      { source: '/product/morning-relax-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/morning-relax-20mg', destination: '/:locale', permanent: true },
      { source: '/product/mt2-10mg-spray', destination: '/', permanent: true },
      { source: '/:locale/product/mt2-10mg-spray', destination: '/:locale', permanent: true },
      { source: '/product/nac-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/nac-20mg', destination: '/:locale', permanent: true },
      { source: '/product/nad-1000mg-spray', destination: '/', permanent: true },
      { source: '/:locale/product/nad-1000mg-spray', destination: '/:locale', permanent: true },
      { source: '/product/nad-100mg', destination: '/', permanent: true },
      { source: '/:locale/product/nad-100mg', destination: '/:locale', permanent: true },
      { source: '/product/neuro-spark-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/neuro-spark-20mg', destination: '/:locale', permanent: true },
      { source: '/product/ovagen', destination: '/', permanent: true },
      { source: '/:locale/product/ovagen', destination: '/:locale', permanent: true },
      { source: '/product/pancragen-pancreas-bioregulator', destination: '/', permanent: true },
      { source: '/:locale/product/pancragen-pancreas-bioregulator', destination: '/:locale', permanent: true },
      { source: '/product/performance-peak-20mg-research-grade-compound', destination: '/', permanent: true },
      { source: '/:locale/product/performance-peak-20mg-research-grade-compound', destination: '/:locale', permanent: true },
      { source: '/product/pinealon', destination: '/', permanent: true },
      { source: '/:locale/product/pinealon', destination: '/:locale', permanent: true },
      { source: '/product/power-blitz-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/power-blitz-20mg', destination: '/:locale', permanent: true },
      { source: '/product/power-burn-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/power-burn-20mg', destination: '/:locale', permanent: true },
      { source: '/product/prostamax', destination: '/', permanent: true },
      { source: '/:locale/product/prostamax', destination: '/:locale', permanent: true },
      { source: '/product/pt-141-spray', destination: '/', permanent: true },
      { source: '/:locale/product/pt-141-spray', destination: '/:locale', permanent: true },
      { source: '/product/pump-xl-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/pump-xl-20mg', destination: '/:locale', permanent: true },
      { source: '/product/pump-xxl-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/pump-xxl-20mg', destination: '/:locale', permanent: true },
      { source: '/product/recovery-rush-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/recovery-rush-20mg', destination: '/:locale', permanent: true },
      { source: '/product/selank-spray', destination: '/', permanent: true },
      { source: '/:locale/product/selank-spray', destination: '/:locale', permanent: true },
      { source: '/product/semax-spray', destination: '/', permanent: true },
      { source: '/:locale/product/semax-spray', destination: '/:locale', permanent: true },
      { source: '/product/sleep-mix-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/sleep-mix-20mg', destination: '/:locale', permanent: true },
      { source: '/product/slu-pp-332', destination: '/', permanent: true },
      { source: '/:locale/product/slu-pp-332', destination: '/:locale', permanent: true },
      { source: '/product/slu-pp-332-capsules', destination: '/', permanent: true },
      { source: '/:locale/product/slu-pp-332-capsules', destination: '/:locale', permanent: true },
      { source: '/product/tadalafil', destination: '/', permanent: true },
      { source: '/:locale/product/tadalafil', destination: '/:locale', permanent: true },
      { source: '/product/tadalafil-20mg-ml', destination: '/', permanent: true },
      { source: '/:locale/product/tadalafil-20mg-ml', destination: '/:locale', permanent: true },
      { source: '/product/tb500-bpc157', destination: '/', permanent: true },
      { source: '/:locale/product/tb500-bpc157', destination: '/:locale', permanent: true },
      { source: '/product/tesofensine-500mcg', destination: '/', permanent: true },
      { source: '/:locale/product/tesofensine-500mcg', destination: '/:locale', permanent: true },
      { source: '/product/testagen', destination: '/', permanent: true },
      { source: '/:locale/product/testagen', destination: '/:locale', permanent: true },
      { source: '/product/tirzepatide-500mcg-60-count-research-grade-peptide', destination: '/', permanent: true },
      { source: '/:locale/product/tirzepatide-500mcg-60-count-research-grade-peptide', destination: '/:locale', permanent: true },
      { source: '/product/tri-immune-blend-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/tri-immune-blend-20mg', destination: '/:locale', permanent: true },
      { source: '/product/vesugen', destination: '/', permanent: true },
      { source: '/:locale/product/vesugen', destination: '/:locale', permanent: true },
      { source: '/product/vilon', destination: '/', permanent: true },
      { source: '/:locale/product/vilon', destination: '/:locale', permanent: true },
      { source: '/product/vitality-vibe-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/vitality-vibe-20mg', destination: '/:locale', permanent: true },
      { source: '/product/vitamin-c-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/vitamin-c-20mg', destination: '/:locale', permanent: true },
      { source: '/product/yohimbine-20mg', destination: '/', permanent: true },
      { source: '/:locale/product/yohimbine-20mg', destination: '/:locale', permanent: true },
      // WordPress blog post never migrated to Next.js content; redirected to the closest
      // topical match (same BPC-157 + TB-500 preclinical research subject) rather than
      // soft-404ing. Remove once/if this post is added to src/data/blog-posts.tsx.
      { source: '/bpc-157-and-tb-500-liver-research-what-preclinical-studies-show', destination: '/bpc-157-tb-500-stack-research', permanent: true },
      { source: '/:locale/bpc-157-and-tb-500-liver-research-what-preclinical-studies-show', destination: '/:locale/bpc-157-tb-500-stack-research', permanent: true },
      // WordPress's dedicated affiliate signup page was consolidated into the /affiliates
      // landing page (which includes the application) on Next.js.
      { source: '/affiliate-registration', destination: '/affiliates', permanent: true },
      { source: '/:locale/affiliate-registration', destination: '/:locale/affiliates', permanent: true },
      // WordPress's "Legal Pages" page duplicated the same research-use disclaimer text
      // that lives on /medical-disclaimer on Next.js (verified near-verbatim match).
      { source: '/legal-pages', destination: '/medical-disclaimer', permanent: true },
      { source: '/:locale/legal-pages', destination: '/:locale/medical-disclaimer', permanent: true },
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
