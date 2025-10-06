-- Comprehensive Database Security Hardening Migration
-- Generated: 2024-12-18
-- Purpose: Implement RLS policies, indexes, triggers, and security measures

BEGIN;

-- =====================================================
-- PART 1: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all user-related tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signup_requests ENABLE ROW LEVEL SECURITY;

-- Enable RLS on invite/VIP system tables
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_passes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin tables (most restrictive)
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can only see/edit their own records
CREATE POLICY "users_own_profile" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Admins can see all users
CREATE POLICY "admin_all_users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can only see their own bookings
CREATE POLICY "users_own_bookings" ON public.bookings
  FOR ALL USING (auth.uid() = user_id);

-- Admins can see all bookings
CREATE POLICY "admin_all_bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- CREATORS TABLE POLICIES
-- =====================================================

-- Public read access for creator profiles
CREATE POLICY "creators_public_read" ON public.creators
  FOR SELECT USING (true);

-- Creators can edit their own profiles
CREATE POLICY "creators_own_profile" ON public.creators
  FOR UPDATE USING (auth.uid() = id);

-- Creators can insert their own profile
CREATE POLICY "creators_own_insert" ON public.creators
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can manage all creator profiles
CREATE POLICY "admin_all_creators" ON public.creators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- INVITE SYSTEM POLICIES
-- =====================================================

-- Only admins can manage invites
CREATE POLICY "admin_only_invites" ON public.invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Public can view active invites (for validation)
CREATE POLICY "public_validate_invites" ON public.invites
  FOR SELECT USING (
    expires_at > NOW() AND uses_remaining > 0
  );

-- Users can see their own redemptions
CREATE POLICY "users_own_invite_redemptions" ON public.invite_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert redemptions
CREATE POLICY "system_insert_invite_redemptions" ON public.invite_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can see all redemptions
CREATE POLICY "admin_all_invite_redemptions" ON public.invite_redemptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- VIP SYSTEM POLICIES
-- =====================================================

-- Only admins can manage VIP codes
CREATE POLICY "admin_only_vip_codes" ON public.vip_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Public can validate VIP codes (for redemption)
CREATE POLICY "public_validate_vip_codes" ON public.vip_codes
  FOR SELECT USING (
    expires_at > NOW() AND uses_remaining > 0
  );

-- Users can see their own VIP redemptions
CREATE POLICY "users_own_vip_redemptions" ON public.vip_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert VIP redemptions
CREATE POLICY "system_insert_vip_redemptions" ON public.vip_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can see all VIP redemptions
CREATE POLICY "admin_all_vip_redemptions" ON public.vip_redemptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- VIP passes - public read for validation
CREATE POLICY "public_validate_vip_passes" ON public.vip_passes
  FOR SELECT USING (active = true);

-- Only admins can manage VIP passes
CREATE POLICY "admin_only_vip_passes" ON public.vip_passes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- WAITLIST & SIGNUP POLICIES
-- =====================================================

-- Public can join waitlist
CREATE POLICY "public_join_waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- Users can view their own waitlist entry
CREATE POLICY "users_own_waitlist" ON public.waitlist
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Admins can see all waitlist entries
CREATE POLICY "admin_all_waitlist" ON public.waitlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Public can submit signup requests
CREATE POLICY "public_signup_requests" ON public.signup_requests
  FOR INSERT WITH CHECK (true);

-- Admins can see all signup requests
CREATE POLICY "admin_all_signup_requests" ON public.signup_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- ADMIN-ONLY POLICIES
-- =====================================================

-- Only admins can manage admin emails
CREATE POLICY "super_admin_only_admin_emails" ON public.admin_emails
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Only admins can manage app settings
CREATE POLICY "admin_only_app_settings" ON public.app_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- =====================================================
-- PART 2: PERFORMANCE & SECURITY INDEXES
-- =====================================================

-- User table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON public.users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_screening_status ON public.users(screening_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Booking table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_deposit_status ON public.bookings(deposit_status);
CREATE INDEX IF NOT EXISTS idx_bookings_interview_status ON public.bookings(interview_status);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON public.bookings(slot);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- Creator table indexes
CREATE INDEX IF NOT EXISTS idx_creators_handle ON public.creators(handle);
CREATE INDEX IF NOT EXISTS idx_creators_email ON public.creators(email);

-- Invite system indexes
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at ON public.invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_invites_role ON public.invites(role);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(email);
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_invite_id ON public.invite_redemptions(invite_id);
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_user_id ON public.invite_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_invite_redemptions_redeemed_at ON public.invite_redemptions(redeemed_at);

-- VIP system indexes
CREATE INDEX IF NOT EXISTS idx_vip_codes_code ON public.vip_codes(code);
CREATE INDEX IF NOT EXISTS idx_vip_codes_expires_at ON public.vip_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_vip_codes_role ON public.vip_codes(role);
CREATE INDEX IF NOT EXISTS idx_vip_redemptions_code_id ON public.vip_redemptions(code_id);
CREATE INDEX IF NOT EXISTS idx_vip_redemptions_user_id ON public.vip_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_vip_redemptions_redeemed_at ON public.vip_redemptions(redeemed_at);
CREATE INDEX IF NOT EXISTS idx_vip_passes_code ON public.vip_passes(code);
CREATE INDEX IF NOT EXISTS idx_vip_passes_active ON public.vip_passes(active);

-- Waitlist and signup indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_signup_requests_email ON public.signup_requests(email);
CREATE INDEX IF NOT EXISTS idx_signup_requests_created_at ON public.signup_requests(created_at);

-- Admin system indexes
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON public.admin_emails(email);
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(key);

-- =====================================================
-- PART 3: AUDIT & TRIGGER SYSTEM
-- =====================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  record_id text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT NOW(),
  ip_address inet,
  user_agent text
);

-- Index for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON public.audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON public.audit_log(changed_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by ON public.audit_log(changed_by);

-- RLS for audit log (admin only)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_only_audit_log" ON public.audit_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Generic audit function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  -- For DELETE operations
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (
      table_name, record_id, operation, old_values, changed_by
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id::text,
      TG_OP,
      to_jsonb(OLD),
      COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
    );
    RETURN OLD;
  END IF;

  -- For INSERT operations
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (
      table_name, record_id, operation, new_values, changed_by
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id::text,
      TG_OP,
      to_jsonb(NEW),
      COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
    );
    RETURN NEW;
  END IF;

  -- For UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (
      table_name, record_id, operation, old_values, new_values, changed_by
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id::text,
      TG_OP,
      to_jsonb(OLD),
      to_jsonb(NEW),
      COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
    );
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables that have the column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_bookings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_admin_emails_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_vip_codes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.vip_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_invites_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invites
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- =====================================================
-- PART 4: SECURITY FUNCTIONS & CONSTRAINTS
-- =====================================================

-- Email validation constraint
ALTER TABLE public.users
ADD CONSTRAINT users_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.admin_emails
ADD CONSTRAINT admin_emails_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Phone validation (basic US format)
ALTER TABLE public.users
ADD CONSTRAINT users_phone_format
CHECK (phone IS NULL OR phone ~* '^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$');

-- Ensure VIP codes and invites have reasonable expiration
ALTER TABLE public.vip_codes
ADD CONSTRAINT vip_codes_reasonable_expiry
CHECK (expires_at > created_at AND expires_at <= created_at + INTERVAL '1 year');

ALTER TABLE public.invites
ADD CONSTRAINT invites_reasonable_expiry
CHECK (expires_at > created_at AND expires_at <= created_at + INTERVAL '1 year');

-- Ensure positive uses
ALTER TABLE public.vip_codes
ADD CONSTRAINT vip_codes_positive_uses
CHECK (uses_allowed > 0 AND uses_remaining >= 0 AND uses_remaining <= uses_allowed);

ALTER TABLE public.invites
ADD CONSTRAINT invites_positive_uses
CHECK (uses_allowed > 0 AND uses_remaining >= 0 AND uses_remaining <= uses_allowed);

-- =====================================================
-- PART 5: SECURITY VIEWS FOR REPORTING
-- =====================================================

-- Admin security dashboard view
CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT
  'active_users' as metric,
  COUNT(*)::text as value,
  'Users with verified status' as description
FROM public.users
WHERE verification_status = 'verified'

UNION ALL

SELECT
  'pending_bookings' as metric,
  COUNT(*)::text as value,
  'Bookings awaiting payment' as description
FROM public.bookings
WHERE deposit_status = 'pending'

UNION ALL

SELECT
  'active_vip_codes' as metric,
  COUNT(*)::text as value,
  'VIP codes still available' as description
FROM public.vip_codes
WHERE expires_at > NOW() AND uses_remaining > 0

UNION ALL

SELECT
  'recent_logins' as metric,
  COUNT(*)::text as value,
  'User logins in last 24h' as description
FROM public.audit_log
WHERE table_name = 'users'
  AND operation = 'UPDATE'
  AND changed_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT
  'waitlist_count' as metric,
  COUNT(*)::text as value,
  'Total waitlist signups' as description
FROM public.waitlist;

-- Note: Views cannot have RLS policies in PostgreSQL
-- Security dashboard access controlled by underlying table policies

-- =====================================================
-- PART 6: RATE LIMITING & ABUSE PREVENTION
-- =====================================================

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL, -- IP, user_id, email, etc.
  action text NOT NULL,     -- login, signup, invite_redeem, etc.
  attempts integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT NOW(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Rate limiting indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked_until ON public.rate_limits(blocked_until);

-- RLS for rate limits (system only)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_only_rate_limits" ON public.rate_limits
  FOR ALL USING (false); -- Only accessible via security definer functions

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
) RETURNS boolean AS $$
DECLARE
  current_attempts integer;
  window_start timestamp with time zone;
  is_blocked boolean;
BEGIN
  -- Check if currently blocked
  SELECT blocked_until > NOW() INTO is_blocked
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND blocked_until IS NOT NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF is_blocked THEN
    RETURN false;
  END IF;

  -- Get current window attempts
  SELECT attempts, window_start
  INTO current_attempts, window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start > NOW() - (p_window_minutes || ' minutes')::interval
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no recent window, create new one
  IF current_attempts IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action, attempts)
    VALUES (p_identifier, p_action, 1);
    RETURN true;
  END IF;

  -- If within limit, increment
  IF current_attempts < p_max_attempts THEN
    UPDATE public.rate_limits
    SET attempts = attempts + 1
    WHERE identifier = p_identifier
      AND action = p_action
      AND window_start = window_start;
    RETURN true;
  END IF;

  -- Rate limit exceeded, block for window duration
  UPDATE public.rate_limits
  SET blocked_until = NOW() + (p_window_minutes || ' minutes')::interval
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start = window_start;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup old rate limit records (to be run by cron)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND (blocked_until IS NULL OR blocked_until < NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FINAL COMMIT
-- =====================================================

COMMIT;

-- =====================================================
-- POST-MIGRATION VALIDATION QUERIES
-- =====================================================

-- These should be run after migration to verify everything works
/*
-- Check RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes were created
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check triggers exist
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Test audit logging (should create audit entries)
SELECT table_name, operation, changed_at
FROM public.audit_log
ORDER BY changed_at DESC
LIMIT 10;
*/
