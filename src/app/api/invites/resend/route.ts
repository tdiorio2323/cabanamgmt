import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';

import { resendInvite } from '@/lib/invites';
import { checkRateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const { data: adminEmail } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', session.user.email)
    .maybeSingle();

  if (!adminEmail) {
    return NextResponse.json({ error: 'not_admin' }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Rate limiting: IP-based (10 requests per hour)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ipLimit = await checkRateLimit(`resend:ip:${ip}`, 10, 60 * 60 * 1000);
  
  if (!ipLimit.allowed) {
    logger.warn('Rate limit exceeded (IP)', { event: 'rate_limit.ip', ip: '[redacted]' });
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((ipLimit.reset! - Date.now()) / 1000)),
        },
      }
    );
  }

  // Rate limiting: Per-invite (3 resends per 15 minutes)
  const inviteLimit = await checkRateLimit(`resend:invite:${parsed.data.email}`, 3, 15 * 60 * 1000);
  
  if (!inviteLimit.allowed) {
    logger.warn('Rate limit exceeded (invite)', { event: 'rate_limit.invite', email: '[redacted]' });
    return NextResponse.json(
      { error: 'Too many resend attempts for this email. Try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((inviteLimit.reset! - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const invite = await resendInvite({
      email: parsed.data.email,
      actorId: session.user.id ?? null,
    });

    logger.info('Invite resent via API', { event: 'api.invite.resend', inviteId: invite.id, adminId: session.user.id });
    return NextResponse.json({ ok: true, inviteId: invite.id, code: invite.code });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = /rate/i.test(message) ? 429 : 500;
    logger.error('Resend invite failed', { event: 'api.invite.resend.error', error: message });
    return NextResponse.json({ error: message }, { status });
  }
}
