import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { generateMilitaryApprovalEmail } from '@/lib/emails/generateMilitaryApprovalEmail';
import { generateMilitaryRejectionEmail } from '@/lib/emails/generateMilitaryRejectionEmail';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action');

    if (!token || !action) {
      return new NextResponse('Missing token or action', { status: 400 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.PAYLOAD_SECRET || 'fallback-secret');
    } catch (err) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }

    const { name, email } = decoded;
    const payload = await getPayload({ config: configPromise });

    if (action === 'approve') {
      const couponCode = `MIL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      await payload.create({
        collection: 'coupons',
        data: {
          code: couponCode,
          type: 'percentage',
          value: 30, // 30% discount
          lockedEmails: [{ email: email }],
          appliesTo: 'all',
          applicableProductTypes: 'all',
          freeShipping: false,
          stackable: false,
          excludeSaleItems: false,
          autoApply: false,
        }
      });

      // Send Approval Email
      const emailHtml = generateMilitaryApprovalEmail(name, couponCode);
      await payload.sendEmail({
        from: 'Support | 99 Purity Peptides <support@99puritypeptides.com>',
        to: email,
        subject: 'Military Discount Verified - Here is your code!',
        html: emailHtml,
      });

      return new NextResponse(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #10b981;">Verification Approved</h2>
          <p>The 30% coupon (<strong>${couponCode}</strong>) has been generated and emailed to ${email}.</p>
          <p>You may now close this window.</p>
        </div>
      `, { headers: { 'Content-Type': 'text/html' } });

    } else if (action === 'reject') {
      // Send Rejection Email
      const emailHtml = generateMilitaryRejectionEmail(name);
      await payload.sendEmail({
        from: 'Support | 99 Purity Peptides <support@99puritypeptides.com>',
        to: email,
        subject: 'Update on your Military Discount Request',
        html: emailHtml,
      });

      return new NextResponse(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #ef4444;">Verification Denied</h2>
          <p>A rejection email has been sent to ${email}.</p>
          <p>You may now close this window.</p>
        </div>
      `, { headers: { 'Content-Type': 'text/html' } });
    } else {
      return new NextResponse('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Error processing military action:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
