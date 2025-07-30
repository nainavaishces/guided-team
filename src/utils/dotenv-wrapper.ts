/**
 * Custom wrapper for dotenv to suppress logging messages
 */
import * as dotenv from 'dotenv';
import { DotenvConfigOptions } from 'dotenv';

// Store the original console.log function
const originalConsoleLog = console.log;

/**
 * Load environment variables from .env file without logging messages
 * @param options - Dotenv configuration options
 * @returns Dotenv parse output
 */
export function loadEnv(options?: DotenvConfigOptions) {
  // Temporarily replace console.log to suppress dotenv messages
  console.log = (...args: unknown[]) => {
    // Only log messages that don't contain 'dotenv'
    if (!args.some(arg => typeof arg === 'string' && arg.includes('dotenv'))) {
      originalConsoleLog(...args);
    }
  };

  // Load environment variables
  const result = dotenv.config(options);

  // Restore original console.log
  console.log = originalConsoleLog;

  return result;
}
