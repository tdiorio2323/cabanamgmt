import { test, expect } from '@playwright/test';

/**
 * Comprehensive Admin Dashboard E2E Tests
 * Non-destructive read-only tests for admin UI functionality
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.TEST_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_PASSWORD || process.env.ADMIN_PASSWORD;

test.describe('Admin Dashboard E2E', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'TEST_EMAIL/TEST_PASSWORD not configured');

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder(/email/i).fill(ADMIN_EMAIL!);
    await page.getByPlaceholder(/password/i).fill(ADMIN_PASSWORD!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
  });

  test('Sidebar is visible with all navigation items', async ({ page }) => {
    // Wait for sidebar to be visible
    await expect(page.locator('aside')).toBeVisible({ timeout: 5000 });

    // Check for all expected navigation items
    const navItems = [
      'Dashboard',
      'Invite Codes',
      'Users',
      'Bookings',
      'Vetting',
      'Media',
      'Contracts',
      'Payments',
      'Payouts',
      'Invoices',
      'System',
      'Environment',
      'Audit',
      'Activity',
      'Support',
      'Rooms',
      'Portfolio'
    ];

    for (const item of navItems) {
      await expect(page.getByRole('link', { name: item })).toBeVisible();
    }
  });

  test('Dashboard overview loads with KPI cards', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard$/);

    // Check for dashboard header
    await expect(page.getByRole('heading', { name: /dashboard overview/i })).toBeVisible();

    // Check for admin badge if user is admin
    const adminBadge = page.getByTestId('admin-only');
    if (await adminBadge.isVisible()) {
      await expect(adminBadge).toContainText(/admin/i);
    }

    // Check for KPI cards (should have at least some stats)
    const kpiCards = page.locator('[class*="glass"]').filter({ hasText: /total users|vip codes|invitations|revenue/i });
    await expect(kpiCards.first()).toBeVisible();
  });

  test('Users page loads and shows table/cards', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.waitForURL('**/dashboard/users', { timeout: 5000 });

    // Check for page header or title
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/user|manage|list/);

    // Page should not be completely empty
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length || 0).toBeGreaterThan(100);
  });

  test('Bookings page loads with content', async ({ page }) => {
    await page.getByRole('link', { name: 'Bookings' }).click();
    await page.waitForURL('**/dashboard/bookings', { timeout: 5000 });

    // Check for page content
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/booking|appointment|schedule/);

    // Should have some content rendered
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length || 0).toBeGreaterThan(100);
  });

  test('Vetting page loads with content', async ({ page }) => {
    await page.getByRole('link', { name: 'Vetting' }).click();
    await page.waitForURL('**/dashboard/vetting', { timeout: 5000 });

    // Check for vetting-related content
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/vet|verification|approval|screening/);

    // Page should render content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length || 0).toBeGreaterThan(100);
  });

  test('Navigation between sections works correctly', async ({ page }) => {
    // Start at dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // Navigate to Users
    await page.getByRole('link', { name: 'Users' }).click();
    await page.waitForURL('**/dashboard/users', { timeout: 5000 });
    await expect(page).toHaveURL(/\/dashboard\/users/);

    // Navigate to Bookings
    await page.getByRole('link', { name: 'Bookings' }).click();
    await page.waitForURL('**/dashboard/bookings', { timeout: 5000 });
    await expect(page).toHaveURL(/\/dashboard\/bookings/);

    // Navigate back to Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('Active navigation item is highlighted', async ({ page }) => {
    // Navigate to Users
    await page.getByRole('link', { name: 'Users' }).click();
    await page.waitForURL('**/dashboard/users', { timeout: 5000 });

    // The Users link should have active styling (check for class with white/20 or similar)
    const usersLink = page.getByRole('link', { name: 'Users' });
    const classes = await usersLink.getAttribute('class');

    // Active links should have bg-white/20 or similar glassmorphic active state
    expect(classes).toMatch(/bg-white/);
  });

  test('Topbar search and user menu are present', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();

    // Check for user menu button
    const userMenuButton = page.getByRole('button', { name: /user menu/i });
    await expect(userMenuButton).toBeVisible();

    // Check for notification bell
    const notificationButton = page.getByLabel(/notification/i);
    await expect(notificationButton).toBeVisible();
  });

  test('User dropdown menu works', async ({ page }) => {
    // Click user menu
    const userMenuButton = page.getByRole('button', { name: /user menu/i });
    await userMenuButton.click();

    // Wait for dropdown to appear
    await page.waitForTimeout(300);

    // Check for menu items
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();

    // Should have Profile, Settings, Sign out options
    const menuContent = await dropdown.textContent();
    expect(menuContent).toMatch(/profile|settings|sign out/i);
  });

  test('All main sections are accessible from sidebar', async ({ page }) => {
    const sections = [
      { name: 'Invite Codes', url: '/dashboard/invite' },
      { name: 'Media', url: '/dashboard/media' },
      { name: 'Contracts', url: '/dashboard/contracts' },
      { name: 'Payments', url: '/dashboard/payments' },
      { name: 'System', url: '/dashboard/system' },
    ];

    for (const section of sections) {
      await page.getByRole('link', { name: section.name }).click();
      await page.waitForURL(`**${section.url}`, { timeout: 5000 });
      await expect(page).toHaveURL(new RegExp(section.url));

      // Verify page loaded (has content)
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length || 0).toBeGreaterThan(50);
    }
  });

  test('Page load performance is acceptable', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const loadTime = Date.now() - start;

    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
