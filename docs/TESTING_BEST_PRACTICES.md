# Testing Best Practices

This document outlines the best practices for writing tests using our Playwright Component-Based Automation Framework.

## Table of Contents

- [Test Structure](#test-structure)
- [Test Organization](#test-organization)
- [Locator Strategies](#locator-strategies)
- [Test Data Management](#test-data-management)
- [Assertions](#assertions)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Debugging Tips](#debugging-tips)
- [CI/CD Integration](#cicd-integration)
- [Common Patterns](#common-patterns)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

## Test Structure

### AAA Pattern

Follow the Arrange-Act-Assert pattern:

```typescript
test('should add item to cart', async ({ page, environment }) => {
  // Arrange: Set up the test environment
  const productPage = new ProductPage(page, environment.baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  // Act: Perform the action being tested
  await productPage.addToCart();

  // Assert: Verify the expected outcome
  const cartCount = await productPage.header.getCartCount();
  expect(cartCount).toBe('1');
});
```

### Test Independence

Each test should be completely independent:

- Tests should not depend on the state from previous tests
- Tests should clean up after themselves
- Tests should be able to run in any order
- Tests should be able to run in parallel

### Test Isolation

Use Playwright's test isolation features:

```typescript
// Use test.describe to group related tests
test.describe('Product Page', () => {
  // Use test.beforeEach for common setup
  test.beforeEach(async ({ page, environment }) => {
    const productPage = new ProductPage(page, environment.baseUrl);
    await productPage.navigateTo('/products/laptop-123');
  });

  // Individual tests
  test('should display product details', async ({ page }) => {
    // Test implementation
  });

  test('should add product to cart', async ({ page }) => {
    // Test implementation
  });
});
```

## Test Organization

### Folder Structure

Organize tests by feature or business domain:

```
tests/
├── e2e/                  # End-to-end tests
│   ├── auth/             # Authentication tests
│   ├── product/          # Product-related tests
│   └── checkout/         # Checkout flow tests
├── api/                  # API tests
│   ├── auth/             # Authentication API tests
│   └── products/         # Product API tests
├── integration/          # Integration tests
└── accessibility/        # Accessibility tests
```

### Test Naming

Use descriptive names that explain the scenario and expected outcome:

```typescript
// Good
test('should display error message when login fails', async ({ page }) => {
  // Test implementation
});

// Bad
test('login test', async ({ page }) => {
  // Test implementation
});
```

### Test Grouping

Group related tests using `test.describe`:

```typescript
test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      // Test implementation
    });

    test('should show error with invalid credentials', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Registration', () => {
    test('should register new user successfully', async ({ page }) => {
      // Test implementation
    });

    // More registration tests
  });
});
```

## Locator Strategies

### Prioritize Accessibility-First Locators

Follow this priority order for locators:

1. **Role-based locators**:

   ```typescript
   page.getByRole('button', { name: 'Submit' });
   ```

2. **Label-based locators**:

   ```typescript
   page.getByLabel('Email');
   ```

3. **Text-based locators**:

   ```typescript
   page.getByText('Welcome to our store');
   ```

4. **Test ID locators**:

   ```typescript
   page.getByTestId('product-card');
   ```

5. **CSS selectors (last resort)**:
   ```typescript
   page.locator('.product-item');
   ```

### Locator Best Practices

- **Be specific**: Use the most specific locator possible
- **Be resilient**: Choose locators that are less likely to change
- **Be accessible**: Prefer locators that align with accessibility best practices
- **Be consistent**: Use the same locator strategy throughout your tests
- **Be descriptive**: Use descriptive names for test IDs

### Examples

```typescript
// Good - Role-based locator with name
const submitButton = page.getByRole('button', { name: 'Submit' });

// Good - Label-based locator
const emailInput = page.getByLabel('Email');

// Good - Test ID locator when role/label not applicable
const productCard = page.getByTestId('product-card');

// Avoid - CSS selector that might break with UI changes
const submitButton = page.locator('.form-submit-button');

// Avoid - XPath
const submitButton = page.locator('//button[contains(text(), "Submit")]');
```

## Test Data Management

### Test Data Factories

Use factories to generate test data:

```typescript
// User factory
export class UserFactory {
  static createRandomUser() {
    return {
      email: `user-${Date.now()}@example.com`,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };
  }

  static createAdminUser() {
    return {
      email: 'admin@example.com',
      password: 'AdminPass123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    };
  }
}

// Usage in test
test('should register new user', async ({ page }) => {
  const user = UserFactory.createRandomUser();
  // Use user data in test
});
```

### Environment-Specific Data

Use environment configuration for environment-specific data:

```typescript
test('should login with environment credentials', async ({ page, environment }) => {
  const loginPage = new LoginPage(page, environment.baseUrl);
  await loginPage.navigateToLogin();
  await loginPage.login(environment.credentials.username, environment.credentials.password);
  // Test continues
});
```

### Test Data Cleanup

Clean up test data after tests:

```typescript
test('should create a new product', async ({ page, api }) => {
  // Create test data
  const product = ProductFactory.createRandomProduct();
  const productId = await api.createProduct(product);

  // Test implementation

  // Clean up
  test.afterEach(async () => {
    await api.deleteProduct(productId);
  });
});
```

## Assertions

### Use Descriptive Assertions

Include descriptive messages in assertions:

```typescript
// Good - Includes descriptive message
expect(isLoggedIn, 'User should be logged in after successful login').toBe(true);

// Bad - No descriptive message
expect(isLoggedIn).toBe(true);
```

### Soft Assertions

Use soft assertions when you want to continue the test after an assertion fails:

```typescript
// Import soft assertions
import { expect as softExpect } from '@playwright/test';

test('product details should be correct', async ({ page }) => {
  const productPage = new ProductPage(page, baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  // Soft assertions
  await softExpect(async () => {
    await expect(productPage.getProductName()).resolves.toBe('Laptop XYZ');
    await expect(productPage.getProductPrice()).resolves.toBe('$999.99');
    await expect(productPage.getProductRating()).resolves.toBe(4.5);
  });

  // Test continues even if some assertions fail
});
```

### Visual Assertions

Use visual comparisons for UI testing:

```typescript
test('product page should match snapshot', async ({ page }) => {
  const productPage = new ProductPage(page, baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  // Wait for page to stabilize
  await page.waitForLoadState('networkidle');

  // Compare screenshot with baseline
  await expect(page).toHaveScreenshot('product-page.png');
});
```

## Error Handling

### Retry Flaky Tests

Use Playwright's retry mechanism for flaky tests:

```typescript
// In playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  // Other configuration
});

// For specific tests
test('flaky test', { retries: 3 }, async ({ page }) => {
  // Test implementation
});
```

### Graceful Failure

Handle expected errors gracefully:

```typescript
test('should handle server errors', async ({ page }) => {
  // Mock server error
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    });
  });

  const productsPage = new ProductsPage(page, baseUrl);
  await productsPage.navigateToProductsPage();

  // Verify error message is displayed
  const errorMessage = await productsPage.getErrorMessage();
  expect(errorMessage).toContain('Unable to load products');
});
```

### Debugging Failed Tests

Use Playwright's debugging features:

```typescript
// In playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // Other configuration
});
```

## Performance Optimization

### Parallel Execution

Configure tests to run in parallel:

```typescript
// In playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  // Other configuration
});
```

### Skip Browser UI When Possible

Use API calls for setup when possible:

```typescript
test('should display order history', async ({ page, request }) => {
  // Login via API instead of UI
  const loginResponse = await request.post(`${baseUrl}/api/login`, {
    data: {
      username: 'testuser',
      password: 'password123',
    },
  });

  // Extract authentication token
  const { token } = await loginResponse.json();

  // Set token in storage
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: token,
      domain: new URL(baseUrl).hostname,
      path: '/',
    },
  ]);

  // Navigate directly to order history page
  const orderHistoryPage = new OrderHistoryPage(page, baseUrl);
  await orderHistoryPage.navigateToOrderHistory();

  // Test continues with authenticated user
});
```

### Reuse Authentication State

Reuse authentication state between tests:

```typescript
// In auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, baseUrl }) => {
  // Perform login
  await page.goto(`${baseUrl}/login`);
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for successful login
  await page.waitForURL(`${baseUrl}/dashboard`);

  // Save authentication state
  await page.context().storageState({ path: authFile });
});

// In playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'authenticated',
      testMatch: /.*\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

## Debugging Tips

### Visual Debugging

Use Playwright's UI mode for visual debugging:

```bash
npx playwright test --ui
```

### Trace Viewer

Use Playwright's trace viewer to analyze test execution:

```bash
npx playwright show-trace trace.zip
```

### Logging

Add detailed logging to tests:

```typescript
test('should complete checkout process', async ({ page, logger }) => {
  logger.info('Starting checkout test');

  const checkoutPage = new CheckoutPage(page, baseUrl);
  logger.info('Navigating to checkout page');
  await checkoutPage.navigateToCheckout();

  logger.info('Filling shipping information');
  await checkoutPage.fillShippingInfo({
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    city: 'Test City',
    zipCode: '12345',
  });

  // More test steps with logging
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        environment: [dev, staging]
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run test:${{ matrix.environment }} -- --project=${{ matrix.browser }}
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.environment }}-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30
```

## Common Patterns

### Page Object Pattern

```typescript
// Page object
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.emailInput = this.page.getByLabel('Email');
    this.passwordInput = this.page.getByLabel('Password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
    this.errorMessage = this.page.getByTestId('login-error');
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}

// Test using page object
test('should login successfully', async ({ page, environment }) => {
  const loginPage = new LoginPage(page, environment.baseUrl);
  await loginPage.navigateToLogin();
  await loginPage.login('user@example.com', 'password123');

  // Verify successful login
  await expect(page).toHaveURL(/.*dashboard/);
});
```

### Component Pattern

```typescript
// Component
export class SearchComponent extends BaseComponent {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    const rootLocator = page.getByTestId('search-component');
    super(page, rootLocator, 'Search Component');

    this.searchInput = this.rootLocator.getByRole('searchbox');
    this.searchButton = this.rootLocator.getByRole('button', { name: 'Search' });
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}

// Test using component
test('should search for products', async ({ page, environment }) => {
  const homePage = new HomePage(page, environment.baseUrl);
  await homePage.navigateToHome();

  // Use search component
  await homePage.searchComponent.search('laptop');

  // Verify search results
  await expect(page).toHaveURL(/.*search=laptop/);
});
```

### Data-Driven Testing

```typescript
const testCases = [
  { username: 'user1', password: 'pass1', expectedError: 'Invalid username or password' },
  { username: 'user2', password: '', expectedError: 'Password is required' },
  { username: '', password: 'pass2', expectedError: 'Username is required' },
  { username: '', password: '', expectedError: 'Username and password are required' },
];

for (const { username, password, expectedError } of testCases) {
  test(`should show error for invalid login: ${username}/${password}`, async ({ page }) => {
    const loginPage = new LoginPage(page, baseUrl);
    await loginPage.navigateToLogin();
    await loginPage.login(username, password);

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(expectedError);
  });
}
```

## Anti-Patterns to Avoid

### Avoid Hardcoded Waits

```typescript
// Bad - Hardcoded wait
await page.waitForTimeout(5000);

// Good - Wait for specific condition
await page.waitForSelector('.product-list');
// or
await page.waitForLoadState('networkidle');
```

### Avoid Excessive Assertions

```typescript
// Bad - Too many assertions in one test
test('product page', async ({ page }) => {
  // Setup
  const productPage = new ProductPage(page, baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  // Too many assertions testing different things
  expect(await productPage.getProductName()).toBe('Laptop XYZ');
  expect(await productPage.getProductPrice()).toBe('$999.99');
  expect(await productPage.getProductRating()).toBe(4.5);
  await productPage.addToCart();
  expect(await productPage.header.getCartCount()).toBe('1');
  await productPage.header.clickCart();
  expect(await page.url()).toContain('/cart');
  // More assertions...
});

// Good - Focused test with related assertions
test('should display correct product details', async ({ page }) => {
  const productPage = new ProductPage(page, baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  expect(await productPage.getProductName()).toBe('Laptop XYZ');
  expect(await productPage.getProductPrice()).toBe('$999.99');
  expect(await productPage.getProductRating()).toBe(4.5);
});

test('should add product to cart', async ({ page }) => {
  const productPage = new ProductPage(page, baseUrl);
  await productPage.navigateTo('/products/laptop-123');

  await productPage.addToCart();
  expect(await productPage.header.getCartCount()).toBe('1');
});
```

### Avoid Test Interdependence

```typescript
// Bad - Tests depend on each other
test('should login', async ({ page }) => {
  // Login implementation
  // This test must run first
});

test('should view dashboard after login', async ({ page }) => {
  // Assumes user is already logged in from previous test
  // This will fail if run independently
});

// Good - Tests are independent
test('should login', async ({ page }) => {
  // Login implementation
});

test('should view dashboard after login', async ({ page }) => {
  // Perform login first
  await loginUser(page);
  // Then test dashboard
});
```

### Avoid Selector Duplication

```typescript
// Bad - Duplicated selectors
test('should login', async ({ page }) => {
  await page.fill('[data-testid="email-input"]', 'user@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');
});

test('should show error for invalid login', async ({ page }) => {
  await page.fill('[data-testid="email-input"]', 'invalid@example.com');
  await page.fill('[data-testid="password-input"]', 'wrongpassword');
  await page.click('[data-testid="login-button"]');

  const errorText = await page.textContent('[data-testid="error-message"]');
  expect(errorText).toBe('Invalid credentials');
});

// Good - Use page objects to avoid selector duplication
test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page, baseUrl);
  await loginPage.navigateToLogin();
  await loginPage.login('user@example.com', 'password123');
});

test('should show error for invalid login', async ({ page }) => {
  const loginPage = new LoginPage(page, baseUrl);
  await loginPage.navigateToLogin();
  await loginPage.login('invalid@example.com', 'wrongpassword');

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe('Invalid credentials');
});
```

### Avoid Testing Implementation Details

```typescript
// Bad - Testing implementation details
test('should toggle menu', async ({ page }) => {
  await page.click('.menu-toggle');
  const menuClassList = await page.$eval('.menu', el => el.classList.toString());
  expect(menuClassList).toContain('menu--open');
});

// Good - Testing behavior
test('should toggle menu', async ({ page }) => {
  const header = new HeaderComponent(page);
  await header.toggleMenu();

  // Test that menu items are visible
  expect(await header.isMenuVisible()).toBe(true);
});
```
