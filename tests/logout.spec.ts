import { test, expect } from "@playwright/test";

test("user can log out", async ({ page }) => {
  await page.goto("/logout");
  await expect(page.getByText(/redirecting to login/i)).toBeVisible();
});
