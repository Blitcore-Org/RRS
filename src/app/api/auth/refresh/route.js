import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyRefreshToken } from '@/utils/token';
import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get('refreshToken');
  
  if (!refreshTokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const refreshToken = refreshTokenCookie.value;
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = {
    id: decoded.id,
    isAdmin: decoded.isAdmin
  };

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  const tokenExpiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  const response = NextResponse.json({ 
    accessToken: newAccessToken,
    tokenExpiresAt
  });
  response.cookies.set('token', newAccessToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600,
  });
  return response;
}
