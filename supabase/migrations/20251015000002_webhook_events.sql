-- Create webhook_events table for idempotency tracking across all webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS webhook_events_idempotency_key_idx ON public.webhook_events (idempotency_key);
CREATE INDEX IF NOT EXISTS webhook_events_provider_idx ON public.webhook_events (provider);
CREATE INDEX IF NOT EXISTS webhook_events_processed_at_idx ON public.webhook_events (processed_at DESC);

-- RLS policies (admin-only access)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "webhook_events_admin_all" ON public.webhook_events
  FOR ALL USING (is_admin());

-- Comment
COMMENT ON TABLE public.webhook_events IS 'Tracks processed webhook events for idempotency across all providers';

