import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // allow formData()
  }
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user.toObject();
    const tokenExpiresAt = new Date(decoded.exp * 1000).toISOString();

    return NextResponse.json({ ...userWithoutPassword, tokenExpiresAt });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1) auth via cookie
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2) lookup user doc
    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3) parse multipart
    const form = await request.formData();
    const file = form.get('profileImage');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 4) ensure uploads dir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // 5) write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, '_');
    const filename = `${user._id}-${timestamp}-${safeName}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    // 6) update profileImage on user doc
    const publicUrl = `/uploads/${filename}`;
    user.profileImage = publicUrl;
    await user.save();

    return NextResponse.json({ profileImage: publicUrl });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}