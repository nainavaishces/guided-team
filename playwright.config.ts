// Load environment variables from .env file without logging messages
import { loadEnv } from './src/utils/dotenv-wrapper';
loadEnv();

import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { TIMEOUTS, PATHS } from './src/config/constants';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Global setup to run before all tests
  globalSetup: './tests/setup/global-setup.ts',
  testDir: './tests',
  // Test patterns to match
  testMatch: ['**/*.spec.ts'],
  /* Maximum time one test can run for */
  timeout: TIMEOUTS.TEST,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met
     */
    timeout: TIMEOUTS.EXPECT,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { outputFolder: PATHS.REPORTS.HTML }]],

  /* Output directory for test results */
  outputDir: PATHS.REPORTS.TEST_RESULTS,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Run browser in headless mode */
    headless: env.HEADLESS,

    /* Use stored authentication state that includes our cookies */
    storageState: PATHS.AUTH_STATE,

    /* Set timeouts for actions and navigation */
    actionTimeout: TIMEOUTS.ACTION,
    navigationTimeout: TIMEOUTS.NAVIGATION,

    /* Capture screenshots on test failures */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers and devices */
  projects: [
    /* Desktop browsers */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Mobile devices */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
