import crypto from 'node:crypto';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type ResendInviteArgs = {
  email: string;
  actorId: string | null;
};

export type ResendInviteResult = {
  id: string;
  code: string;
};

type InviteRole = 'member' | 'staff' | 'admin';

const roleMap: Record<InviteRole, string> = {
  member: 'client',
  staff: 'creator',
  admin: 'admin',
};

const generateCode = () => {
  const first = crypto.randomBytes(3).toString('hex').toUpperCase();
  const second = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CABANA-${first}-${second}`;
};

export async function resendInvite({ email, actorId }: ResendInviteArgs): Promise<ResendInviteResult> {
  const now = Date.now();

  const { data: latestInvite, error: latestError } = await supabaseAdmin
    .from('invites')
    .select('id, created_at, role, uses_allowed, note')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) throw latestError;

  if (latestInvite?.created_at) {
    const lastSentAt = new Date(latestInvite.created_at).getTime();
    if (!Number.isNaN(lastSentAt) && now - lastSentAt < RATE_LIMIT_WINDOW_MS) {
      throw new Error('Invite recently sent. Please try again later.');
    }
  }

  const code = generateCode();
  const usesAllowed = latestInvite?.uses_allowed ?? 1;
  const role = latestInvite?.role ?? roleMap.member;
  const note = latestInvite?.note ?? null;
  const expiresAt = new Date(now + DEFAULT_EXPIRY_MS).toISOString();

  const { data, error } = await supabaseAdmin
    .from('invites')
    .insert({
      code,
      email,
      role,
      status: 'pending',
      uses_allowed: usesAllowed,
      uses_remaining: usesAllowed,
      expires_at: expiresAt,
      note,
      created_by: actorId,
    })
    .select('id, code')
    .single();

  if (error) throw error;

  return { id: data.id, code: data.code };
}

export type RevokeInviteArgs = {
  id?: string;
  email?: string;
};

export async function revokeInvite({ id, email }: RevokeInviteArgs): Promise<number> {
  if (!id && !email) {
    throw new Error('Provide invite id or email');
  }

  let query = supabaseAdmin
    .from('invites')
    .update({ status: 'revoked' })
    .eq('status', 'pending');

  if (id) {
    query = query.eq('id', id);
  }

  if (email) {
    query = query.eq('email', email);
  }

  const { data, error } = await query.select('id');
  if (error) throw error;

  return data?.length ?? 0;
}

export type CreateInviteArgs = {
  email: string;
  role: InviteRole;
  expiresInDays: number;
  message?: string;
  actorId: string;
};

export type CreateInviteResult = {
  id: string;
  token: string;
};

export async function createInvite({ email, role, expiresInDays, message, actorId }: CreateInviteArgs): Promise<CreateInviteResult> {
  const dbRole = roleMap[role];

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('invites')
    .select('id')
    .eq('email', email)
    .eq('status', 'pending')
    .limit(1);

  if (existingError) throw existingError;
  if (existing && existing.length) {
    throw new Error('Pending invite already exists');
  }

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + expiresInDays * 86_400_000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('invites')
    .insert({
      code: generateCode(),
      email,
      role: dbRole,
      status: 'pending',
      created_by: actorId,
      expires_at: expiresAt,
      note: message ?? null,
      token,
      uses_allowed: 1,
      uses_remaining: 1,
    })
    .select('id')
    .single();

  if (error) throw error;

  return { id: data.id, token };
}
