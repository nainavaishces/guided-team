/**
 * Environment configuration interface
 * Defines the shape of environment configuration
 */
export interface IEnvironmentConfig {
  /**
   * The country code (e.g., 'GB', 'US')
   */
  COUNTRY: string;

  /**
   * The environment branch (e.g., 'staging', 'development')
   */
  BRANCH: string;

  /**
   * Whether to run browsers in headless mode
   */
  HEADLESS: boolean;

  /**
   * The base URL for the application
   */
  BASE_URL: string;
}

/**
 * Timeout configuration interface
 * Defines the shape of timeout configuration
 */
export interface ITimeoutConfig {
  /**
   * Test timeout in milliseconds
   */
  TEST: number;

  /**
   * Expect timeout in milliseconds
   */
  EXPECT: number;

  /**
   * Action timeout in milliseconds
   */
  ACTION: number;

  /**
   * Navigation timeout in milliseconds
   */
  NAVIGATION: number;
}

/**
 * Path configuration interface
 * Defines the shape of path configuration
 */
export interface IPathConfig {
  /**
   * Path to the authentication state file
   */
  AUTH_STATE: string;

  /**
   * Report paths
   */
  REPORTS: {
    /**
     * Root reports directory
     */
    ROOT: string;

    /**
     * HTML report directory
     */
    HTML: string;

    /**
     * Screenshots directory
     */
    SCREENSHOTS: string;

    /**
     * Allure results directory
     */
    ALLURE: string;

    /**
     * Test results directory
     */
    TEST_RESULTS: string;
  };
}

/**
 * Analytics configuration interface
 * Defines the shape of analytics configuration
 */
export interface IAnalyticsConfig {
  /**
   * OneTrust configuration
   */
  onetrust: {
    /**
     * Cookie name for OneTrust consent
     */
    cookieName: string;

    /**
     * Required parameters in the cookie (optional)
     */
    requiredParameters?: string[];

    /**
     * Variable name for active groups
     */
    activeGroupsVariable: string;
  };

  /**
   * Google Tag Manager configuration
   */
  gtm: {
    /**
     * URL for GTM script
     */
    scriptUrl: string;

    /**
     * GTM IDs for different environments
     */
    ids: {
      production: string;
      staging: string;
      development: string;
      [key: string]: string;
    };
  };

  /**
   * Elevar configuration
   */
  elevar: {
    /**
     * Variable name for Elevar data layer
     */
    dataLayerVariable: string;

    /**
     * Required properties in the data layer (optional)
     */
    requiredProperties?: string[];
  };

  /**
   * Consent settings configuration
   */
  consent: {
    /**
     * Local storage key for consent settings
     */
    localStorageKey: string;

    /**
     * Required parameters in the consent settings
     */
    requiredParameters: string[];
  };
}
