import { NextRequest } from "next/server";

import { verifyCheckrSignature, getIdempotencyKey } from "@/lib/webhooks";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logger } from "@/lib/logger";

const CHECKR_SECRET = process.env.CHECKR_WEBHOOK_SECRET || process.env.CERTN_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-checkr-signature') ?? req.headers.get('x-certn-signature') ?? '';

  if (!CHECKR_SECRET) {
    logger.error('Screening webhook secret not configured', { event: 'screening.webhook.config_error' });
    return new Response('webhook secret not configured', { status: 500 });
  }

  if (!verifyCheckrSignature(raw, sig, CHECKR_SECRET)) {
    logger.warn('Screening webhook bad signature', { event: 'screening.webhook.bad_signature' });
    return new Response('bad signature', { status: 400 });
  }

  let evt: { id: string; status: string; user_id?: string; result?: string };
  
  try {
    evt = JSON.parse(raw);
  } catch {
    logger.error('Screening webhook invalid JSON', { event: 'screening.webhook.invalid_json' });
    return new Response('invalid json', { status: 400 });
  }

  // Check idempotency
  const idempotencyKey = getIdempotencyKey('screening', evt.id);
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();

  if (existing) {
    logger.info('Screening webhook duplicate event', { event: 'screening.webhook.duplicate', eventId: evt.id });
    return new Response('ok', { status: 200 });
  }

  // Record event
  await supabaseAdmin.from('webhook_events').insert({
    idempotency_key: idempotencyKey,
    provider: 'screening',
    event_type: evt.status,
    processed_at: new Date().toISOString(),
  });

  // Map status to screening status
  const screeningStatus = evt.status === 'clear' || evt.result === 'clear' ? 'passed' : 'failed';

  try {
    // Update user screening status
    if (evt.user_id) {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ screening_status: screeningStatus })
        .eq('id', evt.user_id);

      if (error) {
        logger.error('Failed to update user screening', { 
          event: 'screening.webhook.update_failed', 
          userId: evt.user_id,
          error: error.message,
        });
        return new Response('database error', { status: 500 });
      }

      logger.info('User screening status updated', { 
        event: 'screening.webhook.updated', 
        userId: evt.user_id,
        status: screeningStatus,
      });
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    logger.error('Screening webhook processing error', { 
      event: 'screening.webhook.error', 
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return new Response('processing error', { status: 500 });
  }
}
