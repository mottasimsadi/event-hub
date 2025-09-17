import { NextRequest, NextResponse } from 'next/server';

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/events/book',
  '/profile',
];

// Define paths that are only accessible for non-authenticated users
const authOnlyPaths = [
  '/login',
  '/signup',
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for token cookie presence - simple check without verification in Edge runtime
  const hasTokenCookie = request.cookies.has('token');
  const isAuthenticated = hasTokenCookie;
  
  // Check if the path is protected and user is not authenticated
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // Check if the path is for non-authenticated users only and user is authenticated
  const isAuthOnlyPath = authOnlyPaths.some(path => pathname.startsWith(path));
  if (isAuthOnlyPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure the paths that should be matched by the middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};