import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export const metadata = {
  title: 'Products | Test Store',
}

export default async function ProductsPage() {
  const t = await getTranslations('shop.productsPage')
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'active' } },
    limit: 50,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">{t('allProducts')}</h1>

      {products.docs.length === 0 ? (
        <p className="text-gray-400">{t('noActiveProducts')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.docs.map((product) => (
            <div key={product.id} className="group relative rounded-lg border border-white/10 p-4 bg-white/5">
              <div className="min-h-60 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-800 flex items-center justify-center lg:aspect-none lg:h-60">
                <span className="text-gray-500">{t('imagePlaceholder')}</span>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    <Link href={`/products/${product.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                </div>
                <p className="text-sm font-bold text-white">
                  ${((product.salePrice || product.price) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
