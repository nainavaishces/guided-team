import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the product reviews section on the PDP
 * Handles reviews accordion and reviews section
 */
export class ReviewsComponent extends BaseComponent {
  private readonly reviewsAccordionDesktop: Locator;
  private readonly reviewsAccordionMobile: Locator;
  private readonly reviewsSection: Locator;

  /**
   * Creates a new ReviewsComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing ReviewsComponent');

    // Initialize locators
    this.reviewsAccordionDesktop = this.page
      .getByTestId('pdptop-title-price')
      .getByTestId('reviews-display-count');

    this.reviewsAccordionMobile = this.page
      .getByTestId('pdptop-title-price-mobile')
      .getByTestId('reviews-display-count');

    this.reviewsSection = this.page.locator('div[data-a11y="pdp-reviews"]');
  }

  /**
   * Gets the reviews accordion locator (handles both desktop and mobile)
   * @returns The appropriate reviews accordion locator based on visibility
   */
  async getReviewsAccordion(): Promise<Locator> {
    // Try desktop first, if not visible return mobile
    if (await this.reviewsAccordionDesktop.isVisible()) {
      return this.reviewsAccordionDesktop;
    } else {
      return this.reviewsAccordionMobile;
    }
  }

  /**
   * Gets the reviews section locator
   * @returns The reviews section locator
   */
  getReviewsSection(): Locator {
    return this.reviewsSection;
  }

  /**
   * Clicks the reviews accordion (handles both desktop and mobile)
   */
  async clickReviewsAccordion(): Promise<void> {
    logger.debug('Clicking reviews accordion');
    const accordion = await this.getReviewsAccordion();
    await accordion.click();
  }
}
