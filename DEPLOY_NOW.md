# 🚀 Deploy to Production - Quick Start

## Prerequisites Complete ✅

- ✅ Build unblocked (TypeScript errors fixed)
- ✅ All tests passing (10/10)
- ✅ Migrations applied to remote database
- ✅ CI/CD aligned with local hooks
- ✅ 8 commits pushed to main

---

## 1️⃣ Automated Deployment (Recommended)

Run the orchestration script:

```bash
./scripts/deploy-production.sh
```

This will:
1. Verify local build (`pnpm run ci:verify`)
2. Check git status (clean working directory)
3. Verify migrations applied (3 new migrations)
4. Regenerate database types
5. Prompt for environment variable confirmation
6. Guide you through Vercel deployment
7. Run post-deploy smoke tests

---

## 2️⃣ Manual Deployment Steps

### Step 1: Add Environment Variables to Vercel

```bash
# Run the sync guide
./scripts/sync-vercel-env.sh

# Or manually add:
vercel env add RESEND_API_KEY production
vercel env add MAIL_FROM production

# Optional (add when vendors configured):
vercel env add VERIFF_WEBHOOK_SECRET production
vercel env add CHECKR_WEBHOOK_SECRET production
vercel env add DOCUSIGN_CONNECT_KEY production
```

### Step 2: Deploy to Vercel

```bash
# Option A: Auto-deploy (already done - push to main triggers deploy)
git push origin main

# Option B: Manual deploy
vercel --prod

# Option C: Via Vercel Dashboard
# Visit: https://vercel.com/your-org/cabanamgmt
# Click: "Deploy" button
```

### Step 3: Verify Deployment

```bash
# Wait for deployment to complete, then:
./scripts/smoke-after-deploy.sh https://your-production-url.vercel.app

# Expected output:
# ✓ PASS - Application health
# ✓ PASS - Database health
```

---

## 3️⃣ Post-Deploy Configuration

### Configure Webhook Endpoints

**Stripe Dashboard** (https://dashboard.stripe.com/webhooks):
```
Endpoint URL: https://your-domain.com/api/stripe/webhook
Events: payment_intent.succeeded, payment_intent.payment_failed
→ Copy webhook signing secret to STRIPE_WEBHOOK_SECRET
```

**Veriff Dashboard** (when ready):
```
Webhook URL: https://your-domain.com/api/identity/webhook
→ Copy HMAC secret to VERIFF_WEBHOOK_SECRET
```

**Checkr Dashboard** (when ready):
```
Webhook URL: https://your-domain.com/api/screening/webhook
→ Copy HMAC secret to CHECKR_WEBHOOK_SECRET
```

**DocuSign Connect** (when ready):
```
Connect URL: https://your-domain.com/api/contracts/webhook
→ Copy HMAC key to DOCUSIGN_CONNECT_KEY
```

### Test Email Delivery

```bash
# Login to dashboard as admin
# Navigate to: /dashboard/invite
# Create a test invite
# Verify email received at recipient inbox
```

---

## 4️⃣ Monitoring Setup (Recommended)

### Sentry (Error Tracking)
```bash
pnpm add @sentry/nextjs
# Follow: https://docs.sentry.io/platforms/javascript/guides/nextjs/
```

### Stripe Alerts
- Dashboard → Webhooks → Configure retry alerts
- Set up email notifications for failed webhooks

### Database Backups
- Supabase Dashboard → Database → Backups
- Enable point-in-time recovery

---

## 🔍 Verification Commands

```bash
# Local verification (before deploy)
pnpm run ci:verify

# Post-deploy verification
curl https://your-domain.com/api/health | jq
curl https://your-domain.com/api/db/health | jq

# Check migrations
supabase migration list
```

---

## 📊 What Was Deployed

**6 Major Features**:
1. ✅ TypeScript strict mode compliance
2. ✅ Email provider (Resend) with rate limiting
3. ✅ Stripe webhook with idempotency
4. ✅ Identity/Screening/Contracts webhooks
5. ✅ CI/CD pipeline alignment
6. ✅ E2E test coverage

**3 New Database Tables**:
- `rate_limits` - API rate limiting
- `stripe_events` - Stripe webhook idempotency
- `webhook_events` - Cross-provider idempotency

**Infrastructure**:
- Rate limiting (IP + per-resource)
- PII redaction in logs
- Signature verification on all webhooks
- Structured logging throughout

---

## 🆘 Troubleshooting

**Build fails on Vercel**:
```bash
# Check build logs for missing env vars
# Verify NEXT_PUBLIC_* variables are set
# Ensure pnpm version matches (10.x)
```

**Migrations not applied**:
```bash
supabase db push
pnpm run db:types
```

**Webhook signature failures**:
```bash
# Check webhook secret is correct in Vercel env
# Verify header name matches vendor docs
# Check logs for structured error events
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Full verification | `pnpm run ci:verify` |
| Apply migrations | `supabase db push` |
| Regenerate types | `pnpm run db:types` |
| Deploy to Vercel | `vercel --prod` |
| Smoke test | `./scripts/smoke-after-deploy.sh <URL>` |
| Env sync guide | `./scripts/sync-vercel-env.sh` |

---

**Ready to deploy!** 🎉

See `BUILD_UNBLOCK_SUMMARY.md` for complete details.

