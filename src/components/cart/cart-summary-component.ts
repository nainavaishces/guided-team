import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { BaseComponent } from '../base/base-component';

/**
 * Component for Cart Summary
 * Handles interactions with the cart summary section (subtotal, checkout button, etc.)
 */
export class CartSummaryComponent extends BaseComponent {
  private readonly cartSubtotal: Locator;
  private readonly checkoutButton: Locator;

  /**
   * Creates a new CartSummaryComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    const { page } = props;

    // Initialize locators
    this.cartSubtotal = page.getByTestId('cart-subtotal');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  /**
   * Gets the cart subtotal locator
   * @returns The cart subtotal locator
   */
  getCartSubtotal(): Locator {
    return this.cartSubtotal;
  }

  /**
   * Clicks the checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
