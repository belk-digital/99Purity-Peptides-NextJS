import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { generateMilitaryAdminEmail } from '@/lib/emails/generateMilitaryAdminEmail';

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

    const payload = await getPayload({ config: configPromise });

    // Generate JWT token
    const token = jwt.sign(
      { name, email, branch },
      process.env.PAYLOAD_SECRET || 'fallback-secret',
      { expiresIn: '7d' } // Admin has 7 days to approve
    );

    // Prepare ID photo attachment
    const arrayBuffer = await idPhoto.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate Email HTML
    const emailHtml = generateMilitaryAdminEmail(name, email, branch, token);

    // Send to Support Email with Attachment
    await payload.sendEmail({
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
