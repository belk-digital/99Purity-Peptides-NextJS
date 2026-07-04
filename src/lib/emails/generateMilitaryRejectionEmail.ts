export function generateMilitaryRejectionEmail(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: sans-serif; color: #111827; width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; line-height: 1.6;">
    <h2 style="color: #000; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Verification Update</h2>
    <p>Hi ${name},</p>
    <p>We recently received your request for our military discount.</p>
    <p>Unfortunately, we were unable to verify the ID document you provided, and your request could not be approved at this time.</p>
    <p>If you believe this was an error, please try submitting a clearer photo of your ID on our website, or reply directly to this email to speak with our support team.</p>
    <p style="margin-top: 30px;">Best regards,<br>The 99 Purity Peptides Team</p>
  </div>
</body>
</html>
  `;
}
