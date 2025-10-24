# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Premium creator booking platform for Cabana Management Group with comprehensive 7-step verification pipeline for promotional appearances, brand representation, and companionship services.

**Tech Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + Stripe + Supabase + Framer Motion

**Status**: ~75% Complete (Q1 2025 launch target)
- ✅ Core infrastructure, database, auth, payments, UI/UX
- ⏳ External integrations (Onfido/Veriff, Checkr/Certn, DocuSign)

**Key Documentation**:
- `CLAUDE.md` (this file) - Architecture and development guide
- `CONTRIBUTING.md` - Contributor workflow and standards
- `AGENTS.md` - Repository conventions and coding style
- `docs/TESTING.md` - Playwright setup and testing guide
- `docs/architecture-diagram.md` - System architecture
- `docs/audit-history.md` - October 2025 non-API hardening audit
- `INTEGRATIONS.md` - Vendor integration specifications

## Development Commands

### Core Workflow

```bash
pnpm install          # Install dependencies (pnpm@10.15.1 required)
pnpm run dev          # Start dev server at localhost:3000
pnpm run build        # Production build (required before release)
pnpm run start        # Serve production build locally
pnpm run lint         # ESLint validation (must pass before PR)
pnpm run typecheck    # TypeScript type checking
pnpm run verify:fast  # Quick check: typecheck + lint (runs on pre-commit)
pnpm run build:full   # Full check: typecheck + build
pnpm run ci:verify    # Complete CI simulation: verify:fast + build + unit tests
```

**Pre-Commit Hooks**: Husky automatically runs `pnpm run verify:fast` before every commit, blocking commits with lint or type errors.

### Testing

```bash
# Vitest Unit Tests
pnpm run test            # Run all unit tests
pnpm run test -- --watch # Watch mode
pnpm run test -- --ui    # Browser UI

# Playwright E2E Tests (requires .env.test.local + running dev server)
pnpm run test:auth       # Authentication flow tests
pnpm run test:smoke      # Generated smoke tests
pnpm run test:e2e        # All E2E tests
pnpm run test:ui         # Interactive debugging UI
pnpm run verify:all      # Route audit + smoke tests
```

### Database

```bash
# Migrations
supabase login
supabase link --project-ref dotfloiygvhsujlwzqgv
supabase db push         # Apply all migrations

# Type Generation
pnpm run db:types        # Generate TypeScript types from schema
pnpm run db:watch        # Auto-regenerate on migration changes
pnpm run db:verify       # Verify connection and schema
pnpm run db:diff         # Check for schema drift
```

### Utilities

```bash
pnpm run analyze         # Bundle size analysis
pnpm run smoke           # Generate smoke test specs from routes
pnpm run seed:admin      # Seed admin user
pnpm run audit           # Project audit script
pnpm run audit:routes    # Route discovery and scaffolding
```

## Architecture

### Three-Track Application Structure

1. **Public Pages** (`/`, `/learn`, `/vetting`, `/deposits`)
   - Marketing and educational content
   - Luxury UI components: GlassCard, HeroLockup, PageHero, ChromeList, CTA

2. **7-Step Booking Flow** (`/intake` → `/verify` → `/deposit` → `/screening` → `/interview` → `/contracts` → `/confirmation`)
   - Zustand state management (`src/lib/store.ts`)
   - Zod validation schemas (`src/lib/schema.ts`)
   - React Hook Form + Stripe integration

3. **Admin Portal** (`/login`, `/dashboard/*`, `/admin/codes`)
   - Supabase Auth-protected
   - Route group: `(dash)/dashboard` with shared layout
   - Navigation: `src/components/layout/DashboardNav.tsx`
   - Admin access: `ADMIN_EMAILS` env var + `src/lib/isAdminEmail.ts`

**Additional Routes**:
- Auth: `/login`, `/signup`, `/reset-password`, `/auth/callback`
- Access codes: `/vip/[code]`, `/invite/[code]`
- Debug: `/debug/session` (dev only)

### State Management

- **Zustand** (`src/lib/store.ts`) - Global booking state across 7-step wizard
- **Zod** (`src/lib/schema.ts`) - Form validation schemas (consent, IDV, deposit)

### Database Schema

**Core Tables** (`supabase/migrations/0001_init.sql`):
- `users` - User profiles with verification_status, screening_status
- `bookings` - Booking records with deposit_status, interview_status, nda_signed

**VIP System** (`0003_vip.sql`, `0004_vip_helpers.sql`):
- `vip_codes` - Public promotional codes with usage limits and expiration
- `vip_redemptions` - Code redemption tracking
- RLS policies via `is_admin()` function

**Invitation System** (`0005_invites.sql`, `0006_invitations.sql`):
- `invites` - Internal admin-to-creator invitations with role-based access
- Helper functions in `src/lib/invites.ts`
- Dashboard UI at `/dashboard/invite`

**Two Access Systems**:
- **VIP Codes** (`/vip/[code]`) - Public promotional codes for external signups
- **Invites** (`/invite/[code]`) - Internal admin invitations for direct onboarding

### Supabase Client Patterns

Multiple clients for different contexts:
- `src/lib/supabase.ts` - Legacy browser client
- `src/lib/supabaseBrowser.ts` - SSR-compatible browser client
- `src/lib/supabaseServer.ts` - Server-side route handler client
- `src/lib/supabaseAdmin.ts` - Service role admin client
- `src/lib/getSession.ts` - Centralized session retrieval

### API Routes

**Production Routes**:
- `/api/health`, `/api/db/health` - Health checks
- `/api/users/create` - User account creation
- `/api/vip/*` - VIP code management (create, list, redeem)
- `/api/invites/*` - Invitation management (create, list, accept, revoke, resend, validate)
- `/api/stripe/create-deposit` - Stripe PaymentIntent creation

**Stubbed Routes** (need vendor SDK integration):
- `/api/identity/*` - Onfido/Veriff IDV + webhook
- `/api/screening/*` - Checkr/Certn background checks + webhook
- `/api/stripe/webhook` - Stripe event processing
- `/api/contracts/*` - DocuSign envelope handling + webhook
- `/api/interview/schedule` - Calendly/Google Calendar booking

**Route Handler Pattern**: Next.js 15 App Router conventions with async GET/POST handlers in `route.ts` files. Use `supabaseServer.ts` for server-side access and `supabaseAdmin.ts` for service role operations.

### Key Components

**Booking Flow**:
- `Stepper.tsx` - 7-step progress indicator
- `Consent.tsx` - React Hook Form + Zod validation
- `IdCapture.tsx` - ID + selfie file upload
- `DepositForm.tsx` - Stripe payment integration
- `StatusPanel.tsx` - Polling-based status checker (replace with webhooks)
- `VideoPick.tsx` - Calendly iframe embed
- `ContractViewer.tsx` - DocuSign redirect handler

**UI Library** (`src/components/ui`):
- Luxury components: `GlassCard.tsx`, `HeroLockup.tsx`, `PageHero.tsx`, `ChromeList.tsx`, `CTA.tsx`, `LiquidButton.tsx`
- shadcn/ui: `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `separator.tsx`, `tabs.tsx`, `tooltip.tsx`
- `dropdown-menu.tsx` - Radix UI primitive
- `AnimatedWrapper.tsx` - Framer Motion wrapper
- `HomeHeroAuth.tsx` - Authenticated homepage hero

**Layout**:
- `DashboardNav.tsx` - Admin navigation with user menu

### Key Utilities (`src/lib`)

**Auth & Access**:
- `isAdminEmail.ts` - Admin email validation
- `getSession.ts` - Centralized session retrieval

**Data**:
- `store.ts` - Zustand booking state
- `schema.ts` - Zod validation schemas
- `invites.ts` - Invitation helpers

**Supabase**:
- `supabase.ts`, `supabaseBrowser.ts`, `supabaseServer.ts`, `supabaseAdmin.ts` - Client patterns
- `supabaseMock.ts` - Testing mock

**External Services**:
- `stripe.ts` - Stripe configuration
- `crypto.ts` - Deterministic VIP code generation
- `email.ts` - Email utilities
- `webhooks.ts` - Webhook helpers

**Infrastructure**:
- `logger.ts` - Production-safe logging (dev only)
  ```typescript
  import { logger } from '@/lib/logger';
  logger.log('Debug:', data);
  logger.error('Error:', error);
  ```
- `securityHeaders.ts` - CSP and security headers
- `rateLimit.ts` - Rate limiting utilities
- `fonts.ts` - Google Fonts (Manrope, Cinzel, Ballet, Inter)

### Styling

- **Tailwind 4** with custom theme colors (`tailwind.config.ts`)
- **Marble background**: `public/lovable-uploads/td-studios-black-marble.png`
- **Global styles**: `src/app/globals.css`
- **Layout**: Centered max-width (5xl) with fixed background parallax
- **Accessibility**: Skip-to-content link, focus-visible styles, SR-only utilities, ARIA labels

## Environment Configuration

### Required Variables

```env
# Site URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase (required for auth, database, VIP codes)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Admin Access (required for /admin/codes and admin routes)
ADMIN_EMAILS=tyler@tdstudiosny.com,admin@example.com

# Stripe (required for deposit flow)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Optional Vendor Integrations

```env
# Identity Verification
ONFIDO_API_TOKEN=
VERIFF_API_TOKEN=

# Background Screening
CHECKR_API_KEY=
CERTN_API_KEY=

# DocuSign
DOCUSIGN_INTEGRATOR_KEY=
DOCUSIGN_USER_ID=
DOCUSIGN_ACCOUNT_ID=
DOCUSIGN_PRIVATE_KEY=

# Email
POSTMARK_API_KEY=
RESEND_API_KEY=
```

## Critical Implementation Notes

1. **Webhook Security**: All webhooks require signature verification before processing
2. **Admin Access**: Controlled by `ADMIN_EMAILS` env var + `is_admin()` Postgres function. Must match exactly (no extra spaces).
3. **VIP Codes**: Deterministic generation via `src/lib/crypto.ts` + RPC function `decrement_uses`
4. **Status Polling**: `StatusPanel.tsx` uses polling - replace with webhooks/SSE for production
5. **Content Moderation**: Zero-tolerance policy - implement before launch
6. **PII Retention**: Must purge per compliance (30-90 days) - implement CRON jobs
7. **FCRA Compliance**: Adverse action notices required for background check denials
8. **Deposit Logic**: Refund if screening fails, forfeit on no-show/violation, track via Stripe metadata
9. **Build Requirements**: Network access to fonts.googleapis.com required. For offline builds, download fonts to `public/fonts/` and update `src/lib/fonts.ts`.
10. **Background Image**: `public/lovable-uploads/td-studios-black-marble.png` must exist (no spaces in filename)

## Coding Standards

- **TypeScript**: 2-space indentation, trailing commas, strict mode + `noUncheckedIndexedAccess`
- **File Naming**: PascalCase for React components/hooks/stores (`Stepper.tsx`, `useBookingStore.ts`), lowercase-hyphenated for routes
- **Styling**: Prefer Tailwind utilities; use scoped CSS only when necessary
- **Imports**: Use `@/` prefix for absolute imports
- **Logging**: Use `logger` utility instead of `console` statements

## Testing Strategy

- **Unit Tests (Vitest)**: Component logic, utilities, hooks - fast, no network/DB
- **E2E Tests (Playwright)**: Full user flows, auth, booking wizard - requires running dev server
- **Smoke Tests**: Auto-generated from route structure to ensure all pages load

**Test Requirements**:
- Copy `.env.test.local.example` to `.env.test.local`
- Dev server must be running
- Test user must exist in Supabase and be in `ADMIN_EMAILS`

**Adding Tests**:
- Colocate unit tests: `*.test.tsx` next to source files
- E2E tests: Add to `/tests` directory
- Target critical flows: booking process, Supabase transforms, auth

## First-Time Setup

1. ✅ `pnpm install` (uses pnpm@10.15.1)
2. ✅ Copy `.env.local.example` to `.env.local`
3. ✅ Add Supabase credentials and set `ADMIN_EMAILS`
4. ✅ `supabase login && supabase link --project-ref dotfloiygvhsujlwzqgv`
5. ✅ `supabase db push`
6. ✅ Set admin emails in DB: `supabase db query "alter database postgres set app.admin_emails = 'your@email.com';"`
7. ✅ `pnpm run db:types`
8. ✅ Create test user in Supabase Dashboard (enable Email + Password auth)
9. ✅ `pnpm run dev`
10. ✅ Test: Visit localhost:3000, sign in, visit `/admin/codes` to generate VIP codes

**Optional Testing Setup**:
- Copy `.env.test.local.example` to `.env.test.local`
- Add test credentials matching an admin user
- Run `pnpm run test:auth` to verify

## Common Issues

- **Build fails with font errors**: Requires network access to fonts.googleapis.com or local font hosting
- **"Unauthorized" on admin pages**: Verify `ADMIN_EMAILS` matches database setting exactly
- **VIP codes fail to redeem**: Check migrations 0003 and 0004 ran successfully, RLS policies active
- **Auth redirects fail**: Ensure `http://localhost:3000` in Supabase allowed redirect URLs
- **TypeScript errors in dashboard**: Pre-existing errors in `environment/page.tsx:461` and `portfolio/page.tsx:301,324` - outside current scope

## Commit & PR Guidelines

**See**: `AGENTS.md` (repo conventions), `CONTRIBUTING.md` (full workflow)

**Quick Reference**:
- Commit format: `type: short summary` (independently revertible)
- PR must include: problem statement, solution, screenshots (UI changes), migration impacts, env var changes, issue links
- Pre-commit hook runs `verify:fast` automatically
- All CI checks must pass

## Reference Documents

- **AGENTS.md** - Module organization, coding style, naming, testing patterns
- **CONTRIBUTING.md** - Setup, commit conventions, branch naming, PR process
- **CLAUDE.md** (this file) - Architecture, commands, database, implementation notes
- **docs/audit-history.md** - October 2025 non-API hardening details
- **docs/TESTING.md** - Playwright setup and troubleshooting
- **INTEGRATIONS.md** - Vendor API specifications
