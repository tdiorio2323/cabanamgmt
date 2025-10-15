-- Create stripe_events table for idempotency tracking
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS stripe_events_event_id_idx ON public.stripe_events (event_id);
CREATE INDEX IF NOT EXISTS stripe_events_processed_at_idx ON public.stripe_events (processed_at DESC);

-- RLS policies (admin-only access)
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stripe_events_admin_all" ON public.stripe_events
  FOR ALL USING (is_admin());

-- Add deposit_paid_at column to bookings if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' 
    AND table_name='bookings' 
    AND column_name='deposit_paid_at'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN deposit_paid_at TIMESTAMPTZ;
  END IF;
END $$;

-- Comment
COMMENT ON TABLE public.stripe_events IS 'Tracks processed Stripe webhook events for idempotency';

