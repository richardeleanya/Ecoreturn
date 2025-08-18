import { test, expect } from '@playwright/test';

test('full analytics dashboard flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'demo@ecoreturn.com');
  await page.fill('input[type="password"]', 'Passw0rd!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
  // Wait for charts canvas to render
  await page.waitForSelector('canvas');
  // Assert KPI cards
  await expect(page.getByText(/Returns Count/)).toBeVisible();
  await expect(page.getByText(/Spend/)).toBeVisible();
  await expect(page.getByText(/Avg Reward/)).toBeVisible();
});