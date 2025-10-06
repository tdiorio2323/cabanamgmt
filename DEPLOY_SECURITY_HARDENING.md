# Security Hardening Deployment Guide

**Date:** October 5, 2025
**Status:** Ready for Manual Deployment

## Problem: Supabase CLI Connection Issues

The `supabase link` and direct `psql` connections are failing, but **MCP integration through VS Code Copilot Chat is working perfectly**.

## Solution: Manual Deployment via MCP

Since you have the MCP Supabase integration working in VS Code, we can deploy the security hardening through that channel.

## Step 1: Verify Current Database State

**Ask Copilot Chat (with @supabase):**

```
@supabase Can you run this query to check which tables currently have RLS enabled?

SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

## Step 2: Apply Core RLS Policies

**Ask Copilot Chat to run each section separately:**

### Enable RLS on Core Tables

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
```

### Add User Protection Policies

```sql
CREATE POLICY "users_own_profile" ON public.users
  FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "admin_all_users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

### Add Booking Protection

```sql
CREATE POLICY "users_own_bookings" ON public.bookings
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "admin_all_bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_emails
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

## Step 3: Apply Performance Indexes

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_emails_email ON public.admin_emails(email);
```

## Step 4: Add Audit System

### Create Audit Table

```sql
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  record_id text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT NOW()
);
```

### Add Audit Function

```sql
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, old_values, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id::text, TG_OP, to_jsonb(OLD), COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
    RETURN OLD;
  END IF;
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(NEW), COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, old_values, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(OLD), to_jsonb(NEW), COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Step 5: Validation

**After each step, validate with:**

```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check indexes created
SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%';
```

## Step 6: Test Security

**Test user isolation:**

```sql
-- This should work for any authenticated user
SELECT * FROM public.users WHERE id = auth.uid()::text;

-- This should only work for admins
SELECT COUNT(*) FROM public.users;
```

## Deployment Checklist

- [ ] **Step 1:** Verify current database state via MCP
- [ ] **Step 2:** Enable RLS on core tables (users, bookings, admin_emails)
- [ ] **Step 3:** Add user and admin policies
- [ ] **Step 4:** Create performance indexes
- [ ] **Step 5:** Set up audit logging system
- [ ] **Step 6:** Validate all security measures are active
- [ ] **Step 7:** Test user isolation and admin access

## Why This Works

1. **MCP Connection is Stable** - Your VS Code Copilot Chat can execute SQL reliably
2. **Incremental Deployment** - Apply changes step-by-step with validation
3. **No CLI Dependencies** - Bypasses the problematic `supabase link` command
4. **Real-time Validation** - Test each step immediately

## Expected Timeline

**15-20 minutes total:**

- 5 minutes: Core RLS policies
- 5 minutes: Performance indexes
- 5 minutes: Audit system setup
- 5 minutes: Validation and testing

## Rollback Plan

If anything goes wrong, you can disable RLS quickly:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
-- etc.
```

---

**Ready to proceed?** Start with Step 1 and work through each section using your working MCP connection in VS Code Copilot Chat.
