'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Heart } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useCartStore } from '@/lib/cart/store'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  descriptor: string;
  price: string;
}

export interface AccountWishlistProps {
  items: WishlistItem[];
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
}

export function WishlistClient({ items: serverItems }: AccountWishlistProps) {
  const t = useTranslations('account.wishlist')
  const { removeItem, setItems } = useWishlistStore()
  const cartStore = useCartStore()

  // Sync the global wishlist store (used for heart-icon state elsewhere) with the
  // real Payload data this page just fetched server-side. Intentionally runs once on mount.
  useEffect(() => {
    setItems(serverItems.map(({ id, name, slug, image }) => ({ id, name, slug, image })))
  }, [])

  const displayItems = serverItems

  const addToCart = (item: WishlistItem) => {
    cartStore.addItem(
      { id: item.id, name: item.name, imageUrl: item.image },
      'Default',
      1,
      parsePrice(item.price)
    )
    toast.success(t('addToCart'), { action: { label: t('addToCart'), onClick: cartStore.openCart } })
  }

  const moveAllToCart = () => {
    displayItems.forEach((item) => addToCart(item))
    cartStore.openCart()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl text-black font-bold tracking-tighter font-heading">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 font-heading">{t('itemsSaved', { count: displayItems.length })}</p>
        </div>

        <button
          onClick={moveAllToCart}
          disabled={displayItems.length === 0}
          className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all w-full sm:w-auto shadow-lg font-heading disabled:opacity-40 disabled:pointer-events-none"
        >
          <ShoppingBag size={14} />
          {t('moveAllToCart')}
        </button>
      </div>

      <AnimatePresence>
        {displayItems.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayItems.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-gray-200 transition-all duration-500 relative overflow-hidden"
              >
                
                {/* Image Area */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 rounded-2xl mb-6">
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={product.image || '/99 Images/placeholder.webp'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </Link>

                  {/* Remove Button Overlay */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      removeItem(product.id)
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-white flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Info Area */}
                <div className="flex flex-col flex-1">
                  <Link href={`/products/${product.slug}`}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block font-heading">
                      {/* @ts-ignore */}
                      {product.descriptor || t('productFallback')}
                    </span>
                    <h3 className="text-xl font-bold text-black tracking-tight leading-tight group-hover:text-purple-600 transition-colors font-heading mb-4">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-black tracking-tighter font-heading">
                      {/* @ts-ignore */}
                      {product.price || product.priceRange || ''}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gray-50 hover:bg-black text-black hover:text-white rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors shrink-0 font-heading"
                    >
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12"
          >
            <EmptyState
              icon={Heart}
              title={t('emptyTitle')}
              description={t('emptyDescription')}
              action={
                <Link href="/shop" className="inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors shadow-lg font-heading">
                  {t('startBrowsing')}
                </Link>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
