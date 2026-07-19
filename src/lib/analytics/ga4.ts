// src/lib/analytics/ga4.ts

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

// Ensure gtag is defined locally to avoid throwing if window.gtag is undefined
const safeGtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

export function trackViewItem(product: any) {
  safeGtag('event', 'view_item', {
    currency: 'USD',
    value: product?.price || 0,
    items: [
      {
        item_id: product?.id || '',
        item_name: product?.title || product?.name || '',
        item_category: Array.isArray(product?.categories) ? product.categories[0]?.title : '',
        price: product?.price || 0,
        quantity: 1
      }
    ]
  })
}

export function trackAddToCart(item: any, quantity: number = 1, priceSnapshot?: number) {
  safeGtag('event', 'add_to_cart', {
    currency: 'USD',
    value: (priceSnapshot || item?.price || 0) * quantity,
    items: [
      {
        item_id: item?.id || item?.productId || '',
        item_name: item?.title || item?.name || item?.product?.name || '',
        item_variant: item?.variantSku || item?.variantTitle || undefined,
        price: priceSnapshot || item?.price || 0,
        quantity
      }
    ]
  })
}

export function trackBeginCheckout(cartItems: any[]) {
  const value = cartItems.reduce((acc, item) => acc + ((item.priceSnapshot || item.price || 0) * (item.quantity || 1)), 0)
  
  safeGtag('event', 'begin_checkout', {
    currency: 'USD',
    value,
    items: cartItems.map(item => ({
      item_id: item.productId || item.id || '',
      item_name: item.product?.name || item.name || item.title || '',
      item_variant: item.variantSku || item.variantTitle || undefined,
      price: item.priceSnapshot || item.price || 0,
      quantity: item.quantity || 1
    }))
  })
}

export function trackPurchase(order: { id: string, total: number, tax?: number, shipping?: number, items: any[] }) {
  // Prevent duplicate tracking if page refreshes
  const trackedKey = `ga4_tracked_order_${order.id}`
  if (typeof window !== 'undefined' && localStorage.getItem(trackedKey)) {
    return
  }

  safeGtag('event', 'purchase', {
    transaction_id: order.id,
    value: order.total,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    currency: 'USD',
    items: (order.items || []).map(item => ({
      item_id: item.productId || item.product?.id || '',
      item_name: item.product?.title || item.productName || item.title || '',
      price: item.priceSnapshot || item.price || 0,
      quantity: item.quantity || 1
    }))
  })

  if (typeof window !== 'undefined') {
    localStorage.setItem(trackedKey, 'true')
  }
}
