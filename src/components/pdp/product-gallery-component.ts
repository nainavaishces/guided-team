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
  }

  /**
   * Gets the main product image
   * @returns The main product image locator
   */
  getMainImage(): Locator {
    return this.mainImage;
  }

  /**
   * Gets the number of images in the gallery
   * @returns Promise resolving to the number of images
   */
  async getImageCount(): Promise<number> {
    return await this.productImages.count();
  }

  /**
   * Waits for the gallery to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for gallery to be loaded');
    await this.mainImage.waitFor({ state: 'visible', timeout });
  }
}
