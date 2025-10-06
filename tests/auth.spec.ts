import { test, expect } from '@playwright/test';

const EMAIL = process.env.TEST_EMAIL!;
const PASSWORD = process.env.TEST_PASSWORD!;
const isSet = EMAIL && PASSWORD;

test.describe('Auth smoke', () => {
  test.skip(!isSet, 'TEST_EMAIL/TEST_PASSWORD not set in .env.test.local');

  test('Login → redirect → session persists across reload', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.getByPlaceholder(/email/i).fill(EMAIL);
    await page.getByPlaceholder(/password/i).fill(PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();

    // Expect redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);

    // Session persists after reload
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);

    // Optional: check user avatar or greeting exists
    // await expect(page.getByTestId('user-avatar')).toBeVisible();
  });

  test('Reset password triggers Supabase recover endpoint (200)', async ({ page }) => {
    await page.goto('/login');
    const reqPromise = page.waitForRequest(req =>
      req.url().includes('/auth/v1/recover') && req.method() === 'POST'
    );
    const resPromise = page.waitForResponse(res =>
      res.url().includes('/auth/v1/recover') && res.status() === 200
    );

    // Click "Forgot password" flow
    const forgot = page.getByRole('link', { name: /forgot password/i });
    if (await forgot.isVisible()) {
      await forgot.click();
    }

    // If reset UI is a modal or same page, adapt selectors:
    const emailInput = page.getByPlaceholder(/email/i);
    await emailInput.fill(EMAIL);
    await page.getByRole('button', { name: /send reset|reset/i }).click();

    await reqPromise;
    const res = await resPromise;
    expect(res.status()).toBe(200);

    // Optional toast assertion if present
    // await expect(page.getByText(/email sent|check your inbox/i)).toBeVisible();
  });

  test('Admin gate shows admin-only UI for admin email', async ({ page }) => {
    // Precondition: your .env(.local) has ADMIN_EMAILS including TEST_EMAIL
    // and your dashboard renders a clear admin-only element.
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill(EMAIL);
    await page.getByPlaceholder(/password/i).fill(PASSWORD);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Adjust selector to your admin-only marker
    const adminMarker = page.getByTestId('admin-only');
    await expect(adminMarker).toBeVisible();
  });
});
