import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { generateMilitaryAdminEmail } from '@/lib/emails/generateMilitaryAdminEmail';
import { sendTrackedEmail } from '@/lib/emails/sendTrackedEmail';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const branch = formData.get('branch') as string;
    const idPhoto = formData.get('idPhoto') as File;

    if (!name || !email || !branch || !idPhoto) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const MAX_PHOTO_BYTES = 8 * 1024 * 1024 // 8MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (idPhoto.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: 'ID photo is too large (max 8MB)' }, { status: 400 });
    }
    if (idPhoto.type && !ALLOWED_TYPES.includes(idPhoto.type)) {
      return NextResponse.json({ error: 'ID photo must be a JPEG, PNG, WEBP, or HEIC image' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = await checkRateLimit(`military-submit:${ip}`, 5, 24 * 60 * 60)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    if (!process.env.PAYLOAD_SECRET) {
      console.error('PAYLOAD_SECRET is not set — refusing to sign military discount token')
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const payload = await getPayload({ config: configPromise });

    // Generate JWT token
    const token = jwt.sign(
      { name, email, branch },
      process.env.PAYLOAD_SECRET,
      { expiresIn: '7d' } // Admin has 7 days to approve
    );

    // Prepare ID photo attachment
    const arrayBuffer = await idPhoto.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate Email HTML
    const emailHtml = generateMilitaryAdminEmail(name, email, branch, token);

    // Send to Support Email with Attachment
    await sendTrackedEmail(payload, {
      to: 'support@99puritypeptides.com',
      subject: `[Military Discount] Verification Request: ${name}`,
      html: emailHtml,
      attachments: [
        {
          filename: idPhoto.name || 'id-photo.jpg',
          content: buffer,
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting military discount:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
