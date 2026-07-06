'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Printer } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { FadeUp } from '@/components/motion/FadeUp'
import { buttonVariants } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

type OrderItem = {
  id: string
  name: string
  variant: string
  quantity: number
  price: number
  image: string
}

type OrderData = {
  id: string
  customerName: string
  email: string
  shippingAddress: {
    line1: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress: {
    line1: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  estimatedDeliveryType: 'express' | 'standard'
  items: OrderItem[]
  subtotal: number
  shipping: number
  processingFee: number
  processingFeePercentage?: number | null
  total: number
  discountTotal?: number
  redeemedPoints?: number
  couponCode?: string
  paymentMethod: 'stripe' | 'zelle'
}

const ZELLE_RECIPIENT_EMAIL = 'orders@99puritypeptides.com'

export function OrderConfirmationClient({ order }: { order: OrderData }) {
  const t = useTranslations('orderConfirmation')
  const isZelle = order.paymentMethod === 'zelle'

  const PAYMENT_METHOD_LABELS: Record<OrderData['paymentMethod'], string> = {
    stripe: t('paymentMethodCard'),
    zelle: t('paymentMethodZelle'),
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-32 print:bg-white print:pt-0 print:pb-0 print:min-h-0">
        <Container size="page" className="flex flex-col items-center px-4 sm:px-6 print:block print:w-full print:px-0 print:m-0 print:h-auto">
        
        {/* Success Header - Hidden on Print */}
        <div className="text-center mb-10 md:mb-12 flex flex-col items-center print:hidden">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-ink text-white flex items-center justify-center mb-6 shadow-lg"
          >
            <Check size={28} strokeWidth={2} />
          </motion.div>
          
          <FadeUp delay={0.1}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-3">
              {isZelle ? t('orderPlaced') : t('paymentSuccessful')}
            </h1>
            <p className="text-ink/60 text-sm md:text-base">
              {isZelle
                ? t('thankYouZelle', { name: order.customerName })
                : t('thankYouConfirmed', { name: order.customerName })}
            </p>
          </FadeUp>
        </div>

        {/* Zelle Payment Card - only shown for pending Zelle orders */}
        {isZelle && (
          <FadeUp delay={0.15} className="w-full max-w-lg mb-8 md:mb-10 print:hidden">
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl font-display">
                Z
              </div>
              <div>
                <h2 className="text-lg font-bold text-purple-800 mb-2">{t('completeZellePayment')}</h2>
                <p className="text-sm text-purple-700/80">
                  {t.rich('sendViaZelle', {
                    amount: `$${order.total.toFixed(2)}`,
                    bold: (chunks) => <span className="font-bold">{chunks}</span>,
                  })}
                </p>
              </div>

              <div className="w-44 h-44 bg-white border border-purple-100 rounded-2xl overflow-hidden flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- res.cloudinary.com isn't in next.config.ts remotePatterns, matching the existing pattern for this Cloudinary account elsewhere in the app */}
                <img src="https://res.cloudinary.com/denskvdyt/image/upload/v1783110064/zelle-qr_h2xhvt.jpg" alt="Zelle payment QR code" className="w-full h-full object-contain" />
              </div>

              <div className="bg-white rounded-xl px-6 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-0.5">{t('sendTo')}</p>
                <p className="text-sm font-bold text-purple-800">{ZELLE_RECIPIENT_EMAIL}</p>
              </div>

              <p className="text-xs text-purple-700/60 max-w-sm">
                {t.rich('includeOrderNumber', {
                  orderId: order.id,
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </p>
            </div>
          </FadeUp>
        )}

        {/* Invoice Card */}
        <FadeUp delay={0.2} className="w-full max-w-5xl print:max-w-none print:w-full">
          <div className="bg-white border border-ink/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden print:shadow-none print:border-none print:rounded-none">
            
            {/* Print Branding Header */}
            <div className="hidden print:flex items-center justify-between py-4 px-0 border-b border-ink/10">
              <h1 className="text-2xl font-display font-bold tracking-tight text-ink uppercase">99 Purity Peptides</h1>
              <p className="text-sm font-medium text-ink/60">99puritypeptides.com</p>
            </div>

            {/* Invoice Header */}
            <div className="p-6 sm:p-8 md:p-10 border-b border-ink/5 bg-[#fafafa]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 print:bg-transparent print:py-4 print:px-0 print:border-b-0">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-1">{t('receipt')}</p>
                <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight break-all">#{order.id}</h2>
              </div>
              <div className="text-left sm:text-right text-sm">
                <p className="text-ink/60 mb-1">{t('confirmationEmailSent')}</p>
                <p className="font-medium text-ink break-all">{order.email}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10 print:py-4 print:px-0 print:border-t print:border-ink/10">
              {/* Shipping & Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 md:mb-12 print:gap-4 print:mb-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4 border-b border-ink/5 pb-2">{t('shippingAddress')}</h3>
                  <div className="text-sm text-ink/80 flex flex-col gap-1">
                    <p className="font-bold text-ink">{order.customerName}</p>
                    <p>{order.shippingAddress.line1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4 border-b border-ink/5 pb-2">{t('billingAddress')}</h3>
                  <div className="text-sm text-ink/80 flex flex-col gap-1">
                    <p className="font-bold text-ink">{order.customerName}</p>
                    <p>{order.billingAddress.line1}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4 border-b border-ink/5 pb-2">{t('deliveryAndPayment')}</h3>
                  <div className="text-sm text-ink/80 flex flex-col gap-3">
                    <div>
                      <p className="text-ink/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">{t('estDelivery')}</p>
                      <p className="font-bold text-ink">{t(order.estimatedDeliveryType === 'express' ? 'estimatedDeliveryExpress' : 'estimatedDeliveryStandard')}</p>
                    </div>
                    <div>
                      <p className="text-ink/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">{t('paymentMethod')}</p>
                      <p className="font-bold text-ink">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table - With horizontal scroll on mobile */}
              <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 mb-8 custom-scrollbar print:overflow-visible print:px-0 print:mx-0 print:mb-4">
                <table className="w-full text-sm text-left min-w-[500px] print:min-w-full">
                  <thead>
                    <tr className="border-b border-ink/10 text-[10px] sm:text-xs uppercase tracking-widest text-ink/40 bg-[#fafafa]/50 print:bg-transparent">
                      <th className="py-3 px-4 font-medium rounded-tl-lg print:px-0">{t('product')}</th>
                      <th className="py-3 px-4 font-medium text-center">{t('qty')}</th>
                      <th className="py-3 px-4 font-medium text-right">{t('price')}</th>
                      <th className="py-3 px-4 font-medium text-right rounded-tr-lg print:px-0">{t('total')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {order.items.map(item => (
                      <tr key={item.id} className="group hover:bg-[#fafafa]/50 transition-colors print:hover:bg-transparent">
                        <td className="py-4 sm:py-5 px-4 print:py-2 print:px-0">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-ink/5 overflow-hidden shrink-0 shadow-sm print:hidden">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-ink whitespace-normal line-clamp-2 print:line-clamp-none">{item.name}</span>
                              {item.variant && !['DEFAULT', 'DEFAULT TITLE'].includes(item.variant.toUpperCase()) && (
                                <span className="text-[10px] uppercase tracking-widest font-medium text-ink/50 mt-0.5">{item.variant}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 sm:py-5 px-4 text-center text-ink/70 font-medium print:py-2">{item.quantity}</td>
                        <td className="py-4 sm:py-5 px-4 text-right text-ink/70 print:py-2">${item.price.toFixed(2)}</td>
                        <td className="py-4 sm:py-5 px-4 text-right font-bold text-ink print:px-0 print:py-2">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Table */}
              <div className="flex justify-center sm:justify-end print:justify-end">
                <div className="w-full sm:max-w-sm bg-[#fafafa]/50 rounded-xl p-5 sm:p-6 border border-ink/5 print:border-none print:bg-transparent print:p-0">
                  <table className="w-full text-sm text-right">
                    <tbody className="divide-y divide-transparent">
                      <tr>
                        <td className="py-2 text-ink/60">{t('subtotal')}</td>
                        <td className="py-2 text-ink font-medium">${order.subtotal.toFixed(2)}</td>
                      </tr>
                      {!!order.discountTotal && order.discountTotal > 0 && (
                        <tr>
                          <td className="py-2 text-ink/60">{t('discount')} {order.couponCode ? `(${order.couponCode})` : ''}</td>
                          <td className="py-2 font-medium text-green-600 print:text-green-600">-${order.discountTotal.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2 text-ink/60">{t('shipping')}</td>
                        <td className="py-2 text-ink font-medium">{order.shipping === 0 ? t('free') : `$${order.shipping.toFixed(2)}`}</td>
                      </tr>
                      <tr>
                        <td className={`py-2 text-ink/60 ${!order.redeemedPoints ? 'pb-3 sm:pb-4' : ''}`}>{t('processingFee')}{order.processingFeePercentage ? ` (${order.processingFeePercentage}%)` : ''}</td>
                        <td className={`py-2 text-ink font-medium ${!order.redeemedPoints ? 'pb-3 sm:pb-4' : ''}`}>${order.processingFee.toFixed(2)}</td>
                      </tr>
                      {!!order.redeemedPoints && order.redeemedPoints > 0 && (
                        <tr>
                          <td className="py-2 text-ink/60 pb-3 sm:pb-4">{t('purityPoints')}</td>
                          <td className="py-2 font-medium text-green-600 print:text-green-600 pb-3 sm:pb-4">-${order.redeemedPoints.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="border-t border-ink/10">
                        <td className="pt-3 sm:pt-4 text-base font-bold text-ink">{t('totalUsd')}</td>
                        <td className="pt-3 sm:pt-4 text-lg sm:text-xl font-bold text-ink">${order.total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Action Bar - Hidden on Print */}
            <div className="bg-[#fafafa] border-t border-ink/5 p-4 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ink/60 print:hidden">
              <button onClick={() => window.print()} className="flex items-center gap-2 hover:text-ink transition-colors font-medium">
                <Printer size={16} /> {t('printReceipt')}
              </button>
              <span className="text-center sm:text-left">
                {t.rich('questionsContactSupport', {
                  link: (chunks) => <a href="mailto:support@99puritypeptides.com" className="text-ink underline hover:no-underline font-medium">{chunks}</a>,
                })}
              </span>
            </div>
          </div>
        </FadeUp>

        {/* Footer Actions - Hidden on Print */}
        <FadeUp delay={0.3} className="mt-10 md:mt-12 w-full flex flex-col items-center print:hidden">
          <Link href="/shop" className={buttonVariants({ variant: 'dark', size: 'lg', className: 'w-full sm:w-auto min-w-[200px] !rounded-full px-8 tracking-widest text-sm uppercase shadow-md hover:-translate-y-0.5 transition-all h-14' })}>
            {t('continueShopping')}
          </Link>
        </FadeUp>
        
      </Container>
      </div>
    </>
  )
}
