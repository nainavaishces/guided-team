import { Locator, Page } from '@playwright/test';

/**
 * Interface for the base component
 * Defines the shape of all UI components
 */
export interface IComponent {
  /**
   * Checks if the component is visible
   * @returns Promise resolving to true if the component is visible
   */
  isVisible(): Promise<boolean>;

  /**
   * Waits for the component to be visible
   * @param timeout - Optional timeout in milliseconds
   */
  waitForVisible(timeout?: number): Promise<void>;

  /**
   * Gets the root locator for the component
   * @returns The root locator
   */
  getRoot(): Locator;

  /**
   * Gets a child element within the component
   * @param selector - Selector for the child element
   * @returns Locator for the child element
   */
  getElement(selector: string): Locator;
}

/**
 * Props for creating a component
 */
export interface IComponentProps {
  /**
   * The Playwright page object
   */
  page: Page;

  /**
   * The root locator for the component
   * Can be a string selector or a Locator object
   */
  rootLocator: string | Locator;
}
