'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Lock, Loader2, ArrowRight, ShieldCheck, Tag, ShoppingCart, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckoutPageSkeleton } from '@/components/ui/skeleton'
import { COUNTRIES } from '@/lib/countries'
import { useCartStore } from '@/lib/cart/store'
import { verifyCoupon, getUserDefaultAddress, getUserPurityPoints, getUserAddresses } from '../actions'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripeCheckoutForm } from './StripeCheckoutForm'
import { PayzentricCheckoutForm } from './PayzentricCheckoutForm'
import { createPaymentIntent, getShippingMethods } from './actions'
import { trackBeginCheckout } from '@/lib/analytics/ga4'
// Card payments are temporarily disabled in favor of Zelle. Flip this back to re-enable Stripe —
// the rest of the Stripe integration below is left intact, just not rendered/called while off.
const ENABLE_STRIPE = false

// Toggle to enable/disable the CircoFlows hosted-card option without touching Stripe/Zelle/Amex.
const ENABLE_CIRCOFLOWS = true

// Toggle to enable/disable the Payzentric card option without touching any other method. Flip
// to false to pull it from checkout instantly — nothing else here depends on it being on.
const ENABLE_PAYZENTRIC = true

const stripePromise = typeof window !== 'undefined' ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '') : null

export function CheckoutClient() {
  const t = useTranslations('checkout.checkoutClient')
  const { items, couponCode: storedCouponCode, setCoupon } = useCartStore()
  const { data: session } = useSession()
  const user = session?.user
  
  // Mobile summary toggle
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(true)

  // Stripe
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Maxx Points State
  const [availablePoints, setAvailablePoints] = useState(0)
  const [isRedeemingPoints, setIsRedeemingPoints] = useState(false)

  // Address Selection State
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new')

  // Form State
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'zelle' | 'amex' | 'circoflows' | 'payzentric'>(
    ENABLE_CIRCOFLOWS ? 'circoflows' : ENABLE_PAYZENTRIC ? 'payzentric' : 'zelle'
  )
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    marketing: false,
    saveInfo: false
  })

  // Prefill Data
  useEffect(() => {
    const prefillData = async () => {
      if (!user) return
      
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
      }))

      try {
        const userAddresses = await getUserAddresses()
        if (userAddresses && userAddresses.length > 0) {
          setAddresses(userAddresses)
          const defaultAddress = userAddresses.find((a: any) => a.isDefaultShipping) || userAddresses[0]
          setSelectedAddressId(String(defaultAddress.id))
          setFormData(prev => ({
            ...prev,
            address: defaultAddress.line1,
            apartment: defaultAddress.line2 || '',
            city: defaultAddress.city,
            state: defaultAddress.state,
            zip: defaultAddress.postalCode,
            country: defaultAddress.country || 'US',
            phone: defaultAddress.phone || ''
          }))
        }
      } catch (err) {
        console.error('Failed to load user addresses:', err)
      }

      const points = await getUserPurityPoints()
      setAvailablePoints(points)
    }
    
    prefillData()
  }, [user])

  // Shipping State
  const [availableShippingMethods, setAvailableShippingMethods] = useState<any[]>([])
  const [shippingMethod, setShippingMethod] = useState<string>('')
  const [activeFees, setActiveFees] = useState<any[]>([])
  
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch data
  useEffect(() => {
    Promise.all([
      getShippingMethods(),
      fetch('/api/processing-fees').then(res => res.json()).catch(() => ({}))
    ]).then(([methods, data]) => {
      setAvailableShippingMethods(methods)
      if (methods.length > 0) {
        setShippingMethod(methods[0].method)
      }
      
      if (data?.docs) {
        const active = data.docs.filter((f: any) => f.isActive && !f.isOptional)
        setActiveFees(active)
      }
      
      
      setDataLoaded(true)
      if (items && items.length > 0) {
        trackBeginCheckout(items)
      }
    }).catch(() => {
      setDataLoaded(true)
    })
  }, [])

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping: boolean; description: string } | null>(null)
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)

  // Order Calculations
  const subtotal = items.reduce((acc, item) => acc + item.priceSnapshot * item.quantity, 0)

  // Fire the free-shipping toast once per crossing, not on every render while above the threshold.
  const previousSubtotal = useRef(subtotal)
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500) // wait for hydration
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    previousSubtotal.current = subtotal
  }, [subtotal, isReady, t])

  // International orders (anything outside the US) get a single flat rate — configured in the
  // Payload admin's Shipping Zones as the method with "Is International Shipping" checked —
  // instead of the configured US shipping zone's methods. No free-shipping threshold, no
  // Express option, since the US zone's methods/thresholds don't reflect real international cost.
  const isInternational = !!formData.country && formData.country !== 'US'

  const internationalMethod = availableShippingMethods.find((method: any) => method.isInternational)
    || { method: 'International Shipping', price: 50, estimatedDays: null, minOrderAmount: 0 }

  const visibleShippingMethods = isInternational
    ? [internationalMethod]
    : availableShippingMethods.filter((method: any) => {
        if (method.isInternational) return false
        if (method.minOrderAmount && method.minOrderAmount > 0) {
          return subtotal >= method.minOrderAmount
        }
        return true
      })

  // Tracks which methods were visible last time this effect ran, so the "auto-upgrade to a
  // newly available cheaper method" branch only fires the moment that set actually changes
  // (e.g. crossing the free-shipping subtotal threshold) — not on every re-run triggered by
  // the user's own manual shippingMethod selection, which would otherwise immediately revert
  // any choice other than the cheapest option.
  const previousVisibleMethodsKey = useRef<string>('')

  useEffect(() => {
    if (visibleShippingMethods.length === 0) return

    const isCurrentValid = visibleShippingMethods.some(m => m.method === shippingMethod)
    const cheapestMethod = [...visibleShippingMethods].sort((a, b) => a.price - b.price)[0]

    if (!isCurrentValid) {
      // Previously selected method dropped out (e.g. subtotal fell below its own
      // minOrderAmount) — fall back to the cheapest available option.
      setShippingMethod(cheapestMethod.method)
      return
    }

    const visibleMethodsKey = visibleShippingMethods.map(m => m.method).sort().join(',')
    const methodsSetChanged = visibleMethodsKey !== previousVisibleMethodsKey.current
    previousVisibleMethodsKey.current = visibleMethodsKey

    if (methodsSetChanged) {
      const isCurrentExpress = shippingMethod.toLowerCase().includes('express')
      const currentMethodObj = visibleShippingMethods.find(m => m.method === shippingMethod)
      if (!isCurrentExpress && currentMethodObj && cheapestMethod.price < currentMethodObj.price) {
        // Auto-select the cheaper method (like Free Shipping) the moment it becomes available.
        setShippingMethod(cheapestMethod.method)
      }
    }
  }, [subtotal, availableShippingMethods, shippingMethod, isInternational])

  const selectedMethodObj = visibleShippingMethods.find(m => m.method === shippingMethod) || visibleShippingMethods[0]
  const shippingCost = selectedMethodObj?.price || 0
  const isExpressShipping = shippingMethod.toLowerCase().includes('express')
  const qualifiesForFreeShipping = appliedCoupon?.freeShipping || false
  const finalShipping = (qualifiesForFreeShipping && !isExpressShipping && !isInternational) ? 0 : shippingCost
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  
  // Calculate dynamic fees
  let processingFeeAmount = 0
  let activeFeePercentage: number | null = null
  activeFees.forEach((fee: any) => {
    if (fee.type === 'percentage') {
      processingFeeAmount += subtotalAfterDiscount * (fee.amount / 100)
      activeFeePercentage = fee.amount
    } else if (fee.type === 'fixed_amount') {
      processingFeeAmount += fee.amount
    }
  })

  const totalBeforePoints = subtotalAfterDiscount + finalShipping + processingFeeAmount
  
  const pointsToRedeem = isRedeemingPoints ? Math.min(availablePoints, totalBeforePoints) : 0
  const total = totalBeforePoints - pointsToRedeem

  // Fetch client secret when order details change (skipped while Stripe is disabled)
  useEffect(() => {
    if (ENABLE_STRIPE && items.length > 0 && total > 0) {
      createPaymentIntent(items, shippingMethod, appliedCoupon?.code, isRedeemingPoints, formData.country)
        .then(res => {
          if (res.clientSecret && res.paymentIntentId) {
            setClientSecret(res.clientSecret)
            setPaymentIntentId(res.paymentIntentId)
          } else if (res.error) {
            toast.error(res.error)
            if ((res as any).priceChanged && (res as any).updatedItems) {
              const { useCartStore } = require('@/lib/cart/store')
              useCartStore.getState().setItems((res as any).updatedItems)
            }
          }
        })
    }
  }, [items, shippingMethod, appliedCoupon, isRedeemingPoints, formData.country])

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleApplyCoupon = async (e?: React.FormEvent, codeToApply?: string) => {
    if (e) e.preventDefault()
    const code = codeToApply || couponCode
    if (!code || !code.trim()) return

    setIsVerifyingCoupon(true)
    try {
      const result = await verifyCoupon(code.trim(), subtotal, items)
      if (result.valid) {
        setAppliedCoupon({
          code: result.code || code.trim(),
          discount: result.discount || 0,
          freeShipping: result.freeShipping || false,
          description: result.description || 'Coupon applied'
        })
        setCouponCode('')
        setCoupon(result.code || code.trim())
        if (!codeToApply) toast.success(result.description || t('couponAppliedSuccess'))
      } else {
        setAppliedCoupon(null)
        if (!codeToApply) toast.error(result.error || t('couponInvalid'))
        if (codeToApply) setCoupon(null)
      }
    } catch (err) {
      setAppliedCoupon(null)
      if (!codeToApply) toast.error(t('couponVerifyFailed'))
      if (codeToApply) setCoupon(null)
    } finally {
      setIsVerifyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCoupon(null)
    toast.info(t('couponRemoved'))
  }

  const handleZeroTotalCheckout = async () => {
    setAttemptedSubmit(true)
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }

    setIsProcessing(true)

    try {
      const { createPayloadOrder } = await import('./actions')
      const orderRes = await createPayloadOrder(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints,
        { ...formData, email: user?.email || formData.email },
        'free_order',
        user?.id as string,
        'stripe',
        selectedAddressId === 'new'
      )

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || t('freeOrderInitFailed'))
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      toast.success(t('orderSuccessRedirecting'))
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch (e: any) {
      toast.error(t('unexpectedError'))
      setIsProcessing(false)
    }
  }

  // Zelle has no payment API — this creates the order as pending/unpaid immediately,
  // then the customer sends payment manually using the details shown. A human confirms
  // the transfer and updates the order's paymentStatus in the admin panel afterward.
  const handleZellePlaceOrder = async () => {
    setAttemptedSubmit(true)
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }

    setIsProcessing(true)

    try {
      const { createPayloadOrder } = await import('./actions')
      const orderRes = await createPayloadOrder(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints,
        { ...formData, email: user?.email || formData.email },
        'zelle_pending',
        user?.id as string,
        'zelle',
        selectedAddressId === 'new'
      )

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || t('freeOrderInitFailed'))
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      toast.success(t('orderSuccessRedirecting'))
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch (e: any) {
      toast.error(t('unexpectedError'))
      setIsProcessing(false)
    }
  }

  const handleAmexPlaceOrder = async () => {
    setAttemptedSubmit(true)
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }

    setIsProcessing(true)

    try {
      const { createPayloadOrder } = await import('./actions')
      const orderRes = await createPayloadOrder(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints,
        { ...formData, email: user?.email || formData.email },
        'amex_pending',
        user?.id as string,
        'amex',
        selectedAddressId === 'new'
      )

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || t('freeOrderInitFailed'))
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      toast.success(t('orderSuccessRedirecting'))
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch (e: any) {
      toast.error(t('unexpectedError'))
      setIsProcessing(false)
    }
  }

  const handleCircoFlowsPlaceOrder = async () => {
    setAttemptedSubmit(true)
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }

    setIsProcessing(true)

    try {
      const { createCircoFlowsPayment } = await import('./circoflowsActions')
      const orderRes = await createCircoFlowsPayment(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints,
        { ...formData, email: user?.email || formData.email },
        user?.id as string,
        selectedAddressId === 'new'
      )

      if (orderRes.error || !orderRes.redirectUrl) {
        toast.error(orderRes.error || t('freeOrderInitFailed'))
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      // Cart is intentionally left intact here — the customer hasn't paid yet, they're only
      // being redirected to CircoFlows' hosted card page. It's cleared once payment actually
      // succeeds (see OrderConfirmationClient's sync fallback / the webhook-driven finalize).
      window.location.href = orderRes.redirectUrl
    } catch (e: any) {
      toast.error(t('unexpectedError'))
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (storedCouponCode && !isVerifyingCoupon) {
      handleApplyCoupon(undefined, storedCouponCode)
    }
  }, [storedCouponCode, subtotal])

  if (!isReady || (items.length > 0 && !dataLoaded)) {
    return <CheckoutPageSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-sm font-heading text-ink mb-4">{t('emptyTitle')}</h1>
          <p className="text-body-md text-ink-muted mb-8">{t('emptyText')}</p>
          <Link href="/shop">
            <Button variant="dark" className="rounded-full h-14 px-8 tracking-widest text-sm uppercase !text-white">
              {t('shopNow')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-16 md:pt-36 md:pb-24 bg-white min-h-screen">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-6rem)] mx-auto">

        <div className="flex items-end justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink font-heading">
            {t('secureCheckout')}
          </h1>
        </div>

        {/* Mobile Summary Accordion */}
        <div className="lg:hidden mb-8 bg-[#F5F5F7]/40 rounded-3xl p-1 shadow-sm border border-slate-100">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-ink"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-ink/60" />
              <span className="text-sm font-bold uppercase tracking-widest">{t('orderSummary')}</span>
              <motion.div animate={{ rotate: mobileSummaryOpen ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </div>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </button>
          
          <AnimatePresence>
            {mobileSummaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-ink/5 flex flex-col gap-6 bg-[#fafafa]/50">
                  
                  {/* Items */}
                  <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 pt-2" data-lenis-prevent="true">
                    {items.map((item) => (
                      <div key={item.lineId} className="flex gap-4 group">
                        <div className="relative w-16 h-16 shrink-0">
                          <div className="w-full h-full bg-cream rounded-xl overflow-hidden border border-ink/5 relative">
                            <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-auto min-w-[20px] h-5 px-1 bg-ink text-cream rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 justify-center py-1">
                          <span className="text-sm font-bold text-ink leading-tight">{item.product?.name}</span>
                          {(item.variantTitle || item.variantSku) && !['DEFAULT', 'DEFAULT TITLE'].includes((item.variantTitle || item.variantSku || '').toUpperCase()) && (
                            <span className="text-[10px] uppercase tracking-widest text-ink/40 mt-1">{item.variantTitle || item.variantSku}</span>
                          )}
                        </div>
                        <span className="text-sm text-ink font-bold self-center">
                          ${(item.priceSnapshot * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="flex flex-col gap-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-500/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Tag size={16} className="text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                            <span className="text-xs font-medium text-green-600/70">{appliedCoupon.description}</span>
                          </div>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-xs font-bold text-green-700 hover:text-green-800 uppercase tracking-widest transition-colors">
                          {t('remove')}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder={t('discountCodePlaceholder')}
                          className="flex-1 h-12 rounded-2xl border-ink/10 bg-white focus-visible:ring-ink shadow-sm"
                        />
                        <Button
                          type="submit"
                          variant="dark"
                          disabled={!couponCode.trim() || isVerifyingCoupon}
                          className="h-12 px-6 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-100 disabled:bg-ink/5 disabled:text-ink/40 disabled:border-transparent transition-colors text-white"
                        >
                          {isVerifyingCoupon ? <Loader2 size={16} className="animate-spin text-ink/40" /> : t('apply')}
                        </Button>
                      </form>
                    )}
                  </div>

                  {/* Maxx Points */}
                  {availablePoints > 0 && (
                    <div className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${isRedeemingPoints ? 'bg-amber-50 border-amber-200/60 shadow-inner-sm' : 'bg-white border-ink/10 shadow-sm'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isRedeemingPoints ? 'bg-amber-100 text-amber-600' : 'bg-cream text-ink/40'}`}>
                            <Sparkles size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${isRedeemingPoints ? 'text-amber-700' : 'text-ink'}`}>{t('purityPoints')}</span>
                            <span className="text-xs font-medium text-ink/50">{t('youHavePoints', { points: Number(availablePoints.toFixed(2)) })}</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isRedeemingPoints}
                            onChange={() => setIsRedeemingPoints(!isRedeemingPoints)}
                          />
                          <div className="w-11 h-6 bg-ink/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-px bg-ink/5" />

                  {/* Totals */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>{t('subtotal')}</span>
                      <span className="text-ink font-bold">${subtotal.toFixed(2)}</span>
                    </div>

                    <AnimatePresence>
                      {appliedCoupon && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                        >
                          <span className="py-1">{t('discountWithCode', { code: appliedCoupon.code })}</span>
                          <span className="py-1 font-bold">-${appliedCoupon.discount.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {isRedeemingPoints && pointsToRedeem > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                        >
                          <span className="py-1 flex items-center gap-1.5"><Sparkles size={14} /> {t('pointsApplied')}</span>
                          <span className="py-1 font-bold">-${pointsToRedeem.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>{t('shippingWithMethod', { method: selectedMethodObj?.method ? `(${selectedMethodObj.method})` : '' })}</span>
                      <span className="text-ink font-bold">{finalShipping === 0 ? t('free') : `$${finalShipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>{t('processingFee')}{activeFeePercentage ? ` (${activeFeePercentage}%)` : ''}</span>
                      <span className="text-ink font-bold">${processingFeeAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-ink/5" />

                  <div className="flex justify-between items-end mb-2 mt-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-ink/60">{t('total')}</span>
                    <span className="text-4xl font-bold text-ink font-heading">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20">
          
          {/* Left Column: Flow */}
          <div className="flex flex-col gap-10">
            
            {/* Continuous Form */}
            <div className="flex flex-col gap-10">
              <input type="hidden" name="redeemPoints" value={isRedeemingPoints ? 'true' : 'false'} />
              <input type="hidden" name="couponCode" value={appliedCoupon?.code || ''} />
              
              {/* Contact */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-ink mb-2">{t('contactInformation')}</h2>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('emailAddress')}
                  type="email"
                  className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && !formData.email ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`}
                  required
                />
                <div className="flex items-start gap-3 mt-1 px-1">
                  <Checkbox
                    id="marketing"
                    name="marketing"
                    checked={formData.marketing}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketing: !!checked }))}
                    className="mt-0.5 rounded-md data-[state=checked]:bg-ink data-[state=checked]:border-ink"
                  />
                  <label htmlFor="marketing" className="text-sm text-ink/60 cursor-pointer select-none">
                    {t('marketingOptIn')}
                  </label>
                </div>
              </section>

              {/* Delivery */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-ink mb-2">{t('deliveryAddress')}</h2>
                
                {user && addresses.length > 0 && (
                  <div className="flex flex-col gap-3 mb-4">
                    {addresses.map((addr) => (
                      <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${selectedAddressId === String(addr.id) ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                        <input 
                          type="radio" 
                          name="addressSelection" 
                          value={addr.id} 
                          checked={selectedAddressId === String(addr.id)}
                          onChange={() => {
                            setSelectedAddressId(String(addr.id))
                            setFormData(prev => ({
                              ...prev,
                              firstName: addr.firstName || prev.firstName,
                              lastName: addr.lastName || prev.lastName,
                              address: addr.line1,
                              apartment: addr.line2 || '',
                              city: addr.city,
                              state: addr.state,
                              zip: addr.postalCode,
                              country: addr.country || 'US',
                              phone: addr.phone || ''
                            }))
                          }}
                          className="mt-0.5 w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0 shrink-0" 
                        />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-start justify-between w-full">
                            <span className="text-sm font-bold text-ink leading-tight">
                              {addr.firstName} {addr.lastName}
                            </span>
                            {addr.isDefaultShipping && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60 bg-white border border-slate-100 shadow-sm px-2 py-0.5 rounded-md shrink-0">
                                {t('defaultAddressBadge')}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-ink/70 mt-1.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</span>
                          <span className="text-xs text-ink/70 mt-0.5">{addr.city}, {addr.state} {addr.postalCode}</span>
                        </div>
                      </label>
                    ))}

                    <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${selectedAddressId === 'new' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                      <input 
                        type="radio" 
                        name="addressSelection" 
                        value="new" 
                        checked={selectedAddressId === 'new'}
                        onChange={() => {
                          setSelectedAddressId('new')
                          setFormData(prev => ({ ...prev, address: '', apartment: '', city: '', state: '', zip: '', country: 'US', phone: '' }))
                        }}
                        className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0" 
                      />
                      <span className="text-sm font-bold text-ink">{t('addNewAddress')}</span>
                    </label>
                  </div>
                )}

                <input type="hidden" name="addressId" value={selectedAddressId} />

                {(!user || selectedAddressId === 'new') && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder={t('firstName')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.firstName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                      <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={t('lastName')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.lastName ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                    </div>
                    <Input name="address" value={formData.address} onChange={handleInputChange} placeholder={t('address')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.address ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                    <Input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder={t('apartmentOptional')} className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" />
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-3 sm:col-span-2">
                        <Input name="city" value={formData.city} onChange={handleInputChange} placeholder={t('city')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.city ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <Input name="state" value={formData.state} onChange={handleInputChange} placeholder={t('state')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.state ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Input name="zip" value={formData.zip} onChange={handleInputChange} placeholder={t('zipCode')} className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && selectedAddressId === 'new' && !formData.zip ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required={selectedAddressId === 'new'} />
                      </div>
                    </div>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-white shadow-sm border-slate-100 focus:ring-ink w-full data-[state=open]:ring-1 data-[state=open]:ring-ink/10 transition-shadow">
                        <SelectValue placeholder={t('country')} />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        sideOffset={8}
                        className="max-h-72 rounded-2xl border-slate-100 bg-white p-2 shadow-xl shadow-black/[0.06]"
                      >
                        {COUNTRIES.map((c) => (
                          <SelectItem
                            key={c.code}
                            value={c.code}
                            className="rounded-xl py-3 px-3 text-sm cursor-pointer data-[highlighted]:bg-ink/5 data-[state=checked]:bg-ink/5 data-[state=checked]:font-semibold"
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInternational && (
                      <p className="text-xs text-ink/50 px-1 -mt-1">{t('internationalShippingNotice')}</p>
                    )}
                  </div>
                )}

                {/* Phone is always shown and required, even when a saved address is selected —
                    older addresses saved before this field existed may not have one on file. */}
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('phoneForDelivery')} type="tel" className={`h-14 rounded-2xl bg-white shadow-sm focus-visible:ring-ink transition-colors ${attemptedSubmit && !formData.phone ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-slate-100'}`} required />
              </section>

              {/* Shipping Method */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-ink mb-2">{t('shippingMethod')}</h2>
                <div className="flex flex-col gap-3">
                  {visibleShippingMethods.map((method: any) => (
                    <label key={method.method} className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${shippingMethod === method.method ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.method}
                          checked={shippingMethod === method.method}
                          onChange={() => setShippingMethod(method.method)}
                          className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-ink">{method.method}</span>
                          {method.estimatedDays && (
                            <span className="text-xs text-ink/60 mt-0.5">{t('businessDays', { days: method.estimatedDays })}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-ink">
                        {(() => {
                          const isExpress = method.method.toLowerCase().includes('express')
                          const isFreeShipping = qualifiesForFreeShipping && !isExpress
                          if (isFreeShipping || method.price === 0) return t('free')
                          return `$${method.price.toFixed(2)}`
                        })()}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-ink mb-2">{t('payment')}</h2>
                <p className="text-xs font-medium text-ink/50 mb-2 flex items-center gap-1.5"><Lock size={12} /> {t('encryptionNotice')}</p>

                {total <= 0 ? (
                  <div className="w-full h-56 bg-green-50 border border-green-500/20 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-sm relative overflow-hidden p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <Check size={24} />
                    </div>
                    <span className="text-sm font-bold text-green-800">{t('orderFullyCovered')}</span>
                    <Button onClick={handleZeroTotalCheckout} disabled={isProcessing} variant="dark" size="lg" className="w-full h-14 rounded-full !text-white">
                      {isProcessing ? <Loader2 className="animate-spin" /> : t('completeFreeOrder')}
                    </Button>
                  </div>
                ) : ENABLE_STRIPE && clientSecret && stripePromise && paymentIntentId ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripeCheckoutForm
                       amount={total}
                       items={items}
                       shippingMethod={shippingMethod}
                       couponCode={appliedCoupon?.code}
                       isRedeemingPoints={isRedeemingPoints}
                       formData={formData}
                       paymentIntentId={paymentIntentId}
                       userId={user?.id}
                    />
                  </Elements>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      {ENABLE_CIRCOFLOWS && (
                        <label className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                          selectedPaymentMethod === 'circoflows' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'
                        }`}>
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="circoflows"
                              className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0"
                              checked={selectedPaymentMethod === 'circoflows'}
                              onChange={() => setSelectedPaymentMethod('circoflows')}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-ink">{t('payWithCard')}</span>
                              <span className="text-xs text-ink/60 mt-0.5">{t('circoflowsCheckoutNote')}</span>
                            </div>
                          </div>
                        </label>
                      )}
                      {ENABLE_PAYZENTRIC && (
                        <label className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                          selectedPaymentMethod === 'payzentric' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'
                        }`}>
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="payzentric"
                              className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0"
                              checked={selectedPaymentMethod === 'payzentric'}
                              onChange={() => setSelectedPaymentMethod('payzentric')}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-ink">{t('payWithCard')}</span>
                              <span className="text-xs text-ink/60 mt-0.5">{t('payzentricCheckoutNote')}</span>
                            </div>
                          </div>
                        </label>
                      )}
                      <label className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                        selectedPaymentMethod === 'zelle' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="zelle" 
                            className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0" 
                            checked={selectedPaymentMethod === 'zelle'} 
                            onChange={() => setSelectedPaymentMethod('zelle')} 
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-ink">Zelle</span>
                            <span className="text-xs text-ink/60 mt-0.5">{t('zelleCheckoutNote')}</span>
                          </div>
                        </div>
                      </label>

                      <label className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${
                        selectedPaymentMethod === 'amex' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="amex" 
                            className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0" 
                            checked={selectedPaymentMethod === 'amex'} 
                            onChange={() => setSelectedPaymentMethod('amex')} 
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-ink">American Express</span>
                            <span className="text-xs text-ink/60 mt-0.5">{t('amexCheckoutNote')}</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    {selectedPaymentMethod === 'payzentric' ? (
                      <PayzentricCheckoutForm
                        amount={total}
                        items={items}
                        shippingMethod={shippingMethod}
                        couponCode={appliedCoupon?.code}
                        isRedeemingPoints={isRedeemingPoints}
                        formData={{ ...formData, email: user?.email || formData.email }}
                        userId={user?.id}
                        isNewAddress={selectedAddressId === 'new'}
                      />
                    ) : (
                      <div className="w-full p-6 sm:p-8 bg-white border border-ink/10 rounded-3xl shadow-sm flex flex-col items-center gap-6 text-center mt-2">
                        <Button onClick={
                          selectedPaymentMethod === 'circoflows' ? handleCircoFlowsPlaceOrder :
                          selectedPaymentMethod === 'zelle' ? handleZellePlaceOrder : handleAmexPlaceOrder
                        } disabled={isProcessing} variant="dark" size="lg" className="w-full h-14 rounded-full !text-white">
                          {isProcessing ? <Loader2 className="animate-spin" /> : t('placeOrder')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </section>

            </div>
          </div>

          {/* Right Column: Order Summary (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="bg-[#F5F5F7]/40 p-8 md:p-10 rounded-[2rem] border border-slate-100 flex flex-col gap-8">
              
              <h2 className="text-2xl font-bold text-ink font-heading">
                {t('orderSummary')}
              </h2>
              
              {/* Items List */}
              <div className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto pt-4 pr-4 pb-2 custom-scrollbar" data-lenis-prevent="true">
                {items.map((item) => (
                  <div key={item.lineId} className="flex gap-4 group">
                    <div className="relative w-20 h-20 shrink-0 transition-transform group-hover:scale-105">
                      <div className="w-full h-full bg-cream border border-ink/5 rounded-2xl overflow-hidden relative">
                        <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-auto min-w-[24px] h-6 px-1 bg-ink text-cream rounded-full flex items-center justify-center text-[11px] font-bold z-10 shadow-sm border-2 border-white">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-center py-1">
                      <span className="text-sm font-bold text-ink leading-tight">{item.product?.name}</span>
                      {(item.variantTitle || item.variantSku) && !['DEFAULT', 'DEFAULT TITLE'].includes((item.variantTitle || item.variantSku || '').toUpperCase()) && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">{item.variantTitle || item.variantSku}</span>
                      )}
                    </div>
                    <span className="text-sm text-ink font-bold self-center">
                      ${(item.priceSnapshot * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex flex-col gap-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-green-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                        <span className="text-xs font-medium text-green-600/70">{appliedCoupon.description}</span>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs font-bold text-green-700 hover:text-green-800 uppercase tracking-widest transition-colors">
                      {t('remove')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={t('discountCodePlaceholder')}
                      className="flex-1 h-12 rounded-2xl border-ink/10 bg-cream/50 focus-visible:ring-ink shadow-inner-sm"
                    />
                    <Button
                      type="submit"
                      variant="dark"
                      disabled={!couponCode.trim() || isVerifyingCoupon}
                      className="h-12 px-6 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-100 disabled:bg-ink/5 disabled:text-ink/40 disabled:border-transparent transition-colors text-white"
                    >
                      {isVerifyingCoupon ? <Loader2 size={16} className="animate-spin text-ink/40" /> : t('apply')}
                    </Button>
                  </form>
                )}
              </div>

              {/* Maxx Points */}
              {availablePoints > 0 && (
                <div className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${isRedeemingPoints ? 'bg-amber-50 border-amber-200/60 shadow-inner-sm' : 'bg-white border-ink/10 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRedeemingPoints ? 'bg-amber-100 text-amber-600' : 'bg-cream text-ink/40'}`}>
                        <Sparkles size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isRedeemingPoints ? 'text-amber-700' : 'text-ink'}`}>{t('purityPoints')}</span>
                        <span className="text-xs font-medium text-ink/50">{t('youHavePointsWithValue', { points: Number(availablePoints.toFixed(2)), value: availablePoints.toFixed(2) })}</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isRedeemingPoints}
                        onChange={() => setIsRedeemingPoints(!isRedeemingPoints)}
                      />
                      <div className="w-11 h-6 bg-ink/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              )}

              <div className="w-full h-px bg-ink/5" />

              {/* Totals */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>{t('subtotal')}</span>
                  <span className="text-ink font-bold">${subtotal.toFixed(2)}</span>
                </div>

                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                    >
                      <span className="py-1">{t('discountWithCode', { code: appliedCoupon.code })}</span>
                      <span className="py-1 font-bold">-${appliedCoupon.discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isRedeemingPoints && pointsToRedeem > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                    >
                      <span className="py-1 flex items-center gap-1.5"><Sparkles size={14} /> {t('pointsApplied')}</span>
                      <span className="py-1 font-bold">-${pointsToRedeem.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>{t('shippingWithMethod', { method: selectedMethodObj?.method ? `(${selectedMethodObj.method})` : '' })}</span>
                  <span className="text-ink font-bold">{finalShipping === 0 ? t('free') : `$${finalShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>{t('processingFee')}{activeFeePercentage ? ` (${activeFeePercentage}%)` : ''}</span>
                  <span className="text-ink font-bold">${processingFeeAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full h-px bg-ink/5" />

              <div className="flex justify-between items-end mt-4">
                <span className="text-sm font-bold uppercase tracking-widest text-ink/60">{t('total')}</span>
                <span className="text-4xl font-bold text-ink font-heading">
                  ${total.toFixed(2)}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
