import { Locator } from '@playwright/test';

import { CartDrawerComponent } from '../../components/cart/cart-drawer-component';
import { CartItemComponent } from '../../components/cart/cart-item-component';
import { CartSummaryComponent } from '../../components/cart/cart-summary-component';
import { IPageProps } from '../../types/page-types';
import { logger } from '../../utils/logger';
import { BasePage } from '../base/base-page';

/**
 * Page object for the Mini Cart
 * Handles interactions with the cart drawer
 */
export class MiniCartPage extends BasePage {
  private readonly cartDrawer: CartDrawerComponent;
  private readonly cartItem: CartItemComponent;
  private readonly cartSummary: CartSummaryComponent;

  /**
   * Creates a new MiniCartPage instance
   * @param props - Page props
   */
  constructor(props: IPageProps) {
    super(props);
    logger.debug('Initializing MiniCartPage');

    // Initialize components
    this.cartDrawer = new CartDrawerComponent({
      page: this.page,
      rootLocator: '[data-a11y="cart-drawer"]',
    });

    this.cartItem = new CartItemComponent({
      page: this.page,
      rootLocator: this.page.locator('[data-a11y="cart-drawer"]'),
    });

    this.cartSummary = new CartSummaryComponent({
      page: this.page,
      rootLocator: this.page.locator('[data-a11y="cart-drawer"]'),
    });
  }

  /**
   * Gets the mini cart locator
   * @returns The mini cart locator
   */
  getMiniCart(): Locator {
    return this.cartDrawer.getCartDrawer();
  }

  /**
   * Gets the cart subtotal locator
   * @returns The cart subtotal locator
   */
  getCartSubtotal(): Locator {
    return this.cartSummary.getCartSubtotal();
  }

  /**
   * Gets the product title in the cart
   * @param index - The index of the product grid item (defaults to 0)
   * @returns The product title locator in the cart
   */
  getProductTitleInCart(index = 0): Locator {
    return this.cartItem.getProductTitleInCart(index);
  }

  /**
   * Gets the product price in the cart
   * @param index - The index of the product grid item (defaults to 0)
   * @returns The product price locator in the cart
   */
  getProductPriceInCart(index = 0): Locator {
    return this.cartItem.getProductPriceInCart(index);
  }

  /**
   * Gets the item quantity in the cart
   * @param index - The index of the product grid item (defaults to 0)
   * @returns The item quantity locator in the cart
   */
  getItemQuantity(index = 0): Locator {
    return this.cartItem.getItemQuantity(index);
  }

  /**
   * Checks if there is a free gift on the page
   * @returns Promise resolving to true if there is a free gift on the page
   */
  async hasFreeGiftOnPage(): Promise<boolean> {
    logger.debug('Checking if there is a free gift on the page');
    try {
      const freeGiftText = this.page.getByText('Free Gift', { exact: true });

      const isVisible = await freeGiftText.isVisible();

      if (isVisible) {
        logger.debug('Free gift detected on page');
      }

      return isVisible;
    } catch (error) {
      logger.error(`Error checking for free gift: ${error}`);
      return false;
    }
  }

  /**
   * Gets the appropriate product index to use for validation based on free gift status
   * @returns Promise resolving to the product index to use
   */
  async getProductIndexForValidation(): Promise<number> {
    try {
      const hasFreeGift = await this.hasFreeGiftOnPage();
      const productIndex = hasFreeGift ? 1 : 0;

      if (hasFreeGift) {
        logger.debug('Free Gift detected on page, using second product for validation');

        // Verify that there is actually a second product in the cart
        const productCount = await this.cartItem.getProductGridItems().count();
        if (productCount <= 1) {
          logger.warn('Free gift detected but only one product in cart, falling back to index 0');
          return 0;
        }
      }

      return productIndex;
    } catch (error) {
      logger.error(`Error determining product index for validation: ${error}`);
      return 0; // Default to first product in case of error
    }
  }

  /**
   * Gets the product title in the cart for validation
   * Automatically handles free gift products by using the appropriate index
   * @returns Promise resolving to the product title locator
   */
  async getProductTitleForValidation(): Promise<Locator> {
    try {
      const index = await this.getProductIndexForValidation();
      logger.debug(`Using product index ${index} for title validation`);
      return this.getProductTitleInCart(index);
    } catch (error) {
      logger.error(`Error getting product title for validation: ${error}`);
      return this.getProductTitleInCart(0); // Default to first product in case of error
    }
  }

  /**
   * Gets the product price in the cart for validation
   * Automatically handles free gift products by using the appropriate index
   * @returns Promise resolving to the product price locator
   */
  async getProductPriceForValidation(): Promise<Locator> {
    try {
      const index = await this.getProductIndexForValidation();
      logger.debug(`Using product index ${index} for price validation`);
      return this.getProductPriceInCart(index);
    } catch (error) {
      logger.error(`Error getting product price for validation: ${error}`);
      return this.getProductPriceInCart(0); // Default to first product in case of error
    }
  }

  /**
   * Gets the item quantity in the cart for validation
   * Automatically handles free gift products by using the appropriate index
   * @returns Promise resolving to the item quantity locator
   */
  async getItemQuantityForValidation(): Promise<Locator> {
    try {
      const index = await this.getProductIndexForValidation();
      logger.debug(`Using product index ${index} for quantity validation`);
      return this.getItemQuantity(index);
    } catch (error) {
      logger.error(`Error getting item quantity for validation: ${error}`);
      return this.getItemQuantity(0); // Default to first product in case of error
    }
  }
}
