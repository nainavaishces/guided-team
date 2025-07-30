import { Page } from '@playwright/test';

/**
 * Analytics fixture for testing analytics functionality
 * Provides methods for checking cookies, JavaScript variables, and page source
 */
export class AnalyticsFixture {
  protected readonly page: Page;

  /**
   * Creates a new analytics fixture
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Check if a cookie exists
   * @param name - Cookie name
   * @returns Promise resolving to true if the cookie exists
   */
  async cookieExists(name: string): Promise<boolean> {
    const cookies = await this.page.context().cookies();
    return cookies.some(cookie => cookie.name === name);
  }

  /**
   * Get cookie value
   * @param name - Cookie name
   * @returns Promise resolving to the cookie value or null if not found
   */
  async getCookieValue(name: string): Promise<string | null> {
    const cookies = await this.page.context().cookies();
    const cookie = cookies.find(c => c.name === name);
    return cookie ? cookie.value : null;
  }

  /**
   * Check if a JavaScript variable exists in the page context
   * @param variableName - Variable name
   * @returns Promise resolving to true if the variable exists
   */
  async jsVariableExists(variableName: string): Promise<boolean> {
    return await this.page.evaluate((name: string) => {
      return typeof (window as unknown as Record<string, unknown>)[name] !== 'undefined';
    }, variableName);
  }

  /**
   * Get JavaScript variable value
   * @param variableName - Variable name
   * @returns Promise resolving to the variable value
   */
  async getJsVariableValue(variableName: string): Promise<unknown> {
    return await this.page.evaluate((name: string) => {
      return (window as unknown as Record<string, unknown>)[name];
    }, variableName);
  }

  /**
   * Check if page source contains a specific string
   * @param text - Text to search for
   * @returns Promise resolving to true if the text is found
   */
  async pageSourceContains(text: string): Promise<boolean> {
    const content = await this.page.content();
    return content.includes(text);
  }

  /**
   * Check if a local storage item exists
   * @param key - Local storage key
   * @returns Promise resolving to true if the item exists
   */
  async localStorageItemExists(key: string): Promise<boolean> {
    return await this.page.evaluate((storageKey: string) => {
      return localStorage.getItem(storageKey) !== null;
    }, key);
  }

  /**
   * Get local storage item value
   * @param key - Local storage key
   * @returns Promise resolving to the item value or null if not found
   */
  async getLocalStorageItem(key: string): Promise<unknown> {
    return await this.page.evaluate((storageKey: string) => {
      const item = localStorage.getItem(storageKey);
      if (item === null) return null;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    }, key);
  }

  /**
   * Check if a local storage item has specific properties
   * @param key - Local storage key
   * @param properties - Array of property names to check
   * @returns Promise resolving to true if all properties exist
   */
  async localStorageItemHasProperties(key: string, properties: string[]): Promise<boolean> {
    return await this.page.evaluate(
      ({ storageKey, props }) => {
        const item = localStorage.getItem(storageKey);
        if (item === null) return false;

        try {
          const parsedItem = JSON.parse(item);
          return props.every(prop => prop in parsedItem);
        } catch {
          return false;
        }
      },
      { storageKey: key, props: properties }
    );
  }
}
