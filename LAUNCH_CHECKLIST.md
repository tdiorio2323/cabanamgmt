# Launch Readiness Checklist

## Quick Start
```bash
# 0. Repo
cd /Users/tylerdiorio/cabanamgmt

# 1. Direct connection (preferred)
export DB_HOST="aws-0-xxx.database.supabase.com"   # Supabase Console → Connection → Direct → Host
export DB_PORT="6543"
export DB_USER="postgres"
export DB_NAME="postgres"
export DB_PASS="<ROTATED_DB_PASSWORD>"

# Fallback (only if direct host fails to resolve)
# export DB_HOST="aws-0-xxx.pooler.supabase.com"
# export DB_PORT="5432"

# 2. DNS + Docker
nslookup "$DB_HOST"
docker info >/dev/null

# 3. Reconcile + build (runs build, repair, pull/push, smoke)
scripts/reconcile_and_build.sh

# 4. Verify applied migrations
supabase migration list --db-url "$SUPABASE_DB_URL"
```

## Env Matrix
| KEY | Scope | Example | Notes |
| --- | --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | local, prod | https://dotfloiygvhsujlwzqgv.supabase.co | Public Supabase URL used by browser clients |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | local, prod | `eyJ...` | Anonymous client key; rotate via Supabase dashboard |
| SUPABASE_SERVICE_ROLE_KEY | local, prod (server only) | `service-role-...` | Never expose to browser; required for admin APIs and scripts |
| NEXT_PUBLIC_SITE_URL | local, prod | https://app.cabana.com | Used for metadata and redirects; must match deployment domain |
| NEXT_PUBLIC_BASE_URL | local, prod | https://app.cabana.com | Used in admin views for absolute links |
| STRIPE_SECRET_KEY | local, prod | sk_live_*** | Full access key for server Stripe SDK |
| STRIPE_WEBHOOK_SECRET | local, prod | whsec_*** | From Stripe CLI / Dashboard webhook endpoint |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | local, prod | pk_live_*** | Browser key for Stripe.js |
| STRIPE_API_VERSION | local, prod | 2024-06-20 | Optional override; keep in sync with Stripe dashboard |
| DOCUSIGN_INTEGRATOR_KEY | local, prod | GUID | API application ID |
| DOCUSIGN_USER_ID | local, prod | GUID | API user GUID |
| DOCUSIGN_ACCOUNT_ID | local, prod | GUID | Account GUID |
| DOCUSIGN_PRIVATE_KEY | local, prod (server only) | `-----BEGIN RSA PRIVATE KEY-----` | Use env-safe PEM string or encrypted secret |
| ONFIDO_API_TOKEN | local, prod | `token_***` | Identity verification token |
| VERIFF_API_TOKEN | local, prod | `veriff_***` | Identity verification token |
| CHECKR_API_KEY | local, prod | `sk_test_***` | Background check |
| CERTN_API_KEY | local, prod | `certn_***` | Background check |
| POSTMARK_API_KEY | local, prod | `postmark-***` | Mail provider (use Postmark **or** provide RESEND_API_KEY) |
| RESEND_API_KEY | local, prod | `re_***` | Alternative mail provider (only set one mail provider) |
| MAIL_FROM | local, prod | no-reply@cabana.com | Default From/Sender address for invites & notifications |
| ADMIN_EMAILS | local, prod | admin@example.com,ops@example.com | Must match `public.admin_emails` rows and Supabase DB parameter |
| OPENAI_API_KEY | optional | sk-*** | Used by `openai` client if features enabled |
| GEMINI_API_KEY | optional | AI key for Gemini integration |
| PLAYWRIGHT_BASE_URL | test CI | https://preview-url | Overrides base URL for Playwright config |
| APP_URL | test CI | http://localhost:3000 | Alternative base URL fallback |
| TEST_EMAIL | local CI | admin+test@example.com | Admin account used in E2E tests |
| TEST_PASSWORD | local CI | strong-password | Matches Supabase auth test user |
| DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME | local ops | (see Quick Start) | Used by `scripts/reconcile_and_build.sh` |
| SUPABASE_DB_URL | local ops | postgresql://postgres:... | Auto-set by script; do not commit |

## 1) Supabase & Migrations
- [ ] **Confirm DNS & Docker ready**
  ```bash
  nslookup "$DB_HOST"
  docker info >/dev/null
  ```
  Expect: DNS returns Supabase IPs; Docker reports server info. If DNS fails, re-copy Direct host from Supabase dashboard. If Docker fails, launch Docker Desktop.
- [ ] **Repair remote history to match local**
  ```bash
  scripts/reconcile_and_build.sh
  ```
  Expect: build passes, `supabase migration repair/pull/push` succeed. If `supabase db pull` errors about Docker, rerun once Docker is up. If auth errors, rotate DB password and re-export DB_PASS.
- [ ] **Verify migration list**
  ```bash
  supabase migration list --db-url "$SUPABASE_DB_URL"
  ```
  Expect: latest entry shows `20251013171500_invites_extend` as Applied (A). If missing, rerun `supabase db push`.
- [ ] **Check indices & constraints**
  ```bash
  supabase db query --db-url "$SUPABASE_DB_URL" <<'SQL'
  SELECT indexname
  FROM pg_indexes
  WHERE schemaname='public'
    AND tablename='invites'
    AND indexname='invites_email_status_idx';
SQL
  ```
  Expect: one row. If none, ensure migration `20251013171500_invites_extend.sql` ran.
- [ ] **RLS policies**
  - Verify tables (`vip_codes`, `vip_redemptions`, `invites`, `invite_redemptions`) have RLS enabled and policies per migrations `0003_vip.sql`, `0005_invites.sql`, `20251013152416_0010_fix_invites_and_vip.sql`.
  ```bash
  supabase db query --db-url "$SUPABASE_DB_URL" <<'SQL'
  SELECT tablename, relrowsecurity
  FROM pg_tables
  WHERE schemaname='public'
    AND tablename IN ('vip_codes','vip_redemptions','invites','invite_redemptions');
SQL
  ```
  Expect `relrowsecurity = true`. If false, rerun migrations or enable manually via `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

## 2) Environment Secrets (local & production)
- [ ] **Mirror .env.local from templates**
  ```bash
  cp .env.local.example .env.local  # if starting fresh
  pnpm exec env-cmd -f .env.local -- printenv | grep SUPABASE
  ```
  Ensure keys in Env Matrix are filled.
- [ ] **Vercel secrets sync**
  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  # repeat for every key in Env Matrix (use lowercase scope: preview, production)
  ```
  Use `vercel env pull .env.production.local` to verify.
- [ ] **Rotation plan**
  - Document where each key lives (Supabase dashboard, Stripe dashboard, DocuSign Connect, etc.).
  - When rotating, update `.env.local`, Vercel env, and invalidate caches (`vercel env rm <KEY>` before add).
  - Supabase DB password rotations require restarting `scripts/reconcile_and_build.sh` exports.

## 3) Build Health
- [ ] **Html guard**
  ```bash
  grep -R "<Html" src/ | grep -v "_document.tsx" || echo "OK"
  ```
  Expect: `OK`. If files listed, move markup into `pages/_document.tsx` equivalent or refactor.
- [ ] **Non-Turbopack build**
  ```bash
  TURBOPACK=0 pnpm exec next build
  ```
  Expect: build succeeds with zero errors. Warnings about unused error variables must be resolved (clean ESLint).
- [ ] **Static gates**
  ```bash
  pnpm run lint
  pnpm run typecheck
  ```
  Both must pass. Fix ESLint or TS issues before launch.

## 4) Tests
- [ ] **Unit (Vitest)**
  ```bash
  pnpm test
  ```
  Expect: `7 passed`. If failures mention supabase credentials, ensure envs exist.
- [ ] **Playwright auth**
  ```bash
  TEST_EMAIL=admin@example.com TEST_PASSWORD=*** PLAYWRIGHT_BASE_URL=https://localhost:3000 pnpm exec playwright test -g "@auth"
  ```
  Expect: all auth-tagged specs skipped only if creds missing; otherwise pass. If login fails, verify test user confirmed in Supabase and listed in `ADMIN_EMAILS`.
- [ ] **Playwright smoke**
  ```bash
  PLAYWRIGHT_BASE_URL=https://localhost:3000 pnpm exec playwright test -g "@smoke"
  ```
  Use `--headed` for debugging: `pnpm exec playwright test -g "@smoke" --headed --trace on`. Collect traces via `pnpm exec playwright show-report` if failures occur.

## 5) Email/Mailer
- [ ] **Provider wiring**
  - `createInvite` and `resendInvite` contain `// TODO` placeholders. Implement actual send in `src/lib/invites.ts` (call e.g. Postmark/Resend SDK) and store outbound templates.
- [ ] **Environment keys**
  - Provide `POSTMARK_API_KEY` or `RESEND_API_KEY`, plus template IDs as needed.
- [ ] **Queue test**
  ```bash
  pnpm exec tsx scripts/mail-smoke.ts  # create script to trigger provider (if not exists, create before launch)
  ```
  Verify actual email received; if not, inspect provider dashboard for delivery errors.

## 6) Stripe
- [ ] **Secrets & API version**
  - Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_API_VERSION`.
- [ ] **Webhook coverage**
  - Ensure `/api/stripe/webhook` handles `payment_intent.succeeded` and `payment_intent.payment_failed`. Update TODO sections to mutate Supabase state (Deposits table) before launch.
- [ ] **Local run**
  ```bash
  stripe listen --forward-to http://localhost:3000/api/stripe/webhook
  stripe trigger payment_intent.succeeded
  ```
  Expect: webhook 200 in CLI, deposit record updated. If fails, check logs and Stripe signing secret.
- [ ] **Dashboard validation**
  - Confirm events/states in Stripe dashboard, ensure no test-livemode mix.

## 7) DocuSign
- [ ] **Envelope creation**
  - Implement actual DocuSign API call in `src/app/api/contracts/create/route.ts` (currently TODO).
- [ ] **Webhook**
  - `/api/contracts/webhook/route.ts` should verify DocuSign signature and update `bookings` row. Configure DocuSign Connect to POST to `<PROD_URL>/api/contracts/webhook`.
- [ ] **Test plan**
  - Send sandbox envelope; ensure webhook transitions booking to `nda_signed: true`.
  - Pass if event arrives and status updates; fail if 4xx response or status unchanged.

## 8) Identity/Verification
- [ ] **Start endpoints**
  - Replace TODOs in `/api/identity/start` and `/api/screening/start` to call Onfido/Checkr (use `ONFIDO_API_TOKEN`, `CHECKR_API_KEY`, etc.).
- [ ] **Webhook handlers**
  - Implement verification of signatures and state updates in `/api/identity/webhook` & `/api/screening/webhook` (currently placeholder).
- [ ] **Sandbox flow**
  ```bash
  curl -X POST https://api.onfido.com/...  # per provider docs
  ```
  Expect: identity status transitions from pending → verified/failed within Supabase. Document rate limits.

## 9) Security
- [ ] **RLS audit**
  - Validate policies for `vip_codes`, `vip_redemptions`, `invites`, `invite_redemptions` and any user tables. Ensure only admins can manage invites.
- [ ] **Service role isolation**
  - Confirm `SUPABASE_SERVICE_ROLE_KEY` used only in server contexts (`src/lib/db.ts`, `supabaseAdmin`). No exposure client-side.
- [ ] **Headers & CORS**
  - `src/lib/securityHeaders.ts` + `middleware.ts` enforce security headers. Verify they’re active via `curl -I https://prod-domain`.
- [ ] **API auth checks**
  - Ensure admin routes (`/api/invites/*`, `/dashboard/*`) require session + admin email. If unauthorized, confirm 401/403 responses.

## 10) Monitoring & Backups
- [ ] **Supabase backups & logs**
  - Enable point-in-time recovery / backups in Supabase dashboard.
  - Configure log drains (to Datadog/Splunk) for audit.
- [ ] **Vercel monitoring**
  - Enable Vercel alerts for build failures, 500 rates.
- [ ] **Stripe retries**
  - Confirm webhook endpoints set to retry on failure and alerts configured.

## 11) Deployment
- [ ] **Vercel env sync**
  ```bash
  vercel env pull .env.production.local
  diff .env.production.local .env.local
  ```
  Ensure all keys aligned.
- [ ] **Build command**
  - Configure Vercel build command: `TURBOPACK=0 pnpm exec next build` (avoid Turbopack in production until stable).
  - Cache dependencies via pnpm (`PNPM_CACHE` automatically handled by Vercel).
- [ ] **Post-deploy smoke**
  ```bash
  ./SmokeAfterDeploy.sh
  ```
  (Create script from block below and store for ops).

## 12) Rollback & Recovery
- [ ] **Revert migration**
  ```bash
  supabase migration revert --name 20251013171500_invites_extend --db-url "$SUPABASE_DB_URL"
  ```
  Use to undo latest schema change.
- [ ] **Disable feature quickly**
  - Remove invite routes from `src/components/layout/Sidebar.tsx` or gate by `ADMIN_EMAILS` to hide UI temporarily.
- [ ] **Rotate compromised secret**
  - Regenerate key (Stripe/Supabase/etc), update `.env.local`, Vercel env, and redeploy.

## 13) Manual QA Scripts
- [ ] **Create invite**
  ```bash
  curl -X POST https://<domain>/api/invites/create \
    -H 'Content-Type: application/json' \
    -b 'sb-access-token=...' \
    -d '{"email":"qa+create@example.com","role":"member","expiresInDays":7}'
  ```
  Expect `{ ok: true, id: "..." }`. If 401, session missing; if 409, duplicate invite.
- [ ] **Resend invite**
  ```bash
  curl -X POST https://<domain>/api/invites/resend \
    -H 'Content-Type: application/json' \
    -b 'sb-access-token=...' \
    -d '{"email":"qa+create@example.com"}'
  ```
  Expect `{ ok: true }`. Failures due to rate limit (429) should be noted.
- [ ] **Revoke invite**
  ```bash
  curl -X POST https://<domain>/api/invites/revoke \
    -H 'Content-Type: application/json' \
    -b 'sb-access-token=...' \
    -d '{"email":"qa+create@example.com"}'
  ```
  Expect `{ ok: true, count: 1 }`.
- [ ] **Payment simulation**
  ```bash
  stripe trigger payment_intent.succeeded
  ```
  Verify `/api/stripe/webhook` logs success and deposit record updates.
- [ ] **Verification simulation**
  - Hit `/api/identity/start` (once implemented): expect session token returned.
  - POST webhook fixture to `/api/identity/webhook`: expect status change in Supabase.

## 14) Sign-off Gates
- [ ] Supabase migrations applied (`supabase migration list` up-to-date).
- [ ] `.env.local` and Vercel env contain all keys from Env Matrix.
- [ ] `TURBOPACK=0 pnpm exec next build`, `pnpm run lint`, `pnpm run typecheck` all pass cleanly.
- [ ] `pnpm test`, `pnpm exec playwright test -g "@auth"`, `pnpm exec playwright test -g "@smoke"` succeed.
- [ ] Email provider sends and logs invite notifications.
- [ ] Stripe events round-trip from webhook to Supabase state.
- [ ] DocuSign envelope flow completes with webhook updating bookings.
- [ ] Identity/Screening providers update verification status through webhooks.
- [ ] Monitoring & alerting configured (Supabase backups, Vercel alerts, Stripe retries).
- [ ] Deployment smoke script returns healthy green checks (see below).

### Smoke After Deploy
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://app.cabana.com}"
COOKIE="sb-access-token=<PROD_ACCESS_TOKEN>"

curl -fsSL "$BASE/api/health" | jq '.ok'  # expect true
curl -fsSL "$BASE/api/invites/list" -b "$COOKIE" | jq '.invites | length'  # expect >=0
curl -fsSL "$BASE/api/db/health" | jq '.ok'  # expect true
```


