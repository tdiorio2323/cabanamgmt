import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.TEST_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_PASSWORD || process.env.ADMIN_PASSWORD;

test('@auth requires login', async ({ page }) => {
  await page.goto(`${BASE_URL}/invites/revoke`);
  await expect(page).toHaveURL(/login/);
});

test.describe('@smoke revoke invite flow', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'TEST_EMAIL/TEST_PASSWORD not configured');

  test('@smoke revoke invite flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL!);
    await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    await page.goto(`${BASE_URL}/invites/revoke`);
    await page.getByTestId('revoke-email').fill('user@example.com');
    await page.getByTestId('revoke-submit').click();
    await expect(page.getByRole('status')).toContainText(/Invite revoked|No pending invite/i);
  });
});
