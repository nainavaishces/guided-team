import { expect } from '@playwright/test';

import { test } from '../../../src/fixtures/test-fixture';
import pdpData from '../../test-data/pdp-data.json';

test.describe('PDP UI Validations @pdp-ui @regression @smoke', () => {
  const defaultProduct = pdpData.products[0];
  test.beforeEach(async ({ page }) => {
    await page.goto(`/products/${defaultProduct.slug || 'default-product'}`);
  });

  test('should validate full PDP UI', async ({ pdp }) => {
    await test.step('Validate PDP Basic Info', async () => {
      await expect(pdp.getProductInfo().getTitle()).toHaveText(
        defaultProduct.title || 'Product Title'
      );
      await expect(pdp.getProductInfo().getPrice()).toHaveText(defaultProduct.price || '$0');
      await expect(pdp.getProductInfo().getBreadcrumbs()).toBeVisible();
    });

    await test.step('Validate PDP Gallery Images', async () => {
      await expect(pdp.getProductGallery().getMainImage()).toBeVisible();
      const imageCount = await pdp.getProductGallery().getImageCount();
      expect(imageCount).toBeGreaterThan(1);
    });

    await test.step('Validate PDP Color Selector', async () => {
      await expect(pdp.getColorSelector().getColorLabel()).toBeVisible();
      const colorCount = await pdp.getColorSelector().getColorCount();
      expect(colorCount).toBeGreaterThan(0);
    });

    await test.step('Validate Selected Color', async () => {
      const selectedColor = await pdp.getColorSelector().getSelectedColor();
      expect(selectedColor).toContain(defaultProduct.color || 'Default Color');
    });

    await test.step('Validate PDP Size Selector', async () => {
      await expect(pdp.getSizeSelector().getSizeLabel()).toBeVisible();
      await expect(pdp.getSizeSelector().getFindMySizeButton()).toBeVisible();
      await expect(pdp.getSizeSelector().getSizeChartLink()).toBeVisible();

      const isValid = await pdp.getSizeSelector().validateSizes(defaultProduct.sizeOptions || []);
      expect(isValid).toBeTruthy();
    });

    await test.step('Validate PDP CTA', async () => {
      await expect(pdp.getProductCTA().getSelectSizeButton()).toBeVisible();

      await pdp.getSizeSelector().selectFirstAvailableSize();
      await expect(pdp.getProductCTA().getAddToCartButton()).toBeVisible();

      await pdp.getProductCTA().getAddToCartButton().click();
    });
  });

  test('should validate color options are shown and update title/URL', async ({ pdp }) => {
    await test.step('Validate Product Options Section', async () => {
      await expect(pdp.getProductSection()).toBeVisible();
    });

    await test.step('Validate PDP Color Selector', async () => {
      const colorOptions = pdp.getColorSelector().getColorOptions();
      const colorValues = await colorOptions.evaluateAll((nodes: HTMLInputElement[]) =>
        nodes.map(node => node.value)
      );
      expect(colorValues.length).toBeGreaterThan(0);
    });

    await test.step('Validate Color Selection Updates', async () => {
      const colorOptions = pdp.getColorSelector().getColorOptions();
      const colorValues = await colorOptions.evaluateAll((nodes: HTMLInputElement[]) =>
        nodes.map(node => node.value)
      );

      // Test the first color to avoid long test times
      const color = colorValues[0];
      await pdp.getColorSelector().selectColor(color);

      // Verify color title is updated
      const selectedColor = await pdp.getColorSelector().getSelectedColor();
      expect(selectedColor).toBe(color);

      // Verify URL is updated
      const formattedColor = color.toLowerCase().replace(/\s+/g, '-');
      const regexPattern = new RegExp(`products/.*${formattedColor}`, 'i');
      expect(pdp.getUrl()).toMatch(regexPattern);
    });
  });

  // Cart integration tests have been moved to pdp-cart-integration.spec.ts
});
