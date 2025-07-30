# Test Examples

This document provides examples of different types of tests that can be implemented using our Playwright component-based automation framework.

## Table of Contents

- [E2E Tests](#e2e-tests)
- [Component Tests](#component-tests)
- [API Tests](#api-tests)
- [Visual Tests](#visual-tests)
- [Accessibility Tests](#accessibility-tests)
- [Performance Tests](#performance-tests)
- [Mobile Tests](#mobile-tests)
- [Data-Driven Tests](#data-driven-tests)
- [Authentication Tests](#authentication-tests)
- [Error Handling Tests](#error-handling-tests)

## E2E Tests

End-to-end tests verify complete user flows from start to finish.

### Example: Complete Checkout Flow Using Fixtures (Recommended)

```typescript
// First, define the fixtures in src/fixtures/checkout-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { HomePage } from '../../src/pages/home/home-page';
import { ProductsPage } from '../../src/pages/product/products-page';
import { ProductDetailPage } from '../../src/pages/product/product-detail-page';
import { CartPage } from '../../src/pages/checkout/cart-page';
import { CheckoutPage } from '../../src/pages/checkout/checkout-page';
import { OrderConfirmationPage } from '../../src/pages/checkout/order-confirmation-page';

// Define the fixture types
interface CheckoutFixtures {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
}

// Extend the base test with page fixtures
export const test = baseTest.extend<CheckoutFixtures>({
  homePage: async ({ page, environment }, use) => {
    await use(new HomePage(page, environment.baseUrl));
  },

  productsPage: async ({ page, environment }, use) => {
    await use(new ProductsPage(page, environment.baseUrl));
  },

  productDetailPage: async ({ page, environment }, use) => {
    await use(new ProductDetailPage(page, environment.baseUrl));
  },

  cartPage: async ({ page, environment }, use) => {
    await use(new CartPage(page, environment.baseUrl));
  },

  checkoutPage: async ({ page, environment }, use) => {
    await use(new CheckoutPage(page, environment.baseUrl));
  },

  orderConfirmationPage: async ({ page, environment }, use) => {
    await use(new OrderConfirmationPage(page, environment.baseUrl));
  },
});

export { expect } from '@playwright/test';

// Then use the fixtures in your test
// tests/e2e/checkout/checkout.spec.ts
import { test, expect } from '../../../src/fixtures/checkout-fixtures';

test.describe('Checkout Flow', () => {
  test('should complete checkout process successfully', async ({
    homePage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
    orderConfirmationPage,
  }) => {
    // Step 1: Navigate to home page
    await homePage.navigateToHome();

    // Step 2: Search for a product
    await homePage.header.search('laptop');

    // Step 3: Select the first product
    const products = await productsPage.getProductCards();
    expect(products.length).toBeGreaterThan(0);
    await products[0].clickTitle();

    // Step 4: Add product to cart
    await productDetailPage.addToCart();

    // Step 5: Navigate to cart
    await productDetailPage.header.clickCart();

    // Step 6: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 7: Fill shipping information
    await checkoutPage.fillShippingInfo({
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      country: 'United States',
    });

    // Step 8: Fill payment information
    await checkoutPage.fillPaymentInfo({
      cardNumber: '4111111111111111',
      cardName: 'Test User',
      expiryDate: '12/25',
      cvv: '123',
    });

    // Step 9: Place order
    await checkoutPage.placeOrder();

    // Step 10: Verify order confirmation
    expect(await orderConfirmationPage.isOrderConfirmed()).toBe(true);
    const orderNumber = await orderConfirmationPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();

    // Step 11: Verify order details
    const orderTotal = await orderConfirmationPage.getOrderTotal();
    expect(orderTotal).toMatch(/\$\d+\.\d{2}/);
  });
});
```

## Component Tests

Component tests verify that individual UI components work correctly in isolation.

### Example: Testing a Search Component

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { SearchComponent } from '../../src/components/forms/search-component';

test.describe('Search Component', () => {
  test('should perform search with valid input', async ({ page }) => {
    // Create a test page with the component
    await page.setContent(`
      <div data-testid="search-form">
        <input type="search" placeholder="Search..." aria-label="Search">
        <button>Search</button>
      </div>
    `);

    // Initialize the component
    const searchComponent = new SearchComponent(page);

    // Perform search
    await searchComponent.search('test query');

    // Verify the search was performed
    // We can verify by checking if the form was submitted with the correct value
    const searchValue = await page.evaluate(() => {
      return document.querySelector('input[type="search"]')?.value || '';
    });

    expect(searchValue).toBe('test query');
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    // Create a test page with the component
    await page.setContent(`
      <div data-testid="search-form">
        <input type="search" placeholder="Search..." aria-label="Search" value="initial value">
        <button>Search</button>
        <button aria-label="Clear">✕</button>
      </div>
    `);

    // Initialize the component
    const searchComponent = new SearchComponent(page);

    // Clear search
    await searchComponent.clearSearch();

    // Verify the search was cleared
    const searchValue = await page.evaluate(() => {
      return document.querySelector('input[type="search"]')?.value || '';
    });

    expect(searchValue).toBe('');
  });
});
```

## API Tests

API tests verify that backend APIs work correctly.

### Example: Testing Product API

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { ProductApiClient } from '../../src/api/clients/product-api-client';

test.describe('Product API', () => {
  let productApiClient: ProductApiClient;

  test.beforeEach(({ request, environment }) => {
    productApiClient = new ProductApiClient(request, environment.apiUrl);
  });

  test('should get product list', async () => {
    // Call the API
    const response = await productApiClient.getProducts();

    // Verify response
    expect(response.status).toBe(200);
    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    // Verify product structure
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('description');
  });

  test('should get product by ID', async () => {
    // First get all products to get a valid ID
    const allProductsResponse = await productApiClient.getProducts();
    const products = await allProductsResponse.json();
    const productId = products[0].id;

    // Call the API with the ID
    const response = await productApiClient.getProductById(productId);

    // Verify response
    expect(response.status).toBe(200);
    const product = await response.json();
    expect(product).toHaveProperty('id', productId);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
  });

  test('should return 404 for non-existent product', async () => {
    // Call the API with an invalid ID
    const response = await productApiClient.getProductById('non-existent-id');

    // Verify response
    expect(response.status).toBe(404);
  });
});
```

## Visual Tests

Visual tests verify that UI components and pages look as expected.

### Example: Visual Testing a Product Card

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { ProductCardComponent } from '../../src/components/cards/product-card-component';

test.describe('Product Card Visual Tests', () => {
  test('should match product card snapshot', async ({ page }) => {
    // Create a test page with a product card
    await page.setContent(`
      <div data-testid="product-card">
        <img src="https://example.com/product.jpg" alt="Product Image">
        <h3>Product Name</h3>
        <div data-testid="product-price">$99.99</div>
        <div data-testid="rating-stars" aria-label="4.5 stars">★★★★½</div>
        <button>Add to Cart</button>
        <button aria-label="Add to Wishlist">♡</button>
      </div>
    `);

    // Initialize the component
    const productCard = new ProductCardComponent(page, page.getByTestId('product-card'));

    // Take a screenshot and compare with baseline
    await expect(page.getByTestId('product-card')).toHaveScreenshot('product-card.png');
  });

  test('should match product card hover state snapshot', async ({ page }) => {
    // Create a test page with a product card
    await page.setContent(`
      <style>
        [data-testid="product-card"]:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transform: translateY(-4px);
        }
      </style>
      <div data-testid="product-card">
        <img src="https://example.com/product.jpg" alt="Product Image">
        <h3>Product Name</h3>
        <div data-testid="product-price">$99.99</div>
        <div data-testid="rating-stars" aria-label="4.5 stars">★★★★½</div>
        <button>Add to Cart</button>
        <button aria-label="Add to Wishlist">♡</button>
      </div>
    `);

    // Initialize the component
    const productCard = new ProductCardComponent(page, page.getByTestId('product-card'));

    // Hover over the card
    await page.getByTestId('product-card').hover();

    // Take a screenshot and compare with baseline
    await expect(page.getByTestId('product-card')).toHaveScreenshot('product-card-hover.png');
  });
});
```

## Accessibility Tests

Accessibility tests verify that the application is accessible to all users.

### Example: Testing Form Accessibility

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import AxeBuilder from '@axe-core/playwright';

test.describe('Form Accessibility', () => {
  test('login form should be accessible', async ({ page, environment }) => {
    // Navigate to login page
    await page.goto(`${environment.baseUrl}/login`);

    // Run accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Verify no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('registration form should be accessible', async ({ page, environment }) => {
    // Navigate to registration page
    await page.goto(`${environment.baseUrl}/register`);

    // Run accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Verify no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

## Performance Tests

Performance tests verify that the application performs well under various conditions.

### Example: Measuring Page Load Performance

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { HomePage } from '../../src/pages/home/home-page';

test.describe('Page Load Performance', () => {
  test('home page should load within acceptable time', async ({ page, environment }) => {
    // Create performance observer
    await page.evaluate(() => {
      window.performanceEntries = [];
      const observer = new PerformanceObserver(list => {
        window.performanceEntries.push(...list.getEntries());
      });
      observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    });

    // Navigate to home page
    const homePage = new HomePage(page, environment.baseUrl);
    await homePage.navigateToHome();

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigationEntry = window.performanceEntries.find(
        entry => entry.entryType === 'navigation'
      );

      const firstPaint = window.performanceEntries.find(entry => entry.name === 'first-paint');

      const firstContentfulPaint = window.performanceEntries.find(
        entry => entry.name === 'first-contentful-paint'
      );

      return {
        navigationStart: navigationEntry?.startTime || 0,
        loadEventEnd: navigationEntry?.loadEventEnd || 0,
        domContentLoaded: navigationEntry?.domContentLoadedEventEnd || 0,
        firstPaint: firstPaint?.startTime || 0,
        firstContentfulPaint: firstContentfulPaint?.startTime || 0,
        totalLoadTime: navigationEntry
          ? navigationEntry.loadEventEnd - navigationEntry.startTime
          : 0,
      };
    });

    // Verify performance metrics
    expect(metrics.totalLoadTime).toBeLessThan(3000); // Total load time < 3s
    expect(metrics.firstPaint).toBeLessThan(1000); // First paint < 1s
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // First contentful paint < 1.5s
  });
});
```

## Mobile Tests

Mobile tests verify that the application works correctly on mobile devices.

### Example: Testing Responsive Behavior

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { HomePage } from '../../src/pages/home/home-page';

// Define device configurations
const devices = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

// Test for each device
for (const device of devices) {
  test.describe(`Responsive Tests - ${device.name}`, () => {
    test.use({ viewport: { width: device.width, height: device.height } });

    test('header should adapt to screen size', async ({ page, environment }) => {
      // Navigate to home page
      const homePage = new HomePage(page, environment.baseUrl);
      await homePage.navigateToHome();

      // Check header behavior based on device
      if (device.name === 'Mobile') {
        // On mobile, menu should be collapsed
        const menuButton = page.getByRole('button', { name: 'Menu' });
        expect(await menuButton.isVisible()).toBe(true);

        // Navigation links should be hidden
        const navLinks = page.getByTestId('nav-links');
        expect(await navLinks.isVisible()).toBe(false);

        // Clicking menu should show navigation
        await menuButton.click();
        expect(await navLinks.isVisible()).toBe(true);
      } else {
        // On tablet and desktop, menu should be expanded
        const menuButton = page.getByRole('button', { name: 'Menu' });
        expect(await menuButton.isVisible()).toBe(false);

        // Navigation links should be visible
        const navLinks = page.getByTestId('nav-links');
        expect(await navLinks.isVisible()).toBe(true);
      }
    });

    test('product grid should adapt to screen size', async ({ page, environment }) => {
      // Navigate to products page
      await page.goto(`${environment.baseUrl}/products`);

      // Get product cards
      const productCards = page.getByTestId('product-card');
      const count = await productCards.count();
      expect(count).toBeGreaterThan(0);

      // Get the width of the first product card
      const firstCardBoundingBox = await productCards.first().boundingBox();
      expect(firstCardBoundingBox).not.toBeNull();

      // Verify card width based on device
      if (device.name === 'Mobile') {
        // On mobile, cards should be full width
        expect(firstCardBoundingBox?.width).toBeGreaterThan(device.width * 0.9);
      } else if (device.name === 'Tablet') {
        // On tablet, cards should be about half width
        expect(firstCardBoundingBox?.width).toBeLessThan(device.width * 0.5);
      } else {
        // On desktop, cards should be about a quarter width
        expect(firstCardBoundingBox?.width).toBeLessThan(device.width * 0.25);
      }
    });
  });
}
```

## Data-Driven Tests

Data-driven tests run the same test with different input data.

### Example: Testing Form Validation

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { RegistrationPage } from '../../src/pages/auth/registration-page';

test.describe('Registration Form Validation', () => {
  // Test cases for email validation
  const emailTestCases = [
    { email: '', expected: 'Email is required' },
    { email: 'invalid-email', expected: 'Please enter a valid email address' },
    { email: 'test@example', expected: 'Please enter a valid email address' },
    { email: 'test@example.com', expected: '' }, // Valid email, no error
  ];

  // Test cases for password validation
  const passwordTestCases = [
    { password: '', expected: 'Password is required' },
    { password: '12345', expected: 'Password must be at least 8 characters long' },
    { password: 'password', expected: 'Password must include at least one number' },
    { password: '12345678', expected: 'Password must include at least one letter' },
    { password: 'Password123', expected: '' }, // Valid password, no error
  ];

  // Test email validation
  for (const { email, expected } of emailTestCases) {
    test(`should validate email: "${email}"`, async ({ page, environment }) => {
      // Navigate to registration page
      const registrationPage = new RegistrationPage(page, environment.baseUrl);
      await registrationPage.navigateToRegistration();

      // Enter email and trigger validation
      await registrationPage.enterEmail(email);
      await registrationPage.blurEmailField();

      // Check error message
      const errorMessage = await registrationPage.getEmailErrorMessage();
      if (expected === '') {
        expect(errorMessage).toBeNull();
      } else {
        expect(errorMessage).toBe(expected);
      }
    });
  }

  // Test password validation
  for (const { password, expected } of passwordTestCases) {
    test(`should validate password: "${password}"`, async ({ page, environment }) => {
      // Navigate to registration page
      const registrationPage = new RegistrationPage(page, environment.baseUrl);
      await registrationPage.navigateToRegistration();

      // Enter password and trigger validation
      await registrationPage.enterPassword(password);
      await registrationPage.blurPasswordField();

      // Check error message
      const errorMessage = await registrationPage.getPasswordErrorMessage();
      if (expected === '') {
        expect(errorMessage).toBeNull();
      } else {
        expect(errorMessage).toBe(expected);
      }
    });
  }
});
```

## Authentication Tests

Authentication tests verify that authentication flows work correctly.

### Example: Testing Login Flow Using Fixtures

```typescript
// First, define the fixtures in src/fixtures/auth-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/login-page';
import { DashboardPage } from '../../src/pages/dashboard/dashboard-page';

// Define the fixture types
interface AuthFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  // Add a fixture for authenticated state
  authenticatedPage: (typeof baseTest.fixtures)['page'];
}

// Extend the base test with auth fixtures
export const test = baseTest.extend<AuthFixtures>({
  loginPage: async ({ page, environment }, use) => {
    await use(new LoginPage(page, environment.baseUrl));
  },

  dashboardPage: async ({ page, environment }, use) => {
    await use(new DashboardPage(page, environment.baseUrl));
  },

  // Fixture that provides an authenticated page
  authenticatedPage: async ({ browser, environment }, use) => {
    // Create a new context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login
    const loginPage = new LoginPage(page, environment.baseUrl);
    await loginPage.navigateToLogin();
    await loginPage.login(environment.credentials.username, environment.credentials.password);

    // Wait for login to complete
    await page.waitForURL(`${environment.baseUrl}/dashboard`);

    // Use the authenticated page
    await use(page);

    // Clean up
    await context.close();
  },
});

export { expect } from '@playwright/test';

// Then use the fixtures in your test
// tests/e2e/auth/auth.spec.ts
import { test, expect } from '../../../src/fixtures/auth-fixtures';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ loginPage, dashboardPage }) => {
    // Navigate to login page
    await loginPage.navigateToLogin();

    // Login with valid credentials
    await loginPage.login(
      test.info().project.use.environment.credentials.username,
      test.info().project.use.environment.credentials.password
    );

    // Verify redirect to dashboard
    expect(await dashboardPage.isDashboardLoaded()).toBe(true);

    // Verify user is logged in
    expect(await dashboardPage.header.isLoggedIn()).toBe(true);
    const username = await dashboardPage.header.getLoggedInUsername();
    expect(username).toContain(test.info().project.use.environment.credentials.username);
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    // Navigate to login page
    await loginPage.navigateToLogin();

    // Login with invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Verify error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid username or password');

    // Verify user is not logged in
    expect(await loginPage.header.isLoggedIn()).toBe(false);
  });

  // Using the authenticatedPage fixture
  test('should access protected page when authenticated', async ({
    authenticatedPage: page,
    environment,
  }) => {
    // Navigate to a protected page
    await page.goto(`${environment.baseUrl}/account/settings`);

    // Verify the page loaded (no redirect to login)
    expect(page.url()).toContain('/account/settings');

    // Verify some account settings content is visible
    await expect(page.getByRole('heading', { name: 'Account Settings' })).toBeVisible();
  });

  // Using the authenticatedPage fixture for logout test
  test('should logout successfully', async ({ authenticatedPage: page, loginPage }) => {
    // Get header from the authenticated page
    const header = page.getByTestId('header-component');

    // Click logout button
    await header.getByRole('button', { name: 'Logout' }).click();

    // Verify user is logged out and redirected to login page
    expect(await loginPage.isLoginPageLoaded()).toBe(true);
    expect(await loginPage.header.isLoggedIn()).toBe(false);
  });
});
```

## Error Handling Tests

Error handling tests verify that the application handles errors gracefully.

### Example: Testing Network Error Handling

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { ProductsPage } from '../../src/pages/product/products-page';

test.describe('Error Handling', () => {
  test('should handle API error when loading products', async ({ page, environment }) => {
    // Mock API error
    await page.route('**/api/products', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Navigate to products page
    const productsPage = new ProductsPage(page, environment.baseUrl);
    await productsPage.navigateToProductsPage();

    // Verify error message is displayed
    const errorMessage = await productsPage.getErrorMessage();
    expect(errorMessage).toContain('Error loading products');

    // Verify retry button is displayed
    expect(await productsPage.isRetryButtonVisible()).toBe(true);

    // Click retry button and verify API is called again
    let apiCalled = false;
    await page.route('**/api/products', route => {
      apiCalled = true;
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    await productsPage.clickRetryButton();
    expect(apiCalled).toBe(true);
  });

  test('should handle network offline state', async ({ page, environment }) => {
    // Navigate to products page
    const productsPage = new ProductsPage(page, environment.baseUrl);
    await productsPage.navigateToProductsPage();

    // Simulate offline state
    await page.context().setOffline(true);

    // Try to search for products
    await productsPage.searchProducts('laptop');

    // Verify offline message is displayed
    const offlineMessage = await productsPage.getOfflineMessage();
    expect(offlineMessage).toContain('You are offline');

    // Restore online state
    await page.context().setOffline(false);

    // Verify offline message is hidden
    expect(await productsPage.isOfflineMessageVisible()).toBe(false);
  });
});
```
