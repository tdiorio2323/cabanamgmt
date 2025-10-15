# Vendor Integration Guide - Cabana Management Group

## Integration Overview

This document provides the complete implementation guide for all third-party vendors integrated into the booking platform. Each vendor serves a specific purpose in the 7-step verification process.

## 1. Stripe - Payment Processing

### Purpose
Secure collection of non-refundable deposits and booking payments with escrow functionality.

### Installation
```bash
npm install stripe @stripe/stripe-js
```

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### Implementation

#### Server-Side Integration (API Route)
```typescript
// src/app/api/stripe/create-deposit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { amount, userId } = await req.json();
    
    const intent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      capture_method: "automatic",
      metadata: { 
        purpose: "booking_deposit",
        user_id: userId 
      },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      intentId: intent.id
    });
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
```

#### Webhook Handler
```typescript
// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      // Update booking status in database
      await supabase
        .from("bookings")
        .update({ deposit_status: "paid" })
        .eq("payment_intent_id", paymentIntent.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
```

#### Client-Side Integration
```typescript
// src/components/DepositForm.tsx
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function DepositForm() {
  // Implementation for payment form with Stripe Elements
}
```

## 2. Onfido - Identity Verification

### Purpose
ID document verification, selfie matching, and liveness detection for user authentication.

### Installation
```bash
npm install @onfido/api
```

### Environment Variables
```bash
ONFIDO_API_TOKEN=onfido_live_xxx
```

### Implementation

#### Server-Side Integration
```typescript
// src/app/api/identity/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Onfido, Region } from "@onfido/api";

const onfido = new Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN!,
  region: Region.US
});

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, userId } = await req.json();
    
    // Create applicant
    const applicant = await onfido.applicant.create({
      first_name: firstName,
      last_name: lastName,
    });

    // Create check
    const check = await onfido.check.create({
      applicant_id: applicant.id,
      report_names: ["document", "facial_similarity_photo", "liveness"]
    });

    return NextResponse.json({
      applicantId: applicant.id,
      checkId: check.id,
      status: "pending"
    });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
```

#### Webhook Handler
```typescript
// src/app/api/identity/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    
    if (event.payload.resource_type === "check" && event.payload.action === "check.completed") {
      const checkId = event.payload.object.id;
      const result = event.payload.object.result;
      
      // Update user verification status
      await supabase
        .from("users")
        .update({ verification_status: result === "clear" ? "passed" : "failed" })
        .eq("onfido_check_id", checkId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
```

## 3. Checkr - Background Screening

### Purpose
Comprehensive background checks including criminal records and sex offender registry searches.

### Installation
No official NPM package - use REST API with fetch/axios.

### Environment Variables
```bash
CHECKR_API_KEY=checkr_live_xxx
```

### Implementation

#### Server-Side Integration
```typescript
// src/app/api/screening/start/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, dob, ssn } = await req.json();
    
    // Create candidate
    const candidateResponse = await fetch("https://api.checkr.com/v1/candidates", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHECKR_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        dob: dob,
        ssn: ssn
      })
    });

    const candidate = await candidateResponse.json();

    // Request report
    const reportResponse = await fetch("https://api.checkr.com/v1/reports", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CHECKR_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        candidate_id: candidate.id,
        package: "tasker_standard"
      })
    });

    const report = await reportResponse.json();

    return NextResponse.json({
      candidateId: candidate.id,
      reportId: report.id,
      status: "pending"
    });
  } catch (error) {
    return NextResponse.json({ error: "Screening failed" }, { status: 500 });
  }
}
```

#### Webhook Handler
```typescript
// src/app/api/screening/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    
    if (event.type === "report.completed") {
      const report = event.data;
      
      // Update user screening status
      await supabase
        .from("users")
        .update({ 
          screening_status: report.status,
          report_reference: report.id
        })
        .eq("checkr_candidate_id", report.candidate_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
```

## 4. DocuSign - Document Signing

### Purpose
Generate and manage NDAs and booking agreements with electronic signatures.

### Installation
```bash
npm install docusign-esign
```

### Environment Variables
```bash
DOCUSIGN_INTEGRATOR_KEY=xxx
DOCUSIGN_USER_ID=xxx
DOCUSIGN_ACCOUNT_ID=xxx
DOCUSIGN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

### Implementation

#### Server-Side Integration
```typescript
// src/app/api/contracts/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import docusign from "docusign-esign";

const jwtConfig = {
  iss: process.env.DOCUSIGN_INTEGRATOR_KEY,
  sub: process.env.DOCUSIGN_USER_ID,
  aud: "account-d.docusign.com",
  scope: "signature"
};

export async function POST(req: NextRequest) {
  try {
    const { clientName, clientEmail, bookingDetails } = await req.json();
    
    // Initialize DocuSign client
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath("https://demo.docusign.net/restapi");
    
    // Generate JWT token for authentication
    const results = await dsApiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATOR_KEY!,
      process.env.DOCUSIGN_USER_ID!,
      "signature",
      Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY!),
      3600
    );
    
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + results.body.access_token);
    
    // Create envelope with NDA template
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const envelope = {
      emailSubject: "Cabana Management Group - Booking Agreement",
      templateId: "your-template-id-here",
      templateRoles: [{
        email: clientEmail,
        name: clientName,
        roleName: "Client"
      }],
      status: "sent"
    };

    const envelopeResult = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_ACCOUNT_ID!,
      { envelopeDefinition: envelope }
    );

    return NextResponse.json({
      envelopeId: envelopeResult.envelopeId,
      signingUrl: `https://demo.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=${envelopeResult.envelopeId}`
    });
  } catch (error) {
    return NextResponse.json({ error: "Contract creation failed" }, { status: 500 });
  }
}
```

## 5. Supabase - Database & Storage

### Purpose
Primary database for user data, booking records, and secure file storage.

### Installation
```bash
npm install @supabase/supabase-js
```

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Database Setup

#### SQL Schema
```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  license_id TEXT,
  verification_status TEXT CHECK (verification_status IN ('pending','passed','failed')) DEFAULT 'pending',
  screening_status TEXT CHECK (screening_status IN ('pending','clear','consider','adverse')) DEFAULT 'pending',
  consent_signed BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  onfido_applicant_id TEXT,
  onfido_check_id TEXT,
  checkr_candidate_id TEXT,
  report_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID,
  deposit_amount INTEGER NOT NULL,
  deposit_status TEXT CHECK (deposit_status IN ('pending','paid','refunded','forfeited')) DEFAULT 'pending',
  payment_intent_id TEXT,
  interview_status TEXT CHECK (interview_status IN ('pending','scheduled','completed','failed')) DEFAULT 'pending',
  interview_slot TIMESTAMPTZ,
  interview_notes TEXT,
  nda_signed BOOLEAN DEFAULT false,
  nda_envelope_id TEXT,
  booking_confirmed BOOLEAN DEFAULT false,
  booking_date TIMESTAMPTZ,
  service_type TEXT,
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  performed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_users_screening_status ON users(screening_status);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_deposit_status ON bookings(deposit_status);
CREATE INDEX idx_bookings_interview_slot ON bookings(interview_slot);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Row Level Security Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Bookings visible to owner" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage all data" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service can manage bookings" ON bookings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

#### Client Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side client with service role (for API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

## 6. Email Notifications

### Purpose
Send booking confirmations, screening notifications, and compliance notices.

### Recommended Vendors

#### Option A: Postmark (High Deliverability)
```bash
npm install postmark
```

#### Option B: Resend (Developer-Friendly)
```bash
npm install resend
```

### Implementation Example (Resend)
```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(clientEmail: string, bookingDetails: any) {
  await resend.emails.send({
    from: "bookings@cabanamanagement.com",
    to: clientEmail,
    subject: "Booking Confirmation - Cabana Management Group",
    html: `
      <h1>Booking Confirmed</h1>
      <p>Your booking has been confirmed for ${bookingDetails.date}</p>
      <p>Meeting details will be sent 24 hours before your appointment.</p>
    `
  });
}

export async function sendAdverseActionNotice(clientEmail: string, reason: string) {
  // FCRA-compliant adverse action notice
  await resend.emails.send({
    from: "compliance@cabanamanagement.com",
    to: clientEmail,
    subject: "Background Check Results - Cabana Management Group",
    html: `
      <h1>Background Check Results</h1>
      <p>We regret to inform you that your application was not approved based on information in your background report.</p>
      <p>Reason: ${reason}</p>
      <p>You have the right to obtain a free copy of your report and dispute any inaccurate information.</p>
    `
  });
}
```

## Integration Testing Checklist

### Stripe Testing
- [ ] Test deposits with test card numbers
- [ ] Verify webhook signature validation
- [ ] Test refund scenarios
- [ ] Validate metadata storage

### Onfido Testing  
- [ ] Test with sample ID documents
- [ ] Verify liveness detection
- [ ] Test webhook event handling
- [ ] Validate error scenarios

### Checkr Testing
- [ ] Use Checkr test environment
- [ ] Test various report outcomes
- [ ] Verify FCRA compliance flows
- [ ] Test webhook reliability

### DocuSign Testing
- [ ] Test envelope creation
- [ ] Verify template functionality
- [ ] Test signing completion events
- [ ] Validate document storage

### Supabase Testing
- [ ] Test RLS policies
- [ ] Verify data encryption
- [ ] Test backup/restore procedures
- [ ] Validate performance under load

---

*Next: See Compliance & Legal Requirements document for regulatory details*