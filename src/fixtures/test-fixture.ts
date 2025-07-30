import { Page } from '@playwright/test';

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
});

/**
 * Re-export expect from the base test
 */
export const expect = test.expect;
