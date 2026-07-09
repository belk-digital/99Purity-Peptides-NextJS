export function generateAdminAffiliateConversionEmail(order: any, affiliate: any, commissionAmount: number): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  
  const affiliateName = affiliate.displayName || 'Partner';
  const orderNumber = order.orderNumber || order.id || 'N/A';
  const orderTotal = `$${(order.total || 0).toFixed(2)}`;
  const commissionFormatted = `$${(commissionAmount / 100).toFixed(2)}`;
  const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || 'N/A';
  const adminUrl = `${serverUrl}/admin/collections/orders/${order.id}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Affiliate Conversion! 🎉</title>
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
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #d1d5db;">New Affiliate Conversion! 🎉</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">An order has been placed by a customer using an affiliate link or coupon.</h2>
              
              <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0;"><span style="font-weight: bold; color: #4b5563;">Affiliate:</span> ${affiliateName}</p>
                <p style="margin: 0 0 8px 0;"><span style="font-weight: bold; color: #4b5563;">Order Number:</span> #${orderNumber}</p>
                <p style="margin: 0 0 8px 0;"><span style="font-weight: bold; color: #4b5563;">Order Total:</span> ${orderTotal}</p>
                <p style="margin: 0 0 8px 0;"><span style="font-weight: bold; color: #4b5563;">Commission:</span> ${commissionFormatted}</p>
                <p style="margin: 0;"><span style="font-weight: bold; color: #4b5563;">Customer:</span> ${customerEmail}</p>
              </div>

              <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px;">View Order in Admin</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. Internal Notification.</p>
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
