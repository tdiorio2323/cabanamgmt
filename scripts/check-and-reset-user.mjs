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

const checkUser = async (email) => {
  console.log(`🔍 Checking user: ${email}`);

  try {
    // Get user by email using admin API
    const { data: usersData, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error listing users:', error.message);
      return;
    }

    const user = usersData.users.find(u => u.email === email);

    if (user) {
      console.log('✅ User found in Supabase Auth:');
      console.log('📧 Email:', user.email);
      console.log('🆔 ID:', user.id);
      console.log('📅 Created:', user.created_at);
      console.log('✅ Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
      console.log('🔐 Last sign in:', user.last_sign_in_at || 'Never');

      // Check if in admin_emails table
      const { data: adminData } = await supabase
        .from('admin_emails')
        .select('*')
        .eq('email', email)
        .single();

      console.log('👑 Is admin:', adminData ? 'Yes' : 'No');

      return user;
    } else {
      console.log('❌ User not found in Supabase Auth');
      return null;
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
};

const resetPassword = async (email, newPassword) => {
  console.log(`🔄 Resetting password for: ${email}`);

  try {
    const { error } = await supabase.auth.admin.updateUserById(
      // First get the user ID
      (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id,
      { password: newPassword }
    );

    if (error) {
      console.error('❌ Error resetting password:', error.message);
      return false;
    }

    console.log('✅ Password reset successfully!');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
};

// Main execution
const email = 'tyler.diorio@gmail.com';
const newPassword = 'Newstart23!';

(async () => {
  const user = await checkUser(email);

  if (user) {
    console.log('\n🔑 Resetting password...');
    const success = await resetPassword(email, newPassword);

    if (success) {
      console.log(`\n🎉 Password updated! You can now login with:`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${newPassword}`);
    }
  }
})();
