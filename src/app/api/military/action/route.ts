import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { generateMilitaryApprovalEmail } from '@/lib/emails/generateMilitaryApprovalEmail';
import { generateMilitaryRejectionEmail } from '@/lib/emails/generateMilitaryRejectionEmail';
import { sendTrackedEmail } from '@/lib/emails/sendTrackedEmail';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action');

    if (!token || !action) {
      return new NextResponse('Missing token or action', { status: 400 });
    }

    if (!process.env.PAYLOAD_SECRET) {
      console.error('PAYLOAD_SECRET is not set — refusing to verify military discount token')
      return new NextResponse('Internal server error', { status: 500 });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.PAYLOAD_SECRET);
    } catch (err) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }

    const { name, email } = decoded;
    const payload = await getPayload({ config: configPromise });

    if (action === 'approve') {
      // Prevent double-clicking from generating multiple coupons
      const existingCoupons = await payload.find({
        collection: 'coupons',
        where: {
          and: [
            { code: { like: 'MIL-' } },
            { 'lockedEmails.email': { equals: email } }
          ]
        },
        depth: 0,
      });

      if (existingCoupons.totalDocs > 0) {
        return new NextResponse(`
          <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #f59e0b;">Already Processed</h2>
            <p>This verification request has already been approved.</p>
            <p>A military discount coupon (<strong>${existingCoupons.docs[0].code}</strong>) was previously generated for ${email}.</p>
            <p>You may now close this window.</p>
          </div>
        `, { headers: { 'Content-Type': 'text/html' } });
      }

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
      await sendTrackedEmail(payload, {
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
      // If the admin is changing their mind after an approval, we need to revoke/delete the coupon
      const existingCoupons = await payload.find({
        collection: 'coupons',
        where: {
          and: [
            { code: { like: 'MIL-' } },
            { 'lockedEmails.email': { equals: email } }
          ]
        },
        depth: 0,
      });

      if (existingCoupons.totalDocs > 0) {
        for (const doc of existingCoupons.docs) {
          await payload.delete({
            collection: 'coupons',
            id: doc.id,
          });
        }
      }

      // Send Rejection Email
      const emailHtml = generateMilitaryRejectionEmail(name);
      await sendTrackedEmail(payload, {
        from: 'Support | 99 Purity Peptides <support@99puritypeptides.com>',
        to: email,
        subject: 'Update on your Military Discount Request',
        html: emailHtml,
      });

      return new NextResponse(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #ef4444;">Verification Denied</h2>
          <p>A rejection email has been sent to ${email}.</p>
          ${existingCoupons.totalDocs > 0 ? `<p style="color: #f59e0b; font-weight: bold;">Note: The previously generated discount coupon was successfully revoked and deleted.</p>` : ''}
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
