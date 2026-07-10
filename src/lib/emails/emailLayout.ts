export function emailLayout({ 
  title, 
  content, 
  heroImage = null, 
  serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com' 
}: { 
  title: string, 
  content: string, 
  heroImage?: string | null,
  serverUrl?: string 
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdfbf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fdfbf7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2ddd3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 40px; text-align: center;">
              <img src="https://pub-82f90d490a8048aa9629f0ae3ea6f567.r2.dev/Logo/99pp-Logo.png" alt="99 Purity Peptides" style="height: 50px; width: auto; max-width: 100%; display: block; margin: 0 auto;" />
            </td>
          </tr>
          
          ${heroImage ? `
          <!-- Hero Image -->
          <tr>
            <td style="padding: 0; background-color: #000000;">
              <img src="${serverUrl}${heroImage}" alt="${title}" style="width: 100%; height: auto; display: block; border-bottom: 4px solid #1e5661;" />
            </td>
          </tr>
          ` : ''}

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Signature & Footer -->
          <tr>
            <td style="background-color: #fdfbf7; padding: 32px 40px; text-align: center; border-top: 1px solid #E8E2D5;">
              <p style="margin: 0 0 8px 0; color: #1e5661; font-weight: bold; font-size: 16px;">99 Purity Peptides</p>
              <p style="margin: 0 0 20px 0; color: #8A8A8A; font-size: 13px;">Research-grade excellence. Dedicated to purity.</p>
              <p style="margin: 0 0 12px 0; color: #8A8A8A; font-size: 12px;">Need help? Reply to this email or contact support.</p>
              <p style="margin: 0; color: #A0A0A0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
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
