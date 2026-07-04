export function generateMilitaryRejectionEmail(name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Military Discount Verification Update</title>
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
              <p style="margin: 12px 0 0 0; font-size: 16px; color: #6b7280;">Verification Update</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 30px 40px 40px 40px; border-bottom: 1px solid #f3f4f6;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827; line-height: 1.6;">Hi ${name},</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">We recently received your request for our military discount program.</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">Unfortunately, we were unable to clearly verify the ID document you provided, and your request could not be approved at this time.</p>
              <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 24px;">
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">If you believe this was an error, please try submitting a clearer photo of your ID on our website, or reply directly to this email to speak with our support team.</p>
              </div>
              <p style="margin: 24px 0 0 0; font-size: 16px; color: #4b5563; line-height: 1.6;">Best regards,<br>The 99 Purity Peptides Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #f9fafb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any questions, simply reply to this email.</p>
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
