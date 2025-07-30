# Component Examples

This document provides examples of how to create and use components in our Playwright component-based automation framework, following Playwright's best practices for locators.

## Table of Contents

- [Basic Component Structure](#basic-component-structure)
- [Navigation Component Example](#navigation-component-example)
- [Form Component Example](#form-component-example)
- [Modal Component Example](#modal-component-example)
- [Card Component Example](#card-component-example)
- [Composite Component Example](#composite-component-example)
- [Using Components in Page Objects](#using-components-in-page-objects)
- [Using Components in Tests](#using-components-in-tests)
- [Best Practices](#best-practices)

## Basic Component Structure

All components should extend the `BaseComponent` class and follow this basic structure, using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class MyComponent extends BaseComponent {
  // Define locators as private readonly properties
  private readonly button: Locator;
  private readonly input: Locator;
  // Add more locators as needed

  constructor(page: Page, rootLocator: Locator) {
    // Pass the root locator and component name to the base class
    super(page, rootLocator, 'My Component');

    // Initialize locators relative to the root locator
    this.button = this.rootLocator.getByRole('button', { name: 'Submit' });
    this.input = this.rootLocator.getByLabel('Search');
  }

  // Implement component-specific methods
  async clickButton(): Promise<void> {
    this.logger.info('Clicking submit button');
    await this.button.click();
  }

  async enterText(text: string): Promise<void> {
    this.logger.info(`Entering text: ${text}`);
    await this.input.fill(text);
  }

  // Add more methods as needed
}
```

## Navigation Component Example

Here's an example of a navigation menu component using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class NavigationComponent extends BaseComponent {
  // Define locators using Playwright's recommended patterns
  private readonly homeLink: Locator;
  private readonly productsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly contactLink: Locator;
  private readonly dropdownToggle: Locator;
  private readonly dropdownMenu: Locator;

  constructor(page: Page) {
    // Use getByTestId for the root element
    const rootLocator = page.getByTestId('main-navigation');
    super(page, rootLocator, 'Navigation');

    // Initialize locators using Playwright's recommended methods
    this.homeLink = this.rootLocator.getByRole('link', { name: 'Home' });
    this.productsLink = this.rootLocator.getByRole('link', { name: 'Products' });
    this.aboutLink = this.rootLocator.getByRole('link', { name: 'About' });
    this.contactLink = this.rootLocator.getByRole('link', { name: 'Contact' });
    this.dropdownToggle = this.rootLocator.getByRole('button', { name: 'More Options' });
    this.dropdownMenu = this.rootLocator.getByTestId('nav-dropdown-menu');
  }

  async navigateToHome(): Promise<void> {
    this.logger.info('Navigating to Home');
    await this.homeLink.click();
  }

  async navigateToProducts(): Promise<void> {
    this.logger.info('Navigating to Products');
    await this.productsLink.click();
  }

  async navigateToAbout(): Promise<void> {
    this.logger.info('Navigating to About');
    await this.aboutLink.click();
  }

  async navigateToContact(): Promise<void> {
    this.logger.info('Navigating to Contact');
    await this.contactLink.click();
  }

  async openDropdown(): Promise<void> {
    if (!(await this.isDropdownOpen())) {
      this.logger.info('Opening dropdown menu');
      await this.dropdownToggle.click();
      await this.dropdownMenu.waitFor({ state: 'visible' });
    }
  }

  async selectDropdownItem(itemText: string): Promise<void> {
    await this.openDropdown();

    // Use getByText to find the dropdown item
    const item = this.dropdownMenu.getByText(itemText, { exact: true });

    if (await item.isVisible()) {
      this.logger.info(`Clicking dropdown item: ${itemText}`);
      await item.click();
    } else {
      throw new Error(`Dropdown item not found: ${itemText}`);
    }
  }

  private async isDropdownOpen(): Promise<boolean> {
    return await this.dropdownMenu.isVisible();
  }
}
```

## Form Component Example

Here's an example of a search form component using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class SearchFormComponent extends BaseComponent {
  // Define locators using Playwright's recommended patterns
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly clearButton: Locator;
  private readonly filterToggle: Locator;
  private readonly filterPanel: Locator;
  private readonly applyFiltersButton: Locator;

  constructor(page: Page) {
    // Use getByTestId for the root element
    const rootLocator = page.getByTestId('search-form');
    super(page, rootLocator, 'Search Form');

    // Initialize locators using Playwright's recommended methods
    this.searchInput = this.rootLocator.getByRole('searchbox');
    this.searchButton = this.rootLocator.getByRole('button', { name: 'Search' });
    this.clearButton = this.rootLocator.getByRole('button', { name: 'Clear' });
    this.filterToggle = this.rootLocator.getByRole('button', { name: 'Filters' });
    this.filterPanel = this.rootLocator.getByTestId('search-filter-panel');
    this.applyFiltersButton = this.filterPanel.getByRole('button', { name: 'Apply Filters' });
  }

  async search(searchTerm: string): Promise<void> {
    this.logger.info(`Searching for: ${searchTerm}`);
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  async clearSearch(): Promise<void> {
    this.logger.info('Clearing search');
    await this.clearButton.click();
    // Verify the input is cleared
    expect(await this.searchInput.inputValue()).toBe('');
  }

  async toggleFilters(): Promise<void> {
    this.logger.info('Toggling filters');
    await this.filterToggle.click();

    // Wait for filter panel visibility to change
    if (await this.filterPanel.isVisible()) {
      await this.filterPanel.waitFor({ state: 'visible' });
    } else {
      await this.filterPanel.waitFor({ state: 'hidden' });
    }
  }

  async selectCategory(categoryName: string): Promise<void> {
    // First ensure filter panel is visible
    if (!(await this.filterPanel.isVisible())) {
      await this.toggleFilters();
    }

    // Use getByLabel to find the checkbox
    const categoryCheckbox = this.filterPanel.getByLabel(categoryName);
    await categoryCheckbox.check();
    this.logger.info(`Selected category: ${categoryName}`);
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    // First ensure filter panel is visible
    if (!(await this.filterPanel.isVisible())) {
      await this.toggleFilters();
    }

    // Use getByLabel to find the inputs
    const minInput = this.filterPanel.getByLabel('Min Price');
    const maxInput = this.filterPanel.getByLabel('Max Price');

    await minInput.fill(min.toString());
    await maxInput.fill(max.toString());
    this.logger.info(`Set price range: ${min} - ${max}`);
  }

  async applyFilters(): Promise<void> {
    this.logger.info('Applying filters');
    await this.applyFiltersButton.click();
  }

  async getCurrentSearchTerm(): Promise<string> {
    return await this.searchInput.inputValue();
  }
}
```

## Modal Component Example

Here's an example of a modal dialog component using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class ModalComponent extends BaseComponent {
  // Define locators using Playwright's recommended patterns
  private readonly title: Locator;
  private readonly closeButton: Locator;
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;
  private readonly content: Locator;

  constructor(page: Page) {
    // Use getByTestId for the root element
    const rootLocator = page.getByTestId('modal-dialog');
    super(page, rootLocator, 'Modal Dialog');

    // Initialize locators using Playwright's recommended methods
    this.title = this.rootLocator.getByRole('heading');
    this.closeButton = this.rootLocator.getByRole('button', { name: 'Close' });
    this.confirmButton = this.rootLocator.getByRole('button', { name: 'Confirm' });
    this.cancelButton = this.rootLocator.getByRole('button', { name: 'Cancel' });
    this.content = this.rootLocator.getByTestId('modal-content');
  }

  async getTitle(): Promise<string | null> {
    return await this.title.textContent();
  }

  async close(): Promise<void> {
    this.logger.info('Closing modal');
    await this.closeButton.click();
    await this.rootLocator.waitFor({ state: 'hidden' });
  }

  async confirm(): Promise<void> {
    this.logger.info('Confirming modal');
    await this.confirmButton.click();
    await this.rootLocator.waitFor({ state: 'hidden' });
  }

  async cancel(): Promise<void> {
    this.logger.info('Canceling modal');
    await this.cancelButton.click();
    await this.rootLocator.waitFor({ state: 'hidden' });
  }

  async getContentText(): Promise<string | null> {
    return await this.content.textContent();
  }

  async waitForModalToAppear(): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible' });
  }
}
```

## Card Component Example

Here's an example of a product card component using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';

export class ProductCardComponent extends BaseComponent {
  // Define locators using Playwright's recommended patterns
  private readonly title: Locator;
  private readonly price: Locator;
  private readonly image: Locator;
  private readonly addToCartButton: Locator;
  private readonly wishlistButton: Locator;
  private readonly ratingStars: Locator;

  constructor(page: Page, cardLocator: Locator) {
    super(page, cardLocator, 'Product Card');

    // Initialize locators using Playwright's recommended methods
    this.title = this.rootLocator.getByRole('heading');
    this.price = this.rootLocator.getByTestId('product-price');
    this.image = this.rootLocator.getByRole('img');
    this.addToCartButton = this.rootLocator.getByRole('button', { name: 'Add to Cart' });
    this.wishlistButton = this.rootLocator.getByRole('button', { name: 'Add to Wishlist' });
    this.ratingStars = this.rootLocator.getByTestId('rating-stars');
  }

  async getTitle(): Promise<string | null> {
    return await this.title.textContent();
  }

  async getPrice(): Promise<string | null> {
    return await this.price.textContent();
  }

  async addToCart(): Promise<void> {
    this.logger.info('Adding product to cart');
    await this.addToCartButton.click();
  }

  async addToWishlist(): Promise<void> {
    this.logger.info('Adding product to wishlist');
    await this.wishlistButton.click();
  }

  async getRating(): Promise<number> {
    // Example: Extract rating from aria-label attribute
    const ratingText = (await this.ratingStars.getAttribute('aria-label')) || '';
    const match = ratingText.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  }

  async clickTitle(): Promise<void> {
    this.logger.info('Clicking product title');
    await this.title.click();
  }

  async clickImage(): Promise<void> {
    this.logger.info('Clicking product image');
    await this.image.click();
  }
}
```

## Composite Component Example

Here's an example of a composite component (a component that contains other components) using Playwright's recommended locator patterns:

```typescript
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base/base-component';
import { SearchFormComponent } from './search-form-component';
import { FilterComponent } from './filter-component';

export class ProductSearchComponent extends BaseComponent {
  // Child components
  private readonly searchForm: SearchFormComponent;
  private readonly filterComponent: FilterComponent;

  // Local locators
  private readonly resultsCount: Locator;
  private readonly sortDropdown: Locator;
  private readonly productGrid: Locator;

  constructor(page: Page) {
    // Use getByTestId for the root element
    const rootLocator = page.getByTestId('product-search');
    super(page, rootLocator, 'Product Search');

    // Initialize child components
    this.searchForm = new SearchFormComponent(page);
    this.filterComponent = new FilterComponent(page);

    // Initialize local locators
    this.resultsCount = this.rootLocator.getByTestId('results-count');
    this.sortDropdown = this.rootLocator.getByLabel('Sort by');
    this.productGrid = this.rootLocator.getByTestId('product-grid');
  }

  async search(searchTerm: string): Promise<void> {
    // Use the search form component
    await this.searchForm.search(searchTerm);
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(category: string): Promise<void> {
    // Use the filter component
    await this.filterComponent.selectCategory(category);
    await this.filterComponent.applyFilters();
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  async sortBy(option: string): Promise<void> {
    this.logger.info(`Sorting by: ${option}`);
    await this.sortDropdown.selectOption({ label: option });
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  async getResultsCount(): Promise<number> {
    const text = (await this.resultsCount.textContent()) || '0 results';
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async getProductTitles(): Promise<string[]> {
    const productTitles = this.productGrid.getByRole('heading');
    const count = await productTitles.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const title = await productTitles.nth(i).textContent();
      if (title) titles.push(title);
    }

    return titles;
  }
}
```

## Using Components in Page Objects

Here's how to use components in page objects:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base-page';
import { HeaderComponent } from '../../components/navigation/header-component';
import { FooterComponent } from '../../components/navigation/footer-component';
import { ProductSearchComponent } from '../../components/search/product-search-component';
import { ProductCardComponent } from '../../components/cards/product-card-component';

export class ProductsPage extends BasePage {
  // Components
  private readonly productSearch: ProductSearchComponent;

  // Page-specific locators
  private readonly featuredSection: Locator;
  private readonly categoryNav: Locator;

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);

    // Initialize components
    this.productSearch = new ProductSearchComponent(page);

    // Initialize page-specific locators
    this.featuredSection = this.page.getByTestId('featured-products');
    this.categoryNav = this.page.getByTestId('category-navigation');
  }

  async navigateToProductsPage(): Promise<void> {
    await this.navigateTo('/products');
    await this.waitForPageLoad();
  }

  async searchProducts(searchTerm: string): Promise<void> {
    // Use the product search component
    await this.productSearch.search(searchTerm);
  }

  async filterByCategory(category: string): Promise<void> {
    // Use the product search component
    await this.productSearch.filterByCategory(category);
  }

  async sortProductsBy(sortOption: string): Promise<void> {
    // Use the product search component
    await this.productSearch.sortBy(sortOption);
  }

  async getResultsCount(): Promise<number> {
    return await this.productSearch.getResultsCount();
  }

  async selectCategoryFromNav(category: string): Promise<void> {
    const categoryLink = this.categoryNav.getByRole('link', { name: category });
    this.logger.info(`Selecting category: ${category}`);
    await categoryLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFeaturedProducts(): Promise<ProductCardComponent[]> {
    const productCards = this.featuredSection.getByTestId('product-card');
    const count = await productCards.count();
    const products: ProductCardComponent[] = [];

    for (let i = 0; i < count; i++) {
      products.push(new ProductCardComponent(this.page, productCards.nth(i)));
    }

    return products;
  }
}
```

## Using Components in Tests

Here's how to use components and pages in tests:

```typescript
import { test, expect } from '../../src/fixtures/base-fixture';
import { ProductsPage } from '../../src/pages/product/products-page';

test.describe('Product Search', () => {
  test('should search and filter products', async ({ page, environment }) => {
    // Initialize the page object
    const productsPage = new ProductsPage(page, environment.baseUrl);

    // Navigate to the products page
    await productsPage.navigateToProductsPage();

    // Search for products
    await productsPage.searchProducts('laptop');

    // Verify search results
    const resultsCount = await productsPage.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);

    // Filter by category
    await productsPage.filterByCategory('Electronics');

    // Sort products
    await productsPage.sortProductsBy('Price: Low to High');

    // Get featured products
    const featuredProducts = await productsPage.getFeaturedProducts();

    // Interact with the first product
    if (featuredProducts.length > 0) {
      const firstProduct = featuredProducts[0];
      const productTitle = await firstProduct.getTitle();

      // Add to cart
      await firstProduct.addToCart();

      // Verify cart count in header
      const cartCount = await productsPage.header.getCartCount();
      expect(cartCount).toBe('1');
    }
  });
});
```

## Best Practices

### Locator Selection Strategy

Follow this priority order for locators:

1. **Accessibility-First Locators**:
   - `getByRole()` - Use for elements with semantic roles (buttons, links, etc.)
   - `getByLabel()` - Use for form fields with associated labels
   - `getByPlaceholder()` - Use for input fields with placeholder text
   - `getByText()` - Use for finding elements by their text content
   - `getByAltText()` - Use for images with alt text

2. **Test-Specific Attributes**:
   - `getByTestId()` - Use for elements without good semantic identifiers

3. **CSS Selectors (last resort)**:
   - `locator()` - Use only when the above methods don't work

### Component Design Principles

1. **Single Responsibility**: Each component should handle one UI element or a logical group of related elements.

2. **Encapsulation**: Components should encapsulate their internal structure and expose a clean API.

3. **Composition**: Complex components should be composed of simpler components.

4. **Reusability**: Components should be designed for reuse across multiple pages.

5. **Maintainability**: Changes to the UI should require changes to only one component.

### Error Handling

1. **Descriptive Logging**: Log all actions with clear descriptions.

2. **Graceful Failure**: Components should handle errors gracefully and provide useful error messages.

3. **Retry Logic**: Add retry logic for flaky interactions.

4. **Timeouts**: Use appropriate timeouts for different actions.

### Performance

1. **Lazy Loading**: Initialize components only when needed.

2. **Efficient Selectors**: Use the most efficient locator strategy for each element.

3. **Minimize Waits**: Use explicit waits only when necessary.

4. **Batch Operations**: Batch operations when possible to reduce round trips.
