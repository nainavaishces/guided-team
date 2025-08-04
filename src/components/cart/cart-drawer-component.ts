import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the Cart Drawer
 * Handles interactions with the cart drawer itself
 */
export class CartDrawerComponent extends BaseComponent {
  private readonly cartDrawer: Locator;
  private readonly closeButton: Locator;

  /**
   * Creates a new CartDrawerComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    const { page } = props;

    // Initialize locators
    this.cartDrawer = page.locator('[data-a11y="cart-drawer"]');
    this.closeButton = page.getByLabel('Close Cart Drawer');
  }

  /**
   * Gets the cart drawer locator
   * @returns The cart drawer locator
   */
  getCartDrawer(): Locator {
    return this.cartDrawer;
  }

  /**
   * Closes the cart drawer
   */
  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
