import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getLocale } from 'next-intl/server'
import { CertificatesClient, type COA } from './CertificatesClient'

export const metadata = {
  title: 'Certificates of Analysis | 99 Purity Peptides',
}

export default async function CertificatesPage() {
  const locale = await getLocale()
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { coaFile: { exists: true } },
        { status: { equals: 'active' } },
      ],
    },
    limit: 500,
    depth: 1,
    locale: locale as 'en' | 'es',
    fallbackLocale: 'en',
    overrideAccess: true,
    sort: '-coaAnalyzedDate',
  })

  const dateFormatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const coas: COA[] = docs
    .filter((doc: any) => doc.coaFile && typeof doc.coaFile === 'object' && doc.coaFile.url)
    .map((doc: any) => ({
      id: doc.id,
      product: doc.name,
      category: (doc.categories?.[0] && typeof doc.categories[0] === 'object' ? doc.categories[0].name : null) || 'Research',
      purity: typeof doc.coaPurity === 'number' ? `${doc.coaPurity}%` : null,
      batch: doc.coaBatchNumber || null,
      analyzed: doc.coaAnalyzedDate ? dateFormatter.format(new Date(doc.coaAnalyzedDate)) : null,
      coaUrl: doc.coaFile.url,
    }))

  return <CertificatesClient coas={coas} />
}
