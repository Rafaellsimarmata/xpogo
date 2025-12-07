import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Note: Server-side middleware cannot access localStorage
  // Auth protection is handled client-side by ProtectedRoute component
  // Middleware only logs for debugging
  
  const { pathname } = request.nextUrl;
  
  console.log('[Middleware] Request to:', pathname);
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)  
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
