export function generateAdminAffiliateNotificationEmail(application: any, affiliate: any, user: any): string {
  const affiliateName = application.displayName || 'Partner';
  const website = application.websiteUrl || 'N/A';
  const reach = application.estimatedMonthlyReach || 'N/A';
  const promotionMethods = application.promotionMethods || 'N/A';
  const niche = application.niche || 'N/A';
  
  let socialLinksHtml = 'N/A';
  if (application.socialLinks && application.socialLinks.length > 0) {
    socialLinksHtml = application.socialLinks.map((link: any) => `<a href="${link.url}" style="color: #000; text-decoration: underline;">${link.platform}</a>`).join(' &middot; ');
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  const adminUrl = `${serverUrl}/admin/collections/affiliates/${affiliate.id}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Partner Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E8E2D5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FAF7F2; letter-spacing: -0.02em;">New Partner Registered</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #0A0A0A;">Hello Admin,</h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">A new partner has registered and their application was <strong>automatically approved</strong>. Their coupon and referral link have been generated.</p>
              
              <!-- Card 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2EDE4; border-radius: 8px; border: 1px solid #E0D5C2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7A55; border-bottom: 1px solid #E0D5C2; padding-bottom: 10px;">Applicant Details</h3>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Name</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${affiliateName}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">User Email</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${user?.email || 'N/A'}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Website / Primary Link</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${website}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Social Links</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${socialLinksHtml}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Estimated Reach</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${reach}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Niche / Audience</p>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #0A0A0A; font-weight: 500; word-break: break-word;">${niche}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Promotion Strategy</p>
                    <p style="margin: 0; font-size: 14px; color: #4A4A4A; word-break: break-word;">${promotionMethods}</p>
                  </td>
                </tr>
              </table>

              <!-- Card 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F2EDE4; border-radius: 8px; border: 1px solid #E0D5C2;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7A55; border-bottom: 1px solid #E0D5C2; padding-bottom: 10px;">Generated Assets</h3>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Assigned Coupon Code</p>
                    <p style="margin: 0 0 16px 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #0A0A0A; word-break: break-word;">${affiliate.couponCode}</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8A8A8A;">Referral Slug</p>
                    <p style="margin: 0; font-family: monospace; font-size: 16px; color: #0A0A0A; word-break: break-word;">${affiliate.referralSlug}</p>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${adminUrl}" style="display: inline-block; background-color: #0A0A0A; color: #FAF7F2; text-decoration: none; padding: 16px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px;">View in Payload Admin</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 24px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0; color: #8A8A8A; font-size: 12px;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. Internal Notification.</p>
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

