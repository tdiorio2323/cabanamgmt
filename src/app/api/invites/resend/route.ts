import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';

import { resendInvite } from '@/lib/invites';

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

  try {
    const invite = await resendInvite({
      email: parsed.data.email,
      actorId: session.user.id ?? null,
    });

    return NextResponse.json({ ok: true, inviteId: invite.id, code: invite.code });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = /rate/i.test(message) ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
