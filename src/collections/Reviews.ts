import { CollectionConfig } from 'payload'
import { beforeValidateReview } from '../hooks/reviews'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    defaultColumns: ['product', 'user', 'rating', 'status', 'verifiedPurchase'],
    description: 'Customer reviews – verification ties to delivered orders.',
  },
  access: {
    // Public read only for approved reviews, admins see all
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { status: { equals: 'approved' } }
    },
    // Only authenticated users can create a review; we'll validate order delivery in hook
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false
      return { and: [{ user: { equals: req.user.id } }, { status: { equals: 'pending' } }] } as any
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeValidate: [beforeValidateReview],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.status === 'pending') {
          try {
            const { generateReviewNotificationEmail } = await import('@/lib/emails/generateReviewNotificationEmail')
            
            // Get user details
            const user = typeof doc.user === 'object' ? doc.user : await req.payload.findByID({ collection: 'users', id: doc.user })
            const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown User'
            const userEmail = user?.email || 'Unknown Email'
            
            // Get product details
            const product = typeof doc.product === 'object' ? doc.product : await req.payload.findByID({ collection: 'products', id: doc.product })
            const productName = product?.title || 'A Product'

            const emailHtml = await generateReviewNotificationEmail({
              reviewerName: userName,
              reviewerEmail: userEmail,
              productName,
              rating: doc.rating,
              comment: doc.comment || 'No comment provided.',
              reviewId: doc.id,
              payload: req.payload
            })

            await req.payload.sendEmail({
              to: process.env.ADMIN_EMAIL || 'support@99puritypeptides.com',
              subject: `New Review for ${productName} (Needs Approval)`,
              html: emailHtml
            })
          } catch (err) {
            req.payload.logger.error(err, `Failed to send review notification email for review ${doc.id}`)
          }
        }
        return doc
      }
    ]
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: false,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      validate: (val: number | null | undefined) => (val && val >= 1 && val <= 5) || 'Rating must be between 1 and 5',
    },
    {
      name: 'comment',
      type: 'text',
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Auto‑set to true when linked order is delivered' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    { name: 'createdAt', type: 'date', admin: { position: 'sidebar', disabled: true } },
    { name: 'updatedAt', type: 'date', admin: { position: 'sidebar', disabled: true } },
  ],
}
