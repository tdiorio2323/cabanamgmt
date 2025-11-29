# Safe View-Only Demo Mode

This project includes a "Demo Mode" that allows you to run the application in a safe, view-only state without connecting to any external services (Supabase, Stripe, etc.) or requiring real environment variables.

## Purpose

The Demo Mode is designed for:
- Screen-sharing the platform to potential partners or investors.
- Testing the UI/UX without needing a full backend setup.
- Running the app in a completely isolated environment.

## How It Works

When Demo Mode is enabled:
1.  **Auth Bypass**: The app treats every visitor as an authenticated "Demo Admin". No login is required.
2.  **Data Mocking**: All data is served from a local mock dataset (`src/lib/demo-data.ts`). No real database queries are made.
3.  **Service Isolation**: External services like Stripe, Onfido, Checkr, and DocuSign are mocked or disabled. No network calls are made to these vendors.
4.  **View-Only**: All mutating actions (create, update, delete) are no-ops. The UI may appear to perform the action, but no data is changed.

## How to Run

You can run the demo mode locally with a single environment variable.

### Prerequisites
- Node.js and pnpm installed.

### Command

```bash
NEXT_PUBLIC_DEMO_MODE=true pnpm dev
```

### Accessing the Demo

Once the server is running (usually at `http://localhost:3000`), navigate to:

**[http://localhost:3000/demo](http://localhost:3000/demo)**

This route will redirect you to the main dashboard, populated with demo data.

## Demo Data

The demo data includes:
- **Talent**: Sample creator profiles with various statuses.
- **Bookings**: Sample bookings in requested, confirmed, and completed states.
- **Clients**: Sample brand profiles.

You can modify `src/lib/demo-data.ts` to add or change the sample data.

## Safety Guarantees

When `NEXT_PUBLIC_DEMO_MODE=true`, the following protections are in place:

### Auth & Session
- **Middleware** (`src/middleware.ts`): Bypasses all auth checks
- **Dashboard Layout** (`src/app/(dash)/layout.tsx`): Auto-authorizes as "Demo Admin"
- **No login required**: Direct access to all dashboard routes

### Data Layer
- **Supabase Browser Client** (`src/lib/supabaseBrowser.ts`): Uses mock client
- **Supabase Server Client** (`src/lib/supabaseServer.ts`): Uses mock client
- **Supabase Admin Client** (`src/lib/supabaseAdmin.ts`): Uses mock client
- **No DB Writes**: All `insert`, `update`, `delete` methods are no-ops in mock
- **Demo Data**: Served from `src/lib/demo-data.ts`

### External Services
- **Stripe** (`src/lib/stripe.ts`): Mocked - no payment processing
- **Email/Resend** (`src/lib/email.ts`): Skipped - logs only, no emails sent
- **Webhooks**: All webhook endpoints return 200 OK without processing

### API Routes
- **Demo Handler** (`src/lib/demoMode.ts`): Intercepts all API calls
- **No External Calls**: Zero network requests to Supabase, Stripe, Onfido, Checkr, DocuSign
- **Safe Responses**: All API routes return mock success responses

### Environment Variables
- **Zero Dependencies**: App runs with ONLY `NEXT_PUBLIC_DEMO_MODE=true`
- **No Required Keys**: Supabase, Stripe, Resend keys are optional in demo mode
- **Graceful Fallbacks**: Missing env vars don't throw errors
