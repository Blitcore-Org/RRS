import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/runner-overview',
    '/runner-profile',
    '/leaderboard',
    '/fastest-5km',
    '/fastest-10km'
  ];

  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Get the token from cookies or localStorage
  const user = request.cookies.get('user');

  // If the route is protected and there's no user, redirect to login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If we're on login/register page and we're already logged in, redirect to overview
  if ((path === '/login' || path === '/register') && user) {
    return NextResponse.redirect(new URL('/runner-overview', request.url));
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