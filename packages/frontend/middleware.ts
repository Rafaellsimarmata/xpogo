import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Check localStorage dari request header (client-side akan handle ini)
  // Server-side akan hanya check cookies
  
  // Routes yang memerlukan autentikasi
  const protectedRoutes = ['/dashboard', '/profile', '/market-analysis', '/documents'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Routes yang hanya untuk guests (sudah login tapi coba akses auth pages)
  const guestOnlyRoutes = ['/', '/auth'];
  const isGuestOnlyRoute = guestOnlyRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Jika tidak ada token dan coba akses protected route, redirect ke home
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

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
