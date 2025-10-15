import { test, expect } from '@playwright/test';

test.describe('Admin KPIs E2E', () => {
  test.beforeEach(async ({ page }) => {
    const adminEmail = process.env.TEST_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_PASSWORD || 'password';

    if (!adminEmail || !adminPassword) {
      test.skip();
      return;
    }

    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('dashboard KPIs render correctly @e2e', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for main KPI cards
    const kpiSelectors = [
      'text=/total.*booking/i',
      'text=/revenue|earnings/i',
      'text=/users|creators/i',
      'text=/pending|active/i',
    ];

    for (const selector of kpiSelectors) {
      await expect(
        page.locator(selector).first()
      ).toBeVisible({ timeout: 5000 });
    }

    // Verify numeric values display
    const numbers = page.locator('text=/\\$\\d+|\\d+/');
    await expect(numbers.first()).toBeVisible();
  });

  test('bookings page displays table @e2e', async ({ page }) => {
    await page.goto('/dashboard/bookings');

    // Check for bookings table or empty state
    await expect(
      page.locator('table').or(page.locator('text=/no bookings|empty/i'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('users page displays list @e2e', async ({ page }) => {
    await page.goto('/dashboard/users');

    // Check for users table or cards
    await expect(
      page.locator('table').or(page.locator('[data-testid="user-card"]')).or(page.locator('text=/no users/i'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('deposits page shows financial data @e2e', async ({ page }) => {
    await page.goto('/dashboard/deposits');

    // Check for deposit information
    await expect(
      page.locator('text=/deposit|payment|\\$/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('codes page shows VIP management @e2e', async ({ page }) => {
    await page.goto('/dashboard/codes');

    // Check for VIP code UI
    await expect(
      page.locator('text=/vip.*code|generate|create/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('invite page shows invitation management @e2e', async ({ page }) => {
    await page.goto('/dashboard/invite');

    // Check for invite creation form
    await expect(
      page.locator('input[name="email"]').or(page.locator('text=/create.*invite/i'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('navigation sidebar works @e2e', async ({ page }) => {
    await page.goto('/dashboard');

    // Check sidebar exists
    const sidebar = page.locator('nav').or(page.locator('[data-testid="sidebar"]'));
    await expect(sidebar.first()).toBeVisible();

    // Click on different nav items
    const navItems = [
      'text=/bookings/i',
      'text=/users/i',
      'text=/deposits/i',
    ];

    for (const item of navItems) {
      const link = page.locator(item).first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');
        // Verify URL changed
        await expect(page).toHaveURL(/dashboard/);
      }
    }
  });
});

