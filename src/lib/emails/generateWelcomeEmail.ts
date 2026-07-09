export async function generateWelcomeEmail(user: any): Promise<string> {
  const name = user.firstName || 'there'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to 99 Purity Peptides</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E8E2D5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 40px; text-align: center;">
              <img src="${serverUrl}/99%20Images/99pp-Logo.png" alt="99 Purity Peptides" style="height: 50px; width: auto; max-width: 100%; display: block; margin: 0 auto; filter: brightness(0) invert(1);" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #0A0A0A;">Welcome to the family, ${name}!</h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Thank you for creating an account with us. We're thrilled to have you join our community committed to high-quality, research-grade peptides.</p>
              
              <!-- Benefits Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2EDE4; border-radius: 8px; border: 1px solid #E0D5C2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7A55;">With your new account, you can:</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 12px; padding-left: 10px;">
                          <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                          <span style="font-size: 15px; color: #4A4A4A;">Speed through checkout on your next order</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; padding-left: 10px;">
                          <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                          <span style="font-size: 15px; color: #4A4A4A;">Easily track your order history and shipping status</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-left: 10px;">
                          <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                          <span style="font-size: 15px; color: #4A4A4A;">Earn and redeem Purity Points for future discounts</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Ready to explore our latest batches? Head over to the shop or check out what's new on the site.</p>
              
              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${serverUrl}/shop" style="display: inline-block; background-color: #0A0A0A; color: #FAF7F2; text-decoration: none; padding: 16px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; width: 100%; max-width: 250px; text-align: center;">Shop Peptides</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${serverUrl}" style="display: inline-block; background-color: transparent; color: #0A0A0A; border: 1px solid #0A0A0A; text-decoration: none; padding: 15px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; width: 100%; max-width: 250px; text-align: center;">Visit Site</a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 24px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0 0 8px 0; color: #8A8A8A; font-size: 12px;">If you have any questions, feel free to reply directly to this email.</p>
              <p style="margin: 0; color: #8A8A8A; font-size: 12px;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
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
