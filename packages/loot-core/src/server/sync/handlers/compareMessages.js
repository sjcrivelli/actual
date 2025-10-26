/**
 * 🧠 compareMessages.ts — A+ Sync Handler
 * ------------------------------------------------------------
 * Compares local and remote sync messages to determine
 * which records are new, updated, or identical.
 */
import { createModuleLogger } from '../../../shared/logger';
import deepEqual from 'deep-equal';
const log = createModuleLogger('sync:compareMessages');
/**
 * Compares two arrays of sync messages (local vs remote)
 * and returns which ones are new or updated.
 *
 * @param localMessages Local sync records
 * @param remoteMessages Remote sync records
 * @returns CompareResult
 */
export function compareMessages(localMessages, remoteMessages) {
    log.info(`[compareMessages] Comparing ${localMessages.length} local ↔ ${remoteMessages.length} remote`);
    const newMessages = [];
    const updatedMessages = [];
    // Index local messages by ID for quick lookup
    const localMap = new Map(localMessages.map((m) => [m.id, m]));
    for (const remoteMsg of remoteMessages) {
        const localMsg = localMap.get(remoteMsg.id);
        if (!localMsg) {
            // Not in local — it's new
            newMessages.push(remoteMsg);
        }
        else if (!deepEqual(localMsg.payload, remoteMsg.payload)) {
            // Exists locally but data differs — updated
            updatedMessages.push(remoteMsg);
        }
    }
    log.debug(`[compareMessages] Found ${newMessages.length} new and ${updatedMessages.length} updated`);
    return {
        new: newMessages,
        updated: updatedMessages,
    };
}
