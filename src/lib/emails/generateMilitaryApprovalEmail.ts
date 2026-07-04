export function generateMilitaryApprovalEmail(name: string, couponCode: string): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Military Discount Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -1px;">99 Purity Peptides</h1>
              <p style="margin: 12px 0 0 0; font-size: 16px; color: #6b7280;">Thank you for your service! 🇺🇸</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 30px 40px 10px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827; line-height: 1.6;">Hi ${name},</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">Your military ID has been successfully verified by our team. We deeply appreciate your service!</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">As a token of our gratitude, here is your unique 30% off discount code:</p>
            </td>
          </tr>

          <!-- Coupon Code -->
          <tr>
            <td style="padding: 10px 40px 20px 40px; text-align: center;">
              <div style="background-color: #f3f4f6; border: 1px dashed #cbd5e1; padding: 24px; border-radius: 8px;">
                <span style="font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #0ea5e9;">${couponCode}</span>
              </div>
              <p style="margin: 16px 0 0 0; font-size: 13px; color: #6b7280; font-style: italic;">Note: This coupon is locked exclusively to your email address and cannot be shared.</p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 10px 40px 40px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
              <a href="${serverUrl}/shop" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px;">Shop Now</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #f9fafb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any questions, simply reply to this email or reach out to our support team.</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #d1d5db;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
