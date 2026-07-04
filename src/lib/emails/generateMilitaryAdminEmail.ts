export function generateMilitaryAdminEmail(name: string, email: string, branch: string, token: string): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  const approveUrl = `${serverUrl}/api/military/action?action=approve&token=${token}`;
  const rejectUrl = `${serverUrl}/api/military/action?action=reject&token=${token}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: sans-serif; color: #111827; width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; line-height: 1.6;">
    <h2 style="color: #000; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Military Discount Verification Request</h2>
    <p>A new user has submitted their ID for military discount verification.</p>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Branch:</strong> <span style="text-transform: capitalize;">${branch}</span></p>
    </div>

    <p><strong>Please review the attached ID photo.</strong></p>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Approve Verification</a>
      <a href="${rejectUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Deny Request</a>
    </div>
  </div>
</body>
</html>
  `;
}
