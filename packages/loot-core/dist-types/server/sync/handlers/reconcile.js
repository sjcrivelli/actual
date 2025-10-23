"use strict";
/**
 * 🧩 reconcile.ts
 * ------------------------------------------------------
 * Reconciles local and remote message differences.
 * Ensures conflict-free data convergence.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcile = reconcile;
const deep_equal_1 = __importDefault(require("deep-equal"));
const logger_1 = require("../../../shared/logger");
/**
 * Resolve message-level conflicts using timestamp comparison
 * or custom logic from SyncConfig.
 */
async function reconcile(diff, config) {
    logger_1.logger.info('[reconcile] Starting reconciliation pass...');
    let conflictsResolved = 0;
    for (const record of diff.updated) {
        const local = record.local;
        const remote = record.remote;
        if (!local || !remote)
            continue;
        const areSame = (0, deep_equal_1.default)(local.data, remote.data);
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
            logger_1.logger.debug(`[reconcile] Conflict resolved: ${record.id}`);
        }
    }
    logger_1.logger.info(`[reconcile] Completed. ${conflictsResolved} conflicts resolved.`);
    return {
        status: 'ok',
        conflictsResolved,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=reconcile.js.map