import { supabaseAdmin } from '@/lib/supabaseAdmin';

export type RateLimitResult = {
  allowed: boolean;
  remaining?: number;
  reset?: number;
};

/**
 * Check if a rate limit has been exceeded
 * @param key - Unique identifier for the rate limit (e.g., IP address, user ID, invite ID)
 * @param maxRequests - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Store rate limit data in a simple table
  // For production, consider using Redis or similar
  const { data: records } = await supabaseAdmin
    .from('rate_limits')
    .select('created_at')
    .eq('key', key)
    .gte('created_at', new Date(windowStart).toISOString())
    .order('created_at', { ascending: false });

  const count = records?.length || 0;

  if (count >= maxRequests) {
    const oldestRecord = records?.[records.length - 1];
    const resetTime = oldestRecord
      ? new Date(oldestRecord.created_at).getTime() + windowMs
      : now + windowMs;

    return {
      allowed: false,
      remaining: 0,
      reset: resetTime,
    };
  }

  // Record this request
  await supabaseAdmin.from('rate_limits').insert({
    key,
    created_at: new Date(now).toISOString(),
  });

  return {
    allowed: true,
    remaining: maxRequests - count - 1,
    reset: now + windowMs,
  };
}

/**
 * Cleanup old rate limit records (call periodically via CRON)
 */
export async function cleanupRateLimits(olderThanMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanMs).toISOString();

  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .delete()
    .lt('created_at', cutoff)
    .select('id');

  if (error) {
    throw error;
  }

  return data?.length || 0;
}

