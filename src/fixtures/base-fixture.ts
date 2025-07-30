import { test as base } from '@playwright/test';

import { env } from '../config/env';
import { IBaseFixture } from '../types/fixture-types';

/**
 * Base fixture interface
 * Defines the shape of fixtures provided to tests
 */
export type BaseFixture = IBaseFixture;

/**
 * Base test fixture that provides common functionality for all tests
 * Fixtures provide test setup and configuration
 */
export const test = base.extend<BaseFixture>({
  // Override the built-in page fixture to add custom setup
  page: async ({ page }, use) => {
    // Set default timeout for all actions
    page.setDefaultTimeout(10000);

    // Use the page in the test
    await use(page);
  },

  // Add baseUrl fixture
  baseUrl: async ({}, use) => {
    await use(env.BASE_URL);
  },
});

/**
 * Re-export expect from the base test
 */
export const expect = test.expect;
