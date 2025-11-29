import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './lib/securityHeaders';
import { isDemoRequest } from './lib/isDemo';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const isDemoMode = isDemoRequest(pathname, searchParams);

  // Demo Mode: Intercept ALL API routes
  if (isDemoMode && pathname.startsWith('/api/')) {
    // Webhooks - always return 200 OK
    if (pathname.includes('/webhook')) {
      return NextResponse.json({ received: true, demo: true }, { status: 200 });
    }

    // VIP endpoints
    if (pathname.includes('/vip/create')) {
      return NextResponse.json({
        code: 'DEMO-VIP-001',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    if (pathname.includes('/vip/list')) {
      return NextResponse.json({ codes: [] });
    }
    if (pathname.includes('/vip/redeem')) {
      return NextResponse.json({ success: true, message: 'Demo mode - no action taken' });
    }

    // Invite endpoints
    if (pathname.includes('/invites/create')) {
      return NextResponse.json({ id: 'demo-invite', token: 'demo-token' });
    }
    if (pathname.includes('/invites/list')) {
      return NextResponse.json({ invites: [] });
    }
    if (pathname.includes('/invites')) {
      return NextResponse.json({ success: true, message: 'Demo mode - no action taken' });
    }

    // Stripe endpoints
    if (pathname.includes('/stripe')) {
      return NextResponse.json({ success: true, demo: true });
    }

    // Identity/screening endpoints
    if (pathname.includes('/identity') || pathname.includes('/screening')) {
      return NextResponse.json({ success: true, demo: true });
    }

    // Contract endpoints
    if (pathname.includes('/contracts')) {
      return NextResponse.json({ success: true, demo: true });
    }

    // Users
    if (pathname.includes('/users/create')) {
      return NextResponse.json({ id: 'demo-user', email: 'demo@example.com' });
    }

    // Interview
    if (pathname.includes('/interview')) {
      return NextResponse.json({ success: true, demo: true });
    }

    // Health checks
    if (pathname.includes('/health')) {
      return NextResponse.json({ status: 'ok', demo: true });
    }

    // Logout
    if (pathname.includes('/auth/logout')) {
      return NextResponse.json({ success: true });
    }

    // Default: generic demo response for any other API route
    return NextResponse.json({
      demo: true,
      message: 'Demo mode - no action taken'
    });
  }

  // Auth cookie for demo mode
  if (isDemoMode) {
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
    !pathname.startsWith('/api');

  if (isHtmlRequest) {
    securityHeaders.forEach(({ key, value }) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt).*)',
  ],
};
