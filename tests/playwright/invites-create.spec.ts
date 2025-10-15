import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.TEST_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_PASSWORD || process.env.ADMIN_PASSWORD;

test('@auth requires login', async ({ page }) => {
  await page.goto(`${BASE_URL}/invites/new`);
  await expect(page).toHaveURL(/login/);
});

test.describe('@smoke create invite flow', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'TEST_EMAIL/TEST_PASSWORD not configured');

  test('@smoke create invite', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL!);
    await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    await page.goto(`${BASE_URL}/invites/new`);
    await page.getByTestId('create-form').getByPlaceholder('user@example.com').fill(`user+${Date.now()}@example.com`);
    await page.getByTestId('create-submit').click();
    await expect(page.getByRole('status')).toContainText(/Invite created|Pending invite already exists/i);
  });
});
