import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = [
    '/runner-overview',
    '/runner-profile',
    '/leaderboard',
    '/fastest-5km',
    '/fastest-10km',
    '/admin',
  ];


  const tokenCookie = request.cookies.get('token');

  if (path === '/login' && tokenCookie) {
    return NextResponse.redirect(new URL('/runner-profile', request.url));
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  if (isProtectedRoute && !tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/admin')) {
    if (!tokenCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const token = tokenCookie.value;
      // Verify the token using your JWT secret
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Check if the payload has an isAdmin flag set to true
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/runner-overview/:path*',
    '/runner-profile/:path*',
    '/leaderboard/:path*',
    '/fastest-5km/:path*',
    '/fastest-10km/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
