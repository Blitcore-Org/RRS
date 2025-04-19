import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const user = await db.findUser(email);
    if (!user || !db.validatePassword(user, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const payload = {
      id: user._id,
      isAdmin: user.isAdmin
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    const cookieStore = await cookies();
    await cookieStore.set('token', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      //maxAge: 3600,
      maxAge: 60,
    });
    await cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600,
    });

    const tokenExpiresAt = new Date(Date.now() + 60 * 1000).toISOString();

    return NextResponse.json({ ...user.toObject(), tokenExpiresAt });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
