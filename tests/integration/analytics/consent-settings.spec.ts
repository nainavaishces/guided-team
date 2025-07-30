import { test, expect } from '@playwright/test';

import { ANALYTICS_CONFIG } from '../../../src/config/analytics-config';
import { AnalyticsFixture } from '../../../src/fixtures/analytics-fixture';

/**
 * Consent Settings integration tests
 * Tests for validating consent settings in local storage
 */
test.describe('Consent Settings Integration Tests', () => {
  let analyticsFixture: AnalyticsFixture;
  const consentKey = ANALYTICS_CONFIG.consent.localStorageKey;
  const requiredParameters = ANALYTICS_CONFIG.consent.requiredParameters;

  test.beforeEach(async ({ page }) => {
    analyticsFixture = new AnalyticsFixture(page);
    await page.goto('/');
  });

  test('should have consentSettings in local storage', async () => {
    // Verify the consentSettings exists in local storage
    const consentSettingsExists = await analyticsFixture.localStorageItemExists(consentKey);
    expect(consentSettingsExists).toBeTruthy();
  });

  test('should have all required consent parameters', async () => {
    // Verify all required parameters exist in consentSettings
    const hasAllParameters = await analyticsFixture.localStorageItemHasProperties(
      consentKey,
      requiredParameters
    );
    expect(hasAllParameters).toBeTruthy();

    // Get the consentSettings value for detailed validation
    const consentSettings = await analyticsFixture.getLocalStorageItem(consentKey);
    expect(consentSettings).not.toBeNull();

    // Type assertion to treat consentSettings as a record
    const typedConsentSettings = consentSettings as Record<string, unknown>;

    // Validate each parameter individually (values don't matter, just checking they exist)
    for (const param of requiredParameters) {
      expect(typedConsentSettings).toHaveProperty(param);
      console.log(`Verified consent parameter: ${param} = ${typedConsentSettings[param]}`);
    }
  });
});
