import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "tests",
  testMatch: ["**/e2e/**/*.spec.ts", "**/logout.spec.ts"],
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    headless: true,
    storageState: "./tests/.auth/storageState.json",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  globalSetup: "./tests/global-setup.ts",
  webServer: {
    command: "NEXT_PUBLIC_E2E_AUTH_MODE=mock E2E_AUTH_MODE=mock PORT=3000 npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
