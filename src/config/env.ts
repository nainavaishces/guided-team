/**
 * Environment configuration management
 * Loads and validates environment variables for test execution
 */
import { IEnvironmentConfig } from '../types/config-types';

/**
 * Get environment variable with validation
 * @param name - Name of the environment variable
 * @param defaultValue - Optional default value if not set
 * @param required - Whether the variable is required
 * @returns The environment variable value
 */
export function getEnv(name: string, defaultValue?: string, required = false): string {
  // Always check process.env first to get the latest values
  const value = process.env[name] || defaultValue;

  if (required && !value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }

  return value || '';
}

/**
 * Environment configuration object
 * Contains all environment-specific configuration
 */
export const env: IEnvironmentConfig = {
  // Test environment
  get COUNTRY(): string {
    return getEnv('COUNTRY', 'US');
  },
  get BRANCH(): string {
    return getEnv('BRANCH', 'production');
  },

  // Browser configuration
  get HEADLESS(): boolean {
    return getEnv('HEADLESS', 'false') === 'true';
  },

  // Base URL (will be set by global setup)
  get BASE_URL(): string {
    return process.env.BASE_URL || '';
  },
  set BASE_URL(value: string) {
    process.env.BASE_URL = value;
  },

  // Deploy Preview URL
  get DEPLOY_PREVIEW_URL(): string {
    return getEnv('DEPLOY_PREVIEW_URL', '');
  },
};
