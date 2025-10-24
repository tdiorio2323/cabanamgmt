import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    'Missing Supabase service role credentials. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
  );
}

/**
 * Supabase Admin Client
 *
 * Uses service role key for elevated permissions.
 * IMPORTANT: Only use server-side - never expose service key to client.
 *
 * Use cases:
 * - Admin operations (VIP codes, invites)
 * - Webhook handlers (Stripe, DocuSign)
 * - Background jobs bypassing RLS
 */
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
