import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/cart/store'

interface PayzentricCheckoutFormProps {
  amount: number
  items: any[]
  shippingMethod: string
  couponCode?: string
  isRedeemingPoints: boolean
  formData: any
  userId?: string
  isNewAddress: boolean
}

// Payzentric has no client-side tokenization SDK — the card fields are submitted straight from
// the customer's own browser to Payzentric's hosted 3D Secure endpoint via a real (non-fetch)
// form POST, never to our own API. Our server action only ever sees these values in memory long
// enough to build that one-time xmlData payload; nothing card-related is stored or logged.
export function PayzentricCheckoutForm({
  amount, items, shippingMethod, couponCode, isRedeemingPoints, formData, userId, isNewAddress,
}: PayzentricCheckoutFormProps) {
  const t = useTranslations('checkout.checkoutClient')
  const tForm = useTranslations('checkout.payzentricCheckoutForm')
  const [isProcessing, setIsProcessing] = useState(false)
  const [card, setCard] = useState({ cardHolder: '', cardNumber: '', expMonth: '', expYear: '', cvv: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }
    if (!card.cardHolder || !card.cardNumber || !card.expMonth || !card.expYear || !card.cvv) {
      toast.error(t('fillRequiredFieldsOrder'))
      return
    }

    setIsProcessing(true)

    try {
      const { createPayzentricPayment } = await import('./payzentricActions')
      const res = await createPayzentricPayment(
        items, shippingMethod, couponCode, isRedeemingPoints,
        { ...formData, email: formData.email },
        card,
        userId,
        isNewAddress
      )

      if (res.error || !res.asyncUrl || !res.xmlData || !res.providerPIN) {
        toast.error(res.error || t('unexpectedError'))
        if ((res as any).priceChanged && (res as any).updatedItems) {
          useCartStore.getState().setItems((res as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      // Cart stays intact until payment is actually confirmed (webhook-driven finalize) — same
      // as CircoFlows. Building a real <form> and submitting it (rather than fetch/redirect) is
      // required here so the customer's own browser lands on Payzentric's 3D Secure page with
      // its own session, able to complete an issuer ACS challenge if one is required.
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = res.asyncUrl
      form.style.display = 'none'

      const providerPinInput = document.createElement('input')
      providerPinInput.type = 'hidden'
      providerPinInput.name = 'ProviderPIN'
      providerPinInput.value = res.providerPIN
      form.appendChild(providerPinInput)

      const xmlDataInput = document.createElement('input')
      xmlDataInput.type = 'hidden'
      xmlDataInput.name = 'xmlData'
      xmlDataInput.value = res.xmlData
      form.appendChild(xmlDataInput)

      document.body.appendChild(form)
      form.submit()
    } catch {
      toast.error(t('unexpectedError'))
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-6 sm:p-8 bg-white border border-ink/10 rounded-3xl shadow-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="payzentric-card-holder" className="text-xs font-bold text-ink/60 uppercase tracking-wide">{tForm('nameOnCard')}</label>
        <Input
          id="payzentric-card-holder"
          value={card.cardHolder}
          onChange={(e) => setCard((c) => ({ ...c, cardHolder: e.target.value }))}
          placeholder={tForm('namePlaceholder')}
          autoComplete="cc-name"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="payzentric-card-number" className="text-xs font-bold text-ink/60 uppercase tracking-wide">{tForm('cardNumber')}</label>
        <Input
          id="payzentric-card-number"
          value={card.cardNumber}
          onChange={(e) => setCard((c) => ({ ...c, cardNumber: e.target.value.replace(/[^\d\s]/g, '') }))}
          placeholder="4111 1111 1111 1111"
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={23}
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payzentric-exp-month" className="text-xs font-bold text-ink/60 uppercase tracking-wide">{tForm('expMonth')}</label>
          <Input
            id="payzentric-exp-month"
            value={card.expMonth}
            onChange={(e) => setCard((c) => ({ ...c, expMonth: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
            placeholder="MM"
            inputMode="numeric"
            autoComplete="cc-exp-month"
            maxLength={2}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payzentric-exp-year" className="text-xs font-bold text-ink/60 uppercase tracking-wide">{tForm('expYear')}</label>
          <Input
            id="payzentric-exp-year"
            value={card.expYear}
            onChange={(e) => setCard((c) => ({ ...c, expYear: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            placeholder="YYYY"
            inputMode="numeric"
            autoComplete="cc-exp-year"
            maxLength={4}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payzentric-cvv" className="text-xs font-bold text-ink/60 uppercase tracking-wide">{tForm('cvv')}</label>
          <Input
            id="payzentric-cvv"
            value={card.cvv}
            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="dark"
        size="lg"
        disabled={isProcessing}
        className="w-full h-14 rounded-full !text-white mt-2"
      >
        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : (<>{t('placeOrder')} (${amount.toFixed(2)}) <ArrowRight size={18} className="ml-2" /></>)}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/40 font-medium">
        <Lock size={12} /> {t('encryptionNotice')}
      </p>
    </form>
  )
}
