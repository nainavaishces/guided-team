import { expect } from '@playwright/test';

import { test } from '../../../src/fixtures/test-fixture';
import pdpData from '../../test-data/pdp-data.json';

test.describe('PDP Reviews @pdp-reviews @regression @smoke', () => {
  const defaultProduct = pdpData.products[0];

  test.beforeEach(async ({ page }) => {
    await page.goto(`/products/${defaultProduct.slug || 'default-product'}`);
  });

  test('should validate clicking reviews navigates to bottom reviews section', async ({ pdp }) => {
    await test.step('Click Reviews Accordion', async () => {
      await pdp.clickReviewsAccordion();
    });

    await test.step('Validate Reviews Section is Visible', async () => {
      // Get the reviews section element
      const reviewsSection = pdp.getReviewsSection();

      // Assert that the reviews section is visible
      await expect(reviewsSection).toBeVisible();
    });
  });

  test('should validate that preview of reviews is shown in top product info section', async ({
    pdp,
  }) => {
    await test.step('Validate Reviews Preview is Visible in Top Product Info Section', async () => {
      // Get the reviews accordion element (desktop or mobile based on visibility)
      const reviewsAccordion = await pdp.getReviews().getReviewsAccordion();

      // Assert that the reviews preview is visible
      await expect(reviewsAccordion).toBeVisible();
    });
  });
});
