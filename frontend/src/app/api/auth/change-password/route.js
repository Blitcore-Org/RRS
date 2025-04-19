export const runtime = 'nodejs';  
export const config = { api: { bodyParser: true } };

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {

    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET);

    const { newPassword } = await request.json();
    if (!newPassword) {
      return NextResponse.json(
        { error: 'newPassword is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forcePasswordChange = false;
    await user.save();

    const { password, ...sanitized } = user.toObject();
    return NextResponse.json(sanitized);
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
