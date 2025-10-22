/**
 * 🧩 configValidation.ts
 * Ensures sync configuration is complete and well-typed.
 */
import type { SyncConfig } from '../types';

export function validateConfig(config: SyncConfig): void {
  if (!config) {
    throw new Error('[sync] Missing configuration object.');

  // Placeholder validation — expand later
  if (Object.keys(config).length === 0) {
    throw new Error('[sync] Empty configuration object.');
  }
}

}
