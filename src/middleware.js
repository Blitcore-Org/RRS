import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = [
    '/runner-overview',
    '/runner-profile',
    '/leaderboard',
    '/fastest-5km',
    '/fastest-10km',
    '/admin'
  ];

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const userCookie = request.cookies.get('user');

  if (isProtectedRoute && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/admin')) {
    try {
      const user = JSON.parse(userCookie.value);
      if (!user.isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
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
    '/register'
  ],
}; 