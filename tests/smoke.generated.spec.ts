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
    await page.goto(route);
    // Basic smoke test - page loads and has an h1
    await expect(page.locator('h1')).toBeVisible();
  });
}
