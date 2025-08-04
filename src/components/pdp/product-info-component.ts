import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the product information section on the PDP
 * Handles product title, price, subtitle, and breadcrumbs
 */
export class ProductInfoComponent extends BaseComponent {
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly breadcrumbs: Locator;

  /**
   * Creates a new ProductInfoComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing ProductInfoComponent');

    // Initialize locators
    this.productTitle = this.page.getByTestId('productdescriptionprice-title').nth(1);
    this.productPrice = this.page.getByTestId('productdescriptionprice-price').nth(1);
    this.breadcrumbs = this.page.getByLabel('breadcrumb');
  }

  /**
   * Gets the product title locator
   * @returns The product title locator
   */
  getTitle(): Locator {
    return this.productTitle;
  }

  /**
   * Gets the product price locator
   * @returns The product price locator
   */
  getPrice(): Locator {
    return this.productPrice;
  }

  /**
   * Gets the breadcrumbs locator
   * @returns The breadcrumbs locator
   */
  getBreadcrumbs(): Locator {
    return this.breadcrumbs;
  }

  /**
   * Gets the product title text
   * @returns Promise resolving to the product title text
   */
  async getTitleText(): Promise<string> {
    return (await this.productTitle.textContent()) || '';
  }

  /**
   * Gets the product price text
   * @returns Promise resolving to the product price text
   */
  async getPriceText(): Promise<string> {
    return (await this.productPrice.textContent()) || '';
  }

  /**
   * Waits for the product information to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for product information to be loaded');
    await this.productTitle.waitFor({ state: 'visible', timeout });
    await this.productPrice.waitFor({ state: 'visible', timeout });
  }
}
