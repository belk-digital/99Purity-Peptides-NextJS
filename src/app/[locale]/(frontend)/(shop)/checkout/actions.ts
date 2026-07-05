'use server'

import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Stripe from 'stripe'
import { verifyCoupon, getUserPurityPoints } from '../actions'
import { cookies } from 'next/headers'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping/constants'
import { establishSessionForNewUser } from '@/lib/auth/establishSession'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10' as any,
})

export async function getShippingMethods() {
  const payload = await getPayload({ config: configPromise })
  const zones = await payload.find({
    collection: 'shippingzones',
    limit: 1,
    depth: 0,
  })

  if (zones.docs.length > 0 && zones.docs[0].methods) {
    return zones.docs[0].methods
  }
  
  // Fallback if none exist (no ShippingZones doc currently exists in this project's DB,
  // so this fallback is what's actually active in production right now)
  return [
    { method: 'Standard Shipping', price: 20, estimatedDays: 5 },
    { method: 'Express Shipping', price: 30, estimatedDays: 2 }
  ]
}

export async function getActiveProcessingFees() {
  const payload = await getPayload({ config: configPromise })
  const fees = await payload.find({
    collection: 'processing-fees',
    depth: 0,
    overrideAccess: true,
    limit: 100,
  })
  return fees.docs.filter((f: any) => f.isActive)
}

export async function createPaymentIntent(
  items: any[], 
  shippingMethodName: string,
  couponCode: string | undefined,
  isRedeemingPoints: boolean
) {
  const payload = await getPayload({ config: configPromise })


  // Validate items, check stock, and calculate subtotal securely on server
  let subtotal = 0;
  let pricesChanged = false;
  const { revalidateCartPrices } = await import('@/app/[locale]/(frontend)/actions/cart')
  const liveItems = await revalidateCartPrices(items)

  for (let i = 0; i < items.length; i++) {
     const item = items[i]
     const liveItem = liveItems[i]
     
     const itemPrice = Number(item.priceSnapshot)
     const livePrice = Number(liveItem.priceSnapshot)
     
     if (itemPrice !== livePrice && !(Number.isNaN(itemPrice) && Number.isNaN(livePrice))) {
       pricesChanged = true
     }

     const productRes = await payload.findByID({ collection: 'products', id: (!isNaN(Number(item.productId)) ? Number(item.productId) : item.productId) as any, depth: 0 })
     if (!productRes) {
        return { error: `Product not found: ${item.productId}` }
     }
     if ((productRes.stock || 0) < item.quantity) {
        return { error: `Insufficient stock for ${productRes.name || 'item'}. Only ${productRes.stock} left.` }
     }
     subtotal += liveItem.priceSnapshot * item.quantity
  }

  if (pricesChanged) {
    return { 
      error: 'Prices for some items have updated since they were added to your cart. We have refreshed your cart with the latest live prices.', 
      updatedItems: liveItems,
      priceChanged: true
    }
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (couponCode) {
    const couponRes = await verifyCoupon(couponCode, subtotal, items)
    if (couponRes.valid) {
      discountAmount = couponRes.discount || 0
      freeShipping = couponRes.freeShipping || false
    }
  }

  const methods = await getShippingMethods()
  const selectedMethod = methods.find((m: any) => m.method === shippingMethodName) || methods[0]
  
  // Validate minOrderAmount for the selected shipping method
  if ((selectedMethod as any)?.minOrderAmount && (selectedMethod as any).minOrderAmount > 0) {
    if (subtotal < (selectedMethod as any).minOrderAmount) {
       return { error: `Your cart subtotal must be at least $${(selectedMethod as any).minOrderAmount} to use ${selectedMethod.method}.` }
    }
  }

  const shippingCost = selectedMethod?.price || 0

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const isExpressShipping = shippingMethodName.toLowerCase().includes('express')
  // Subtotal is checked before coupon discount, per the $300 free-standard-shipping threshold.
  // Express is never discounted (matches how a coupon's freeShipping flag already behaves).
  const qualifiesForFreeShipping = freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD
  const finalShipping = (qualifiesForFreeShipping && !isExpressShipping) ? 0 : shippingCost

  // Calculate dynamic processing fees
  const activeFees = await getActiveProcessingFees()
  let feeTotal = 0
  activeFees.forEach((fee: any) => {
    if (!fee.isOptional) {
      if (fee.type === 'percentage') {
        feeTotal += subtotalAfterDiscount * (fee.amount / 100)
      } else if (fee.type === 'fixed_amount') {
        feeTotal += (fee.amount / 100)
      }
    }
  })

  const tax = 0 // Statically 0 now, handled by ProcessingFees
  const totalBeforePoints = subtotalAfterDiscount + finalShipping + tax + feeTotal

  let pointsToRedeem = 0;
  if (isRedeemingPoints) {
    const availablePoints = await getUserPurityPoints()
    pointsToRedeem = Math.min(availablePoints, totalBeforePoints)
  }

  const total = totalBeforePoints - pointsToRedeem
  const amountInCents = Math.round(total * 100)

  if (amountInCents < 50) {
      return { error: 'Order total too low for Stripe processing (minimum $0.50)' }
  }

  // Check for affiliate ref cookie
  const cookieStore = await cookies()
  const affiliateRef = cookieStore.get('affiliate_ref')?.value
  const clickCookie = cookieStore.get('affiliate_click_id')?.value

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        affiliateId: affiliateRef || null,
        clickId: clickCookie || null
      }
    })

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount: total }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return { error: error.message }
  }
}

export async function createPayloadOrder(
  items: any[],
  shippingMethodName: string,
  couponCode: string | undefined,
  isRedeemingPoints: boolean,
  formData: any,
  paymentIntentId: string,
  userId?: string,
  paymentMethod: 'stripe' | 'zelle' = 'stripe',
  isNewAddress = false
) {
  const payload = await getPayload({ config: configPromise })

  let subtotal = 0;
  let pricesChanged = false;
  const { revalidateCartPrices } = await import('@/app/[locale]/(frontend)/actions/cart')
  const liveItems = await revalidateCartPrices(items)

  const productsCache = new Map()

  for (let i = 0; i < items.length; i++) {
     const item = items[i]
     const liveItem = liveItems[i]
     
     if (item.priceSnapshot !== liveItem.priceSnapshot) {
       pricesChanged = true
     }

     const productRes = await payload.findByID({ collection: 'products', id: (!isNaN(Number(item.productId)) ? Number(item.productId) : item.productId) as any, depth: 0 })
     if (!productRes) {
        return { error: `Product not found: ${item.productId}` }
     }
     productsCache.set(item.productId, productRes)
     if ((productRes.stock || 0) < item.quantity) {
        return { error: `Insufficient stock for ${productRes.name || 'item'}. Only ${productRes.stock} left.` }
     }
     subtotal += liveItem.priceSnapshot * item.quantity
  }

  if (pricesChanged) {
    return { 
      error: 'Prices for some items have updated since they were added to your cart. We have refreshed your cart with the latest live prices.', 
      updatedItems: liveItems,
      priceChanged: true
    }
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (couponCode) {
    const couponRes = await verifyCoupon(couponCode, subtotal, items)
    if (couponRes.valid) {
      discountAmount = couponRes.discount || 0
      freeShipping = couponRes.freeShipping || false
    }
  }

  const methods = await getShippingMethods()
  const selectedMethod = methods.find((m: any) => m.method === shippingMethodName) || methods[0]

  // Validate minOrderAmount for the selected shipping method
  if ((selectedMethod as any)?.minOrderAmount && (selectedMethod as any).minOrderAmount > 0) {
    if (subtotal < (selectedMethod as any).minOrderAmount) {
       return { error: `Your cart subtotal must be at least $${(selectedMethod as any).minOrderAmount} to use ${selectedMethod.method}.` }
    }
  }

  const shippingCost = selectedMethod?.price || 0

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const isExpressShipping = shippingMethodName.toLowerCase().includes('express')
  // Subtotal is checked before coupon discount, per the $300 free-standard-shipping threshold.
  // Express is never discounted (matches how a coupon's freeShipping flag already behaves).
  const qualifiesForFreeShipping = freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD
  const finalShipping = (qualifiesForFreeShipping && !isExpressShipping) ? 0 : shippingCost

  // Calculate dynamic processing fees
  const activeFees = await getActiveProcessingFees()
  let feeTotal = 0
  const appliedFees: any[] = []
  
  activeFees.forEach((fee: any) => {
    if (!fee.isOptional) {
      const amount = fee.type === 'percentage' 
        ? subtotalAfterDiscount * (fee.amount / 100)
        : (fee.amount / 100)
      
      feeTotal += amount
      appliedFees.push({
        feeId: fee.id,
        feeName: fee.name,
        amount: Math.round(amount * 100) // cents for Payload array
      })
    }
  })

  const tax = 0 // Statically 0 now, handled by ProcessingFees
  const totalBeforePoints = subtotalAfterDiscount + finalShipping + tax + feeTotal

  let pointsToRedeem = 0;
  if (isRedeemingPoints) {
    const availablePoints = await getUserPurityPoints()
    pointsToRedeem = Math.min(availablePoints, totalBeforePoints)
  }

  const total = totalBeforePoints - pointsToRedeem

  try {
    // userId is the Payload user's own id (from the NextAuth session), not an external IdP id.
    let payloadUserId: number | null = userId ? Number(userId) : null
    let isNewAccount = false
    const normalizedEmail = (formData.email || '').toLowerCase().trim()

    if (!payloadUserId && normalizedEmail) {
      // Guest checkout — link to an existing account with this email if one exists,
      // otherwise auto-create one so the customer has an account for this order going forward.
      const existingUser = await payload.find({
        collection: 'users',
        where: { email: { equals: normalizedEmail } },
        limit: 1,
        overrideAccess: true,
      })

      if (existingUser.docs.length > 0) {
        payloadUserId = existingUser.docs[0].id
      } else {
        const created = await payload.create({
          collection: 'users',
          data: {
            email: normalizedEmail,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            role: 'customer',
            authProvider: 'credentials',
            // Random unusable password — the customer sets a real one via the password-setup email below.
            password: crypto.randomBytes(32).toString('hex'),
          },
          overrideAccess: true,
        })
        payloadUserId = created.id
        isNewAccount = true
      }
    }

    // Format order items for Payload
    const orderItems = items.map(item => {
      const parsedId = parseInt(String(item.productId), 10)
      const productData = productsCache.get(item.productId)
      return {
        product: isNaN(parsedId) ? item.productId : parsedId,
        variant: item.variantSku || 'DEFAULT',
        price: item.priceSnapshot,
        quantity: item.quantity,
        productSnapshot: productData || null
      }
    })

    // Create pending Order in Payload
    const order = await payload.create({
      collection: 'orders',
      data: {
        owner: payloadUserId,
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        customerPhone: formData.phone,
        guestEmail: formData.email,
        shippingAddress: {
          line1: formData.address,
          line2: formData.apartment || '',
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: 'US', // default
        },
        items: orderItems,
        status: total <= 0 ? 'paid' : 'pending',
        // Zelle has no payment API — orders stay unpaid until a human confirms the transfer manually.
        paymentStatus: total <= 0 ? 'captured' : 'unpaid',
        paymentMethod,
        fulfillmentStatus: 'unfulfilled',
        subtotal: subtotal,
        discountTotal: discountAmount,
        redeemedPoints: pointsToRedeem,
        shippingTotal: finalShipping,
        taxTotal: tax,
        feeTotal: Math.round(feeTotal * 100),
        appliedFees,
        total: total,
        shippingMethod: shippingMethodName,
        couponCode: couponCode || '',
      }
    })

    // Update Stripe PaymentIntent with the Order ID (unless it's a free order or Zelle, which has no PaymentIntent)
    if (paymentMethod === 'stripe' && paymentIntentId && paymentIntentId !== 'free_order') {
       await stripe.paymentIntents.update(paymentIntentId, {
          metadata: {
             orderId: String(order.id)
          }
       })
    } else if (total <= 0) {
       // Instantly finalize the free order (deduct inventory, use coupons, give points)
       const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
       await finalizeOrder(order.id, {
          cartId: undefined, // user cart cleared in finalizeOrder, guest cart is in formData guestCart
          affiliateId: (await cookies()).get('affiliate_ref')?.value,
          clickId: (await cookies()).get('affiliate_click_id')?.value,
       })
    } else if (paymentMethod === 'zelle') {
       // Send initial order invoice immediately for Zelle orders
       try {
           let customerEmail = order.guestEmail;
           if (!customerEmail && order.owner) {
               const userDoc = typeof order.owner === 'object' ? order.owner : await payload.findByID({ collection: 'users', id: order.owner });
               customerEmail = userDoc.email;
           }
           if (customerEmail) {
               const { generateOrderInvoiceHtml } = await import('@/lib/emails/generateOrderEmail');
               const invoiceHtml = await generateOrderInvoiceHtml(order, payload);

               await payload.sendEmail({
                   from: 'Orders | 99 Purity Peptides <orders@99puritypeptides.com>',
                   to: customerEmail,
                   bcc: 'orders@99puritypeptides.com',
                   subject: `Order Invoice #${order.orderNumber || order.id}`,
                   html: invoiceHtml,
               })
           }
       } catch (err) {
           console.error('Failed to send initial Zelle confirmation email', err)
       }
    }

    // Save this shipping address to the account for next time, if it's a newly-typed one
    // (not one they picked from their existing saved addresses).
    if (payloadUserId && isNewAddress && formData.address) {
      try {
        const existingAddresses = await payload.find({
          collection: 'addresses',
          where: { user: { equals: payloadUserId } },
          overrideAccess: true,
        })
        const alreadySaved = existingAddresses.docs.some(
          (addr: any) =>
            addr.line1?.toLowerCase() === formData.address?.toLowerCase() &&
            addr.postalCode === formData.zip
        )
        if (!alreadySaved) {
          await payload.create({
            collection: 'addresses',
            data: {
              user: payloadUserId,
              label: formData.address,
              firstName: formData.firstName,
              lastName: formData.lastName,
              line1: formData.address,
              line2: formData.apartment || '',
              city: formData.city,
              state: formData.state,
              postalCode: formData.zip,
              country: 'US',
              phone: formData.phone,
              isDefaultShipping: existingAddresses.docs.length === 0,
            },
            overrideAccess: true,
          })
        }
      } catch (err) {
        // Don't fail the order over a non-critical address save
        console.error('Failed to save address to account:', err)
      }
    }

    // A brand-new account was just auto-created for this guest — sign them in immediately
    // and send a password-setup email so they can log back in on a future visit.
    if (isNewAccount && payloadUserId) {
      try {
        await establishSessionForNewUser({
          id: payloadUserId,
          email: normalizedEmail,
          role: 'customer',
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
        await payload.forgotPassword({
          collection: 'users',
          data: { email: normalizedEmail },
          disableEmail: false,
        })
      } catch (err) {
        console.error('Failed to finish new-account setup:', err)
      }
    }

    // Set a cookie to authorize the order confirmation page
    const cookieStore = await cookies()
    cookieStore.set(`order_auth_${order.id}`, 'true', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return { orderId: String(order.id) }
  } catch (error: any) {
    console.error('Failed to create Payload order:', error)
    return { error: error.message }
  }
}

export async function syncPaymentStatus(paymentIntentId: string, orderId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
      await finalizeOrder(orderId, paymentIntent.metadata)
      return { success: true }
    }
    return { success: false, status: paymentIntent.status }
  } catch (error: any) {
    console.error('Failed to sync payment status:', error)
    return { error: error.message }
  }
}

export async function notifyAdminFailedPayment(orderId: string, errorMessage: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const order = await payload.findByID({
      collection: 'orders',
      id: isNaN(Number(orderId)) ? orderId : Number(orderId),
      depth: 0,
    })

    if (!order) return { success: false }

    const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || 'N/A'
    const total = `$${(order.total || 0).toFixed(2)}`

    const html = `
      <h2>Payment Failed Alert</h2>
      <p>A customer attempted to checkout but their payment failed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Customer Email:</strong> ${customerEmail}</li>
        <li><strong>Total:</strong> ${total}</li>
        <li><strong>Error Message:</strong> ${errorMessage}</li>
      </ul>
      <p>You can check their cart/order details in the Payload Admin panel to see what they were trying to buy.</p>
    `

    await payload.sendEmail({
      to: 'support@99puritypeptides.com',
      subject: `⚠️ Payment Failed - Order ${orderId}`,
      html: html,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send admin failure notification:', error)
    return { success: false }
  }
}

