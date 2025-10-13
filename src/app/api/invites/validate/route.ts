import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ valid: false, error: 'missing_code' }, { status: 400 })
  }

  const svc = createClient(url, service, { auth: { persistSession: false } })

  const { data: invite, error } = await svc
    .from('invites')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !invite) {
    return NextResponse.json({ valid: false, error: 'code_not_found' }, { status: 404 })
  }

  const isExpired = new Date(invite.expires_at).getTime() < Date.now()
  const isDepleted = invite.uses_remaining <= 0

  if (isExpired) {
    return NextResponse.json({ valid: false, error: 'code_expired' }, { status: 400 })
  }

  if (isDepleted) {
    return NextResponse.json({ valid: false, error: 'code_depleted' }, { status: 400 })
  }

  return NextResponse.json({
    valid: true,
    invite: {
      code: invite.code,
      role: invite.role,
      expires_at: invite.expires_at,
      uses_remaining: invite.uses_remaining
    }
  })
}
