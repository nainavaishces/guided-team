# Analytics Integration Tests

This directory contains integration tests for analytics tools used in the application.

## Overview

These tests verify the presence and proper configuration of the following analytics tools:

1. **OneTrust** - Cookie consent management
   - Verifies OptanonConsent cookies are present
   - Verifies window.OnetrustActiveGroups is available

2. **Google Tag Manager (GTM)**
   - Verifies the presence of GTM script (https://www.googletagmanager.com/gtm.js)
   - Confirms the correct GTM ID is used (GTM-TCVZ9HT for production)

3. **Elevar**
   - Verifies window.ElevarDataLayer is available
   - Checks for required properties in the data layer

4. **Consent Settings**
   - Verifies consentSettings is present in local storage
   - Validates it contains all necessary consent parameters:
     - ad_personalization
     - ad_storage
     - ad_user_data
     - analytics_storage
     - functionality_storage
     - personalization_storage
     - security_storage

## Running the Tests

To run all analytics tests:

```bash
npx playwright test tests/integration/analytics
```

To run a specific analytics test:

```bash
npx playwright test tests/integration/analytics/onetrust.spec.ts
npx playwright test tests/integration/analytics/gtm.spec.ts
npx playwright test tests/integration/analytics/elevar.spec.ts
npx playwright test tests/integration/analytics/consent-settings.spec.ts
```

## Configuration

The expected values for these tests are configured in `src/config/analytics-config.ts`. This makes it easy to update the expected values without changing the test code.

## Test Environments

These tests run in all environments (production, staging, development) and across all country domains. The environment is determined by the `BRANCH` environment variable, and the country is determined by the `COUNTRY` environment variable.

## Adding New Tests

To add a new analytics test:

1. Update the `src/config/analytics-config.ts` file with the expected values
2. Create a new test file in this directory
3. Use the `AnalyticsFixture` to interact with the page and verify the expected values

## Troubleshooting

If the tests fail, check the following:

1. Ensure the analytics tools are properly configured in the application
2. Verify the expected values in `src/config/analytics-config.ts` match the actual values
3. Check the browser console for any errors related to the analytics tools
