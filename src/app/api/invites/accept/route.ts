import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({}))
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : ''

  if (!normalizedCode) {
    return NextResponse.json({ error: 'missing_code' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const ssr = createServerClient(url, anon, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      }
    }
  })

  const { data: { session } } = await ssr.auth.getSession()
  const user = session?.user

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const svc = createClient(url, service, { auth: { persistSession: false } })

  const { data: invite, error } = await svc
    .from('invites')
    .select('code, role, expires_at, uses_remaining, redeemed_by')
    .eq('code', normalizedCode)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: 'code_not_found' }, { status: 404 })
  }

  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'code_expired' }, { status: 410 })
  }

  if (invite.uses_remaining <= 0) {
    return NextResponse.json({ error: 'code_depleted' }, { status: 410 })
  }

  const alreadyRedeemed = Array.isArray(invite.redeemed_by) && invite.redeemed_by.includes(user.id)

  if (alreadyRedeemed) {
    return NextResponse.json({ error: 'already_redeemed' }, { status: 400 })
  }

  const hdrs = await headers()
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const ua = hdrs.get('user-agent') ?? null

  const { error: logError } = await svc.from('invite_redemptions').insert({
    invite_code: normalizedCode,
    user_id: user.id,
    ip,
    user_agent: ua,
  })

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 400 })
  }

  const { error: decrementError } = await svc.rpc('decrement_uses', { p_code: normalizedCode })

  if (decrementError) {
    return NextResponse.json({ error: decrementError.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, role: invite.role })
}
