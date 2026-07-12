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
              <a href="${serverUrl}" target="_blank" style="text-decoration: none;">
                <img src="https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/99pp-Logo.png" alt="99 Purity Peptides" style="height: 50px; width: auto; max-width: 100%; display: block; margin: 0 auto;" />
              </a>
            </td>
          </tr>
          
          <!-- Hero Image -->
          <tr>
            <td style="padding: 0; background-color: #000000;">
              <img src="https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/vial-ice-closeup.webp" alt="Welcome to 99 Purity Peptides" style="width: 100%; height: auto; display: block; border-bottom: 4px solid #1e5661;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #0A0A0A; font-weight: 800; letter-spacing: -0.5px;">Welcome to the family, ${name}!</h2>
              <p style="margin: 0 0 28px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Thank you for creating an account with us. We\'re absolutely thrilled to have you join our community committed to high-quality, research-grade peptides.</p>
              
              <!-- Benefits Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fdfbf7; border-radius: 12px; border: 1px solid #e2ddd3; margin-bottom: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <tr>
                  <td style="padding: 30px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #1e5661; font-weight: 700;">With your new account, you can:</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 16px; padding-left: 5px; vertical-align: top; width: 24px;">
                          <div style="background-color: #1e5661; color: white; width: 18px; height: 18px; border-radius: 50%; display: inline-block; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold;">✓</div>
                        </td>
                        <td style="padding-bottom: 16px; vertical-align: top;">
                          <span style="font-size: 15px; color: #2A2A2A; font-weight: 500;">Speed through checkout</span>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #6A6A6A;">Save your details for lightning-fast orders.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px; padding-left: 5px; vertical-align: top; width: 24px;">
                          <div style="background-color: #1e5661; color: white; width: 18px; height: 18px; border-radius: 50%; display: inline-block; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold;">✓</div>
                        </td>
                        <td style="padding-bottom: 16px; vertical-align: top;">
                          <span style="font-size: 15px; color: #2A2A2A; font-weight: 500;">Track your research</span>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #6A6A6A;">Easily view order history and shipping status.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-left: 5px; vertical-align: top; width: 24px;">
                          <div style="background-color: #1e5661; color: white; width: 18px; height: 18px; border-radius: 50%; display: inline-block; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold;">✓</div>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="font-size: 15px; color: #2A2A2A; font-weight: 500;">Earn Purity Points</span>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #6A6A6A;">Get rewarded on every purchase for future discounts.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6; text-align: center;">Ready to explore our latest batches? Head over to the shop or check out what\'s new on the site.</p>
              
              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="${serverUrl}/shop" style="display: inline-block; background-color: #1e5661; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; width: 100%; max-width: 280px; text-align: center;">Shop Peptides</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${serverUrl}" style="display: inline-block; background-color: transparent; color: #1e5661; border: 2px solid #1e5661; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; width: 100%; max-width: 280px; text-align: center;">Visit Site</a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fdfbf7; padding: 32px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0 0 12px 0; color: #8A8A8A; font-size: 13px;">If you have any questions, feel free to reply directly to this email.</p>
              <p style="margin: 0; color: #A0A0A0; font-size: 12px;">&copy; ${new Date().getFullYear()} <a href="${serverUrl}" target="_blank" style="color: inherit; text-decoration: none;">99 Purity Peptides</a>. All rights reserved.</p>
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
