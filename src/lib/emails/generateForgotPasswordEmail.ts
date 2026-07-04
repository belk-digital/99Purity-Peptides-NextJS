export async function generateForgotPasswordEmail(url: string, user?: any): Promise<string> {
  const name = user?.firstName || 'there'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E8E2D5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0A0A0A; padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FAF7F2; letter-spacing: -0.02em;">99 Purity Peptides</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #0A0A0A;">Password Reset Request</h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">Hi ${name},</p>
              <p style="margin: 0 0 32px 0; font-size: 16px; color: #4A4A4A; line-height: 1.6;">We received a request to reset the password for your account at 99 Purity Peptides. If you made this request, please click the button below to securely set a new password.</p>
              
              <!-- CTAs -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="${url}" style="display: inline-block; background-color: #0A0A0A; color: #FAF7F2; text-decoration: none; padding: 16px 32px; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; width: 100%; max-width: 250px; text-align: center;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 14px; color: #4A4A4A; line-height: 1.6;">If the button above does not work, copy and paste the following link into your browser:</p>
              <p style="margin: 0 0 32px 0; font-size: 14px; color: #8C7A55; line-height: 1.6; word-break: break-all;">
                <a href="${url}" style="color: #8C7A55;">${url}</a>
              </p>
              
              <p style="margin: 0; font-size: 14px; color: #8A8A8A; line-height: 1.6;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email and your account will remain secure.</p>
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
