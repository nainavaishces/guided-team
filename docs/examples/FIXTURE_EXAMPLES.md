# Fixture Examples

This document provides examples of how to use fixtures in our Playwright component-based automation framework.

## Table of Contents

- [Page Object Fixtures](#page-object-fixtures)
- [API Client Fixtures](#api-client-fixtures)
- [Data Fixtures](#data-fixtures)
- [Authentication Fixtures](#authentication-fixtures)
- [Custom Fixture Composition](#custom-fixture-composition)
- [Best Practices](#best-practices)

## Page Object Fixtures

Instead of instantiating page objects directly in each test, use fixtures to provide them:

### Creating Page Object Fixtures

```typescript
// src/fixtures/page-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { Environment } from '../config/env';
import { HomePage } from '../pages/home/home-page';
import { ProductsPage } from '../pages/product/products-page';
import { ProductDetailPage } from '../pages/product/product-detail-page';
import { CartPage } from '../pages/checkout/cart-page';
import { CheckoutPage } from '../pages/checkout/checkout-page';

// Define the fixture types
interface PageFixtures {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

// Extend the base test with page fixtures
export const test = baseTest.extend<PageFixtures>({
  homePage: async ({ page, environment }, use) => {
    const homePage = new HomePage(page, environment.baseUrl);
    await use(homePage);
  },

  productsPage: async ({ page, environment }, use) => {
    const productsPage = new ProductsPage(page, environment.baseUrl);
    await use(productsPage);
  },

  productDetailPage: async ({ page, environment }, use) => {
    const productDetailPage = new ProductDetailPage(page, environment.baseUrl);
    await use(productDetailPage);
  },

  cartPage: async ({ page, environment }, use) => {
    const cartPage = new CartPage(page, environment.baseUrl);
    await use(cartPage);
  },

  checkoutPage: async ({ page, environment }, use) => {
    const checkoutPage = new CheckoutPage(page, environment.baseUrl);
    await use(checkoutPage);
  },
});

// Re-export expect
export { expect } from '@playwright/test';
```

### Using Page Object Fixtures in Tests

```typescript
// tests/e2e/checkout/checkout.spec.ts
import { test, expect } from '../../../src/fixtures/page-fixtures';

test.describe('Checkout Flow', () => {
  test('should complete checkout process successfully', async ({
    homePage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
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

    // Continue with checkout process...
  });
});
```

## API Client Fixtures

Similar to page objects, API clients can be provided through fixtures:

### Creating API Client Fixtures

```typescript
// src/fixtures/api-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { ProductApiClient } from '../api/clients/product-api-client';
import { UserApiClient } from '../api/clients/user-api-client';
import { OrderApiClient } from '../api/clients/order-api-client';

// Define the fixture types
interface ApiFixtures {
  productApi: ProductApiClient;
  userApi: UserApiClient;
  orderApi: OrderApiClient;
}

// Extend the base test with API fixtures
export const test = baseTest.extend<ApiFixtures>({
  productApi: async ({ request, environment }, use) => {
    const productApi = new ProductApiClient(request, environment.apiUrl);
    await use(productApi);
  },

  userApi: async ({ request, environment }, use) => {
    const userApi = new UserApiClient(request, environment.apiUrl);
    await use(userApi);
  },

  orderApi: async ({ request, environment }, use) => {
    const orderApi = new OrderApiClient(request, environment.apiUrl);
    await use(orderApi);
  },
});

// Re-export expect
export { expect } from '@playwright/test';
```

### Using API Client Fixtures in Tests

```typescript
// tests/api/products/products-api.spec.ts
import { test, expect } from '../../../src/fixtures/api-fixtures';

test.describe('Product API', () => {
  test('should get product list', async ({ productApi }) => {
    // Call the API
    const response = await productApi.getProducts();

    // Verify response
    expect(response.status).toBe(200);
    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should get product by ID', async ({ productApi }) => {
    // First get all products to get a valid ID
    const allProductsResponse = await productApi.getProducts();
    const products = await allProductsResponse.json();
    const productId = products[0].id;

    // Call the API with the ID
    const response = await productApi.getProductById(productId);

    // Verify response
    expect(response.status).toBe(200);
    const product = await response.json();
    expect(product).toHaveProperty('id', productId);
  });
});
```

## Data Fixtures

Data fixtures provide test data:

### Creating Data Fixtures

```typescript
// src/fixtures/data-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { UserFactory } from '../data/factories/user-factory';
import { ProductFactory } from '../data/factories/product-factory';
import { OrderFactory } from '../data/factories/order-factory';

// Define the fixture types
interface DataFixtures {
  testUser: ReturnType<typeof UserFactory.createRandomUser>;
  adminUser: ReturnType<typeof UserFactory.createAdminUser>;
  testProduct: ReturnType<typeof ProductFactory.createRandomProduct>;
  testOrder: ReturnType<typeof OrderFactory.createRandomOrder>;
}

// Extend the base test with data fixtures
export const test = baseTest.extend<DataFixtures>({
  testUser: async ({}, use) => {
    const user = UserFactory.createRandomUser();
    await use(user);
  },

  adminUser: async ({}, use) => {
    const admin = UserFactory.createAdminUser();
    await use(admin);
  },

  testProduct: async ({}, use) => {
    const product = ProductFactory.createRandomProduct();
    await use(product);
  },

  testOrder: async ({}, use) => {
    const order = OrderFactory.createRandomOrder();
    await use(order);
  },
});

// Re-export expect
export { expect } from '@playwright/test';
```

### Using Data Fixtures in Tests

```typescript
// tests/e2e/auth/registration.spec.ts
import { test, expect } from '../../../src/fixtures/data-fixtures';

test.describe('User Registration', () => {
  test('should register a new user', async ({ page, environment, testUser }) => {
    // Navigate to registration page
    await page.goto(`${environment.baseUrl}/register`);

    // Fill registration form using test data
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByLabel('First Name').fill(testUser.firstName);
    await page.getByLabel('Last Name').fill(testUser.lastName);

    // Submit form
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify successful registration
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

## Authentication Fixtures

Authentication fixtures handle user login:

### Creating Authentication Fixtures

```typescript
// src/fixtures/auth-fixtures.ts
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/auth/login-page';
import { UserFactory } from '../data/factories/user-factory';

// Define the fixture types
interface AuthFixtures {
  authenticatedPage: (typeof baseTest.fixtures)['page'];
  adminPage: (typeof baseTest.fixtures)['page'];
}

// Extend the base test with authentication fixtures
export const test = baseTest.extend<AuthFixtures>({
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

  adminPage: async ({ browser, environment }, use) => {
    // Create a new context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login as admin
    const loginPage = new LoginPage(page, environment.baseUrl);
    await loginPage.navigateToLogin();
    await loginPage.login(
      environment.credentials.adminUsername,
      environment.credentials.adminPassword
    );

    // Wait for login to complete
    await page.waitForURL(`${environment.baseUrl}/admin/dashboard`);

    // Use the admin page
    await use(page);

    // Clean up
    await context.close();
  },
});

// Re-export expect
export { expect } from '@playwright/test';
```

### Using Authentication Fixtures in Tests

```typescript
// tests/e2e/user/profile.spec.ts
import { test, expect } from '../../../src/fixtures/auth-fixtures';

test.describe('User Profile', () => {
  test('authenticated user can view profile', async ({ authenticatedPage: page, environment }) => {
    // Navigate to profile page
    await page.goto(`${environment.baseUrl}/profile`);

    // Verify profile page is loaded
    await expect(page.getByRole('heading', { name: 'Your Profile' })).toBeVisible();

    // Verify user information is displayed
    await expect(page.getByText(environment.credentials.username)).toBeVisible();
  });

  test('admin user can access admin panel', async ({ adminPage: page, environment }) => {
    // Navigate to admin panel
    await page.goto(`${environment.baseUrl}/admin`);

    // Verify admin panel is loaded
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  });
});
```

## Custom Fixture Composition

You can compose fixtures from multiple sources:

### Creating Composite Fixtures

```typescript
// src/fixtures/composite-fixtures.ts
import { test as pageTest } from './page-fixtures';
import { test as apiTest } from './api-fixtures';
import { test as dataTest } from './data-fixtures';

// Combine fixtures from multiple sources
export const test = pageTest.extend({
  // Add API fixtures
  productApi: apiTest.fixtures.productApi,
  userApi: apiTest.fixtures.userApi,
  orderApi: apiTest.fixtures.orderApi,

  // Add data fixtures
  testUser: dataTest.fixtures.testUser,
  testProduct: dataTest.fixtures.testProduct,
});

// Re-export expect
export { expect } from '@playwright/test';
```

### Using Composite Fixtures in Tests

```typescript
// tests/e2e/product/product-management.spec.ts
import { test, expect } from '../../../src/fixtures/composite-fixtures';

test.describe('Product Management', () => {
  test('should create and view product', async ({
    homePage,
    productsPage,
    productApi,
    testProduct,
  }) => {
    // Create product via API
    const createResponse = await productApi.createProduct(testProduct);
    expect(createResponse.status).toBe(201);
    const { id } = await createResponse.json();

    // Navigate to home page
    await homePage.navigateToHome();

    // Search for the created product
    await homePage.header.search(testProduct.name);

    // Verify product is displayed
    const products = await productsPage.getProductCards();
    const productNames = await Promise.all(products.map(p => p.getTitle()));
    expect(productNames).toContain(testProduct.name);

    // Clean up
    await productApi.deleteProduct(id);
  });
});
```

## Best Practices

### 1. Organize Fixtures by Domain

Group fixtures by their domain or purpose:

- Page fixtures for UI interactions
- API fixtures for API calls
- Data fixtures for test data
- Authentication fixtures for login/logout

### 2. Keep Fixtures Lightweight

Fixtures should be lightweight and focused:

- Initialize only what's needed
- Avoid complex setup logic in fixtures
- Use helper functions for complex setup

### 3. Handle Cleanup

Always clean up resources created by fixtures:

- Close contexts and pages
- Delete test data
- Log out users

### 4. Use Dependency Injection

Fixtures can depend on other fixtures:

```typescript
// Fixture that depends on another fixture
myFixture: async ({ anotherFixture }, use) => {
  // Use anotherFixture to set up myFixture
  const myFixture = new MyThing(anotherFixture);
  await use(myFixture);
};
```

### 5. Parameterize Fixtures

Use parameterized fixtures for variations:

```typescript
// Parameterized fixture
test.extend({
  userRole: ['admin', 'customer', 'guest'],
  authenticatedPage: async ({ browser, environment, userRole }, use) => {
    // Create context and page
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login based on role
    if (userRole !== 'guest') {
      const credentials =
        userRole === 'admin' ? environment.credentials.admin : environment.credentials.customer;

      const loginPage = new LoginPage(page, environment.baseUrl);
      await loginPage.navigateToLogin();
      await loginPage.login(credentials.username, credentials.password);
    }

    await use(page);
    await context.close();
  },
});
```

### 6. Combine with Worker Fixtures

For expensive setup that should be shared across tests:

```typescript
// Worker fixture (shared across tests in a worker)
test.extend({
  // Use {} to mark as worker fixture
  database: [
    async ({}, use) => {
      // Set up database connection
      const db = await Database.connect();

      // Seed test data
      await db.seed();

      await use(db);

      // Clean up
      await db.disconnect();
    },
    { scope: 'worker' },
  ],
});
```

### 7. Document Fixtures

Add JSDoc comments to fixtures:

```typescript
/**
 * Provides an authenticated page with a logged-in user
 * @param browser - The browser instance
 * @param environment - The environment configuration
 * @param use - The fixture use callback
 */
authenticatedPage: async ({ browser, environment }, use) => {
  // Implementation
};
```
