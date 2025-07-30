import { BrowserContext } from '@playwright/test';

import { Cookie } from '../../types';

/**
 * CookieManager class for managing browser cookies
 * Provides methods for adding and managing cookies for authentication
 */
export class CookieManager {
  /**
   * Add authentication cookies to bypass password protection
   * @param context - Playwright browser context
   * @param cookieDomain - Domain for the cookies
   */
  static async addAuthCookies(context: BrowserContext, cookieDomain: string): Promise<void> {
    const cookies: Cookie[] = [
      {
        name: 'vuori_access',
        value: 'allowed',
        domain: cookieDomain,
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'automation',
        value: 'true',
        domain: cookieDomain,
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ];

    await context.addCookies(cookies);
  }

  /**
   * Save browser context state to a file
   * @param context - Playwright browser context
   * @param path - Path to save the state
   */
  static async saveContextState(context: BrowserContext, path: string): Promise<void> {
    await context.storageState({ path });
  }
}
