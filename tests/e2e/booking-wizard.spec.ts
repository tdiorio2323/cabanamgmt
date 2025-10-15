import { test, expect } from '@playwright/test';

test.describe('Booking Wizard E2E', () => {
  test('7-step wizard smoke test with fixtures @e2e', async ({ page }) => {
    // Skip if no auth configured
    if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
      test.skip();
      return;
    }

    // Step 1: Intake
    await page.goto('/intake');
    await expect(page.locator('text=/step 1|intake/i')).toBeVisible();
    
    // Fill intake form
    await page.fill('input[name="full_name"]', 'Test Creator');
    await page.fill('input[name="email"]', `creator-${Date.now()}@example.com`);
    await page.fill('input[name="phone"]', '+1234567890');
    await page.click('button:has-text("Next")');

    // Step 2: Verify
    await expect(page).toHaveURL(/verify/);
    await expect(page.locator('text=/step 2|verify/i')).toBeVisible();
    
    // Mock ID upload (if file input exists)
    const idInput = page.locator('input[type="file"]').first();
    if (await idInput.isVisible()) {
      // Skip file upload in E2E for now
      await page.click('button:has-text("Skip")').catch(() => {});
    }

    // Step 3: Deposit
    await page.goto('/deposit');
    await expect(page.locator('text=/step 3|deposit/i')).toBeVisible();
    
    // Verify Stripe Elements loaded (if configured)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    if (await stripeFrame.locator('input').isVisible().catch(() => false)) {
      // Stripe is configured
      await expect(page.locator('text=/payment/i')).toBeVisible();
    }

    // Step 4: Screening
    await page.goto('/screening');
    await expect(page.locator('text=/step 4|screening/i')).toBeVisible();

    // Step 5: Interview
    await page.goto('/interview');
    await expect(page.locator('text=/step 5|interview/i')).toBeVisible();
    
    // Check for Calendly embed or scheduling UI
    await expect(
      page.locator('text=/schedule|interview|calendar/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Step 6: Contracts
    await page.goto('/contracts');
    await expect(page.locator('text=/step 6|contract|nda/i')).toBeVisible();

    // Step 7: Confirmation
    await page.goto('/confirmation');
    await expect(page.locator('text=/step 7|confirm|complete/i')).toBeVisible();
    
    // Verify completion message
    await expect(
      page.locator('text=/thank you|completed|confirmed/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('stepper navigation works @e2e', async ({ page }) => {
    await page.goto('/intake');
    
    // Verify stepper component exists
    const stepper = page.locator('[data-testid="stepper"]').or(
      page.locator('text=/step 1.*7/i')
    );
    await expect(stepper.first()).toBeVisible({ timeout: 5000 });
    
    // Navigate to different steps
    await page.goto('/deposit');
    await expect(page.locator('text=/step 3/i')).toBeVisible();
    
    await page.goto('/contracts');
    await expect(page.locator('text=/step 6/i')).toBeVisible();
  });
});

