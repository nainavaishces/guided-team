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
  private readonly outOfStockMessage: Locator;
  private readonly quantitySelector: Locator;

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
    this.outOfStockMessage = this.page.getByText(/Out of Stock|Sold Out/i);
    this.quantitySelector = this.page.getByLabel(/Quantity/i);
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
   * Gets the out of stock message
   * @returns The out of stock message locator
   */
  getOutOfStockMessage(): Locator {
    return this.outOfStockMessage;
  }

  /**
   * Gets the quantity selector
   * @returns The quantity selector locator
   */
  getQuantitySelector(): Locator {
    return this.quantitySelector;
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
   * Clicks the select size button
   */
  async clickSelectSize(): Promise<void> {
    logger.debug('Clicking Select Size button');
    const isVisible = await this.selectSizeButton.isVisible();

    if (!isVisible) {
      throw new Error('Select Size button is not visible');
    }

    await this.selectSizeButton.click();
  }

  /**
   * Sets the quantity
   * @param quantity - The quantity to set
   */
  async setQuantity(quantity: number): Promise<void> {
    logger.debug(`Setting quantity to ${quantity}`);
    const isVisible = await this.quantitySelector.isVisible();

    if (!isVisible) {
      throw new Error('Quantity selector is not visible');
    }

    await this.quantitySelector.selectOption(quantity.toString());
  }

  /**
   * Gets the current quantity
   * @returns Promise resolving to the current quantity
   */
  async getQuantity(): Promise<number> {
    const isVisible = await this.quantitySelector.isVisible();

    if (!isVisible) {
      return 1; // Default quantity
    }

    const value = await this.quantitySelector.inputValue();
    return parseInt(value, 10) || 1;
  }

  /**
   * Checks if the add to cart button is enabled
   * @returns Promise resolving to true if the add to cart button is enabled
   */
  async isAddToCartEnabled(): Promise<boolean> {
    const isVisible = await this.addToCartButton.isVisible();

    if (!isVisible) {
      return false;
    }

    return await this.addToCartButton.isEnabled();
  }

  /**
   * Checks if the select size button is visible
   * @returns Promise resolving to true if the select size button is visible
   */
  async isSelectSizeVisible(): Promise<boolean> {
    return await this.selectSizeButton.isVisible();
  }

  /**
   * Checks if the product is out of stock
   * @returns Promise resolving to true if the product is out of stock
   */
  async isOutOfStock(): Promise<boolean> {
    return await this.outOfStockMessage.isVisible();
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
      this.outOfStockMessage.waitFor({ state: 'visible', timeout }).catch(() => {}),
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
