/**
 * Global type declarations
 * These types are available globally without imports
 */

/**
 * Extend the NodeJS namespace to include custom environment variables
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The country code (e.g., 'GB', 'US')
     */
    COUNTRY?: string;

    /**
     * The environment branch (e.g., 'staging', 'development')
     */
    BRANCH?: string;

    /**
     * Whether to run browsers in headless mode
     */
    HEADLESS?: string;

    /**
     * The base URL for the application
     */
    BASE_URL?: string;

    /**
     * Netlify deploy context
     */
    CONTEXT?: string;

    /**
     * Netlify deploy URL
     */
    DEPLOY_PRIME_URL?: string;

    /**
     * Whether running in CI environment
     */
    CI?: string;
  }
}

/**
 * Extend the Playwright test namespace
 */
declare namespace PlaywrightTest {
  /**
   * Custom test options
   */
  interface TestOptions {
    /**
     * The base URL for the tests
     */
    baseUrl: string;
  }
}
