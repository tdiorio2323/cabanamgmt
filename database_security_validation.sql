-- Database Security Validation Queries
-- Use these with Supabase MCP integration to validate security measures

-- =====================================================
-- VALIDATION 1: RLS STATUS CHECK
-- =====================================================

-- Check which tables have RLS enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- VALIDATION 2: POLICY VERIFICATION
-- =====================================================

-- Check all policies exist and are properly configured
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd as allowed_operations,
  CASE
    WHEN policyname LIKE '%admin%' THEN 'Admin-only policy'
    WHEN policyname LIKE '%own%' THEN 'User-own-data policy'
    WHEN policyname LIKE '%public%' THEN 'Public access policy'
    ELSE 'Other policy'
  END as policy_type
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- VALIDATION 3: INDEX VERIFICATION
-- =====================================================

-- Check performance indexes were created
SELECT
  schemaname,
  tablename,
  indexname,
  CASE
    WHEN indexname LIKE 'idx_%_email' THEN 'Email index'
    WHEN indexname LIKE 'idx_%_created_at' THEN 'Created timestamp index'
    WHEN indexname LIKE 'idx_%_status' THEN 'Status index'
    WHEN indexname LIKE 'idx_%_code' THEN 'Code lookup index'
    ELSE 'Other index'
  END as index_type
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- VALIDATION 4: TRIGGER VERIFICATION
-- =====================================================

-- Check audit and update triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  CASE
    WHEN trigger_name LIKE 'audit_%' THEN 'Audit trigger'
    WHEN trigger_name LIKE 'update_%_updated_at' THEN 'Updated_at trigger'
    ELSE 'Other trigger'
  END as trigger_type,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name NOT LIKE 'on_%' -- Exclude Supabase internal triggers
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- VALIDATION 5: CONSTRAINT VERIFICATION
-- =====================================================

-- Check data validation constraints
SELECT
  table_name,
  constraint_name,
  constraint_type,
  CASE
    WHEN constraint_name LIKE '%email_format%' THEN 'Email validation'
    WHEN constraint_name LIKE '%phone_format%' THEN 'Phone validation'
    WHEN constraint_name LIKE '%positive_uses%' THEN 'Usage count validation'
    WHEN constraint_name LIKE '%reasonable_expiry%' THEN 'Expiration validation'
    ELSE 'Other constraint'
  END as validation_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND constraint_type = 'CHECK'
ORDER BY table_name, constraint_name;

-- =====================================================
-- VALIDATION 6: FUNCTION VERIFICATION
-- =====================================================

-- Check security functions exist
SELECT
  routine_name as function_name,
  routine_type,
  CASE
    WHEN routine_name LIKE '%audit%' THEN 'Audit system'
    WHEN routine_name LIKE '%rate_limit%' THEN 'Rate limiting'
    WHEN routine_name LIKE '%updated_at%' THEN 'Timestamp management'
    WHEN routine_name LIKE 'is_admin' THEN 'Authorization'
    ELSE 'Business logic'
  END as function_category,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name NOT LIKE 'pg_%'
ORDER BY function_category, routine_name;

-- =====================================================
-- VALIDATION 7: SECURITY AUDIT SAMPLE
-- =====================================================

-- Check if audit logging is working (should be empty initially)
SELECT
  table_name,
  operation,
  changed_at,
  changed_by
FROM public.audit_log
ORDER BY changed_at DESC
LIMIT 10;

-- =====================================================
-- VALIDATION 8: RATE LIMITING TEST
-- =====================================================

-- Test rate limiting function
SELECT public.check_rate_limit('test-ip', 'test-action', 3, 5) as first_attempt;
SELECT public.check_rate_limit('test-ip', 'test-action', 3, 5) as second_attempt;
SELECT public.check_rate_limit('test-ip', 'test-action', 3, 5) as third_attempt;
SELECT public.check_rate_limit('test-ip', 'test-action', 3, 5) as fourth_attempt_should_fail;

-- Check rate limit record was created
SELECT identifier, action, attempts, blocked_until FROM public.rate_limits
WHERE identifier = 'test-ip';

-- =====================================================
-- VALIDATION 9: ADMIN FUNCTION TEST
-- =====================================================

-- Test admin checking function (should return false without proper email)
SELECT public.is_admin() as is_current_user_admin;

-- =====================================================
-- VALIDATION 10: SECURITY DASHBOARD TEST
-- =====================================================

-- Test security dashboard view (may fail if not admin)
SELECT metric, value, description
FROM public.security_dashboard
ORDER BY metric;

-- =====================================================
-- VALIDATION 11: TABLE SECURITY SUMMARY
-- =====================================================

-- Summary of security measures per table
SELECT
  t.tablename,
  t.rowsecurity as has_rls,
  COUNT(DISTINCT p.policyname) as policy_count,
  COUNT(DISTINCT i.indexname) as custom_index_count,
  COUNT(DISTINCT tr.trigger_name) as trigger_count
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
LEFT JOIN pg_indexes i ON i.tablename = t.tablename AND i.schemaname = 'public' AND i.indexname LIKE 'idx_%'
LEFT JOIN information_schema.triggers tr ON tr.event_object_table = t.tablename AND tr.trigger_schema = 'public' AND tr.trigger_name NOT LIKE 'on_%'
WHERE t.schemaname = 'public'
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;

-- =====================================================
-- EXPECTED RESULTS SUMMARY
-- =====================================================

/*
EXPECTED VALIDATION RESULTS:

1. RLS Status: All main tables should show rls_enabled = true
2. Policies: Should see 20+ policies covering admin, user-own-data, and public access patterns
3. Indexes: Should see 20+ custom indexes for performance (all starting with idx_)
4. Triggers: Should see audit_* and update_*_updated_at triggers on key tables
5. Constraints: Should see email_format, phone_format, positive_uses, reasonable_expiry constraints
6. Functions: Should see audit, rate limiting, and admin checking functions
7. Audit Log: Initially empty, will populate as data changes
8. Rate Limiting: Should work correctly - first 3 attempts true, 4th false
9. Admin Function: Should return false (unless user is in admin_emails table)
10. Security Dashboard: May require admin access to view
11. Security Summary: All tables should have RLS enabled, policies, indexes, and triggers

If any of these fail, it indicates the migration needs to be applied or there are permission issues.
*/
