import { Page } from '@playwright/test';

import { MiniCartPage } from '../pages/cart/mini-cart-page';
import { ProductDetailPage } from '../pages/pdp/product-detail-page';
import { IPageObjectsFixture } from '../types/fixture-types';
import { logger } from '../utils/logger';

import { test as base } from './base-fixture';

/**
 * Extended test fixture that provides page objects and test data
 */
export const test = base.extend<IPageObjectsFixture>({
  // Page Objects

  /**
   * Product Detail Page fixture
   */
  pdp: async ({ page }: { page: Page }, use: (pdp: ProductDetailPage) => Promise<void>) => {
    try {
      const pdp = new ProductDetailPage({ page });
      await use(pdp);
    } catch (error) {
      logger.error(`Failed to create ProductDetailPage instance: ${error}`);
      throw error;
    }
  },

  /**
   * Mini Cart Page fixture
   */
  miniCart: async ({ page }: { page: Page }, use: (miniCart: MiniCartPage) => Promise<void>) => {
    try {
      const miniCart = new MiniCartPage({ page });
      await use(miniCart);
    } catch (error) {
      logger.error(`Failed to create MiniCartPage instance: ${error}`);
      throw error;
    }
  },
});

/**
 * Re-export expect from the base test
 */
export const expect = test.expect;
