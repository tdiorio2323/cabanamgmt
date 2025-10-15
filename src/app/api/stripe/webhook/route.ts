import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logger } from "@/lib/logger";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    logger.error("Missing STRIPE_WEBHOOK_SECRET", { event: "stripe.webhook.config_error" });
    return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    logger.warn("Stripe webhook missing signature", { event: "stripe.webhook.no_signature" });
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid signature";
    logger.error("Stripe webhook signature verification failed", { 
      event: "stripe.webhook.invalid_signature", 
      error: message 
    });
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Check idempotency - prevent duplicate processing
  const { data: existingEvent } = await supabaseAdmin
    .from('stripe_events')
    .select('id')
    .eq('event_id', event.id)
    .maybeSingle();

  if (existingEvent) {
    logger.info('Stripe event already processed', { event: 'stripe.webhook.duplicate', eventId: event.id, type: event.type });
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Record this event for idempotency
  await supabaseAdmin.from('stripe_events').insert({
    event_id: event.id,
    type: event.type,
    processed_at: new Date().toISOString(),
  });

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info('Processing payment_intent.succeeded', { 
          event: 'stripe.payment.succeeded', 
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
        });

        // Update booking deposit status
        const { data: booking, error: updateError } = await supabaseAdmin
          .from('bookings')
          .update({ 
            deposit_status: 'paid',
            payment_intent_id: paymentIntent.id,
            deposit_paid_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', paymentIntent.id)
          .select('id')
          .maybeSingle();

        if (updateError) {
          logger.error('Failed to update booking for succeeded payment', { 
            event: 'stripe.payment.update_failed', 
            paymentIntentId: paymentIntent.id,
            error: updateError.message,
          });
        } else if (booking) {
          logger.info('Booking deposit marked as paid', { 
            event: 'stripe.payment.booking_updated', 
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
          });
        } else {
          logger.warn('No booking found for payment intent', { 
            event: 'stripe.payment.no_booking', 
            paymentIntentId: paymentIntent.id,
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.warn('Processing payment_intent.payment_failed', { 
          event: 'stripe.payment.failed', 
          paymentIntentId: paymentIntent.id,
          lastError: paymentIntent.last_payment_error?.message,
        });

        // Update booking deposit status
        const { data: booking, error: updateError } = await supabaseAdmin
          .from('bookings')
          .update({ 
            deposit_status: 'failed',
            payment_intent_id: paymentIntent.id,
          })
          .eq('payment_intent_id', paymentIntent.id)
          .select('id')
          .maybeSingle();

        if (updateError) {
          logger.error('Failed to update booking for failed payment', { 
            event: 'stripe.payment.update_failed', 
            paymentIntentId: paymentIntent.id,
            error: updateError.message,
          });
        } else if (booking) {
          logger.info('Booking deposit marked as failed', { 
            event: 'stripe.payment.booking_updated', 
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
          });
        }
        break;
      }

      default:
        logger.info('Unhandled Stripe event type', { event: 'stripe.webhook.unhandled', type: event.type });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Error processing Stripe webhook', { 
      event: 'stripe.webhook.error', 
      eventId: event.id,
      type: event.type,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // Return 500 so Stripe retries
    return NextResponse.json({ error: 'webhook processing failed' }, { status: 500 });
  }
}
