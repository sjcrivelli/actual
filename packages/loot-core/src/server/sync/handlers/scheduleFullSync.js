/**
 * Schedules the next full sync (placeholder logic).
 */
export function scheduleFullSync(config, intervalMs) {
    // TODO: Implement real scheduler once controller is finalized
    setTimeout(() => {
        console.log(`[sync] Scheduled full sync triggered after ${intervalMs}ms`);
    }, intervalMs);
}
