# Demo Mode – Partner Preview

## Overview

Demo Mode provides a **safe, isolated environment** for showcasing the Cabana Management platform to potential partners without requiring any external services or credentials.

## Quick Start

### Running Locally

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Start the development server in Demo Mode
NEXT_PUBLIC_DEMO_MODE=true pnpm dev

# 3. Open your browser
http://localhost:3000/demo
```

The application will automatically:
- Bypass all authentication
- Load simulated demo data
- Disable all external service calls
- Show a clear "Demo Mode" banner

## What's Included

### Demo Data
- **8 Talent Profiles** - Realistic creator profiles across different categories (Nightlife, Brand Campaigns, Events)
- **12 Bookings** - Mix of statuses: Confirmed, Pending, Requested, Completed, Cancelled
- **5 Clients** - Sample brands and organizations across different industries
- **KPI Metrics** - Revenue tracking, booking analytics, talent verification stats

### Feature Showcases
- Talent management dashboard
- Booking workflow and status tracking
- Client relationship management
- Verification and compliance workflows
- Admin controls and system monitoring

## Safety Guarantees

When `NEXT_PUBLIC_DEMO_MODE=true` is set:

### ✅ No External Services
- **No Supabase** - All database queries return mocked data
- **No Stripe** - Payment processing is stubbed
- **No Email/Resend** - Email sending is logged, not sent
- **No Webhooks** - All webhook endpoints return success without processing
- **No API Calls** - Zero network requests to external services

### ✅ No Credentials Required
- Runs with ONLY the `NEXT_PUBLIC_DEMO_MODE` environment variable
- No Supabase keys, Stripe keys, or other service credentials needed
- Missing environment variables do not cause errors

### ✅ View-Only Mode
- All create/update/delete operations are no-ops
- UI remains interactive but no data is persisted
- Changes are silently ignored or show friendly demo messages

### ✅ No Authentication
- Login bypassed automatically
- Direct access to all dashboard routes
- Session management disabled

## Architecture

### Data Layer (`src/lib/demo-data.ts`)
Static, in-memory dataset with realistic talent, booking, and client records.

### Service Mocks
- `src/lib/supabaseMock.ts` - Mock Supabase client with query support
- `src/lib/supabaseBrowser.ts` - Auto-switches to mock in demo mode
- `src/lib/supabaseServer.ts` - Auto-switches to mock in demo mode
- `src/lib/supabaseAdmin.ts` - Auto-switches to mock in demo mode
- `src/lib/stripe.ts` - Returns stub Stripe client in demo mode
- `src/lib/email.ts` - Skips email sending in demo mode

### Middleware (`src/middleware.ts`)
Intercepts ALL API routes and returns appropriate demo responses.

### UI Components
- Demo mode banner clearly indicates simulated environment
- All navigation and routing fully functional
- Professional, polished interface

## Partner Demo Walkthrough

When presenting to partners, highlight:

1. **Dashboard Overview** - Quick snapshot of platform KPIs and activity
2. **Talent Management** - Browse talent profiles, verification statuses, categories
3. **Booking Workflow** - See different booking states and lifecycle management
4. **Client Relationships** - Track brand partnerships and project history
5. **Admin Controls** - Platform health, user management, system monitoring

## Production vs Demo

| Feature | Production | Demo Mode |
|---------|-----------|-----------|
| Authentication | Supabase Auth | Bypassed |
| Database | PostgreSQL via Supabase | In-memory mock |
| Payments | Live Stripe | Stubbed |
| Emails | Resend API | Logged only |
| Data Persistence | Full CRUD | View-only |
| External APIs | Live webhooks | No-ops |
| Env Variables | Required | Only demo flag |

## Troubleshooting

**App won't start?**
- Ensure `NEXT_PUBLIC_DEMO_MODE=true` is set
- Check that `pnpm install` completed successfully

**Seeing empty data?**
- Verify you're accessing `/demo` route
- Check browser console for any errors
- Ensure demo flag is correctly set

**Authentication issues?**
- Demo mode should bypass all auth - if you see login screens, the flag may not be set correctly

## Notes

- Demo data is completely fictional - no real names, emails, or venues
- All dollar amounts and metrics are simulated
- Demo mode is for presentation purposes only
- Never use demo mode in production deployments
