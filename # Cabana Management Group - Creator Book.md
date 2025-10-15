# Cabana Management Group - Creator Booking Platform

## Business Overview

**Company**: Cabana Management Group  
**Purpose**: High-tier creator management platform for secure, vetted, compliant bookings  
**Services**: Promotional appearances, brand representation, companionship bookings  

## Brand Identity

- **Visual Identity**: Chrome/iridescent "CABANA" wordmark with luxury tropical elements
- **Positioning**: Exclusive, controlled, modern luxury
- **Tone**: Safety, exclusivity, and professionalism above all
- **Differentiator**: Full verification + screening pipeline (ID, deposit, background check, interview, NDA)

## Core Business Flow

### 7-Step Booking Process

1. **Entry Point** → Link in creator's bio takes user to booking portal
2. **Intake & Consent** → Form with full name, license upload, selfie capture, consent checkbox
3. **Identity Verification** → ID authenticity check, face match (selfie ↔ ID), liveness detection
4. **Deposit & Payment** → Stripe payment gateway for non-refundable deposit
5. **Background Screening** → Criminal record checks, sex offender registry searches (FCRA compliant)
6. **Video Interview** → 5-minute video call for final vetting by management
7. **Contract Signing** → NDA + service agreement auto-generated via DocuSign
8. **Final Confirmation** → Booking slot released after all verifications complete

## Compliance & Safety Framework

### Legal Safeguards
- **Service Positioning**: Always frame as "promotional appearances, brand representation, companionship" 
- **Never Position As**: Escort services or anything suggesting sexual services
- **Privacy Protection**: All sensitive files encrypted at rest, limited access, 30-90 day retention
- **Paper Trail**: Complete audit trail (IP, device, timestamp, deposit proof, signed docs)

### Verification Requirements
- **Identity**: ID scan + facial liveness detection via Onfido/Veriff
- **Background**: Criminal record + sex offender registry via Checkr/Certn
- **Consent**: Digital signature required for all screening processes
- **FCRA Compliance**: Pre-adverse action notices for background check denials

### Data Protection
- **Storage**: Encrypted at rest, minimal retention windows
- **Access**: Limited staff access to sensitive verification data  
- **Compliance**: GDPR considerations for international users
- **Audit**: Complete logging of all access and modifications

## Revenue Model

- **Deposit Structure**: Non-refundable deposit required upfront to show commitment
- **Booking Fees**: Service fees for completed bookings
- **Escrow System**: Stripe Connect with clear release/forfeit rules
- **Refund Policy**: Deposits only refundable if screening fails on platform side

## Success Metrics

- **Conversion Rate**: Intake → Final booking confirmation
- **Screening Pass Rate**: Background check approval percentage
- **No-Show Rate**: Confirmed bookings vs. actual attendance
- **Creator Satisfaction**: Rating system for client behavior
- **Compliance Score**: Zero tolerance for policy violations

---

*Next: See Technical Architecture document for implementation details*