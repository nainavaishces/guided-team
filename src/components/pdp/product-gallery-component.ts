import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the product gallery section on the PDP
 * Handles product images and gallery navigation
 */
export class ProductGalleryComponent extends BaseComponent {
  private readonly productImages: Locator;
  private readonly mainImage: Locator;
  private readonly thumbnails: Locator;
  private readonly nextButton: Locator;
  private readonly prevButton: Locator;

  /**
   * Creates a new ProductGalleryComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing ProductGalleryComponent');

    // Initialize locators
    this.productImages = this.page.getByLabel('product image gallery');
    this.mainImage = this.productImages.getByRole('img').first();
    this.thumbnails = this.page.getByTestId('thumbnail-image');
    this.nextButton = this.page.getByRole('button', { name: 'Next' }).filter({ hasText: /Next/i });
    this.prevButton = this.page
      .getByRole('button', { name: 'Previous' })
      .filter({ hasText: /Previous/i });
  }

  /**
   * Gets all product images
   * @returns The product images locator
   */
  getImages(): Locator {
    return this.productImages;
  }

  /**
   * Gets the main product image
   * @returns The main product image locator
   */
  getMainImage(): Locator {
    return this.mainImage;
  }

  /**
   * Gets the thumbnail images
   * @returns The thumbnail images locator
   */
  getThumbnails(): Locator {
    return this.thumbnails;
  }

  /**
   * Gets the next button
   * @returns The next button locator
   */
  getNextButton(): Locator {
    return this.nextButton;
  }

  /**
   * Gets the previous button
   * @returns The previous button locator
   */
  getPrevButton(): Locator {
    return this.prevButton;
  }

  /**
   * Gets the number of images in the gallery
   * @returns Promise resolving to the number of images
   */
  async getImageCount(): Promise<number> {
    return await this.productImages.count();
  }

  /**
   * Gets the number of thumbnails
   * @returns Promise resolving to the number of thumbnails
   */
  async getThumbnailCount(): Promise<number> {
    return await this.thumbnails.count();
  }

  /**
   * Clicks on a thumbnail by index
   * @param index - The index of the thumbnail to click
   */
  async clickThumbnail(index: number): Promise<void> {
    logger.debug(`Clicking thumbnail at index ${index}`);
    const thumbnailCount = await this.getThumbnailCount();

    if (index < 0 || index >= thumbnailCount) {
      throw new Error(
        `Thumbnail index out of range: ${index}. Available thumbnails: ${thumbnailCount}`
      );
    }

    await this.thumbnails.nth(index).click();
  }

  /**
   * Clicks the next button to navigate to the next image
   */
  async clickNextButton(): Promise<void> {
    logger.debug('Clicking next button');
    const isVisible = await this.nextButton.isVisible();

    if (!isVisible) {
      throw new Error('Next button is not visible');
    }

    await this.nextButton.click();
  }

  /**
   * Clicks the previous button to navigate to the previous image
   */
  async clickPrevButton(): Promise<void> {
    logger.debug('Clicking previous button');
    const isVisible = await this.prevButton.isVisible();

    if (!isVisible) {
      throw new Error('Previous button is not visible');
    }

    await this.prevButton.click();
  }

  /**
   * Waits for the gallery to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for gallery to be loaded');
    await this.mainImage.waitFor({ state: 'visible', timeout });
  }

  /**
   * Checks if the gallery has multiple images
   * @returns Promise resolving to true if the gallery has multiple images
   */
  async hasMultipleImages(): Promise<boolean> {
    const count = await this.getImageCount();
    return count > 1;
  }
}
