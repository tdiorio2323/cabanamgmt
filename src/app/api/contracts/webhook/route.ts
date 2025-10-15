import { NextRequest } from "next/server";

import { verifyDocuSignSignature, getIdempotencyKey } from "@/lib/webhooks";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logger } from "@/lib/logger";

const DOCUSIGN_SECRET = process.env.DOCUSIGN_CONNECT_KEY;

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-docusign-signature-1') ?? '';

  if (!DOCUSIGN_SECRET) {
    logger.error('DocuSign webhook secret not configured', { event: 'contracts.webhook.config_error' });
    return new Response('webhook secret not configured', { status: 500 });
  }

  if (!verifyDocuSignSignature(raw, sig, DOCUSIGN_SECRET)) {
    logger.warn('DocuSign webhook bad signature', { event: 'contracts.webhook.bad_signature' });
    return new Response('bad signature', { status: 400 });
  }

  let evt: { 
    id?: string;
    envelopeId?: string; 
    envelopeSummary?: { status?: string; booking_id?: string };
    event?: string;
  };
  
  try {
    evt = JSON.parse(raw);
  } catch {
    logger.error('DocuSign webhook invalid JSON', { event: 'contracts.webhook.invalid_json' });
    return new Response('invalid json', { status: 400 });
  }

  const eventId = evt.envelopeId || evt.id || 'unknown';
  
  // Check idempotency
  const idempotencyKey = getIdempotencyKey('docusign', eventId);
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();

  if (existing) {
    logger.info('DocuSign webhook duplicate event', { event: 'contracts.webhook.duplicate', eventId });
    return new Response('ok', { status: 200 });
  }

  // Record event
  await supabaseAdmin.from('webhook_events').insert({
    idempotency_key: idempotencyKey,
    provider: 'docusign',
    event_type: evt.event || evt.envelopeSummary?.status || 'unknown',
    processed_at: new Date().toISOString(),
  });

  try {
    const bookingId = evt.envelopeSummary?.booking_id;
    const status = evt.envelopeSummary?.status || evt.event;
    
    if (bookingId && (status === 'completed' || status === 'signed')) {
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({ nda_signed: true })
        .eq('id', bookingId);

      if (error) {
        logger.error('Failed to update booking NDA status', { 
          event: 'contracts.webhook.update_failed', 
          bookingId,
          error: error.message,
        });
        return new Response('database error', { status: 500 });
      }

      logger.info('Booking NDA marked as signed', { 
        event: 'contracts.webhook.updated', 
        bookingId,
        envelopeId: eventId,
      });
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    logger.error('DocuSign webhook processing error', { 
      event: 'contracts.webhook.error', 
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return new Response('processing error', { status: 500 });
  }
}
