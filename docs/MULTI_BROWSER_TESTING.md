# Multi-Browser and Multi-Device Testing

This document describes how to use Playwright's built-in multi-browser and multi-device testing capabilities.

## Supported Browsers and Devices

The automation framework supports the following browsers and devices:

- **Desktop Browsers**:
  - Chrome (Chromium)
  - Firefox
  - Safari (WebKit)

- **Mobile Devices**:
  - Mobile Chrome (Pixel 5)
  - Mobile Safari (iPhone 12)

## Configuration

The browser and device configurations are defined in `playwright.config.ts` using Playwright's built-in device descriptors:

```typescript
// Example configuration in playwright.config.ts
projects: [
  /* Desktop browsers */
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
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
];
```

## Running Tests

### Running Tests on All Browsers and Devices

To run tests on all configured browsers and devices:

```bash
npm test
```

### Running Tests on Specific Browsers

To run tests on a specific browser:

```bash
# Run tests on Chrome
npm run test:chrome

# Run tests on Firefox
npm run test:firefox

# Run tests on Safari
npm run test:safari
```

### Running Tests on Mobile Devices

To run tests on a specific mobile device:

```bash
# Run tests on Mobile Chrome (Pixel 5)
npm run test:mobile-chrome

# Run tests on Mobile Safari (iPhone 12)
npm run test:mobile-safari
```

## Writing Responsive Tests

Playwright provides the `isMobile` parameter in the test context, which you can use to write responsive tests:

```typescript
import { test, expect } from '@playwright/test';

test('should adapt layout based on device type', async ({ page, isMobile }) => {
  await page.goto('/');

  if (isMobile) {
    // Mobile-specific assertions
    await expect(page.locator('.mobile-menu')).toBeVisible();
  } else {
    // Desktop-specific assertions
    await expect(page.locator('.desktop-menu')).toBeVisible();
  }
});
```

## Best Practices

1. **Use Playwright's built-in device emulation**: Playwright provides excellent device emulation capabilities. Use the built-in device descriptors rather than creating custom ones.

2. **Use the `isMobile` parameter**: Playwright automatically provides an `isMobile` parameter in the test context, which you can use to write responsive tests.

3. **Take screenshots for visual verification**: Take screenshots during tests to visually verify the layout on different browsers and devices.

4. **Use responsive selectors**: Design your selectors to work across different browsers and devices. Use data attributes rather than CSS classes that might change based on the device.

5. **Test on real devices when possible**: While emulators are useful for development and CI, testing on real devices provides the most accurate results.

## Available Device Descriptors

Playwright provides a wide range of device descriptors that you can use in your configuration. Here are some examples:

- Desktop browsers: `Desktop Chrome`, `Desktop Firefox`, `Desktop Safari`, `Desktop Edge`
- Mobile devices: `iPhone 12`, `iPhone 13`, `Pixel 5`, `Galaxy S8`, `iPad Pro 11`, etc.

For a complete list of available device descriptors, see the [Playwright documentation](https://playwright.dev/docs/emulation#devices).
