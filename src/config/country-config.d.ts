/**
 * Type declarations for country-config.js
 */

import { CountryConfig } from '../types/country';

/**
 * Array of country configurations
 */
export const countries: CountryConfig[];

/**
 * Generate test country configurations based on environment
 * @returns Array of country configurations with environment-specific domains
 */
export function generateTestCountries(): CountryConfig[];
