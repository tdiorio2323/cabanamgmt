# CABANA Management Platform - Architecture Diagram

## Best-Practice Architecture Overview

```mermaid
flowchart TB
  U[User] --> B[Browser]
  B --> N[Next.js App (App Router, TS, Tailwind)]

  subgraph App (src/app)
    N --> Pages[[Public Pages<br/>/, /learn, /deposit, /verify, /contracts, /invite/[code], /screening, /vetting, /intake, /interview, /deposits, /login]]
    N --> Dash[[(dash)/dashboard/*<br/>/bookings, /codes, /deposits, /invites, /settings, /users, /vetting]]
    N --> Layout[layout.tsx + globals.css + fonts]
  end

  N -->|fetch| API[/Route Handlers (src/app/api/*)/]

  subgraph API Routes
    API --> IDStart[/identity/start/route.ts/]
    API --> IDHook[/identity/webhook/route.ts/]
    API --> ScrStart[/screening/start/route.ts/]
    API --> ScrHook[/screening/webhook/route.ts/]
    API --> StripeDep[/stripe/create-deposit/route.ts/]
    API --> StripeHook[/stripe/webhook/route.ts/]
    API --> ContractsMake[/contracts/create/route.ts/]
    API --> ContractsHook[/contracts/webhook/route.ts/]
    API --> Interview[/interview/schedule/route.ts/]
    API --> Invites[/invites/{create,list,accept,revoke}/route.ts/]
    API --> VIP[/vip/{create,list,redeem}/route.ts/]
    API --> Users[/users/create/route.ts/]
    API --> Health[/db/health/route.ts/]
  end

  subgraph Server Logic (src/lib)
    Ctrl[Route Controllers] --> Svc[Domain Services]
    Svc --> Repo[db.ts + schema.ts (Zod)]
    Svc --> StripeSDK[stripe.ts]
    Svc --> Auth[getSession.ts + isAdminEmail.ts]
    N --> Store[store.ts (Zustand)]
    N --> UI[components/* + components/ui/*]
    Repo --> SBClient[supabase.ts / supabaseServer.ts / supabaseAdmin.ts]
  end

  subgraph Supabase
    SB[(Supabase JS Client)]
    PG[(Postgres + RLS)]
    ST[(Storage)]
    AUTH[(Auth)]
  end

  SBClient --> SB
  SB --> PG
  SB --> ST
  SB --> AUTH

  StripeSDK --> STR[(Stripe)]
  IDStart --> IDP[(ID Provider)]
  IDHook --> IDP
  ScrStart --> ScrP[(Screening Provider)]
  ScrHook --> ScrP

  CI[CI: lint, typecheck, test] --> Deploy[Vercel]
  Deploy --> N
```## Architecture Principles & Best Practices

### 1. **Separation of Concerns**

- **Frontend**: Pure UI components and client-side state management
- **API Layer**: Route handlers with business logic delegation
- **Service Layer**: Domain-specific services in `/lib`
- **Data Layer**: Typed database operations with Zod validation

### 2. **Type Safety**

- Full TypeScript coverage with strict mode
- Zod schemas for runtime validation
- Generated Supabase types for database operations
- Type-safe API routes and responses

### 3. **Security by Design**

- Row Level Security (RLS) policies in Supabase
- Admin email verification system
- Secure webhook handling with signature validation
- Environment variable management for secrets

### 4. **Scalable State Management**

- Zustand for client-side state (booking flow)
- Server-side session management via Supabase Auth
- Optimistic updates for better UX

### 5. **Testing & Quality Assurance**

- Playwright for end-to-end testing
- ESLint + TypeScript for code quality
- Automated smoke tests for critical paths
- Manual QA documentation for complex flows

### 6. **Performance Optimization**

- Next.js App Router for optimal loading
- Turbopack for fast development builds
- Image optimization and font loading
- Edge deployment via Vercel

## Business Context & Requirements

### **Cabana Management Group Platform**
Premium creator management platform for secure, vetted, compliant bookings focused on promotional appearances, brand representation, and companionship services.

### **7-Step Verification Pipeline**
1. **Entry Point** → Creator bio link to booking portal
2. **Intake & Consent** → Full name, ID upload, selfie capture, consent
3. **Identity Verification** → ID authenticity, face match, liveness detection (Onfido/Veriff)
4. **Deposit & Payment** → Non-refundable deposit via Stripe
5. **Background Screening** → Criminal records, sex offender registry (Checkr/Certn)
6. **Video Interview** → 5-minute management vetting call
7. **Contract Signing** → NDA + service agreement (DocuSign)
8. **Final Confirmation** → Booking slot released after all verifications

## Compliance & Security Framework

### **Legal Safeguards**
- **Service Positioning**: "Promotional appearances, brand representation, companionship"
- **FCRA Compliance**: Pre-adverse action notices for background check denials
- **Data Protection**: Encrypted at rest, 30-90 day retention, GDPR considerations
- **Audit Trail**: Complete logging (IP, device, timestamp, signed docs)

### **Security Implementation**
- Row Level Security (RLS) policies in Supabase
- Webhook signature verification (Stripe + HMAC)
- Rate limiting and DDoS protection
- SOC 2 Type II compliance via vendor selection

## Key Business Workflows

### **User Verification Journey**

```text
Creator Link → Intake Form → ID Verification → Deposit Payment
→ Background Check → Video Interview → Contract Signing → Booking Confirmed
```

### **Admin Management Dashboard**

- User pipeline management with status tracking
- FCRA-compliant adverse action notice system
- VIP invitation code management
- Comprehensive audit logging for compliance
- Performance metrics and conversion tracking

### **Revenue & Compliance Model**

- **Non-refundable deposits** to ensure commitment
- **Escrow system** via Stripe Connect
- **Complete paper trail** for legal protection
- **Zero tolerance** policy violations

## Production Readiness Assessment

### **Current Implementation Status: ~75%**

✅ **Core Infrastructure**: Database, auth, payment processing, UI/UX
✅ **Security Hardening**: RLS policies, webhook verification, encryption
✅ **Legal Framework**: Terms of service, privacy policy, compliance docs

⏳ **Pending Integrations**: Onfido/Veriff, Checkr/Certn, DocuSign
⏳ **Testing**: Comprehensive test coverage beyond current smoke tests
⏳ **Production Setup**: Live vendor configurations and monitoring

### **Next Engineering Priorities**

1. **External Service Integration** → Connect identity verification and screening providers
2. **FCRA Compliance Implementation** → Automated adverse action notice system
3. **Email Notification System** → Postmark/Resend for booking pipeline communications
4. **Production Hardening** → Monitoring, error tracking, performance optimization
5. **Comprehensive Testing** → End-to-end testing of full verification pipeline

This architecture supports a premium, compliant booking platform with enterprise-grade security and legal protections suitable for high-value creator management services.
