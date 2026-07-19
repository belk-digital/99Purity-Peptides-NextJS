import type { CollectionBeforeValidateHook } from "payload"
import { Payload } from 'payload'

export const beforeValidateReview: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data
  // If the user creating the review is an admin, they can bypass the purchase check.
  if (req.user?.role === 'admin') {
    // If they manually selected an order, just trust it.
    if (data.order) {
      data.verifiedPurchase = true
    }
    return data
  }

  if (!req.user) {
    throw new Error('You must be logged in to leave a review.')
  }

  if (!data.product || !data.user) {
    throw new Error('Product and User are required to leave a review.')
  }

  // Look up based on the user submitting the review (data.user)
  // (In frontend submissions, data.user is set to session.user.id)
  const targetUserId = typeof data.user === 'object' ? data.user.id : data.user

  const { docs: orders } = await req.payload.find({
    collection: 'orders',
    where: {
      and: [
        { owner: { equals: targetUserId } },
        { 'items.product': { equals: data.product } },
        { status: { in: ['paid', 'fulfilled', 'shipped', 'completed'] } }
      ]
    },
    limit: 1,
    depth: 0,
  })

  if (orders && orders.length > 0) {
    // We found a valid order containing this product
    data.verifiedPurchase = true
    // Link the first found order just for record keeping
    data.order = orders[0].id
  } else {
    throw new Error('You must purchase this product before you can leave a review.')
  }

  return data
}
