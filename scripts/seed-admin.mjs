import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = process.env.ADMIN_EMAILS?.split(',')[0]?.trim() || 'tyler.diorio@gmail.com';

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const run = async () => {
  // Check if admin exists
  const { data: existing } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', admin)
    .single();

  if (existing) {
    console.log(`✅ Admin already exists: ${admin}`);
    return;
  }

  // Insert new admin
  const { error } = await supabase
    .from('admin_emails')
    .insert({ email: admin });

  if (error) throw error;
  console.log(`✅ Admin ensured: ${admin}`);
};

run().catch((e) => { console.error('❌ seed-admin failed:', e.message); process.exit(1); });
