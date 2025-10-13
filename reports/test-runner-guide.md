# Functional Test Runner Guide

Quick reference for running functional tests on the Cabana admin dashboard.

## Prerequisites

1. **Dev server running**: `pnpm run dev`
2. **Browsers installed**: `pnpm exec playwright install` (one-time)

## Running Tests

### Smoke Tests Only (Routes + APIs)
```bash
# Use default BASE_URL from .env.local
pnpm run smoke

# Or specify custom base URL
BASE_URL=http://localhost:3002 pnpm run smoke
```

**Output**: ASCII table showing pass/fail for each route and API endpoint

### E2E Tests Only (Admin UI Interaction)
```bash
# Configure credentials first
cp .env.test.local.example .env.test.local
# Edit .env.test.local with TEST_EMAIL and TEST_PASSWORD

# Run e2e tests
BASE_URL=http://localhost:3002 pnpm run test:e2e
```

**Output**: Playwright test report with detailed pass/fail for each scenario

### Full Functional Test Suite
```bash
# Run both smoke + e2e tests
BASE_URL=http://localhost:3002 pnpm run test:functional
```

## Test Reports

After running tests, check:
- `reports/smoke-results.json` - Machine-readable smoke test data
- `reports/functional-summary.md` - Human-readable summary report

## Quick Validation

To quickly verify the admin dashboard is working:
```bash
# Start dev server
pnpm run dev

# In another terminal, run smoke tests
pnpm run smoke
```

Expected: 13+ passed, 0-1 warnings, 0 failures
