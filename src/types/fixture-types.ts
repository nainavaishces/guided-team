import { Page, Browser, BrowserContext } from '@playwright/test';

import { MiniCartPage } from '../pages/cart/mini-cart-page';
import { ProductDetailPage } from '../pages/pdp/product-detail-page';

/**
 * Base fixture interface
 * Defines the shape of fixtures provided to tests
 */
export interface IBaseFixture {
  /**
   * The Playwright page object
   */
  page: Page;

  /**
   * The Playwright browser object
   */
  browser: Browser;

  /**
   * The Playwright browser context
   */
  context: BrowserContext;

  /**
   * The base URL for the tests
   */
  baseUrl: string;
}

/**
 * Interface for page objects fixture
 * Provides access to page objects in tests
 */
export interface IPageObjectsFixture {
  /**
   * Product Detail Page object
   */
  pdp: ProductDetailPage;

  /**
   * Mini Cart Page object
   */
  miniCart: MiniCartPage;
}
