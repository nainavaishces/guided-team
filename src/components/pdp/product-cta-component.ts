import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the product call-to-action section on the PDP
 * Handles add to cart button, select size button, and other CTA elements
 */
export class ProductCTAComponent extends BaseComponent {
  private readonly addToCartButton: Locator;
  private readonly selectSizeButton: Locator;

  /**
   * Creates a new ProductCTAComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing ProductCTAComponent');

    // Initialize locators
    // Make the locator more specific by using first() to only match the first "Select size" button
    this.selectSizeButton = this.page.getByRole('button', { name: /Select size/i }).first();
    this.addToCartButton = this.page
      .getByRole('button')
      .filter({ hasText: /Add to (Cart|Bag)/i })
      .first();
  }

  /**
   * Gets the add to cart button
   * @returns The add to cart button locator
   */
  getAddToCartButton(): Locator {
    return this.addToCartButton;
  }

  /**
   * Gets the select size button
   * @returns The select size button locator
   */
  getSelectSizeButton(): Locator {
    return this.selectSizeButton;
  }

  /**
   * Clicks the add to cart button
   */
  async clickAddToCart(): Promise<void> {
    logger.debug('Clicking Add to Cart button');
    const isVisible = await this.addToCartButton.isVisible();

    if (!isVisible) {
      throw new Error('Add to Cart button is not visible');
    }

    await this.addToCartButton.click();
  }

  /**
   * Waits for the CTA section to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for CTA section to be loaded');

    // Wait for either the add to cart button or the select size button
    await Promise.race([
      this.addToCartButton.waitFor({ state: 'visible', timeout }).catch(() => {}),
      this.selectSizeButton.waitFor({ state: 'visible', timeout }).catch(() => {}),
    ]);
  }

  /**
   * Waits for the add to cart button to be enabled
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForAddToCartEnabled(timeout?: number): Promise<void> {
    logger.debug('Waiting for Add to Cart button to be enabled');
    await this.addToCartButton.waitFor({ state: 'visible', timeout });
    await this.page.waitForFunction(
      selector => !document.querySelector(selector)?.hasAttribute('disabled'),
      this.addToCartButton.toString(),
      { timeout }
    );
  }
}
