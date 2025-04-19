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

    const { email, newPassword } = await request.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user || user._id.toString() !== decoded.id) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 403 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forcePasswordChange = false;
    await user.save();

    const { password, ...u } = user.toObject();
    return NextResponse.json(u);
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
