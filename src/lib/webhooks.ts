import crypto from 'node:crypto';
import { logger } from '@/lib/logger';

/**
 * Verify HMAC-SHA256 webhook signature
 * @param payload - Raw request body as string
 * @param signature - Signature from webhook header
 * @param secret - Webhook secret key
 */
export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    logger.error('Signature verification failed', {
      event: 'webhook.signature_error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

/**
 * Verify Veriff webhook signature
 * Veriff uses X-Signature header with SHA256 HMAC
 */
export function verifyVeriffSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  return verifyHmacSignature(payload, signature, secret);
}

/**
 * Verify Checkr webhook signature
 * Checkr uses X-Checkr-Signature header with SHA256 HMAC
 */
export function verifyCheckrSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  return verifyHmacSignature(payload, signature, secret);
}

/**
 * Verify DocuSign Connect webhook signature (HMAC-SHA256)
 * DocuSign uses X-DocuSign-Signature-1 header
 */
export function verifyDocuSignSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  return verifyHmacSignature(payload, signature, secret);
}

/**
 * Extract idempotency key from event
 */
export function getIdempotencyKey(provider: string, eventId: string): string {
  return `${provider}:${eventId}`;
}

