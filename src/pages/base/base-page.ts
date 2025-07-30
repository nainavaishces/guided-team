import { Page } from '@playwright/test';

import { BaseComponent } from '../../components/base/base-component';
import { IPage, IPageProps, IComponentPage } from '../../types/page-types';

/**
 * Base page class that provides common functionality for all pages
 * Pages are composed of components and represent complete web pages in the application
 */
export abstract class BasePage implements IPage, IComponentPage {
  protected readonly page: Page;
  protected readonly components: Map<string, BaseComponent> = new Map();
  protected readonly url: string;

  /**
   * Creates a new page instance
   * @param page - Playwright page object
   * @param url - Page URL (relative to base URL)
   */
  constructor(props: IPageProps) {
    this.page = props.page;
    this.url = props.url || '/';
  }

  /**
   * Navigates to the page
   * @param options - Navigation options
   */
  async goto(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.goto(this.url, options);
  }

  /**
   * Gets the page title
   * @returns Promise resolving to the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Gets the current URL
   * @returns The current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Registers a component with the page
   * @param name - Component name
   * @param component - Component instance
   */
  protected registerComponent(name: string, component: BaseComponent): void {
    this.components.set(name, component);
  }

  /**
   * Gets a registered component
   * @param name - Component name
   * @returns The component instance
   * @throws Error if the component is not registered
   */
  getComponent<T extends BaseComponent>(name: string): T {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' is not registered with this page`);
    }
    return component as T;
  }
}
