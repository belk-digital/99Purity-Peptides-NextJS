'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'

export async function submitContactForm(formData: FormData) {
  const t = await getTranslations('content.contactForm')
  try {
    const payload = await getPayload({ config: configPromise })

    const department = formData.get('department') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !subject || !message) {
      return { error: t('errorRequiredFields') }
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E8E2D5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FAF7F2; letter-spacing: -0.02em;">Contact Form Submission</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px 0; font-size: 20px; color: #0A0A0A;">A new message was received:</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2EDE4; border-radius: 8px; border: 1px solid #E0D5C2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Name</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${name}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Email Address</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${email}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Department</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; text-transform: capitalize;">${department || 'General'}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Subject</p>
                    <p style="margin: 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${subject}</p>
                  </td>
                </tr>
              </table>

              <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7A55;">Message</h3>
              <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px dashed #C9B58E; font-size: 16px; color: #4A4A4A; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${message}</div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 24px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0 0 8px 0; color: #8A8A8A; font-size: 12px;">You can reply directly to this email to respond to ${name}.</p>
              <p style="margin: 0; color: #8A8A8A; font-size: 12px;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. Internal Notification.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    await payload.sendEmail({
      from: '99 Purity Peptides <contact@99puritypeptides.com>',
      to: 'contact@99puritypeptides.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: html,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return { error: error.message || t('errorUnexpected') }
  }
}
