import { Page } from '@playwright/test';

import { BaseComponent } from '../components/base/base-component';

/**
 * Interface for the base page
 * Defines the shape of all page objects
 */
export interface IPage {
  /**
   * Navigates to the page
   * @param options - Navigation options
   */
  goto(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void>;

  /**
   * Gets the page title
   * @returns Promise resolving to the page title
   */
  getTitle(): Promise<string>;

  /**
   * Gets the current URL
   * @returns The current URL
   */
  getUrl(): string;
}

/**
 * Props for creating a page
 */
export interface IPageProps {
  /**
   * The Playwright page object
   */
  page: Page;

  /**
   * The URL for the page (relative to base URL)
   */
  url?: string;
}

/**
 * Interface for pages with components
 * Extends the base page interface with component management
 */
export interface IComponentPage extends IPage {
  /**
   * Gets a registered component
   * @param name - Component name
   * @returns The component instance
   * @throws Error if the component is not registered
   */
  getComponent<T extends BaseComponent>(name: string): T;
}
