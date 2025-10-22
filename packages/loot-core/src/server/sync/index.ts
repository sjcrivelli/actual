/**
 * 🧠 ActualFork A+ Sync Orchestrator
 * ------------------------------------------------------
 * The central orchestrator for local <-> remote sync.
 * Clean, typed, and dependency-isolated.
 *
 * Responsibilities:
 * - Validate environment & config
 * - Load sync controller
 * - Run full or incremental sync
 * - Report structured results
 */

import { applyMessages } from './handlers/applyMessages';
import { compareMessages } from './handlers/compareMessages';
import { reconcile } from './handlers/reconcile';
import { scheduleFullSync } from './handlers/scheduleFullSync';
import type { SyncConfig, SyncResult } from './types';
import { logger } from '../../shared/logger';
import { validateConfig } from './utils/configValidation';
import { performance } from 'node:perf_hooks';
import { createModuleLogger } from '../../shared/logger';

// Core controller handles orchestration between local/remote
import { runSyncController } from './controller';

// ------------------------------------------------------------
// 1️⃣ Default Configuration
// ------------------------------------------------------------

export const DEFAULT_SYNC_INTERVAL_MS = 1000 * 60 * 15; // 15 minutes
export const DEFAULT_RETRY_DELAY_MS = 1000 * 30; // 30 seconds

// ------------------------------------------------------------
// 2️⃣ Entry Point: sync()
// ------------------------------------------------------------

/**
 * Runs a full synchronization cycle between local + remote.
 */
export async function sync(config: SyncConfig): Promise<SyncResult> {
  const start = performance.now();
  logger.info('[sync] Starting synchronization process...');

  try {
    // 🔍 Validate environment + configuration
    validateConfig(config);
    logger.debug('[sync] Config validated.');

    // 🧭 Run controller (core orchestrator)
    const { localChanges, remoteChanges } = await runSyncController(config);

    // 🧩 Compare incoming vs local changes
    const diff = compareMessages(localChanges, remoteChanges);
    logger.debug(`[sync] Found ${diff.new.length} new / ${diff.updated.length} updated records.`);

    // 💾 Apply inbound changes to local DB
    const applied = await applyMessages(diff);
    logger.debug(`[sync] Applied ${applied.appliedCount} updates successfully.`);

    // ⚖️ Reconcile any conflicts
    const reconciliation = await reconcile(diff, config);
    logger.debug(`[sync] Reconciliation complete: ${reconciliation.conflictsResolved} conflicts.`);

    // 🕒 Optionally schedule next full sync
    if (config.autoSchedule) {
      scheduleFullSync(config, DEFAULT_SYNC_INTERVAL_MS);
      logger.debug('[sync] Next full sync scheduled.');
    }

    const end = performance.now();

    const result: SyncResult = {
      status: 'success',
      durationMs: Math.round(end - start),
      applied: applied.appliedCount,
      resolved: reconciliation.conflictsResolved,
      timestamp: new Date().toISOString(),
    };

    logger.info(`[sync] ✅ Completed successfully in ${result.durationMs}ms`);
    return result;
  } catch (error: any) {
    const end = performance.now();

    logger.error('[sync] ❌ Sync failed:', error);

    const result: SyncResult = {
      status: 'failed',
      durationMs: Math.round(end - start),
      error: error.message ?? 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    return result;
  }
}

// ------------------------------------------------------------
// 3️⃣ Helper: startScheduledSync()
// ------------------------------------------------------------

/**
 * Starts a background sync loop.
 */
export function startScheduledSync(config: SyncConfig) {
  validateConfig(config);

  logger.info(`[sync] Background sync loop started (interval ${DEFAULT_SYNC_INTERVAL_MS / 1000}s).`);

  const run = async () => {
    await sync(config);
    setTimeout(run, DEFAULT_SYNC_INTERVAL_MS);
  };

  run().catch((err) => logger.error('[sync] Background loop error:', err));
}

// ------------------------------------------------------------
// 4️⃣ Graceful Shutdown
// ------------------------------------------------------------

export async function stopSync() {
  logger.info('[sync] Stopping background synchronization...');
  // You can extend this with controller cleanup logic later
}
// ------------------------------------------------------------
// 🧩 Temporary Legacy Re-Exports (verified existing symbols)
// ------------------------------------------------------------
export { applyMessages } from './handlers/applyMessages';
export { compareMessages } from './handlers/compareMessages';
export type { SyncMessage, SyncConfig } from './types';

// ------------------------------------------------------------
// 🧾 Module Exports
// ------------------------------------------------------------
export default {
  sync,
  startScheduledSync,
  stopSync,
};
