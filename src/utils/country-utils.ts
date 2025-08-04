import { countries, generateTestCountries } from '../config/country-config';
import { env } from '../config/env';
import { CountryConfig } from '../types';

/**
 * Get country configuration based on country code
 * @param countryCode - ISO country code (e.g., 'GB', 'US')
 * @returns Country configuration object
 */
export function getCountryConfig(countryCode: string): CountryConfig {
  const countryConfig = countries.find(
    (country: CountryConfig) => country.countryCode === countryCode
  );

  if (!countryConfig) {
    throw new Error(`Country configuration not found for country code: ${countryCode}`);
  }

  return countryConfig as CountryConfig;
}

/**
 * Get environment-specific country configuration
 * Uses the generateTestCountries function to get the correct domain based on branch
 * @param countryCode - ISO country code (e.g., 'GB', 'US')
 * @param branch - Environment branch (e.g., 'staging', 'development')
 * @returns Environment-specific country configuration
 */
export function getEnvironmentCountryConfig(
  countryCode: string = env.COUNTRY,
  branch: string = env.BRANCH
): CountryConfig {
  // Set branch in environment for generateTestCountries
  process.env.BRANCH = branch;

  // Get test country configuration
  const testCountries = generateTestCountries();
  const testCountryConfig = testCountries.find(
    (country: CountryConfig) => country.countryCode === countryCode
  );

  if (!testCountryConfig) {
    throw new Error(`Test country configuration not found for country code: ${countryCode}`);
  }

  // For non-production environments, ensure the cookieDomain has a leading dot
  // This ensures cookies work across subdomains
  const domain = testCountryConfig.domain;
  const cookieDomain = domain.includes('web.')
    ? `.${domain.substring(domain.indexOf('web.') + 4)}`
    : `.${testCountryConfig.cookieDomain}`;

  return {
    ...testCountryConfig,
    cookieDomain,
  } as CountryConfig;
}

/**
 * Get base URL for the current environment and country
 * @param countryConfig - Country configuration
 * @returns Base URL for the environment
 */
export function getBaseUrl(countryConfig: CountryConfig): string {
  return `https://${countryConfig.domain}`;
}

/**
 * Parse a deploy preview URL and set the appropriate environment variables
 * @param deployPreviewUrl - The deploy preview URL
 * @returns True if the URL was successfully parsed, false otherwise
 */
export function parseDeployPreviewUrl(deployPreviewUrl: string): boolean {
  if (!deployPreviewUrl) {
    return false;
  }

  try {
    // Set the DEPLOY_PRIME_URL environment variable
    process.env.DEPLOY_PRIME_URL = deployPreviewUrl;

    // Set the CONTEXT environment variable
    process.env.CONTEXT = 'deploy-preview';

    return true;
  } catch (error) {
    console.error('Error parsing deploy preview URL:', error);
    return false;
  }
}
