-- ============================================================================
-- QUICK VERIFICATION COMMANDS (paste these after migration execution)
-- ============================================================================

-- 1) Check RLS Status (should show all tables with rls_enabled = true)
SELECT relname, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relname IN ('users','bookings','creators','waitlist','signup_requests','invites','invite_redemptions','vip_codes','vip_redemptions','vip_passes','admin_emails','app_settings')
ORDER BY relname;

-- 2) Count RLS Policies (should show ~50+ policies total)
SELECT polrelid::regclass AS table_name, polname, polcmd
FROM pg_policies
WHERE polrelid::regclass::text IN (
  'public.users','public.bookings','public.creators','public.invites','public.invite_redemptions',
  'public.signup_requests','public.waitlist','public.vip_codes','public.vip_passes','public.vip_redemptions','public.app_settings'
)
ORDER BY table_name, polname;

-- 3) Verify Indexes (should show ~30+ indexes)
SELECT relname AS table_name, indexrelname AS index_name
FROM pg_stat_all_indexes
WHERE schemaname='public'
  AND relname IN ('users','bookings','creators','invites','invite_redemptions','signup_requests','waitlist','vip_codes','vip_passes','vip_redemptions','app_settings')
ORDER BY table_name, index_name;

-- 4) Quick Policy Count Summary
SELECT
    polrelid::regclass AS table_name,
    COUNT(*) as policy_count
FROM pg_policies
WHERE polrelid::regclass::text LIKE 'public.%'
GROUP BY polrelid::regclass
ORDER BY table_name;
