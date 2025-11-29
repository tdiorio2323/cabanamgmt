import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './lib/securityHeaders';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.E2E_AUTH_MODE === 'mock' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const hasTestCookie = request.cookies.get('auth_test');
    if (!hasTestCookie) {
      response.cookies.set('auth_test', '1', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
    }
  }

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
    '/((?!_next|api/test-login|favicon.ico|robots.txt).*)',
  ],
};
