import { NextResponse } from 'next/server';

export function middleware(request) {
  // Middleware logic can be added here for authentication, logging, etc.
  
  // Example: Redirect to login if user is not authenticated
  const isAuthenticated = request.cookies.get('auth-token'); // Replace with actual authentication check

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/events/:path*', '/api/:path*'], // Apply middleware to specific routes
};