export async function generateAffiliateSaleEmail(affiliate: any, commissionAmount: number, isVoid: boolean): Promise<string> {
  const amount = (commissionAmount || 0).toFixed(2)
  const name = affiliate.displayName || 'Partner'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'

  const title = isVoid ? 'Sale Tracked (Voided)' : 'New Sale Tracked!'
  const content = isVoid 
    ? `<p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">A sale was recently tracked to your affiliate account, but it has been marked as void.</p><p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">This typically happens if our system detects a self-referral or a policy violation.</p><p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">If you believe this was in error, please contact our support team.</p>`
    : `<p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">Great news! A new sale has been tracked to your affiliate account.</p><p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">Commission amount: <strong style="color: #111827;">$${amount}</strong></p><p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">Keep up the great work!</p>`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #000000; border-bottom: 1px solid #111111;">
              <img src="${serverUrl}/99%20Images/99pp-Logo.png" alt="99 Purity Peptides" style="height: 50px; width: auto; max-width: 100%; display: block; margin: 0 auto; filter: brightness(0) invert(1);" />
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #d1d5db;">${title}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Hi ${name},</h2>
              ${content}
              <p style="margin: 32px 0 0 0; font-size: 16px; color: #4b5563;">Best regards,<br>The 99 Purity Peptides Team</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

