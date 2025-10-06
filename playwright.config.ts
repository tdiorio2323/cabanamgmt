import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test.local' });

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'iphone-13', use: { ...devices['iPhone 13'] } }, // Enable after `npx playwright install webkit`
  ],
});
