/**
 * Application constants
 * Contains constants used throughout the test framework
 */
import { ITimeoutConfig, IPathConfig } from '../types/config-types';

// Timeout constants (in milliseconds)
export const TIMEOUTS: ITimeoutConfig = {
  TEST: 30 * 1000,
  EXPECT: 5000,
  ACTION: 10000,
  NAVIGATION: 30000,
};

// File paths
export const PATHS: IPathConfig = {
  AUTH_STATE: './.auth/auth-state.json',
  REPORTS: {
    ROOT: './reports',
    HTML: './reports/html-report',
    SCREENSHOTS: './reports/screenshots',
    ALLURE: './reports/allure-results',
    TEST_RESULTS: './reports/test-results',
  },
};
