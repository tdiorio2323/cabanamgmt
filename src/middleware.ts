import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './lib/securityHeaders';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers only to HTML responses (not API routes, images, etc.)
  const isHtmlRequest =
    request.headers.get('accept')?.includes('text/html') ||
    !request.nextUrl.pathname.startsWith('/api');

  if (isHtmlRequest) {
    securityHeaders.forEach(({ key, value }) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
