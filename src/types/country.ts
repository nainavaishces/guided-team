/**
 * Country configuration type definitions
 */

/**
 * CountryConfig interface for country-specific settings
 * Used in country-utils.ts for managing country configurations
 */
export interface CountryConfig {
  label?: string;
  locale?: string;
  currency?: string;
  domain: string;
  checkoutDomain: string;
  headlessCheckoutReturnDomain: string;
  cookieDomain: string;
  countryCode?: string;
  language?: string;
  protocol?: string;
  [key: string]: string | number | boolean | undefined;
}
