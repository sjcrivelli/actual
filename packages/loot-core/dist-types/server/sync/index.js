"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTestMessage = exports.initialFullSync = exports.clearFullSyncTimeout = exports.fullSync = exports.addSyncListener = exports.sendMessages = exports.setSyncingMode = exports.batchMessages = exports.compareMessages = exports.applyMessages = exports.DEFAULT_RETRY_DELAY_MS = exports.DEFAULT_SYNC_INTERVAL_MS = void 0;
exports.sync = sync;
exports.startScheduledSync = startScheduledSync;
exports.stopSync = stopSync;
const applyMessages_1 = require("./handlers/applyMessages");
const compareMessages_1 = require("./handlers/compareMessages");
const reconcile_1 = require("./handlers/reconcile");
const scheduleFullSync_1 = require("./handlers/scheduleFullSync");
const logger_1 = require("../../shared/logger");
const configValidation_1 = require("./utils/configValidation");
const node_perf_hooks_1 = require("node:perf_hooks");
// Core controller handles orchestration between local/remote
const controller_1 = require("./controller");
// ------------------------------------------------------------
// 1️⃣ Default Configuration
// ------------------------------------------------------------
exports.DEFAULT_SYNC_INTERVAL_MS = 1000 * 60 * 15; // 15 minutes
exports.DEFAULT_RETRY_DELAY_MS = 1000 * 30; // 30 seconds
// ------------------------------------------------------------
// 2️⃣ Entry Point: sync()
// ------------------------------------------------------------
/**
 * Runs a full synchronization cycle between local + remote.
 */
async function sync(config) {
    const start = node_perf_hooks_1.performance.now();
    logger_1.logger.info('[sync] Starting synchronization process...');
    try {
        // 🔍 Validate environment + configuration
        (0, configValidation_1.validateConfig)(config);
        logger_1.logger.debug('[sync] Config validated.');
        // 🧭 Run controller (core orchestrator)
        const { localChanges, remoteChanges } = await (0, controller_1.runSyncController)(config);
        // 🧩 Compare incoming vs local changes
        const diff = (0, compareMessages_1.compareMessages)(localChanges, remoteChanges);
        logger_1.logger.debug(`[sync] Found ${diff.new.length} new / ${diff.updated.length} updated records.`);
        // 💾 Apply inbound changes to local DB
        const applied = await (0, applyMessages_1.applyMessages)(diff);
        logger_1.logger.debug(`[sync] Applied ${applied.appliedCount} updates successfully.`);
        // ⚖️ Reconcile any conflicts
        const reconciliation = await (0, reconcile_1.reconcile)(diff, config);
        logger_1.logger.debug(`[sync] Reconciliation complete: ${reconciliation.conflictsResolved} conflicts.`);
        // 🕒 Optionally schedule next full sync
        if (config.autoSchedule) {
            (0, scheduleFullSync_1.scheduleFullSync)(config, exports.DEFAULT_SYNC_INTERVAL_MS);
            logger_1.logger.debug('[sync] Next full sync scheduled.');
        }
        const end = node_perf_hooks_1.performance.now();
        const result = {
            status: 'success',
            durationMs: Math.round(end - start),
            applied: applied.appliedCount,
            resolved: reconciliation.conflictsResolved,
            timestamp: new Date().toISOString(),
        };
        logger_1.logger.info(`[sync] ✅ Completed successfully in ${result.durationMs}ms`);
        return result;
    }
    catch (error) {
        const end = node_perf_hooks_1.performance.now();
        logger_1.logger.error('[sync] ❌ Sync failed:', error);
        const result = {
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
function startScheduledSync(config) {
    (0, configValidation_1.validateConfig)(config);
    logger_1.logger.info(`[sync] Background sync loop started (interval ${exports.DEFAULT_SYNC_INTERVAL_MS / 1000}s).`);
    const run = async () => {
        await sync(config);
        setTimeout(run, exports.DEFAULT_SYNC_INTERVAL_MS);
    };
    run().catch((err) => logger_1.logger.error('[sync] Background loop error:', err));
}
// ------------------------------------------------------------
// 4️⃣ Graceful Shutdown
// ------------------------------------------------------------
async function stopSync() {
    logger_1.logger.info('[sync] Stopping background synchronization...');
    // You can extend this with controller cleanup logic later
}
// ------------------------------------------------------------
// 🧩 Temporary Legacy Re-Exports (verified existing symbols)
// ------------------------------------------------------------
var applyMessages_2 = require("./handlers/applyMessages");
Object.defineProperty(exports, "applyMessages", { enumerable: true, get: function () { return applyMessages_2.applyMessages; } });
var compareMessages_2 = require("./handlers/compareMessages");
Object.defineProperty(exports, "compareMessages", { enumerable: true, get: function () { return compareMessages_2.compareMessages; } });
// ------------------------------------------------------------
// 🧾 Module Exports
// ------------------------------------------------------------
exports.default = {
    sync,
    startScheduledSync,
    stopSync,
};
// 🩹 Temporary legacy stubs for compatibility during refactor
const batchMessages = () => {
    throw new Error("batchMessages() has been removed or refactored. Check new sync API.");
};
exports.batchMessages = batchMessages;
const setSyncingMode = () => {
    throw new Error("setSyncingMode() removed. Update to new sync scheduler logic.");
};
exports.setSyncingMode = setSyncingMode;
const sendMessages = () => {
    throw new Error("sendMessages() removed. Use applyMessages() or compareMessages() instead.");
};
exports.sendMessages = sendMessages;
const addSyncListener = () => {
    throw new Error("addSyncListener() deprecated. See controller.ts for sync orchestration.");
};
exports.addSyncListener = addSyncListener;
const fullSync = () => {
    throw new Error("fullSync() deprecated. Use runSyncController() entrypoint.");
};
exports.fullSync = fullSync;
const clearFullSyncTimeout = () => { };
exports.clearFullSyncTimeout = clearFullSyncTimeout;
const initialFullSync = () => { };
exports.initialFullSync = initialFullSync;
const makeTestMessage = () => { };
exports.makeTestMessage = makeTestMessage;
//# sourceMappingURL=index.js.map