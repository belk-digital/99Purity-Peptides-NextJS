export async function generateAffiliateWelcomeEmail(affiliate: any, user: any): Promise<string> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  
  const affiliateName = affiliate.displayName || user?.firstName || 'Partner';
  const referralLink = `${serverUrl}/ref/${affiliate.referralSlug}`;
  const couponCode = affiliate.couponCode || '';
  const commissionRate = affiliate.commissionRate || 15;
  const cookieDuration = affiliate.cookieDurationDays || 30;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Partner Program</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E8E2D5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; background-color: #000000; border-bottom: 1px solid #111111;">
              <img src="${serverUrl}/99%20Images/99pp-Logo.png" alt="99 Purity Peptides" style="height: 50px; width: auto; max-width: 100%; display: block; margin: 0 auto; filter: brightness(0) invert(1);" />
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #d1d5db;">Welcome to the Partner Program</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #0A0A0A;">Hi ${affiliateName},</h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Your application has been instantly approved! We're thrilled to have you join 99 Purity Peptides as an official partner. You can now start earning ${commissionRate}% commission on every referral.</p>
              
              <!-- Toolkit Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2EDE4; border-radius: 8px; border: 1px solid #E0D5C2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7A55;">Your Partner Toolkit</h3>
                    
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #0A0A0A;">Your Unique Referral Link</p>
                    <div style="background-color: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px dashed #C9B58E; font-family: monospace; font-size: 16px; font-weight: bold; color: #0A0A0A; margin-bottom: 16px; word-break: break-all;">${referralLink}</div>
                    
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #0A0A0A;">Your Custom ${commissionRate}% Discount Code</p>
                    <div style="background-color: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px dashed #C9B58E; font-family: monospace; font-size: 16px; font-weight: bold; color: #0A0A0A; word-break: break-all;">${couponCode}</div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Share your link or your code with your audience. When they use it, they get ${commissionRate}% off their order, and you get ${commissionRate}% commission!</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                    <span style="font-size: 15px; color: #4A4A4A;"><strong>Track Everything:</strong> See live clicks, conversions, and payouts on your dashboard.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px;">
                    <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                    <span style="font-size: 15px; color: #4A4A4A;"><strong>Automated Payouts:</strong> Get paid out directly to your account.</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="color: #C9B58E; font-weight: bold; font-size: 18px; margin-right: 8px;">✓</span>
                    <span style="font-size: 15px; color: #4A4A4A;"><strong>${cookieDuration}-Day Cookies:</strong> You get credited even if they buy ${cookieDuration} days after clicking your link.</span>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center;">
                <a href="${serverUrl}/affiliates/dashboard" style="display: inline-block; background-color: #0A0A0A; color: #FAF7F2; text-decoration: none; padding: 16px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px;">Go to Dashboard</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 24px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0 0 8px 0; color: #8A8A8A; font-size: 12px;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
              <a href="${serverUrl}" style="color: #8A8A8A; text-decoration: underline; font-size: 12px;">Visit our store</a>
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
