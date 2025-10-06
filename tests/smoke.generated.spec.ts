import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/health",
  "/confirmation",
  "/contracts",
  "/debug",
  "/deposit",
  "/deposits",
  "/intake",
  "/interview", 
  "/learn",
  "/login",
  "/reset-password",
  "/screening",
  "/verify",
  "/vetting"
];

const dynamicRoutes = [
  { template: "/invite/[code]", example: "/invite/test123" },
  { template: "/vip/[code]", example: "/vip/test123" }
];

// Test public routes
for (const route of publicRoutes) {
  test(`smoke: ${route}`, async ({ page }) => {
    await page.goto(route);
    // Basic smoke test - page loads without error
    await expect(page).not.toHaveTitle(/Error/);
    // Most pages should have some content or redirect appropriately
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
}

// Test dynamic routes with example parameters
for (const { template, example } of dynamicRoutes) {
  test(`smoke: ${template} (via ${example})`, async ({ page }) => {
    await page.goto(example);
    // Allow redirects for invalid codes
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveTitle(/Error/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
}
