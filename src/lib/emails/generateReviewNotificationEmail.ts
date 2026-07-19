import { Payload } from 'payload'
import { emailLayout } from './emailLayout'

interface GenerateReviewNotificationArgs {
  reviewerName: string
  reviewerEmail: string
  productName: string
  rating: number
  comment: string
  reviewId: string
  payload: Payload
}

export async function generateReviewNotificationEmail({
  reviewerName,
  reviewerEmail,
  productName,
  rating,
  comment,
  reviewId,
  payload,
}: GenerateReviewNotificationArgs): Promise<string> {
  
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  const adminUrl = `${siteUrl}/admin/collections/reviews/${reviewId}`

  const stars = Array(5).fill('&#9734;')
  for (let i = 0; i < rating; i++) stars[i] = '&#9733;'
  const starsDisplay = stars.join('')

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e5661; font-size: 24px; font-weight: bold; text-align: center;">New Review Needs Approval</h2>
    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 1.6; text-align: center;">
      A customer has just submitted a new review for <strong>${productName}</strong>. It is currently pending and waiting for your approval.
    </p>
    
    <div style="background-color: #fdfbf7; padding: 24px; border-radius: 8px; border: 1px solid #e2ddd3; margin-bottom: 30px;">
      <div style="color: #eab308; font-size: 28px; letter-spacing: 2px; margin-bottom: 16px; text-align: center;">${starsDisplay}</div>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;"><strong style="color: #1e5661; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Reviewer:</strong><br/> ${reviewerName} (${reviewerEmail})</p>
      <p style="margin: 0 0 4px 0; font-size: 11px; color: #1e5661; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Comment:</p>
      <p style="margin: 0; font-size: 15px; color: #555; font-style: italic; line-height: 1.6;">"${comment}"</p>
    </div>

    <div style="text-align: center;">
      <a href="${adminUrl}" style="display: inline-block; background-color: #1e5661; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        Manage Review in CMS
      </a>
    </div>
  `

  return emailLayout({
    title: 'New Product Review Needs Approval',
    content,
    serverUrl: siteUrl
  })
}
