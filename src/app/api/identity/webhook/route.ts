import { NextRequest } from "next/server";

import { verifyVeriffSignature, getIdempotencyKey } from "@/lib/webhooks";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logger } from "@/lib/logger";

const VERIFF_SECRET = process.env.VERIFF_WEBHOOK_SECRET || process.env.ONFIDO_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const sig = request.headers.get('x-signature') ?? request.headers.get('x-hmac-signature') ?? '';

  if (!VERIFF_SECRET) {
    logger.error('Identity webhook secret not configured', { event: 'identity.webhook.config_error' });
    return new Response('webhook secret not configured', { status: 500 });
  }

  if (!verifyVeriffSignature(raw, sig, VERIFF_SECRET)) {
    logger.warn('Identity webhook bad signature', { event: 'identity.webhook.bad_signature' });
    return new Response('bad signature', { status: 400 });
  }

  let evt: { id: string; status: string; user_id?: string; verification?: string };
  
  try {
    evt = JSON.parse(raw);
  } catch {
    logger.error('Identity webhook invalid JSON', { event: 'identity.webhook.invalid_json' });
    return new Response('invalid json', { status: 400 });
  }

  // Check idempotency
  const idempotencyKey = getIdempotencyKey('identity', evt.id);
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();

  if (existing) {
    logger.info('Identity webhook duplicate event', { event: 'identity.webhook.duplicate', eventId: evt.id });
    return new Response('ok', { status: 200 });
  }

  // Record event
  await supabaseAdmin.from('webhook_events').insert({
    idempotency_key: idempotencyKey,
    provider: 'identity',
    event_type: evt.status,
    processed_at: new Date().toISOString(),
  });

  // Map status to verification status
  const verificationStatus = evt.status === 'approved' || evt.verification === 'approved' ? 'verified' : 'failed';

  try {
    // Update user verification status
    if (evt.user_id) {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ verification_status: verificationStatus })
        .eq('id', evt.user_id);

      if (error) {
        logger.error('Failed to update user verification', { 
          event: 'identity.webhook.update_failed', 
          userId: evt.user_id,
          error: error.message,
        });
        return new Response('database error', { status: 500 });
      }

      logger.info('User verification status updated', { 
        event: 'identity.webhook.updated', 
        userId: evt.user_id,
        status: verificationStatus,
      });
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    logger.error('Identity webhook processing error', { 
      event: 'identity.webhook.error', 
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return new Response('processing error', { status: 500 });
  }
}
