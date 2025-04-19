export const runtime = 'nodejs';
export const config = { api: { bodyParser: false } };

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('profileImage');
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mime = file.type || 'application/octet-stream';
    const dataUri = `data:${mime};base64,${base64}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: `profiles/${user._id}`,
      public_id: `avatar_${Date.now()}`,
      resource_type: 'image',
    });

    user.profileImage = uploaded.secure_url;
    await user.save();

    return NextResponse.json({ profileImage: uploaded.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    const msg =
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
