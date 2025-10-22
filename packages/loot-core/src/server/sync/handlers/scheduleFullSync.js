"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleFullSync = scheduleFullSync;
/**
 * Schedules the next full sync (placeholder logic).
 */
function scheduleFullSync(config, intervalMs) {
    // TODO: Implement real scheduler once controller is finalized
    setTimeout(function () {
        console.log("[sync] Scheduled full sync triggered after ".concat(intervalMs, "ms"));
    }, intervalMs);
}
