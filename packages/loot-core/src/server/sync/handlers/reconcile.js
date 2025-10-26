/**
 * 🧩 reconcile.ts
 * ------------------------------------------------------
 * Reconciles local and remote message differences.
 * Ensures conflict-free data convergence.
 */
import deepEqual from 'deep-equal';
import { logger } from '../../../shared/logger';
/**
 * Resolve message-level conflicts using timestamp comparison
 * or custom logic from SyncConfig.
 */
export async function reconcile(diff, config) {
    logger.info('[reconcile] Starting reconciliation pass...');
    let conflictsResolved = 0;
    for (const record of diff.updated) {
        const local = record.local;
        const remote = record.remote;
        if (!local || !remote)
            continue;
        const areSame = deepEqual(local.data, remote.data);
        if (!areSame) {
            conflictsResolved++;
            const winner = config.conflictResolution === 'remote-wins'
                ? remote
                : config.conflictResolution === 'local-wins'
                    ? local
                    : local.updated > remote.updated
                        ? local
                        : remote;
            await config.applyRecord(winner);
            logger.debug(`[reconcile] Conflict resolved: ${record.id}`);
        }
    }
    logger.info(`[reconcile] Completed. ${conflictsResolved} conflicts resolved.`);
    return {
        status: 'ok',
        conflictsResolved,
        timestamp: new Date().toISOString(),
    };
}
