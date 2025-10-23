"use strict";
/**
 * 🧠 compareMessages.ts — A+ Sync Handler
 * ------------------------------------------------------------
 * Compares local and remote sync messages to determine
 * which records are new, updated, or identical.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareMessages = compareMessages;
const logger_1 = require("../../../shared/logger");
const deep_equal_1 = __importDefault(require("deep-equal"));
const log = (0, logger_1.createModuleLogger)('sync:compareMessages');
/**
 * Compares two arrays of sync messages (local vs remote)
 * and returns which ones are new or updated.
 *
 * @param localMessages Local sync records
 * @param remoteMessages Remote sync records
 * @returns CompareResult
 */
function compareMessages(localMessages, remoteMessages) {
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
        else if (!(0, deep_equal_1.default)(localMsg.payload, remoteMsg.payload)) {
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
//# sourceMappingURL=compareMessages.js.map