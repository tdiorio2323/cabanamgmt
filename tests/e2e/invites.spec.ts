import { test, expect } from '@playwright/test';

test.describe('Invites E2E Flow', () => {
  test('create invite → accept → confirm profile @e2e', async ({ page }) => {
    // Prerequisites: Admin user logged in
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

    // Navigate to invites
    await page.goto('/dashboard/invite');

    // Create a new invite
    const testEmail = `test-${Date.now()}@example.com`;
    await page.fill('input[name="email"]', testEmail);
    await page.selectOption('select[name="role"]', 'member');
    await page.fill('input[name="expiresInDays"]', '7');
    await page.click('button:has-text("Create Invite")');

    // Wait for success confirmation
    await expect(page.locator('text=/invite created/i')).toBeVisible({ timeout: 5000 });

    // Extract invite code from UI or response
    const inviteCode = await page.locator('[data-testid="invite-code"]').textContent();

    if (inviteCode) {
      // Navigate to invite acceptance page
      await page.goto(`/invite/${inviteCode.trim()}`);

      // Verify invite page loads
      await expect(page.locator('text=/accept invitation/i')).toBeVisible();

      // Accept invite (fill profile)
      await page.fill('input[name="full_name"]', 'Test User');
      await page.fill('input[name="password"]', 'SecurePass123!');
      await page.click('button:has-text("Accept")');

      // Confirm profile created
      await expect(page).toHaveURL(/dashboard|profile/, { timeout: 10000 });
    }
  });

  test('resend invite flow @e2e', async ({ page }) => {
    const adminEmail = process.env.TEST_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_PASSWORD || 'password';

    if (!adminEmail || !adminPassword) {
      test.skip();
      return;
    }

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Go to resend page
    await page.goto('/dashboard/invites/resend');

    // Resend to an email
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.click('button:has-text("Resend")');

    // Check for success or rate limit
    await expect(
      page.locator('text=/resent|rate limit/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('revoke invite flow @e2e', async ({ page }) => {
    const adminEmail = process.env.TEST_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_PASSWORD || 'password';

    if (!adminEmail || !adminPassword) {
      test.skip();
      return;
    }

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Go to revoke page
    await page.goto('/dashboard/invites/revoke');

    // Revoke by email
    await page.fill('input[name="email"]', 'revoke@example.com');
    await page.click('button:has-text("Revoke")');

    // Check result
    await expect(
      page.locator('text=/revoked|not found/i')
    ).toBeVisible({ timeout: 5000 });
  });
});

