import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';

import { createInvite } from '@/lib/invites';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BodySchema = z.object({
  email: z.string().email(),
  role: z.enum(['member', 'staff', 'admin']).default('member'),
  expiresInDays: z.number().int().min(1).max(60).default(7),
  message: z.string().max(500).optional(),
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
    const invite = await createInvite({
      ...parsed.data,
      actorId: session.user.id ?? '',
    });

    return NextResponse.json({ ok: true, id: invite.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const status = /duplicate|exists/i.test(message) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
