import { test, expect } from '@playwright/test';

import { ANALYTICS_CONFIG } from '../../../src/config/analytics-config';
import { AnalyticsFixture } from '../../../src/fixtures/analytics-fixture';

/**
 * OneTrust integration tests
 * Tests for OneTrust cookie consent management
 */
test.describe('OneTrust Integration Tests', () => {
  let analyticsFixture: AnalyticsFixture;

  test.beforeEach(async ({ page }) => {
    analyticsFixture = new AnalyticsFixture(page);
    await page.goto('/');
  });

  test('should have OptanonConsent cookies', async () => {
    // Verify the cookie exists
    const cookieExists = await analyticsFixture.cookieExists(ANALYTICS_CONFIG.onetrust.cookieName);
    expect(cookieExists).toBeTruthy();

    // Verify the cookie value
    const cookieValue = await analyticsFixture.getCookieValue(ANALYTICS_CONFIG.onetrust.cookieName);
    expect(cookieValue).not.toBeNull();
  });

  test('should have OnetrustActiveGroups in window', async () => {
    // Verify the variable exists
    const variableExists = await analyticsFixture.jsVariableExists(
      ANALYTICS_CONFIG.onetrust.activeGroupsVariable
    );
    expect(variableExists).toBeTruthy();

    // Verify the variable value
    const variableValue = await analyticsFixture.getJsVariableValue(
      ANALYTICS_CONFIG.onetrust.activeGroupsVariable
    );
    expect(variableValue).not.toBeNull();
  });
});
