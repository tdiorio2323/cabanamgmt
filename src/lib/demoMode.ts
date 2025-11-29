import { NextResponse } from 'next/server';

/**
 * Demo Mode API Handler
 *
 * Returns a JSON response for API calls in demo mode
 * without hitting real external services
 */
export function handleDemoMode(req: Request): NextResponse | null {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    return null;
  }

  const url = new URL(req.url);
  const pathname = url.pathname;

  // Webhook endpoints - always return 200 OK in demo mode
  if (pathname.includes('/webhook')) {
    return NextResponse.json({ received: true, demo: true }, { status: 200 });
  }

  // VIP code endpoints
  if (pathname.includes('/api/vip')) {
    if (pathname.includes('/create')) {
      return NextResponse.json({
        code: 'DEMO-VIP-CODE',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    if (pathname.includes('/list')) {
      return NextResponse.json({ codes: [] });
    }
    if (pathname.includes('/redeem')) {
      return NextResponse.json({ success: true, message: 'Demo mode - code not redeemed' });
    }
  }

  // Invite endpoints
  if (pathname.includes('/api/invites')) {
    if (pathname.includes('/create')) {
      return NextResponse.json({
        id: 'demo-invite-id',
        token: 'demo-invite-token',
      });
    }
    if (pathname.includes('/list')) {
      return NextResponse.json({ invites: [] });
    }
    if (pathname.includes('/resend')) {
      return NextResponse.json({
        success: true,
        message: 'Demo mode - invite not sent'
      });
    }
    if (pathname.includes('/revoke')) {
      return NextResponse.json({ success: true, count: 0 });
    }
    if (pathname.includes('/validate')) {
      return NextResponse.json({ valid: true, demo: true });
    }
    if (pathname.includes('/accept')) {
      return NextResponse.json({ success: true, message: 'Demo mode - invite not accepted' });
    }
  }

  // Auth endpoints
  if (pathname.includes('/api/auth/logout')) {
    return NextResponse.json({ success: true });
  }

  // DB health check
  if (pathname.includes('/api/db/health')) {
    return NextResponse.json({ status: 'ok', demo: true });
  }

  // Default: return a generic demo response
  return NextResponse.json({
    demo: true,
    message: 'Demo mode - no action taken'
  });
}
