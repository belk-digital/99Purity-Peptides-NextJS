import { escapeHtml } from './escapeHtml'

export function generateMilitaryAdminEmail(rawName: string, rawEmail: string, rawBranch: string, token: string): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  const approveUrl = `${serverUrl}/api/military/action?action=approve&token=${token}`;
  const rejectUrl = `${serverUrl}/api/military/action?action=reject&token=${token}`;
  const name = escapeHtml(rawName)
  const email = escapeHtml(rawEmail)
  const branch = escapeHtml(rawBranch)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Military Discount Verification Request</title>
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
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #d1d5db;">Verification Request Received</p>
            </td>
          </tr>

          <!-- Request Info -->
          <tr>
            <td style="padding: 30px 40px;">
              <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #111827;">Applicant Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600;">Name</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 500;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600;">Email</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 500;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600;">Service Branch</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 500; text-transform: capitalize;">${branch}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 10px 40px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #4b5563;">Please review the attached ID photo.</p>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
              <a href="${approveUrl}" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; margin: 5px;">Approve Verification</a>
              <a href="${rejectUrl}" style="display: inline-block; padding: 14px 28px; background-color: #ef4444; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; margin: 5px;">Deny Request</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; background-color: #f9fafb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated system notification.</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #d1d5db;">&copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.</p>
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
