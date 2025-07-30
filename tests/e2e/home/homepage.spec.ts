import path from 'path';

import { test, expect } from '@playwright/test';

import { PATHS } from '../../../src/config/constants';

test.describe('Homepage Tests', () => {
  test('should display the logo on homepage', async ({ page }) => {
    // Log the BASE_URL for debugging
    console.log(`Using BASE_URL: ${process.env.BASE_URL}`);

    // Navigate to the homepage
    await page.goto('/');

    // Log the current URL for debugging
    console.log(`Current URL: ${page.url()}`);

    // Take a screenshot for debugging
    const screenshotPath = path.join(PATHS.REPORTS.SCREENSHOTS, 'homepage-screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    await expect(page.getByRole('link', { name: 'Vuori Home' })).toBeVisible();
  });
});
