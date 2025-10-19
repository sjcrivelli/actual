// Temporary stubs for type compatibility
export const defaultMappings = new Map<string, any>();
export const mappingsFromString = (str: string) => new Map<string, any>();
import { getErrorMessage } from 'loot-core/src/shared/error-utils';

/**
 * Custom sync mapping utilities for handling sync data conversion and
 * error-safe transformations.
 *
 * All errors are logged or passed upstream as safe string messages.
 */

export function mapSyncData<T, U>(
  data: T[],
  transform: (item: T) => U
): U[] {
  try {
    return data.map(transform);
  } catch (e: unknown) {
    console.error('Error mapping sync data:', getErrorMessage(e));
    return [];
  }
}

/**
 * Attempts to perform an operation and wraps any thrown error
 * into a uniform, string-safe format.
 */
export function safeOperation<T>(operation: () => T): T | null {
  try {
    return operation();
  } catch (e: unknown) {
    console.error('Safe operation failed:', getErrorMessage(e));
    return null;
  }
}

/**
 * Converts an arbitrary error into a standardized sync error object.
 */
export function toSyncError(e: unknown): { message: string } {
  return {
    message: getErrorMessage(e),
  };
}

/**
 * Example of a sync-mapping transform with error isolation.
 * Extend or adapt as needed by upstream code.
 */
export function mapAccountSync<T extends Record<string, unknown>>(
  account: T
): T {
  try {
    // perform any shape normalization or property filtering here
    return {
      ...account,
    };
  } catch (e: unknown) {
    console.warn('Error mapping account sync:', getErrorMessage(e));
    return account;
  }
}
