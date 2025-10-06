# Route Auditing & Testing System

## Overview

This system provides automated route discovery, scaffolding, and smoke testing for the Cabana Management Platform.

## Components

### 1. Route Specification (`docs/route-spec.json`)

Central registry of all expected public routes in the application:

- Public pages that should exist
- Dynamic routes with parameter patterns
- Excludes authenticated dashboard routes (handled by route groups)
- Excludes API routes and route handlers

### 2. Audit & Scaffold Script (`scripts/audit-and-scaffold.mjs`)

Automated tooling that:

- ✅ Discovers missing routes by comparing spec against filesystem
- ✅ Handles Next.js route groups (checks `(dash)` group for dashboard routes)
- ✅ Scaffolds minimal placeholder pages with glassy design
- ✅ Generates Playwright smoke tests automatically
- ✅ Runs build validation to catch conflicts

### 3. Generated Smoke Tests (`tests/smoke.generated.spec.ts`)

Playwright tests that verify:

- All public routes load without error
- Dynamic routes work with example parameters
- Basic page structure exists (no crashes)
- Handles redirects gracefully

## Usage

### Audit Routes

```bash
npm run audit:routes
```

This will:

1. Check all routes in the specification
2. Create placeholder pages for missing routes
3. Generate new smoke tests
4. Run a build to verify everything works

### Run Smoke Tests

```bash
# Run just smoke tests
npm run test:smoke

# Run all tests including smoke tests
npm run test:all

# Interactive test runner
npm run test:ui
```

### Add New Routes

1. Add route to `docs/route-spec.json`
2. Run `npm run audit:routes` to scaffold placeholder
3. Replace placeholder with actual implementation
4. Smoke tests are automatically generated

## File Structure

```
docs/
  route-spec.json          # Central route registry
  ROUTE_AUDITING.md        # This documentation
scripts/
  audit-and-scaffold.mjs   # Main auditing script
tests/
  smoke.generated.spec.ts  # Auto-generated smoke tests
  auth.spec.ts            # Manual authentication tests
```

## Benefits

- **Prevents missing routes** - Automatically detects and scaffolds placeholders
- **Reduces 404 errors** - Ensures all specified routes exist
- **Speeds development** - Quick scaffolding with consistent design
- **Improves reliability** - Smoke tests catch basic breakages
- **Maintains consistency** - Central route specification
- **Supports CI/CD** - Automated validation in build process

## Implementation Notes

- Placeholders use the global glassy design system
- Dynamic routes are tested with example parameters
- Route groups are properly detected (e.g., `(dash)/dashboard/*`)
- Build validation catches conflicts between routes and API handlers
- Smoke tests focus on basic functionality, not authentication flows
