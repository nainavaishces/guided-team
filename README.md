# Playwright Component-Based Automation Framework

A scalable and maintainable test automation framework built with Playwright and TypeScript, following a component-based architecture.

## Features

- Component-based architecture for maximum reusability
- Page Object Model pattern for better maintainability
- Business flow abstraction for clear test intent
- Multi-environment support (dev, staging, production)
- Multi-browser and multi-device testing capabilities
- TypeScript for type safety and better developer experience
- Parallel test execution for faster feedback
- Country-specific configuration for international testing
- Authentication state management for efficient testing
- Deploy preview URL support for testing PR deployments

## Project Structure

```
automation/
├── src/                             # Source code
│   ├── components/                  # UI Components
│   │   └── base/                    # Base component classes
│   ├── pages/                       # Page Object Models
│   │   └── base/                    # Base page classes
│   ├── fixtures/                    # Test fixtures
│   ├── utils/                       # Utility functions
│   │   └── browser/                 # Browser utilities
│   ├── config/                      # Configuration management
│   └── types/                       # TypeScript definitions
│
├── tests/                           # Test specifications
│   ├── setup/                       # Test setup
│   └── e2e/                         # End-to-end tests
│
├── docs/                            # Documentation
│   ├── ARCHITECTURE.md              # Architecture documentation
│   ├── CONTRIBUTING.md              # Contributing guidelines
│   ├── TESTING_BEST_PRACTICES.md    # Testing best practices
│   ├── MULTI_BROWSER_TESTING.md     # Multi-browser testing guide
│   ├── TYPESCRIPT_STRATEGY.md       # TypeScript strategy
│   └── examples/                    # Example code and usage
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

4. Configure environment variables:

The framework now uses dotenv to load environment variables from a .env file:

```bash
# Create a .env file from the example
cp .env.example .env
```

Edit the .env file to set your desired configuration:

```
# Test Configuration
COUNTRY=US          # Country code (e.g., US, GB, DE)
BRANCH=production   # Environment (production, staging, development)
HEADLESS=true       # Run browsers in headless mode

# Deploy Preview Configuration
DEPLOY_PREVIEW_URL= # URL for testing deploy previews (PR deployments)
```

These settings control:

- The BASE_URL is dynamically generated during test setup based on:
  - The COUNTRY environment variable (which country/domain to test)
  - The BRANCH environment variable (which environment to test)
  - The country configuration in `src/config/country-config.js`
  - The DEPLOY_PREVIEW_URL (if set) will override the above settings

Default values are provided in `src/config/env.ts` if not specified in .env.

### Running Tests

Run all tests:

```bash
npm test
```

Run tests on specific browsers:

```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

Run tests on mobile devices:

```bash
npm run test:mobile-chrome
npm run test:mobile-safari
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

Watch mode for type checking during development:

```bash
npm run typecheck:watch
```

## Architecture

The framework follows a component-based architecture with the following key layers:

1. **Component Layer**: Reusable UI elements (buttons, forms, navigation)
2. **Page Layer**: Page objects composed of components
3. **Fixture Layer**: Test setup and configuration
4. **Test Layer**: End-to-end and integration tests

For more details, see the [Architecture Documentation](docs/ARCHITECTURE.md).

## Multi-Browser Testing

The framework supports testing on multiple browsers and devices:

- Desktop: Chrome, Firefox, Safari
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

For more details, see the [Multi-Browser Testing Guide](docs/MULTI_BROWSER_TESTING.md).

## Country-Specific Testing

The framework includes support for testing across multiple countries and domains:

- Environment-specific domain configuration
- Country-specific settings (currency, language, etc.)
- Cookie management for authentication
- Deploy preview URL support for testing PR deployments

## Deploy Preview Testing

The framework supports testing against deploy previews (PR deployments):

1. Set the `DEPLOY_PREVIEW_URL` environment variable in your `.env` file:

```
DEPLOY_PREVIEW_URL=https://deploy-preview-3318.web.vuoriclothing.com
```

2. Run your tests normally:

```bash
npm test
```

The framework will automatically:

- Use the deploy preview URL as the base URL for all tests
- Configure the appropriate cookie domain
- Set up authentication for the deploy preview

## Authentication State Management

The framework uses Playwright's storage state feature to manage authentication:

- During global setup, authentication cookies are added to bypass password protection:
  - `vuori_access: allowed` - Grants access to password-protected environments
  - `automation: true` - Identifies the session as an automation run

- These cookies are saved to `auth-state.json` and automatically applied to all tests
- This approach eliminates the need to handle authentication in individual tests

The auth-state.json file is stored in the `.auth` directory (a hidden directory) and generated during test setup. This directory should be added to .gitignore to prevent committing authentication state to version control. The file is referenced in playwright.config.ts on line 49:

```typescript
// In playwright.config.ts
use: {
  /* Base URL to use in actions like `await page.goto('/')`. */
  baseURL: env.BASE_URL,

  /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  trace: "on-first-retry",

  /* Run browser in headless mode */
  headless: env.HEADLESS,

  /* Use stored authentication state that includes our cookies */
  storageState: PATHS.AUTH_STATE,  // This line uses auth-state.json

  /* Set timeouts for actions and navigation */
  actionTimeout: TIMEOUTS.ACTION,
  navigationTimeout: TIMEOUTS.NAVIGATION,
}
```

The `PATHS.AUTH_STATE` constant is defined in `src/config/constants.ts` as `'./auth-state.json'`.

## CI/CD Integration

The framework includes GitHub Actions workflows for continuous integration and automated testing:

- **Pull Request Validation**: Runs tests automatically on pull requests
- **Nightly Regression**: Runs comprehensive tests across all browsers and devices every night at 11:00 PM PDT
- **Manual Trigger**: Allows manual execution of test suites as needed

These automated workflows ensure consistent quality and catch regressions early.

## Best Practices

For testing best practices, see the [Testing Best Practices](docs/TESTING_BEST_PRACTICES.md) guide.

## Contributing

For contribution guidelines, see the [Contributing Guide](docs/CONTRIBUTING.md).

## License

This project is licensed under the ISC License.
