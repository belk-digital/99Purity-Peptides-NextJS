export async function generateAffiliateSaleEmail(affiliate: any, commissionAmountCents: number, isVoid: boolean): Promise<string> {
  const amount = (commissionAmountCents / 100).toFixed(2)
  const name = affiliate.displayName || 'Partner'

  if (isVoid) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: sans-serif; color: #111827; width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; line-height: 1.6;">
    <h2 style="color: #000; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Sale Tracked (Voided)</h2>
    <p>Hi ${name},</p>
    <p>A sale was recently tracked to your affiliate account, but it has been marked as void.</p>
    <p>This typically happens if our system detects a self-referral or a policy violation.</p>
    <p>If you believe this was in error, please contact our support team.</p>
    <p style="margin-top: 30px;">Best regards,<br>The 99 Purity Peptides Team</p>
  </div>
</body>
</html>
    `
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="font-family: sans-serif; color: #111827; width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; line-height: 1.6;">
    <h2 style="color: #10b981; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🎉 You made a sale!</h2>
    <p>Hi ${name},</p>
    <p>Great news! You just referred a new sale.</p>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 18px; text-align: center;">
      <strong>Estimated Commission: $${amount}</strong>
    </div>
    <p>This commission is currently pending and will become available in your balance after the standard pending period (typically 30 days) provided the order is not refunded or cancelled.</p>
    <p>Keep up the great work!</p>
    <p style="margin-top: 30px;">Best regards,<br>The 99 Purity Peptides Team</p>
  </div>
</body>
</html>
  `
}
