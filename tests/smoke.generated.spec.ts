import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/health",
  "/invite/[code]",
  "/vip/[code]",
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

for (const route of routes) {
  test(`smoke: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    
    // Basic smoke test - page loads successfully (no 404/500 errors)
    expect(response?.status()).toBeLessThan(400);
    
    // Page should have some content (not completely empty)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length || 0).toBeGreaterThan(0);
  });
}
