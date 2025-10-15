-- Drop existing rate_limits table if schema doesn't match
DROP TABLE IF EXISTS public.rate_limits CASCADE;

-- Create rate_limits table for API rate limiting
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX rate_limits_key_created_at_idx
  ON public.rate_limits (key, created_at DESC);

-- RLS policies (admin-only access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limits_admin_all" ON public.rate_limits
  FOR ALL USING (is_admin());

-- Comment
COMMENT ON TABLE public.rate_limits IS 'Stores rate limit tracking data for API endpoints';

