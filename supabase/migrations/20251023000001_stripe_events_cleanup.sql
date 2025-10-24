-- Add automatic cleanup function for old stripe_events
-- Events older than 90 days will be periodically removed

CREATE OR REPLACE FUNCTION cleanup_old_stripe_events()
RETURNS void AS $$
BEGIN
  DELETE FROM public.stripe_events
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to postgres role
GRANT EXECUTE ON FUNCTION cleanup_old_stripe_events() TO postgres;

-- Comment
COMMENT ON FUNCTION cleanup_old_stripe_events() IS 'Removes Stripe events older than 90 days to prevent unbounded table growth. Run periodically via cron or pg_cron.';

-- Note: To enable automatic cleanup, set up a cron job:
-- SELECT cron.schedule('cleanup-stripe-events', '0 2 * * *', 'SELECT cleanup_old_stripe_events()');
-- This requires pg_cron extension to be enabled in Supabase dashboard
