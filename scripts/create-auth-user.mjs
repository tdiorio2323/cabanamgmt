import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const createUser = async (email, password) => {
  console.log(`Creating user: ${email}`);

  try {
    // Create user with admin service role
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Skip email confirmation
    });

    if (error) {
      console.error('❌ Error creating user:', error.message);
      return false;
    }

    console.log('✅ User created successfully:', data.user.email);
    console.log('📧 User ID:', data.user.id);

    // Also ensure they're in the admin_emails table
    const { error: adminError } = await supabase
      .from('admin_emails')
      .upsert({ email: email }, { onConflict: 'email' });

    if (adminError) {
      console.error('❌ Error adding to admin_emails:', adminError.message);
    } else {
      console.log('✅ Added to admin_emails table');
    }

    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
};

// Create the admin user
const email = 'tyler.diorio@gmail.com';
const password = 'Newstart23!'; // You can change this

console.log('🚀 Creating admin user account...');
createUser(email, password)
  .then((success) => {
    if (success) {
      console.log(`🎉 Admin user created! You can now login with:`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
    }
    process.exit(success ? 0 : 1);
  });
