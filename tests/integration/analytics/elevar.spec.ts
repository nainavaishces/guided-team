import { test, expect } from '@playwright/test';

import { ANALYTICS_CONFIG } from '../../../src/config/analytics-config';
import { AnalyticsFixture } from '../../../src/fixtures/analytics-fixture';

/**
 * Elevar integration tests
 * Tests for Elevar data layer implementation
 */
test.describe('Elevar Integration Tests', () => {
  let analyticsFixture: AnalyticsFixture;

  test.beforeEach(async ({ page }) => {
    analyticsFixture = new AnalyticsFixture(page);
    await page.goto('/');
  });

  test('should have ElevarDataLayer in window', async () => {
    // Verify the ElevarDataLayer exists
    const dataLayerExists = await analyticsFixture.jsVariableExists(
      ANALYTICS_CONFIG.elevar.dataLayerVariable
    );
    expect(dataLayerExists).toBeTruthy();

    // Verify the ElevarDataLayer value
    const dataLayer = await analyticsFixture.getJsVariableValue(
      ANALYTICS_CONFIG.elevar.dataLayerVariable
    );
    expect(dataLayer).not.toBeNull();
  });
});
