export async function generateWelcomeEmail(user: any): Promise<string> {
  const name = user.firstName || 'there'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://99puritypeptides.com'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to 99 Purity Peptides</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #0ea5e9; /* Brand color */
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #111827;
      font-size: 20px;
      margin-top: 0;
    }
    .benefits {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .benefits ul {
      margin: 0;
      padding-left: 20px;
    }
    .benefits li {
      margin-bottom: 10px;
      color: #475569;
    }
    .benefits li:last-child {
      margin-bottom: 0;
    }
    .cta-container {
      text-align: center;
      margin-top: 35px;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      margin: 0 10px 10px 10px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;
    }
    .btn-primary {
      background-color: #0ea5e9;
      color: #ffffff !important;
      border: 2px solid #0ea5e9;
    }
    .btn-secondary {
      background-color: transparent;
      color: #0ea5e9 !important;
      border: 2px solid #0ea5e9;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 14px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>99 Purity Peptides</h1>
    </div>
    <div class="content">
      <h2>Welcome to the family, ${name}!</h2>
      <p>Thank you for creating an account with us. We're thrilled to have you join our community committed to high-quality, research-grade peptides.</p>
      
      <div class="benefits">
        <strong>With your new account, you can:</strong>
        <ul style="margin-top: 10px;">
          <li>Speed through checkout on your next order</li>
          <li>Easily track your order history and shipping status</li>
          <li>Earn and redeem Purity Points for future discounts</li>
        </ul>
      </div>
      
      <p>Ready to explore our latest batches? Head over to the shop or check out what's new on the site.</p>
      
      <div class="cta-container">
        <a href="${serverUrl}/shop" class="btn btn-primary">Shop Peptides</a>
        <a href="${serverUrl}" class="btn btn-secondary">Visit Site</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} 99 Purity Peptides. All rights reserved.<br>
      <span style="font-size: 12px;">If you have any questions, feel free to reply directly to this email.</span>
    </div>
  </div>
</body>
</html>
  `
}
