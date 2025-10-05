import { createClient } from '@supabase/supabase-js';

// Environment variables (hardcoded for this script)
const supabaseUrl = 'https://dotfloiygvhsujlwzqgv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGZsb2l5Z3Zoc3VqbHd6cWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA5NDg3NSwiZXhwIjoyMDY4NjcwODc1fQ._h0D0P7oqsUlzPJkCv2ebKYSrJLjI9Bg_4khjRvYysw';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('SERVICE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('Creating test admin account...');

  try {
    // Create a test admin user
    const testEmail = 'admin@cabana.test';
    const testPassword = 'cabana123';

    const { data: _userData, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    if (createError && createError.message.includes('already registered')) {
      console.log('✅ Test admin already exists');
      console.log('📧 Email:', testEmail);
      console.log('🔑 Password:', testPassword);
    } else if (createError) {
      console.error('❌ Create error:', createError);
    } else {
      console.log('✅ Test admin created successfully!');
      console.log('� User ID:', _userData?.user?.id);
      console.log('�📧 Email:', testEmail);
      console.log('🔑 Password:', testPassword);
    }

    // Add to admin_emails table
    const { error: adminError } = await supabase
      .from('admin_emails')
      .upsert({ email: testEmail }, { onConflict: 'email' });

    if (adminError) {
      console.error('❌ Admin email error:', adminError);
    } else {
      console.log('✅ Added to admin_emails table');
      console.log('🌐 Try login at: http://localhost:3000/login');
    }    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'tyler.diorio@gmail.com',
      password: 'temp123456',
      email_confirm: true
    });

    if (error) {
      console.error('❌ Error creating user:', error);
    } else {
      console.log('✅ User created successfully!');
      console.log('📧 Email:', data.user.email);
      console.log('🔑 Password: temp123456');
      console.log('💡 You can now login at http://localhost:3000/login');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

createAdminUser();
