/**
 * Cookie type definitions
 */

/**
 * Cookie interface for browser cookie management
 * Used in cookie-manager.ts for authentication cookies
 */
export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Lax' | 'Strict' | 'None';
}
