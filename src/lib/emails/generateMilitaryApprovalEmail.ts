export function generateMilitaryApprovalEmail(name: string, couponCode: string): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: sans-serif; color: #111827; width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; line-height: 1.6;">
    <h2 style="color: #0ea5e9; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Thank you for your service! 🇺🇸</h2>
    <p>Hi ${name},</p>
    <p>Your military ID has been successfully verified by our team. We appreciate your service!</p>
    
    <p>As a token of our gratitude, here is your unique 30% off discount code:</p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <strong style="font-size: 24px; letter-spacing: 2px;">${couponCode}</strong>
    </div>

    <p style="font-size: 14px; color: #6b7280;"><em>Note: This coupon is locked exclusively to your email address and cannot be shared.</em></p>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${serverUrl}/shop" style="display: inline-block; padding: 12px 24px; background-color: #0A0A0A; color: #FAF7F2; text-decoration: none; border-radius: 6px; font-weight: bold;">Shop Now</a>
    </div>
  </div>
</body>
</html>
  `;
}
