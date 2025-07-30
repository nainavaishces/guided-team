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
   * Gets all size options
   * @returns The size options locator
   */
  getSizeOptions(): Locator {
    return this.sizeOptions;
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
   * Gets the number of size options
   * @returns Promise resolving to the number of size options
   */
  async getSizeCount(): Promise<number> {
    return await this.sizeOptions.count();
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
  async selectFirstAvailableSize(): Promise<string> {
    logger.debug('Selecting first available size');

    // Get all size option buttons
    const sizeButtons = await this.sizeOptions.locator('button').all();

    // Find and click the first enabled size button
    for (const size of sizeButtons) {
      if (await size.isEnabled()) {
        await size.click();

        // Get the selected size text
        const selectedSize = await this.getSelectedSize();
        logger.debug(`Selected size: ${selectedSize}`);
        return selectedSize;
      }
    }

    throw new Error('No available sizes found');
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
}
