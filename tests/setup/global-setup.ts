import { chromium, FullConfig } from '@playwright/test';

import { PATHS } from '../../src/config/constants';
import { env } from '../../src/config/env';
import { CookieManager } from '../../src/utils/browser/cookie-manager';
import {
  getEnvironmentCountryConfig,
  getBaseUrl,
  parseDeployPreviewUrl,
} from '../../src/utils/country-utils';

/**
 * Global setup for Playwright tests
 * - Gets country configuration based on COUNTRY env variable
 * - Uses generateTestCountries to get the correct domain based on BRANCH
 * - Sets up cookies to bypass password protection in lower environments
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  try {
    console.log('Global setup using environment variables:');
    console.log('COUNTRY:', process.env.COUNTRY);
    console.log('BRANCH:', process.env.BRANCH);

    // Check if we're running against a deploy preview
    if (env.DEPLOY_PREVIEW_URL) {
      console.log('DEPLOY_PREVIEW_URL:', env.DEPLOY_PREVIEW_URL);

      // Parse the deploy preview URL and set environment variables
      const success = parseDeployPreviewUrl(env.DEPLOY_PREVIEW_URL);

      if (success) {
        console.log('Running tests against deploy preview');
      } else {
        console.warn('Failed to parse deploy preview URL, falling back to normal configuration');
      }
    }

    // Get environment-specific country configuration
    // Make sure to use process.env directly to get the latest values
    const countryCode = process.env.COUNTRY || env.COUNTRY;
    const branch = process.env.BRANCH || env.BRANCH;

    const countryConfig = getEnvironmentCountryConfig(countryCode, branch);

    // Set BASE_URL environment variable for tests
    const baseUrl = getBaseUrl(countryConfig);
    env.BASE_URL = baseUrl;

    console.log(`Setting BASE_URL to: ${baseUrl}`);
    console.log(`Using cookie domain: ${countryConfig.cookieDomain}`);

    // Launch browser to set cookies
    const browser = await chromium.launch();
    try {
      const context = await browser.newContext();

      // Add authentication cookies
      await CookieManager.addAuthCookies(context, countryConfig.cookieDomain);

      // Save storage state to be used in tests
      await CookieManager.saveContextState(context, PATHS.AUTH_STATE);
      console.log('Auth state saved with cookies');
    } finally {
      // Close browser
      await browser.close();
    }
  } catch (error) {
    console.error('Error in global setup:', error);
    throw error;
  }
}

export default globalSetup;
