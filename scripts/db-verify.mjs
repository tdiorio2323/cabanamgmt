import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });



async function rpc(fn) {
  const { data, error } = await supabase.rpc(fn);
  if (error) throw error;
  return data;
}

const run = async () => {
  // Tables list (probe if helper/rpc not available)
  const tables = await (async () => {
    const candidates = ['admin_emails', 'users', 'bookings', 'creators', 'invites', 'vip_codes', 'vip_passes', 'vip_redemptions', 'signup_requests', 'waitlist'];
    const existing = [];
    for (const t of candidates) {
      const r = await supabase.from(t).select('*').limit(1);
      if (!r.error) existing.push(t);
    }
    return existing.map(table_name => ({ table_name }));
  })();

  const policies = await rpc('get_policy_counts').catch(() => []);
  const rls = await rpc('get_rls_status').catch(() => []);
  const admin = await supabase.from('admin_emails').select('email').eq('email', 'tyler.diorio@gmail.com');

  console.log('=== SUMMARY ===');
  console.log('Tables:', tables.map(t => t.table_name).join(', '));
  console.log('Policy rows:', policies.length);
  console.log('RLS rows:', rls.length);
  console.log('Admin present:', admin.data?.length ? 'YES' : 'NO');
};

run().catch((e) => { console.error('❌ db-verify failed:', e.message); process.exit(1); });
