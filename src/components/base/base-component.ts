import { Locator, Page } from '@playwright/test';

import { IComponent, IComponentProps } from '../../types/component-types';

/**
 * Base component class that provides common functionality for all components
 * Components represent reusable UI elements that appear across multiple pages
 */
export abstract class BaseComponent implements IComponent {
  protected readonly page: Page;
  protected readonly root: Locator;

  /**
   * Creates a new component instance
   * @param page - Playwright page object
   * @param rootLocator - Root locator for the component
   */
  constructor(props: IComponentProps) {
    this.page = props.page;
    this.root =
      typeof props.rootLocator === 'string'
        ? props.page.locator(props.rootLocator)
        : props.rootLocator;
  }

  /**
   * Checks if the component is visible
   * @returns Promise resolving to true if the component is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.root.isVisible();
  }

  /**
   * Waits for the component to be visible
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForVisible(timeout?: number): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /**
   * Gets the root locator for the component
   * @returns The root locator
   */
  getRoot(): Locator {
    return this.root;
  }

  /**
   * Gets a child element within the component
   * @param selector - Selector for the child element
   * @returns Locator for the child element
   */
  getElement(selector: string): Locator {
    return this.root.locator(selector);
  }
}
