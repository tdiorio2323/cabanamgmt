# Playwright Testing Setup

## 🎭 Overview

Automated end-to-end testing for the Cabana Management authentication system using Playwright.

## 🚀 Quick Start

### 1. Start Development Server

```bash
pnpm run dev
# Keep this running in separate terminal
```

### 2. Configure Test Environment

```bash
# Copy and update test credentials
cp .env.test.local .env.test.local.example
```

Edit `.env.test.local`:

```bash
# UI under test
APP_URL=http://localhost:3000

# Supabase test user (must already exist and be confirmed)
TEST_EMAIL=your-test-admin@example.com
TEST_PASSWORD=yourSecurePassword123

# Make sure your .env.local includes TEST_EMAIL in ADMIN_EMAILS
# ADMIN_EMAILS=your-test-admin@example.com,tyler@tdstudiosny.com
```

### 3. Run Tests

```bash
# Run auth smoke tests
pnpm run test:auth

# Run with visual UI (great for debugging)
pnpm run test:ui

# Run all tests
pnpm exec playwright test
```

## 🧪 Test Coverage

### Authentication Flow Tests

- **Login → Dashboard Redirect**: Verifies email/password login redirects to dashboard
- **Session Persistence**: Confirms authentication survives page reloads
- **Password Reset Flow**: Tests forgot password triggers Supabase recovery endpoint
- **Admin Access Control**: Validates admin users see admin-only UI elements

### Test Strategy

- **Smoke Tests**: Core authentication flows that must always work
- **Real Browser Testing**: Uses actual Chromium for genuine user interactions
- **Environment Isolation**: Tests run against local dev server with test credentials
- **Network Validation**: Monitors actual Supabase API calls for 200 responses

## 📋 Prerequisites

### Required Setup

1. **Test User Account**: Create a Supabase user with confirmed email
2. **Admin Access**: Add test email to `ADMIN_EMAILS` environment variable
3. **Development Server**: `pnpm run dev` must be running on port 3000
4. **Browser Installation**: Run `npx playwright install` if needed

### Test User Creation

```bash
# Create test user in Supabase Dashboard or via CLI
# Make sure the email is confirmed/verified
# Add the email to ADMIN_EMAILS in .env.local
```

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- **Base URL**: Configurable via `APP_URL` environment variable
- **Browsers**: Currently Chromium (WebKit/iPhone testing available)
- **Traces**: Captured on first retry for debugging
- **Screenshots**: Taken on test failures

### Environment Variables

- `APP_URL`: Target application URL (default: <http://localhost:3000>)
- `TEST_EMAIL`: Valid Supabase user email for testing
- `TEST_PASSWORD`: Password for test user account

## 🐛 Troubleshooting

### Common Issues

**Tests Skip with "TEST_EMAIL/TEST_PASSWORD not set"**

```bash
# Update .env.test.local with valid credentials
TEST_EMAIL=your-actual-email@example.com
TEST_PASSWORD=your-actual-password
```

**Connection Refused Errors**

```bash
# Make sure dev server is running
pnpm run dev
# Wait for "Ready" message before running tests
```

**Admin Test Fails**

```bash
# Ensure TEST_EMAIL is included in ADMIN_EMAILS
# In .env.local:
ADMIN_EMAILS=your-test-email@example.com,tyler@tdstudiosny.com
```

**Browser Installation Errors**

```bash
# Install missing browsers
npx playwright install

# Or install only Chromium
npx playwright install chromium
```

### Debug Mode

```bash
# Run with headed browser (visual)
pnpm exec playwright test --headed

# Run with debug mode (step through)
pnpm exec playwright test --debug

# Generate test report
pnpm exec playwright show-report
```

## 🔐 Security Notes

- **Test Credentials**: Never commit real credentials to version control
- **Environment Isolation**: Tests should only run against development/staging
- **Admin Testing**: Test admin functionality only with designated test accounts
- **Data Safety**: Ensure test database is separate from production

## 📈 Extending Tests

### Adding New Test Cases

1. Create new `.spec.ts` file in `/tests` directory
2. Follow existing patterns for authentication and navigation
3. Use Page Object Model for complex interactions
4. Add corresponding npm script to `package.json`

### Mobile Testing

```typescript
// Uncomment in playwright.config.ts after installing webkit
{ name: 'iphone-13', use: { ...devices['iPhone 13'] } }
```

### API Testing

```typescript
// Example: Test API endpoints directly
test('API health check', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
});
```

## 📊 CI/CD Integration

Ready for GitHub Actions, Vercel Build Checks, or other CI systems:

```yaml
# Example GitHub Action step
- name: Run E2E Tests
  run: |
    pnpm install
    pnpm run build
    pnpm run start &
    sleep 5
    pnpm run test:auth
```
