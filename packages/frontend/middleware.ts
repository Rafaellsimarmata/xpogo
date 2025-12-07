import { NextRequest, NextResponse } from 'next/server';

export function middleware(_: NextRequest) {
  // Note: Server-side middleware cannot access localStorage
  // Auth protection is handled client-side by ProtectedRoute component

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
