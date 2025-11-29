import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseMock } from './supabaseMock';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Supabase Admin Client
 *
 * Uses service role key for elevated permissions.
 * IMPORTANT: Only use server-side - never expose service key to client.
 *
 * In Demo Mode: Returns mock client instead of real client
 *
 * Use cases:
 * - Admin operations (VIP codes, invites)
 * - Webhook handlers (Stripe, DocuSign)
 * - Background jobs bypassing RLS
 */
export const supabaseAdmin: SupabaseClient = (() => {
  if (isDemo) {
    return supabaseMock.admin as SupabaseClient;
  }

  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase service role credentials. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
})();
