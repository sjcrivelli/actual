/**
 * 🧩 scheduleFullSync.ts
 * Temporary placeholder for sync scheduler handler
 */
import type { SyncConfig } from '../types';

/**
 * Schedules the next full sync (placeholder logic).
 */
export function scheduleFullSync(config: SyncConfig, intervalMs: number): void {
  // TODO: Implement real scheduler once controller is finalized
  setTimeout(() => {
    console.log(`[sync] Scheduled full sync triggered after ${intervalMs}ms`);
  }, intervalMs);
}
