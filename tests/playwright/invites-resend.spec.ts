import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.TEST_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_PASSWORD || process.env.ADMIN_PASSWORD;

test('@auth requires login', async ({ page }) => {
  await page.goto(`${BASE_URL}/invites/resend`);
  await expect(page).toHaveURL(/login/);
});

test.describe('@smoke resend invite flow', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'TEST_EMAIL/TEST_PASSWORD not configured');

  test('@smoke resend invite flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL!);
    await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    await page.goto(`${BASE_URL}/invites/resend`);
    await page.getByTestId('resend-form').getByRole('textbox').fill('user@example.com');
    await page.getByTestId('resend-submit').click();
    await expect(page.getByRole('status')).toContainText(/Invite resent|blocked/i);
  });
});
