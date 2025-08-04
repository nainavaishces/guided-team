import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Type for product size options
 * Used for size selection in the PDP
 */
type ProductSize = string;

/**
 * Component for the size selector section on the PDP
 * Handles size options, selection, and related functionality
 */
export class SizeSelectorComponent extends BaseComponent {
  private readonly sizeLabel: Locator;
  private readonly sizeOptions: Locator;
  private readonly findMySizeButton: Locator;
  private readonly sizeChartLink: Locator;
  private readonly selectedSizeText: Locator;

  /**
   * Creates a new SizeSelectorComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing SizeSelectorComponent');

    // Initialize locators
    this.sizeLabel = this.page.getByText('Size', { exact: true }).first();
    this.sizeOptions = this.page.getByTestId('productTextSelect');
    this.findMySizeButton = this.page.getByRole('button', { name: 'Find My Size' });
    this.sizeChartLink = this.page.getByTestId('sizeChartTestId');
    this.selectedSizeText = this.page.getByText(/Size: /i).first();
  }

  /**
   * Gets the size label
   * @returns The size label locator
   */
  getSizeLabel(): Locator {
    return this.sizeLabel;
  }

  /**
   * Gets the "Find My Size" button
   * @returns The "Find My Size" button locator
   */
  getFindMySizeButton(): Locator {
    return this.findMySizeButton;
  }

  /**
   * Gets the size chart link
   * @returns The size chart link locator
   */
  getSizeChartLink(): Locator {
    return this.sizeChartLink;
  }

  /**
   * Gets all available size texts
   * @returns Promise resolving to an array of size texts
   */
  async getAvailableSizes(): Promise<string[]> {
    const sizeTexts = (await this.sizeOptions.allInnerTexts())
      .join(' ')
      .split(/\s+/)
      .filter(Boolean);
    return sizeTexts;
  }

  /**
   * Gets the currently selected size
   * @returns Promise resolving to the currently selected size
   */
  async getSelectedSize(): Promise<string> {
    const isVisible = await this.selectedSizeText.isVisible();

    if (!isVisible) {
      return ''; // No size selected yet
    }

    const text = (await this.selectedSizeText.textContent()) || '';
    const match = text.match(/Size:\s*(.+)/i);
    return match ? match[1].trim() : '';
  }

  /**
   * Selects the first available (enabled) size
   * @returns Promise resolving to the selected size text
   */
  /**
   * Selects the first available (enabled) size
   * @returns Promise resolving to the selected size text
   * @throws Error if no available sizes are found
   */
  async selectFirstAvailableSize(): Promise<string> {
    logger.debug('Selecting first available size');

    try {
      // Get all size option buttons
      const sizeButtons = await this.sizeOptions.locator('button').all();

      if (sizeButtons.length === 0) {
        logger.warn('No size buttons found');
        throw new Error('No size buttons found on the page');
      }

      // Find and click the first enabled size button
      let foundEnabledSize = false;
      for (const size of sizeButtons) {
        if (await size.isEnabled()) {
          // Get the size text before clicking for better logging
          const sizeText = (await size.textContent()) || 'unknown';
          logger.debug(`Clicking size button: ${sizeText}`);

          await size.click();
          foundEnabledSize = true;

          // Get the selected size text
          const selectedSize = await this.getSelectedSize();
          logger.debug(`Selected size: ${selectedSize}`);
          return selectedSize;
        }
      }

      if (!foundEnabledSize) {
        logger.warn('No enabled size buttons found - all sizes may be out of stock');
        throw new Error('No available sizes found - all sizes may be out of stock');
      }

      // This should never be reached if the function works correctly
      throw new Error('Failed to select a size for unknown reason');
    } catch (error) {
      logger.error(`Error selecting size: ${error}`);
      throw error;
    }
  }

  /**
   * Waits for the size selector to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for size selector to be loaded');
    await this.sizeLabel.waitFor({ state: 'visible', timeout });
    await this.sizeOptions.first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Validates that the expected sizes are available
   * @param expectedSizes - The expected sizes
   * @returns Promise resolving to true if all expected sizes are available
   */
  async validateSizes(expectedSizes: ProductSize[]): Promise<boolean> {
    logger.debug(`Validating sizes: ${JSON.stringify(expectedSizes)}`);
    const availableSizes = await this.getAvailableSizes();

    for (const expectedSize of expectedSizes) {
      if (!availableSizes.includes(expectedSize)) {
        logger.error(
          `Expected size "${expectedSize}" not found in available sizes: ${JSON.stringify(availableSizes)}`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Selects the first available inseam option
   * @returns Promise resolving when the first available inseam is selected
   */
  async selectFirstAvailableInseam(): Promise<void> {
    logger.debug('Selecting first available inseam');

    try {
      // Get all product text selectors
      const sizeSelectors = await this.page.getByTestId('productTextSelect').count();

      // If there are multiple size selectors, the second one is typically for inseam
      if (sizeSelectors > 1) {
        const inseamSelector = this.page.getByTestId('productTextSelect').nth(1);
        const inseamButtons = await inseamSelector.locator('button').all();

        if (inseamButtons.length === 0) {
          logger.warn('No inseam buttons found');
          return;
        }

        // Find and click the first enabled inseam button
        let foundEnabledInseam = false;
        for (const inseam of inseamButtons) {
          if (await inseam.isEnabled()) {
            await inseam.click();
            logger.debug('Selected inseam');
            foundEnabledInseam = true;
            break;
          }
        }

        if (!foundEnabledInseam) {
          logger.warn('No available inseam options found - all buttons are disabled');
        }
      } else {
        logger.debug('No inseam selector found - product may not have inseam options');
      }
    } catch (error) {
      logger.error(`Error selecting inseam: ${error}`);
    }
  }

  /**
   * Selects the first available size and inseam options
   * This method handles the selection in the correct order based on the product type
   * @returns Promise resolving when both size and inseam are selected
   */
  async selectFirstAvailableSizeAndInseam(): Promise<void> {
    logger.debug('Selecting first available size and inseam');

    try {
      // Get all product text selectors
      const sizeSelectors = await this.page.getByTestId('productTextSelect').count();

      if (sizeSelectors > 1) {
        // For products with both size and inseam, we need to select inseam first
        // as it may affect which sizes are available
        logger.debug('Product has multiple selectors, handling inseam first');
        await this.selectFirstAvailableInseam();
        await this.selectFirstAvailableSize();
      } else if (sizeSelectors === 1) {
        // For products with only size, just select the size
        logger.debug('Product has only size selector');
        await this.selectFirstAvailableSize();
      } else {
        logger.warn('No size selectors found on the page');
      }
    } catch (error) {
      logger.error(`Error selecting size and inseam: ${error}`);
      // Attempt to select size anyway as a fallback
      try {
        await this.selectFirstAvailableSize();
      } catch (sizeError) {
        logger.error(`Fallback size selection also failed: ${sizeError}`);
        throw new Error(`Failed to select size and inseam: ${error}`);
      }
    }
  }
}
