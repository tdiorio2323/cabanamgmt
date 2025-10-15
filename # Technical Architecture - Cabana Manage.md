# Technical Architecture - Cabana Management Group Platform

## Technology Stack

### Frontend Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling  
- **shadcn/ui** component library

### Backend & Database
- **Supabase** for database, auth, and file storage
- **PostgreSQL** as primary database
- **Next.js API Routes** for backend logic

### State Management
- **Zustand** for client-side state
- **Zod** for schema validation
- **React Hook Form** for form handling

## Development Environment

### Required Dependencies
```bash
npm install zustand zod react-hook-form @hookform/resolvers date-fns
npm install stripe @stripe/stripe-js
npm install @supabase/supabase-js
npm install sonner clsx tailwind-merge
npm install @onfido/api
npm install docusign-esign
```

### Environment Configuration
```bash
# Core App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Identity Verification
ONFIDO_API_TOKEN=onfido_live_xxx
VERIFF_API_TOKEN=veriff_live_xxx

# Background Screening
CHECKR_API_KEY=checkr_live_xxx
CERTN_API_KEY=certn_live_xxx

# Document Signing
DOCUSIGN_INTEGRATOR_KEY=xxx
DOCUSIGN_USER_ID=xxx
DOCUSIGN_ACCOUNT_ID=xxx
DOCUSIGN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...

# Email (Optional)
POSTMARK_API_KEY=xxx
RESEND_API_KEY=xxx
```

## Application Architecture

### Route Structure
```
src/app/
├── layout.tsx              # Root layout with branding
├── page.tsx                # Landing page
├── intake/page.tsx         # Step 1: Consent & Intake
├── verify/page.tsx         # Step 2: ID + Liveness  
├── deposit/page.tsx        # Step 3: Deposit Payment
├── screening/page.tsx      # Step 4: Background Check
├── interview/page.tsx      # Step 5: Video Interview
├── contracts/page.tsx      # Step 6: NDA + Terms
└── confirmation/page.tsx   # Step 7: Booking Confirmed
```

### API Routes
```
src/app/api/
├── identity/
│   ├── start/route.ts      # Initialize ID verification
│   └── webhook/route.ts    # Handle verification results
├── screening/
│   ├── start/route.ts      # Start background check  
│   └── webhook/route.ts    # Process screening results
├── stripe/
│   ├── create-deposit/route.ts  # Create payment intent
│   └── webhook/route.ts    # Handle payment events
├── contracts/
│   ├── create/route.ts     # Generate DocuSign envelope
│   └── webhook/route.ts    # Handle signing completion  
└── interview/
    └── schedule/route.ts   # Schedule video call slot
```

### Component Structure
```
src/components/
├── Stepper.tsx            # Progress indicator
├── Consent.tsx            # Intake form + consent
├── IdCapture.tsx          # ID upload + selfie
├── DepositForm.tsx        # Stripe payment element
├── StatusPanel.tsx        # Screening status display
├── VideoPick.tsx          # Interview scheduling
└── ContractViewer.tsx     # DocuSign embed
```

### Data Layer
```
src/lib/
├── store.ts              # Zustand state management
├── schema.ts             # Zod validation schemas
├── stripe.ts             # Stripe client config
└── supabase.ts           # Supabase client config
```

## Database Schema

### Core Tables
```sql
-- Users table
users (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date,
  license_id text,
  verification_status text CHECK (verification_status IN ('pending','passed','failed')),
  screening_status text CHECK (screening_status IN ('pending','clear','consider','adverse')),
  consent_signed boolean DEFAULT false,
  consent_timestamp timestamptz,
  report_reference text,
  created_at timestamptz DEFAULT now()
);

-- Bookings table  
bookings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  creator_id uuid,
  deposit_amount integer,
  deposit_status text CHECK (deposit_status IN ('pending','paid','refunded','forfeited')),
  payment_intent_id text,
  interview_status text CHECK (interview_status IN ('pending','scheduled','completed','failed')),
  interview_slot timestamptz,
  nda_signed boolean DEFAULT false,
  nda_envelope_id text,
  booking_confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit log for compliance
audit_log (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
```

## Security Considerations

### Data Protection
- All PII encrypted at rest in Supabase
- File uploads stored in secure Supabase Storage buckets
- Row Level Security (RLS) policies on all tables
- API routes protected with proper authentication

### Compliance Requirements
- FCRA compliance for background checks
- GDPR considerations for international users
- SOC 2 compliance via vendor selection
- Regular security audits and penetration testing

### Access Controls
- Role-based permissions (admin, staff, viewer)
- API rate limiting to prevent abuse
- Webhook signature verification for all vendors
- Comprehensive audit logging

## Performance Optimization

### Frontend
- Static page generation where possible
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CDN deployment via Vercel

### Backend  
- Database query optimization with proper indexing
- Caching strategies for frequently accessed data
- Background job processing for long-running tasks
- Monitoring and alerting via Supabase dashboard

## Deployment Strategy

### Development Environment
```bash
npm run dev              # Local development server
npm run build           # Production build
npm run lint           # ESLint checking
npm run type-check    # TypeScript validation
```

### Production Deployment
- **Platform**: Vercel (optimal Next.js integration)
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Supabase Dashboard
- **Error Tracking**: Sentry integration

### Environment Promotion
1. Development → Staging → Production
2. Separate Supabase projects per environment
3. Vendor sandbox → live API key promotion
4. Comprehensive testing at each stage

---

*Next: See Vendor Integration Guide for API implementation details*