import { test, expect } from '@playwright/test';

test('login and dashboard KPIs', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'demo@ecoreturn.com');
  await page.fill('input[type="password"]', 'Passw0rd!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
  await expect(page.locator('text=Returns Count')).toBeVisible();
  await expect(page.locator('text=Balance')).toBeVisible();
});