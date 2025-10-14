> See **AGENTS.md** for contributor rules.

# Cabana Management Platform

[![CI Status](https://github.com/YOUR_ORG/cabanamgmt/workflows/CI/badge.svg)](https://github.com/YOUR_ORG/cabanamgmt/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)

Premium creator management platform for secure, vetted, compliant bookings focused on promotional appearances, brand representation, and companionship services.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Testing**: Playwright + Vitest

## Quick Start

### Prerequisites

- Node.js 20.x (see `.nvmrc`)
- pnpm 10.15.1+
- Supabase account

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Setup database
supabase login
supabase link --project-ref dotfloiygvhsujlwzqgv
supabase db push

# Start development server
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development

### Available Commands

```bash
# Development
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run start        # Serve production build

# Quality Checks
pnpm run lint         # Run ESLint
pnpm run typecheck    # TypeScript validation
pnpm run verify:fast  # Quick verification (lint + typecheck)
pnpm run build:full   # Full build with typecheck

# Testing
pnpm run test:auth    # Authentication tests
pnpm run test:smoke   # Smoke tests
pnpm run test:e2e     # End-to-end tests
pnpm run test:ui      # Interactive test UI
pnpm run verify:all   # Full validation suite

# Database
pnpm run db:types     # Generate TypeScript types
pnpm run db:verify    # Verify DB connection
```

### Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (dash)/      # Dashboard route group
│   ├── api/         # API routes
│   └── ...
├── components/       # React components
│   ├── system/      # Error boundaries, etc.
│   ├── layout/      # Layout components
│   └── ui/          # UI primitives
├── lib/             # Utilities and helpers
└── types/           # TypeScript types

docs/                # Documentation
tests/               # Playwright tests
scripts/             # Build and utility scripts
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete project architecture and development guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[docs/TESTING.md](./docs/TESTING.md)** - Testing guide
- **[INTEGRATIONS.md](./INTEGRATIONS.md)** - External API integration specs

## Features

### Completed (75%)

- ✅ Core infrastructure (database, auth, payments)
- ✅ Admin dashboard with KPIs
- ✅ VIP code and invitation system
- ✅ User management
- ✅ Booking management
- ✅ Error handling and loading states
- ✅ Security headers and middleware
- ✅ Accessibility improvements
- ✅ CI/CD pipeline

### In Progress (25%)

- ⏳ External vendor integrations (Onfido, Checkr, DocuSign)
- ⏳ Webhook handlers
- ⏳ E2E test coverage
- ⏳ Performance optimizations

## CI/CD

GitHub Actions automatically runs on push and PR:

1. **Lint** - ESLint validation
2. **TypeCheck** - TypeScript compilation
3. **Build** - Production build test

All checks must pass before merging.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick checklist:**
- Run `pnpm run verify:fast` before committing
- Follow commit message format
- Update tests and documentation
- Avoid editing `/api/*` routes without approval

## License

Private - All rights reserved

## Support

- Review [CLAUDE.md](./CLAUDE.md) for architecture
- Check existing issues
- Create new issue for bugs/features
