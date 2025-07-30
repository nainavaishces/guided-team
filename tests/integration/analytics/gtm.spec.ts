import { test, expect } from '@playwright/test';

import { ANALYTICS_CONFIG } from '../../../src/config/analytics-config';
import { env } from '../../../src/config/env';
import { AnalyticsFixture } from '../../../src/fixtures/analytics-fixture';

/**
 * Google Tag Manager integration tests
 * Tests for Google Tag Manager (GTM) implementation
 */
test.describe('Google Tag Manager Integration Tests', () => {
  let analyticsFixture: AnalyticsFixture;

  test.beforeEach(async ({ page }) => {
    analyticsFixture = new AnalyticsFixture(page);
    await page.goto('/');
  });

  test('should have GTM script in page source', async () => {
    // Verify the GTM script is present
    const scriptExists = await analyticsFixture.pageSourceContains(ANALYTICS_CONFIG.gtm.scriptUrl);
    expect(scriptExists).toBeTruthy();
  });

  test('should have correct GTM ID', async () => {
    // Get the expected GTM ID based on the current environment
    const currentBranch = env.BRANCH;
    // Use a helper function to get the GTM ID for the current branch
    const expectedGtmId = getGtmIdForBranch(currentBranch);

    // Verify the GTM ID is present in the page source
    const pageContainsGtmId = await analyticsFixture.pageSourceContains(expectedGtmId);
    expect(pageContainsGtmId).toBeTruthy();
  });

  /**
   * Helper function to get the GTM ID for a specific branch
   * @param branch - Branch name
   * @returns GTM ID for the branch
   */
  function getGtmIdForBranch(branch: string): string {
    return ANALYTICS_CONFIG.gtm.ids[branch] || ANALYTICS_CONFIG.gtm.ids.production;
  }
});
