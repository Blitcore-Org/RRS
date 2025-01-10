import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = [
    '/runner-overview',
    '/runner-profile',
    '/leaderboard',
    '/fastest-5km',
    '/fastest-10km'
  ];

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const user = request.cookies.get('user');

  // Only redirect if trying to access protected routes without auth
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
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
    '/login',
    '/register'
  ],
}; 