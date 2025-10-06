import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdmin() {
  console.log('🔧 Setting up admin access...')

  try {
    // Add admin email
    const { data: adminData, error: adminError } = await supabase
      .from('admin_emails')
      .insert([{ email: 'tyler.diorio@gmail.com' }])
      .select()
      .single()

    if (adminError && adminError.code !== '23505') { // 23505 is unique constraint violation (already exists)
      console.log('❌ Admin email error:', adminError)
    } else {
      console.log('✅ Admin email configured:', adminData?.email || 'tyler.diorio@gmail.com (already exists)')
    }

    // Check all admin emails
    const { data: allAdmins, error: listError } = await supabase
      .from('admin_emails')
      .select('email')
      .order('email')

    if (listError) {
      console.log('❌ Error listing admins:', listError)
    } else {
      console.log('📋 Current admin emails:', allAdmins?.map(a => a.email).join(', '))
    }

    // Quick sanity check: verify policies exist
    const { data: policies, error: policyError } = await supabase
      .rpc('sql', {
        query: `
          SELECT polrelid::regclass AS table_name, COUNT(*) AS policy_count
          FROM pg_policies
          WHERE polrelid::regclass::text IN ('public.users','public.bookings','public.creators','public.invites')
          GROUP BY 1 ORDER BY 1;
        `
      })

    if (policyError) {
      console.log('❌ Policy check error:', policyError)
    } else {
      console.log('🔒 Security policies active:')
      policies?.forEach(p => console.log(`  - ${p.table_name}: ${p.policy_count} policies`))
    }

  } catch (error) {
    console.log('❌ Setup error:', error.message)
  }
}

// Load environment from .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

// Debug environment variables
console.log('Debug: SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Debug: SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

setupAdmin()
