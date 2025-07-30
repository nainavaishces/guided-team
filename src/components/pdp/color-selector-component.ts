import { Locator } from '@playwright/test';

import { IComponentProps } from '../../types/component-types';
import { logger } from '../../utils/logger';
import { BaseComponent } from '../base/base-component';

/**
 * Component for the color selector section on the PDP
 * Handles color options and selection
 */
export class ColorSelectorComponent extends BaseComponent {
  private readonly colorLabel: Locator;
  private readonly colorOptions: Locator;
  private readonly selectedColorTitle: Locator;

  /**
   * Creates a new ColorSelectorComponent instance
   * @param props - Component props
   */
  constructor(props: IComponentProps) {
    super(props);
    logger.debug('Initializing ColorSelectorComponent');

    // Initialize locators
    this.colorLabel = this.page.getByText('Color', { exact: true });
    this.colorOptions = this.page.locator('[data-radio-button="product-color-select"]');
    this.selectedColorTitle = this.page
      .getByTestId('product-select-title')
      .filter({ hasText: /Color:/i });
  }

  /**
   * Gets the color label
   * @returns The color label locator
   */
  getColorLabel(): Locator {
    return this.colorLabel;
  }

  /**
   * Gets all color options
   * @returns The color options locator
   */
  getColorOptions(): Locator {
    return this.colorOptions;
  }

  /**
   * Gets the number of color options
   * @returns Promise resolving to the number of color options
   */
  async getColorCount(): Promise<number> {
    return await this.colorOptions.count();
  }

  /**
   * Gets the currently selected color
   * @returns Promise resolving to the currently selected color
   */
  async getSelectedColor(): Promise<string> {
    const text = (await this.selectedColorTitle.textContent()) || '';
    // Extract just the color name from the text which might include "Color: "
    const match = text.match(/Color:\s*(.+)/i);
    return match ? match[1].trim() : text.trim();
  }

  /**
   * Waits for the color selector to be loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForLoaded(timeout?: number): Promise<void> {
    logger.debug('Waiting for color selector to be loaded');
    await this.colorLabel.waitFor({ state: 'visible', timeout });
    await this.colorOptions.first().waitFor({ state: 'visible', timeout });
  }
}
