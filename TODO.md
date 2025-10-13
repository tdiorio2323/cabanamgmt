# TODO - Cabana Management Platform

**Project Status**: ~75% Complete (as of October 11, 2025)
**Target Launch**: Q1 2026

## 📊 Current State Summary

### What's Working
- ✅ **Core Infrastructure**: Supabase database with RLS, indexes, audit logs, rate limiting
- ✅ **Admin Portal**: Full dashboard with users, bookings, VIP codes, invitations
- ✅ **Authentication**: Session management, admin access control, protected routes
- ✅ **VIP & Invite System**: Complete CRUD operations with usage tracking
- ✅ **Stripe Integration**: Deposit creation endpoint (webhook handler stubbed)
- ✅ **Testing**: Playwright E2E suite for admin (12 tests), smoke tests, auth tests
- ✅ **Documentation**: Comprehensive CLAUDE.md, architecture docs, testing guide

### What's Stubbed (Needs Vendor Integration)
- ⚠️ **Identity Verification**: `/api/identity/*` returns mock data, no Onfido/Veriff SDK
- ⚠️ **Background Screening**: `/api/screening/*` returns mock data, no Checkr/Certn SDK
- ⚠️ **DocuSign Contracts**: `/api/contracts/*` returns mock data, no DocuSign SDK
- ⚠️ **Stripe Webhooks**: `/api/stripe/webhook` only returns `{received: true}`
- ⚠️ **Interview Scheduling**: `/api/interview/schedule` stubbed, no Calendly/Google Calendar
- ⚠️ **StatusPanel**: Still uses polling instead of webhooks/SSE

### Critical Blockers for Launch
1. **External Vendor SDKs**: Must install and integrate 4 vendor SDKs (Onfido, Checkr, DocuSign, Calendly)
2. **Webhook Handlers**: All webhook routes need signature verification and real logic
3. **No Middleware**: `src/middleware.ts` doesn't exist (needed for rate limiting, CORS, CSP)
4. **No Error Boundaries**: React error boundaries not implemented
5. **No Supabase Functions**: PII cleanup CRON job not created
6. **No CI/CD**: No `.github/workflows/` files

## ✅ Recently Completed (October 2025)

### Database & Security
- [x] Comprehensive RLS policies implemented (`20241218_comprehensive_security_hardening.sql`)
- [x] Performance indexes for all core tables (users, bookings, invites, VIP codes)
- [x] Audit logging system with triggers for sensitive tables
- [x] Rate limiting database functions (`check_rate_limit()`)
- [x] Security dashboard view for metrics

### Admin Dashboard
- [x] Dashboard overview with KPI cards (Users, VIP Codes, Invitations, Revenue)
- [x] User management page with search, filters, and role badges
- [x] Booking management page with stats, filters, and action buttons
- [x] VIP code and invitation system fully functional with admin-only access

### API & Authentication
- [x] VIP code creation/redemption with admin auth checks (`/api/vip/*`)
- [x] Invitation system with create/list/accept/revoke endpoints (`/api/invites/*`)
- [x] Stripe deposit creation endpoint (`/api/stripe/create-deposit`)
- [x] Session management with `getSession()` utility
- [x] Admin email verification with `isAdminEmail()` utility

### Testing
- [x] Playwright E2E test suite for admin dashboard (12 tests)
- [x] Smoke test generation system (`scripts/smoke.ts`)
- [x] Authentication flow tests
- [x] Testing documentation (`docs/TESTING.md`)

### Documentation
- [x] Comprehensive CLAUDE.md with architecture, commands, and setup guide
- [x] Architecture diagram with business context (`docs/architecture-diagram.md`)
- [x] Session summary and project handoff (`docs/session-summary-2025-10-06.md`)
- [x] User invitation guide (`docs/USER-INVITATION-GUIDE.md`)

## 🔴 Critical Path - External Integrations

**STATUS**: All external vendor integrations are STUBBED with placeholder logic. Real API keys and SDK packages NOT installed.
- Onfido/Veriff SDK: NOT installed
- Checkr/Certn SDK: NOT installed
- DocuSign SDK: NOT installed
- Calendly/Google Calendar: NOT installed

### Identity Verification (Onfido/Veriff)

- [ ] **Implement Onfido SDK integration** (`src/app/api/identity/start/route.ts`)
  - Priority: High
  - Install package: `npm install @onfido/api` (NOT CURRENTLY INSTALLED)
  - Create applicant, generate SDK token, return to client
  - Store verification reference in `users.verification_status`
  - Test: Create test applicant and verify webhook receipt

- [ ] **Complete IDV webhook handler** (`src/app/api/identity/webhook/route.ts`)
  - Priority: High
  - Verify webhook signature using Onfido/Veriff secret
  - Parse check result (complete, consider, clear)
  - Update `users.verification_status` in Supabase
  - Trigger email notification on completion
  - Test: `curl -X POST http://localhost:3000/api/identity/webhook -d '{}'`

- [ ] **Add Veriff as fallback option** (`src/lib/idv.ts`)
  - Priority: Medium
  - Implement vendor selection logic based on user location
  - Create unified interface for both Onfido and Veriff
  - Document vendor switching logic in INTEGRATIONS.md
  - Test: Toggle vendors via environment variable

### Background Screening (Checkr/Certn)

- [ ] **Implement Checkr API integration** (`src/app/api/screening/start/route.ts`)
  - Priority: High
  - Replace mock status pool with real Checkr candidate creation
  - Request MVR + criminal background check packages
  - Store report ID in `users.screening_status`
  - Test: Create candidate with test SSN from Checkr docs

- [ ] **Complete screening webhook handler** (`src/app/api/screening/webhook/route.ts`)
  - Priority: High
  - Verify Checkr webhook signature
  - Handle report status: pending, clear, consider, suspended
  - Implement FCRA adverse action workflow (see compliance section)
  - Update `users.screening_status` in database
  - Test: Simulate webhook with Checkr test data

- [ ] **Add FCRA compliance workflow** (`src/app/api/screening/adverse-action/route.ts`)
  - Priority: High
  - Send pre-adverse action notice (7-day waiting period)
  - Store notice delivery timestamp in `users` table
  - Create adverse action final notice template
  - Integrate with email service (Postmark/Resend)
  - Test: Trigger adverse action flow with test user

### DocuSign Contract Execution

- [ ] **Implement DocuSign envelope creation** (`src/app/api/contracts/create/route.ts`)
  - Priority: High
  - Install package: `npm install docusign-esign`
  - Generate JWT for authentication (RSA keypair)
  - Create envelope with NDA template
  - Return embedded signing URL to client
  - Test: Create envelope and verify in DocuSign dashboard

- [ ] **Complete DocuSign webhook handler** (`src/app/api/contracts/webhook/route.ts`)
  - Priority: High
  - Verify DocuSign HMAC signature
  - Handle envelope events: sent, delivered, completed, declined
  - Update `bookings.nda_signed` on completion
  - Store signed document URL in database
  - Test: Sign test envelope and verify webhook

- [ ] **Create NDA template in DocuSign** (DocuSign dashboard)
  - Priority: High
  - Upload NDA PDF with anchor tags for signatures
  - Define signer roles (client, creator, witness)
  - Set template metadata and expiration (7 days)
  - Document template ID in `.env.local.example`
  - Test: Send test envelope using template ID

### Stripe Webhook Implementation

- [ ] **Complete Stripe webhook handler** (`src/app/api/stripe/webhook/route.ts`)
  - Priority: High
  - Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
  - Handle events: `payment_intent.succeeded`, `payment_intent.payment_failed`
  - Update `bookings.deposit_status` based on event type
  - Implement refund logic when screening fails (see deposit logic)
  - Test: `stripe trigger payment_intent.succeeded`

- [ ] **Implement deposit refund workflow** (`src/lib/stripe-refunds.ts`)
  - Priority: High
  - Auto-refund if user fails background screening
  - Create refund reason codes (screening_failed, policy_violation)
  - Log refund transactions to audit_log table
  - Send refund confirmation email
  - Test: Create refund for test payment intent

- [ ] **Add Stripe metadata tracking** (`src/app/api/stripe/create-deposit/route.ts`)
  - Priority: Medium
  - Store `user_id`, `booking_id`, `flow_step` in PaymentIntent metadata
  - Enable Stripe Radar for fraud detection
  - Set statement descriptor: "CABANA MGMT DEPOSIT"
  - Test: Verify metadata appears in Stripe dashboard

### Interview Scheduling

- [ ] **Implement Calendly/Google Calendar integration** (`src/app/api/interview/schedule/route.ts`)
  - Priority: Medium
  - Choose vendor: Calendly (easier) vs Google Calendar API (more control)
  - Generate unique booking link per user
  - Store scheduled slot in `bookings.slot` and update `interview_status`
  - Send calendar invite via email
  - Test: Book appointment and verify calendar event

- [ ] **Replace Calendly iframe with native scheduling** (`src/components/VideoPick.tsx`)
  - Priority: Low
  - Build custom date/time picker using shadcn/ui components
  - Check interviewer availability via Calendar API
  - Create calendar event on booking confirmation
  - Test: Schedule interview and verify Google Calendar sync

---

## 🧱 Core Infrastructure

### Database & Migrations

- [x] **Add RLS policies to core tables** (`supabase/migrations/0001_init.sql`)
  - Priority: High
  - Enable RLS on `users` and `bookings` tables
  - Create policies: users see own records, admins see all
  - Test: `pnpm run db:verify` and verify policies via Supabase dashboard
  - COMPLETED: Migration `20241218_comprehensive_security_hardening.sql` implements comprehensive RLS

- [ ] **Create PII retention cleanup job** (`supabase/functions/cleanup-pii/index.ts`)
  - Priority: High (GDPR compliance)
  - Delete `users` records older than 90 days with no active bookings
  - Anonymize email/phone for users with completed bookings
  - Schedule CRON trigger: `0 2 * * *` (daily at 2 AM)
  - Log deletions to audit_log
  - Test: Run function manually via `supabase functions invoke cleanup-pii`

- [ ] **Add database backup verification** (`scripts/verify-backups.mjs`)
  - Priority: High
  - Verify Supabase automatic backups are enabled
  - Test point-in-time recovery (PITR) with test data
  - Document restoration procedure in DEPLOYMENT_GUIDE.md
  - Schedule weekly backup tests
  - Test: Restore from backup to staging environment

- [x] **Optimize database indexes** (`supabase/migrations/performance_indexes.sql`)
  - Priority: Medium
  - Add composite indexes for common queries: `(user_id, created_at)`, `(deposit_status, slot)`
  - Create partial indexes for active bookings: `WHERE deposit_status = 'paid'`
  - Review slow queries using Supabase dashboard
  - Test: Run `EXPLAIN ANALYZE` on slow queries before/after
  - COMPLETED: Migration `20241218_comprehensive_security_hardening.sql` includes comprehensive indexes

- [ ] **Implement database connection pooling** (`src/lib/supabaseServer.ts`)
  - Priority: Medium
  - Configure Supabase connection pool size (default: 15)
  - Add retry logic for transient connection failures
  - Monitor connection usage via Supabase metrics
  - Test: Load test with 100 concurrent requests

### Authentication & Authorization

- [ ] **Implement session timeout handling** (`src/lib/getSession.ts`)
  - Priority: Medium
  - Detect expired sessions and redirect to /login
  - Add session refresh before expiration (sliding window)
  - Show "session expired" toast notification
  - Test: Set short session timeout and verify redirect

- [ ] **Add multi-factor authentication (MFA)** (Supabase Auth dashboard)
  - Priority: Low
  - Enable TOTP-based MFA in Supabase project settings
  - Create MFA enrollment flow for admin users
  - Add "Require MFA" toggle in admin settings page
  - Test: Enroll admin user and verify login flow

- [ ] **Audit admin access logs** (`src/app/(dash)/dashboard/audit/page.tsx`)
  - Priority: Medium
  - Query `audit_log` table for admin actions
  - Display recent admin logins, VIP code creations, user modifications
  - Add export to CSV functionality
  - Test: Perform admin action and verify audit entry

- [ ] **Add IP-based rate limiting** (`src/middleware.ts`)
  - Priority: High
  - Create Next.js middleware to check rate limits before route handlers
  - Use `public.check_rate_limit()` function from security hardening migration (AVAILABLE)
  - Block IPs exceeding 100 requests/minute
  - Test: Simulate rapid requests and verify 429 responses
  - NOTE: Database function exists, need to create middleware.ts file

---

## 🖥 Frontend & UI

### Booking Flow

- [ ] **Replace status polling with webhooks** (`src/components/StatusPanel.tsx`)
  - Priority: High
  - Remove `setInterval` polling pattern (lines 7-13)
  - Implement Server-Sent Events (SSE) endpoint: `/api/status/stream`
  - Subscribe to screening status updates via SSE
  - Add reconnection logic for dropped connections
  - Test: Monitor network tab for long-polling connection

- [ ] **Add booking flow progress persistence** (`src/lib/store.ts`)
  - Priority: Medium
  - Save Zustand state to localStorage on each step completion
  - Restore state on page reload
  - Add "Resume booking" CTA on homepage for partial flows
  - Handle expired sessions (clear stale state after 24 hours)
  - Test: Refresh page mid-flow and verify state restoration

- [ ] **Implement error boundaries** (`src/components/ErrorBoundary.tsx`)
  - Priority: High
  - Wrap booking flow pages with React error boundary
  - Display user-friendly error messages
  - Log errors to Supabase or external service (Sentry)
  - Add "Report issue" button for user feedback
  - Test: Throw error in component and verify boundary catches it

- [ ] **Add form validation feedback** (`src/components/Consent.tsx`, `src/components/IdCapture.tsx`)
  - Priority: Medium
  - Show real-time validation errors using React Hook Form
  - Add field-level help text and tooltips
  - Implement accessible error announcements (ARIA live regions)
  - Highlight invalid fields on submit
  - Test: Submit forms with invalid data and verify error messages

- [ ] **Optimize mobile responsiveness** (`src/app/intake/page.tsx`, etc.)
  - Priority: Medium
  - Test booking flow on mobile devices (iPhone, Android)
  - Fix layout issues in 7-step wizard on small screens
  - Ensure file upload works on mobile browsers
  - Add mobile-specific touch interactions
  - Test: Complete full booking flow on mobile device

### Admin Dashboard

- [x] **Implement dashboard KPI widgets** (`src/app/(dash)/dashboard/page.tsx`)
  - Priority: Medium
  - Query `security_dashboard` view for metrics
  - Display cards: Active Users, Pending Bookings, Revenue MTD, Active VIP Codes
  - Add date range picker for historical data
  - Cache query results (5-minute TTL)
  - Test: Verify metrics update when data changes
  - COMPLETED: Dashboard shows Total Users, VIP Codes, Invitations, Revenue with trends

- [x] **Add user search and filtering** (`src/app/(dash)/dashboard/users/page.tsx`)
  - Priority: Medium
  - Implement search by email, name, phone
  - Add filters: verification_status, screening_status, created_at range
  - Paginate results (20 per page)
  - Add "Export to CSV" button
  - Test: Search for user and verify results
  - COMPLETED: UI implemented with search, role filter, and user table with stats

- [x] **Create booking management interface** (`src/app/(dash)/dashboard/bookings/page.tsx`)
  - Priority: High
  - Display table: user, slot, deposit_status, interview_status, nda_signed
  - Add actions: Cancel booking, Issue refund, Reschedule interview
  - Implement booking detail modal with full history
  - Show payment details and DocuSign link
  - Test: Modify booking and verify database update
  - COMPLETED: Full UI with stats, filters, table, and action buttons (View/Edit/Delete)

- [ ] **Build VIP code analytics** (`src/app/(dash)/dashboard/codes/page.tsx`)
  - Priority: Low
  - Show redemption count, conversion rate, top codes
  - Display chart: redemptions over time
  - Add filters by role and date range
  - Test: Generate code, redeem it, verify analytics

- [ ] **Add content moderation dashboard** (`src/app/(dash)/dashboard/moderation/page.tsx`)
  - Priority: High (policy enforcement)
  - Display flagged booking notes or messages
  - Implement keyword detection for sexual service requests
  - Add "Ban user" action with reason
  - Log moderation actions to audit_log
  - Test: Flag booking and verify alert appears

---

## 🔒 Security & Compliance

### Security Hardening

- [x] **Implement API route authentication** (`src/app/api/**/route.ts`)
  - Priority: High
  - Add Supabase session verification to all protected routes
  - Return 401 Unauthorized if no valid session
  - Check admin access for admin-only routes using `isAdminEmail()`
  - Add request ID for logging
  - Test: Call API without auth header and verify 401
  - COMPLETED: VIP and invite routes implement session + admin checks

- [ ] **Add CORS configuration** (`next.config.ts`)
  - Priority: High
  - Restrict API origins to production domains only
  - Allow credentials for Supabase Auth cookies
  - Add OPTIONS preflight handling
  - Document allowed origins in `.env.local.example`
  - Test: Call API from unauthorized origin and verify CORS error

- [ ] **Implement CSP headers** (`src/middleware.ts` or `next.config.ts`)
  - Priority: Medium
  - Set Content-Security-Policy header
  - Allow: self, Supabase CDN, Stripe.js, Google Fonts
  - Block inline scripts (use nonce for allowed scripts)
  - Test: Check browser console for CSP violations

- [ ] **Add request signature verification** (`src/lib/webhook-verify.ts`)
  - Priority: High
  - Create utility for Stripe signature verification
  - Add signature checks for Onfido, Checkr, DocuSign webhooks
  - Reject requests with invalid signatures (return 401)
  - Log verification failures to audit_log
  - Test: Send webhook with invalid signature and verify rejection

- [ ] **Implement secrets rotation policy** (Supabase + Stripe dashboards)
  - Priority: Medium
  - Rotate Supabase service role key quarterly
  - Rotate Stripe API keys annually
  - Document rotation procedure in API_KEY_SECURITY_GUIDE.md
  - Test: Update keys and verify application still functions

### Compliance & Legal

- [ ] **Create FCRA adverse action workflow** (`src/app/api/screening/adverse-action/route.ts`)
  - Priority: High
  - Send pre-adverse action notice within 3 days of screening result
  - Include copy of background check and FCRA rights summary
  - Wait 7 business days before final adverse action
  - Send final notice with reason and contact information
  - Test: Trigger workflow with flagged screening result

- [ ] **Implement PII data retention policy** (`supabase/functions/cleanup-pii/index.ts`)
  - Priority: High (GDPR/CCPA)
  - Auto-delete user data 90 days after booking completion
  - Anonymize: email → `deleted_user_XXXXX@example.com`, phone → `NULL`
  - Retain booking records for financial auditing (7 years)
  - Provide "Delete my data" user request endpoint
  - Test: Run cleanup job and verify data anonymization

- [ ] **Add terms of service acceptance tracking** (`users` table)
  - Priority: Medium
  - Add `tos_accepted_at` and `tos_version` columns
  - Require acceptance before booking flow
  - Log acceptance to audit_log
  - Show TOS update notification when version changes
  - Test: Update TOS version and verify re-acceptance flow

- [ ] **Create data export endpoint** (`src/app/api/users/export/route.ts`)
  - Priority: Medium (GDPR right to data portability)
  - Return user's full data as JSON: profile, bookings, payments
  - Include verification and screening results
  - Require email confirmation before export
  - Rate limit: 1 export per 24 hours per user
  - Test: Request export and verify JSON structure

- [ ] **Implement consent management** (`src/components/ConsentManager.tsx`)
  - Priority: Medium
  - Add granular consent options: marketing, analytics, data sharing
  - Store consent preferences in `users` table
  - Respect consent settings in email campaigns
  - Provide "Manage consent" link in dashboard
  - Test: Update consent and verify preferences saved

### Monitoring & Logging

- [ ] **Set up error tracking** (Sentry or similar)
  - Priority: High
  - Install Sentry SDK: `npm install @sentry/nextjs`
  - Configure DSN in `.env.local`
  - Track: API errors, client exceptions, webhook failures
  - Set up alerts for critical errors (email/Slack)
  - Test: Trigger error and verify Sentry alert

- [ ] **Implement application logging** (`src/lib/logger.ts`)
  - Priority: High
  - Create structured logging utility (JSON format)
  - Log: API requests, auth events, booking state changes
  - Include: timestamp, user_id, request_id, level
  - Stream logs to external service (Datadog, Papertrail)
  - Test: Make API call and verify log entry

- [ ] **Add uptime monitoring** (UptimeRobot or Pingdom)
  - Priority: High
  - Monitor: `/api/health`, `/api/db/health`, main pages
  - Set up: 1-minute intervals, 5-minute alert threshold
  - Configure alert channels: email, SMS, Slack
  - Test: Stop dev server and verify alert

- [ ] **Create performance monitoring** (`src/middleware.ts`)
  - Priority: Medium
  - Track API route response times
  - Log slow queries (>2 seconds) to console
  - Add performance metrics to dashboard
  - Set alerts for response time degradation
  - Test: Add artificial delay and verify alert

---

## 🧪 Testing & QA

### Unit & Integration Tests

- [ ] **Add API route tests** (`tests/api/*.spec.ts`)
  - Priority: High
  - Test: `/api/vip/create`, `/api/vip/redeem`, `/api/invites/create`
  - Mock Supabase client responses
  - Verify: 200 responses, correct data structure, error handling
  - Test admin access controls (401 for non-admin)
  - Test: `pnpm run test:api`

- [ ] **Add component unit tests** (`src/components/*.test.tsx`)
  - Priority: Medium
  - Test: `<Consent />`, `<IdCapture />`, `<DepositForm />`
  - Mock: API calls, file uploads, form submissions
  - Verify: validation errors, loading states, success flows
  - Test: `pnpm run test:unit`

- [ ] **Add Zustand store tests** (`src/lib/store.test.ts`)
  - Priority: Medium
  - Test: state updates, step progression, reset logic
  - Verify: consent → IDV → deposit → screening flow
  - Test persistence to localStorage
  - Test: `pnpm run test:store`

- [ ] **Create webhook integration tests** (`tests/webhooks/*.spec.ts`)
  - Priority: High
  - Test: Stripe, Onfido, Checkr, DocuSign webhook handlers
  - Verify: signature validation, database updates, error handling
  - Use test payloads from vendor documentation
  - Test: `pnpm run test:webhooks`

### End-to-End Tests

- [ ] **Expand E2E test coverage** (`tests/e2e/booking-flow.spec.ts`)
  - Priority: High
  - Test full booking flow: intake → verify → deposit → screening → interview → contracts → confirmation
  - Verify: form validation, API calls, database updates, email notifications
  - Use Playwright's visual regression testing
  - Test: `pnpm run test:e2e`

- [x] **Add admin dashboard E2E tests** (`tests/e2e/admin.spec.ts`)
  - Priority: Medium
  - Test: login, VIP code creation, booking management, user search
  - Verify: admin-only access, data CRUD operations
  - Test: `pnpm run test:e2e:admin`
  - COMPLETED: 12 comprehensive tests covering sidebar, navigation, dashboard KPIs, user menu

- [ ] **Create mobile E2E tests** (`tests/e2e/mobile.spec.ts`)
  - Priority: Medium
  - Test booking flow on iPhone and Android viewports
  - Verify: touch interactions, file uploads, form submissions
  - Use Playwright's device emulation
  - Test: `pnpm run test:e2e:mobile`

### Load & Performance Testing

- [ ] **Implement load testing** (`tests/load/booking-flow.k6.js`)
  - Priority: Medium
  - Use k6 or Artillery for load testing
  - Simulate: 100 concurrent users completing booking flow
  - Measure: response times, error rates, database performance
  - Set targets: p95 < 2s, error rate < 1%
  - Test: `k6 run tests/load/booking-flow.k6.js`

- [x] **Add bundle size monitoring** (`package.json`)
  - Priority: Low
  - Configure `@next/bundle-analyzer` (already installed)
  - Set bundle size budget: < 300KB initial load
  - Add CI check to fail on bundle size increase >10%
  - Test: `pnpm run analyze`
  - COMPLETED: @next/bundle-analyzer installed, script available

---

## 🚀 Deployment & DevOps

### CI/CD Pipeline

- [ ] **Create GitHub Actions workflow** (`.github/workflows/ci.yml`)
  - Priority: High
  - Steps: Install deps → Lint → Type check → Build → Test → Deploy
  - Run on: push to main, pull requests
  - Cache: pnpm store, Next.js build cache
  - Test: Push to branch and verify workflow runs

- [ ] **Add pre-commit hooks** (`package.json` + `husky`)
  - Priority: Medium
  - Install: `npm install husky lint-staged`
  - Run: lint, type check, format on staged files
  - Block commit if checks fail
  - Test: Commit with lint error and verify block

- [ ] **Set up staging environment** (Vercel)
  - Priority: High
  - Deploy: Preview deployments on PR creation
  - Configure: Separate Supabase project for staging
  - Environment: `.env.staging` with test API keys
  - Test: Create PR and verify preview deployment

- [ ] **Configure production environment** (Vercel)
  - Priority: High
  - Set environment variables in Vercel dashboard
  - Enable: Vercel Analytics, Speed Insights
  - Configure: Custom domain, SSL certificate
  - Test: Deploy to production and verify functionality

### Infrastructure

- [ ] **Set up CDN caching** (Vercel Edge Network)
  - Priority: Medium
  - Cache: Static assets, public pages (`/`, `/learn`, `/vetting`)
  - Add `Cache-Control` headers for API routes
  - Configure stale-while-revalidate for dynamic content
  - Test: Check `X-Vercel-Cache` header in response

- [ ] **Implement database connection pooling** (Supabase)
  - Priority: Medium
  - Configure Supabase connection pooler (PgBouncer)
  - Use transaction mode for API routes
  - Set max connections per environment (staging: 5, prod: 50)
  - Test: Monitor connection usage in Supabase dashboard

- [ ] **Add database read replicas** (Supabase Pro plan)
  - Priority: Low
  - Configure read replica for analytics queries
  - Route: Read-heavy dashboard queries to replica
  - Keep writes on primary database
  - Test: Verify query distribution via Supabase metrics

### Monitoring & Alerting

- [ ] **Configure production monitoring** (Vercel + Sentry)
  - Priority: High
  - Set up: Error tracking, performance monitoring, uptime checks
  - Configure alerts: Email, Slack, PagerDuty
  - Set thresholds: Error rate >1%, response time >3s, uptime <99.9%
  - Test: Trigger error in production and verify alert

- [ ] **Create runbook for incidents** (`docs/RUNBOOK.md`)
  - Priority: High
  - Document: Common issues, debugging steps, contact information
  - Include: Database recovery, API key rotation, rollback procedure
  - Test: Simulate incident and verify runbook accuracy

- [ ] **Set up log aggregation** (Datadog, LogDNA, or Papertrail)
  - Priority: Medium
  - Aggregate: Vercel logs, Supabase logs, error logs
  - Create dashboards: Request volume, error rates, slow queries
  - Set up alerts: 5xx errors, slow API routes
  - Test: Search logs for specific request ID

---

## 📚 Documentation & Cleanup

### Documentation

- [ ] **Update API documentation** (`docs/API.md`)
  - Priority: Medium
  - Document: All API routes, request/response formats, error codes
  - Add: Example cURL commands, TypeScript types
  - Include: Authentication requirements, rate limits
  - Test: Follow docs to make API call manually
  - NOTE: CLAUDE.md has comprehensive docs, need standalone API.md

- [ ] **Create developer onboarding guide** (`docs/ONBOARDING.md`)
  - Priority: Medium
  - Steps: Clone repo, install deps, configure env vars, run migrations
  - Include: Common issues, troubleshooting tips, VS Code setup
  - Add: First task suggestions for new contributors
  - Test: Follow guide on fresh machine

- [ ] **Document deployment process** (`docs/DEPLOYMENT.md`)
  - Priority: High
  - Steps: Build → Test → Deploy → Verify → Monitor
  - Include: Rollback procedure, emergency contacts
  - Add: Environment variable checklist
  - Test: Deploy following documentation

- [ ] **Add JSDoc comments** (`src/lib/*.ts`, `src/app/api/**/route.ts`)
  - Priority: Low
  - Add: Function descriptions, parameter types, return values
  - Include: Usage examples for complex utilities
  - Generate: API docs using TypeDoc
  - Test: `npx typedoc --out docs/api src/lib`

### Code Cleanup

- [ ] **Remove unused dependencies** (`package.json`)
  - Priority: Low
  - Identify: Unused packages via `npx depcheck`
  - Remove: Test thoroughly after removal
  - Update: Lock file with `pnpm install`
  - Test: `pnpm run build` succeeds after removal

- [ ] **Consolidate Supabase clients** (`src/lib/supabase*.ts`)
  - Priority: Medium
  - Currently 5 client files: `supabase.ts`, `supabaseBrowser.ts`, `supabaseServer.ts`, `supabaseAdmin.ts`, `getSession.ts`
  - Create: Single `src/lib/supabase/index.ts` with exports for each context
  - Update: All imports to use new unified module
  - Test: Verify auth flows still work

- [ ] **Refactor admin access checks** (`src/app/api/**/route.ts`)
  - Priority: Medium
  - Create: Middleware or HOF for admin route protection
  - Replace: Inline `isAdminEmail()` checks with middleware
  - Standardize: Error responses (401 Unauthorized, 403 Forbidden)
  - Test: Call admin route without admin email

- [ ] **Remove TODO comments** (various files)
  - Priority: Low
  - Files: `src/app/api/stripe/webhook/route.ts`, `src/app/api/identity/start/route.ts`, etc.
  - Replace: TODO with implemented functionality
  - Track: Outstanding TODOs in this file
  - Test: `grep -r "TODO" src/` returns empty

- [ ] **Optimize font loading** (`src/lib/fonts.ts`)
  - Priority: Low
  - Current: Loads fonts from Google Fonts CDN (requires network)
  - Option 1: Self-host fonts in `public/fonts/`
  - Option 2: Use Vercel Font Optimization
  - Test: Verify fonts load correctly in production

---

## 🎯 Nice-to-Have Features

### User Experience

- [ ] **Add booking cancellation flow** (`src/app/bookings/[id]/cancel/page.tsx`)
  - Priority: Low
  - Allow users to cancel bookings with 48-hour notice
  - Implement cancellation policy (forfeit deposit if <48 hours)
  - Send cancellation confirmation email
  - Test: Cancel booking and verify refund logic

- [ ] **Create booking history page** (`src/app/bookings/page.tsx`)
  - Priority: Low
  - Show user's past and upcoming bookings
  - Display: date, creator, status, documents
  - Add "Rebook" button for past bookings
  - Test: Navigate to bookings and verify data

- [ ] **Add referral program** (`src/app/api/referrals/create/route.ts`)
  - Priority: Low
  - Generate unique referral codes per user
  - Track referrals and conversions
  - Offer credit for successful referrals ($50 per booking)
  - Test: Share referral code and verify tracking

### Admin Tools

- [ ] **Build bulk email tool** (`src/app/(dash)/dashboard/email/page.tsx`)
  - Priority: Low
  - Select users by filters (verified, pending, etc.)
  - Compose email with template variables
  - Preview before sending
  - Test: Send test email to admin

- [ ] **Add financial reporting** (`src/app/(dash)/dashboard/reports/page.tsx`)
  - Priority: Low
  - Generate reports: Revenue, Refunds, Deposits held
  - Export to CSV or PDF
  - Date range filtering
  - Test: Generate report for last month

- [ ] **Create system health dashboard** (`src/app/(dash)/dashboard/health/page.tsx`)
  - Priority: Low
  - Display: Database status, API health, external service status
  - Show: Supabase connection count, Stripe API status
  - Add: Manual health check trigger
  - Test: View dashboard and verify metrics

---

## 📋 Pre-Launch Checklist

### Security Audit

- [ ] **Run security audit** (`npm audit`)
  - Fix: All high/critical vulnerabilities
  - Review: Medium vulnerabilities for false positives
  - Test: `npm audit --production`

- [ ] **Perform penetration testing**
  - Test: SQL injection, XSS, CSRF, authentication bypass
  - Use: OWASP ZAP or Burp Suite
  - Document: Findings and remediation

- [ ] **Review Supabase RLS policies**
  - Verify: All tables have appropriate policies
  - Test: Access data as different user roles
  - Check: No data leakage across users

### Performance Optimization

- [ ] **Optimize images** (`public/` directory)
  - Use: Next.js Image component with optimization
  - Compress: PNG/JPG using ImageOptim or similar
  - Add: Lazy loading for below-fold images
  - Test: Lighthouse performance score >90

- [ ] **Minimize bundle size**
  - Analyze: `pnpm run analyze`
  - Code split: Large dependencies
  - Remove: Unused imports via ESLint
  - Test: Initial load <300KB

- [ ] **Enable production caching**
  - Cache: Static assets (1 year)
  - Cache: API responses (5 minutes)
  - Add: CDN edge caching
  - Test: Verify `Cache-Control` headers

### Compliance Review

- [ ] **Legal review of terms**
  - Review: Terms of Service, Privacy Policy, NDA template
  - Update: With legal counsel
  - Add: Cookie consent banner

- [ ] **GDPR/CCPA compliance check**
  - Verify: Data export endpoint works
  - Test: Data deletion workflow
  - Add: Privacy policy links on all forms

- [ ] **FCRA compliance verification**
  - Review: Adverse action workflow
  - Test: Pre-adverse and final notices send correctly
  - Document: Compliance procedures for audit

### Go-Live Tasks

- [ ] **Configure production domains**
  - Set up: Custom domain in Vercel
  - Configure: DNS records (A, CNAME)
  - Enable: SSL certificate
  - Test: Visit production domain

- [ ] **Enable production monitoring**
  - Set up: Sentry, Uptime monitoring
  - Configure: Alert thresholds
  - Test: Trigger test alert

- [ ] **Train support team**
  - Document: Common issues, admin dashboard usage
  - Create: Support playbook
  - Test: Support team handles test scenarios

- [ ] **Create launch announcement**
  - Write: Blog post, email announcement
  - Prepare: Social media posts
  - Schedule: Launch date and time

---

## 🎯 Quick Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm run dev              # Start dev server
pnpm run build            # Production build
pnpm run start            # Serve production build

# Quality Checks
pnpm run lint             # ESLint check
pnpm run typecheck        # TypeScript validation
pnpm run build:full       # Typecheck + Build

# Testing
pnpm run test:auth        # Auth smoke tests
pnpm run test:smoke       # Generated smoke tests
pnpm run test:e2e         # E2E admin tests
pnpm run test:all         # All tests
pnpm run test:ui          # Visual test debugging
pnpm run verify:all       # Full validation suite

# Database
pnpm run db:types         # Generate TypeScript types
pnpm run db:verify        # Verify DB connection
supabase db push          # Apply migrations
supabase db reset         # Reset local DB (destructive)

# Utilities
pnpm run audit            # Project audit
pnpm run audit:routes     # Route audit + scaffold
pnpm run smoke            # Generate smoke tests
pnpm run analyze          # Bundle size analysis
```

---

## 📊 Progress Tracking

**Completed**: ~75%
**Remaining**: ~25%

### By Category
- 🔴 External Integrations: 20% (Stripe partial, 0/4 vendors complete - Onfido, Checkr, DocuSign, Calendly all stubbed)
- 🧱 Core Infrastructure: 85% (database/auth/RLS complete, PII cleanup pending)
- 🖥 Frontend & UI: 80% (admin dashboard complete with KPIs, users, bookings, codes)
- 🔒 Security & Compliance: 60% (RLS/audit/rate-limiting DB functions done, middleware pending)
- 🧪 Testing & QA: 50% (smoke + admin E2E done, booking flow E2E needed)
- 🚀 Deployment & DevOps: 30% (staging ready, CI/CD pending)
- 📚 Documentation: 70% (comprehensive CLAUDE.md, TESTING.md, architecture docs exist)

### Critical Path to Launch
1. Complete Stripe webhook (1 week)
2. Integrate Onfido IDV (2 weeks)
3. Integrate Checkr screening (2 weeks)
4. Integrate DocuSign contracts (1 week)
5. Implement FCRA compliance (1 week)
6. Add E2E test coverage (1 week)
7. Security audit & penetration testing (1 week)
8. Production deployment & monitoring (3 days)

**Estimated Time to Launch**: 8-10 weeks

---

## 🆘 Priority Legend

- **High**: Blocking launch, security-critical, or revenue-impacting
- **Medium**: Important for user experience, not launch-blocking
- **Low**: Nice-to-have, can be addressed post-launch

---

Last updated: October 11, 2025
