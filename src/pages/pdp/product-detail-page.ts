import { Locator } from '@playwright/test';

import { ColorSelectorComponent } from '../../components/pdp/color-selector-component';
import { ProductCTAComponent } from '../../components/pdp/product-cta-component';
import { ProductGalleryComponent } from '../../components/pdp/product-gallery-component';
import { ProductInfoComponent } from '../../components/pdp/product-info-component';
import { ReviewsComponent } from '../../components/pdp/reviews-component';
import { SizeSelectorComponent } from '../../components/pdp/size-selector-component';
import { IComponentProps } from '../../types/component-types';
import { IPageProps } from '../../types/page-types';
import { logger } from '../../utils/logger';
import { BasePage } from '../base/base-page';

/**
 * Page object for the Product Detail Page
 * Composed of multiple components for different sections of the page
 */
export class ProductDetailPage extends BasePage {
  private readonly productSection: Locator;
  private readonly productInfo: ProductInfoComponent;
  private readonly productGallery: ProductGalleryComponent;
  private readonly colorSelector: ColorSelectorComponent;
  private readonly sizeSelector: SizeSelectorComponent;
  private readonly productCTA: ProductCTAComponent;
  private readonly reviews: ReviewsComponent;

  /**
   * Creates a new ProductDetailPage instance
   * @param props - Page props
   */
  constructor(props: IPageProps) {
    super(props);
    logger.debug('Initializing ProductDetailPage');
    const { page } = props;

    // Initialize the product section locator
    this.productSection = page.getByTestId('product-options-section');

    // Create component props
    const componentProps: IComponentProps = {
      page,
      rootLocator: this.productSection,
    };

    // Initialize components
    this.productInfo = new ProductInfoComponent(componentProps);
    this.productGallery = new ProductGalleryComponent(componentProps);
    this.colorSelector = new ColorSelectorComponent(componentProps);
    this.sizeSelector = new SizeSelectorComponent(componentProps);
    this.productCTA = new ProductCTAComponent(componentProps);

    // Initialize reviews component with page as root since it spans multiple sections
    this.reviews = new ReviewsComponent({
      page,
      rootLocator: page.locator('body'),
    });
  }

  /**
   * Gets the product information component
   * @returns The product information component
   */
  getProductInfo(): ProductInfoComponent {
    return this.productInfo;
  }

  /**
   * Gets the product gallery component
   * @returns The product gallery component
   */
  getProductGallery(): ProductGalleryComponent {
    return this.productGallery;
  }

  /**
   * Gets the color selector component
   * @returns The color selector component
   */
  getColorSelector(): ColorSelectorComponent {
    return this.colorSelector;
  }

  /**
   * Gets the size selector component
   * @returns The size selector component
   */
  getSizeSelector(): SizeSelectorComponent {
    return this.sizeSelector;
  }

  /**
   * Gets the product CTA component
   * @returns The product CTA component
   */
  getProductCTA(): ProductCTAComponent {
    return this.productCTA;
  }

  /**
   * Gets the product section locator
   * @returns The product section locator
   */
  getProductSection(): Locator {
    return this.productSection;
  }

  /**
   * Selects the first available size and inseam options.
   */
  async selectFirstAvailableSizeAndInseam(): Promise<void> {
    logger.debug('Selecting first available size and inseam');
    await this.sizeSelector.selectFirstAvailableSizeAndInseam();
  }

  /**
   * Clicks the "Add to bag" button.
   */
  async clickAddToCartButton(): Promise<void> {
    await this.productCTA.clickAddToCart();
  }

  /**
   * Retrieves product information from the PDP details section.
   * @returns An object containing productName and productPrice.
   */
  async getProductInfoFromPdpDetails(): Promise<{ productName: string; productPrice: string }> {
    const productName = await this.productInfo.getTitleText();
    const productPrice = await this.productInfo.getPriceText();

    return { productName, productPrice };
  }

  /**
   * Gets the reviews component
   * @returns The reviews component
   */
  getReviews(): ReviewsComponent {
    return this.reviews;
  }

  /**
   * Clicks the reviews accordion to navigate to the reviews section
   */
  async clickReviewsAccordion(): Promise<void> {
    logger.debug('Clicking reviews accordion');
    await this.reviews.clickReviewsAccordion();
  }

  /**
   * Gets the reviews section locator
   * @returns The reviews section locator
   */
  getReviewsSection(): Locator {
    return this.reviews.getReviewsSection();
  }
}
