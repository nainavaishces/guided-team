import { expect } from '@playwright/test';

import { test } from '../../../src/fixtures/test-fixture';
import pdpData from '../../test-data/pdp-data.json';

test.describe('PDP Cart Integration @pdp-cart @regression @smoke', () => {
  const defaultProduct = pdpData.products[0];

  test.beforeEach(async ({ page }) => {
    await page.goto(`/products/${defaultProduct.slug || 'default-product'}`);
  });

  test('should verify product can be added to cart once options are selected', async ({
    pdp,
    miniCart,
  }) => {
    // Get product info before adding to cart
    const { productName, productPrice } = await pdp.getProductInfoFromPdpDetails();

    await test.step('Select Size and Add to Cart', async () => {
      await pdp.selectFirstAvailableSizeAndInseam();
      await pdp.clickAddToCartButton();
    });

    await test.step('Verify Mini Cart is Visible', async () => {
      // Increase timeout for Mobile Safari which may be slower
      await expect(miniCart.getMiniCart()).toBeVisible({ timeout: 10000 });
    });

    await test.step('Verify Product Info in Mini Cart', async () => {
      // Get the cart drawer element
      const cartDrawer = miniCart.getMiniCart();

      // Wait for the cart drawer to be fully visible with increased timeout for Mobile Safari
      await expect(cartDrawer).toBeVisible({ timeout: 10000 });

      // Get the product title and price from the mini cart
      // These methods automatically handle free gift products
      const titleInCart = await miniCart.getProductTitleForValidation();
      const priceInCart = await miniCart.getProductPriceForValidation();
      const itemQuantity = await miniCart.getItemQuantityForValidation();

      // Assert that the product name matches the expected value
      await expect(titleInCart).toHaveText(productName);

      // Assert that the product price matches the expected value
      await expect(priceInCart).toHaveText(productPrice);

      // Assert that the counter in the mini cart contains the text '1'
      await expect(itemQuantity).toContainText('1');

      // Assert that the subtotal in the mini cart contains the product price
      await expect(miniCart.getCartSubtotal()).toContainText(productPrice);
    });
  });
});
