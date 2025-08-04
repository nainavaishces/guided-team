import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { BaseComponent } from '../base/base-component';

/**
 * Component for Cart Items
 * Handles interactions with individual items in the cart
 */
export class CartItemComponent extends BaseComponent {
  private readonly productGridItem: Locator;

  // Define arrow functions for index-based locators
  public readonly getProductGridItemByIndex: (index?: number) => Locator;
  public readonly getProductTitleInCart: (index?: number) => Locator;
  public readonly getProductPriceInCart: (index?: number) => Locator;
  public readonly getItemQuantity: (index?: number) => Locator;
  public readonly getRemoveButton: (index?: number) => Locator;

  /**
   * Creates a new CartItemComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);

    // Initialize locators
    this.productGridItem = this.getRoot().getByTestId('product-grid-item');

    // Define arrow functions in the constructor
    this.getProductGridItemByIndex = (index = 0): Locator => this.productGridItem.nth(index);

    this.getProductTitleInCart = (index = 0): Locator =>
      this.getProductGridItemByIndex(index).getByTestId('productdescriptionprice-title');

    this.getProductPriceInCart = (index = 0): Locator =>
      this.getProductGridItemByIndex(index).getByTestId('productdescriptionprice-price');

    this.getItemQuantity = (index = 0): Locator =>
      this.getProductGridItemByIndex(index).getByTestId('counter');

    this.getRemoveButton = (index = 0): Locator =>
      this.getProductGridItemByIndex(index).getByTestId('cartproductitem-remove');
  }

  /**
   * Gets all product grid items in the cart
   * @returns The product grid items locator
   */
  getProductGridItems(): Locator {
    return this.productGridItem;
  }
}
