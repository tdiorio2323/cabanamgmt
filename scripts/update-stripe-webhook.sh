#!/usr/bin/env bash
set -euo pipefail

# Update Stripe Webhook via API
# Usage: ./scripts/update-stripe-webhook.sh

WEBHOOK_ID="we_1SIYbUEXXYdy3RqJOssuEcVn"
WEBHOOK_URL="https://cabanamgmt-ol6r8n28u-td-studioss-projects.vercel.app/api/stripe/webhook"

echo "🔧 Updating Stripe Webhook Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Webhook ID: $WEBHOOK_ID"
echo "Endpoint URL: $WEBHOOK_URL"
echo ""
read -sp "Enter your Stripe LIVE secret key (sk_live_...): " STRIPE_KEY
echo ""
echo ""

if [[ ! "$STRIPE_KEY" =~ ^sk_live_ ]]; then
  echo "❌ Error: Must use live key (sk_live_...), not test key"
  exit 1
fi

echo "Updating webhook endpoint..."
RESPONSE=$(curl -s https://api.stripe.com/v1/webhook_endpoints/"$WEBHOOK_ID" \
  -u "$STRIPE_KEY": \
  -X POST \
  -d "enabled_events[]=payment_intent.succeeded" \
  -d "enabled_events[]=payment_intent.payment_failed" \
  -d url="$WEBHOOK_URL")

if echo "$RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
  echo ""
  echo "❌ Error updating webhook:"
  echo "$RESPONSE" | jq -r '.error.message'
  exit 1
fi

echo ""
echo "✅ Webhook updated successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Webhook Details:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$RESPONSE" | jq -r '
"ID: " + .id + "
URL: " + .url + "
Events: " + (.enabled_events | join(", ")) + "
Status: " + .status + "
API Version: " + (.api_version // "default")
'

SECRET=$(echo "$RESPONSE" | jq -r '.secret')

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  IMPORTANT: Add signing secret to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Signing Secret: $SECRET"
echo ""
echo "Run this command:"
echo ""
echo "  vercel env add STRIPE_WEBHOOK_SECRET production"
echo "  # When prompted, paste: $SECRET"
echo ""
echo "Then redeploy:"
echo "  vercel --prod"
echo ""

