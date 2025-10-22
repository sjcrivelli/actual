"use strict";
/**
 * 🧠 compareMessages.ts — A+ Sync Handler
 * ------------------------------------------------------------
 * Compares local and remote sync messages to determine
 * which records are new, updated, or identical.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareMessages = compareMessages;
var logger_1 = require("../../../shared/logger");
var deep_equal_1 = require("deep-equal");
var log = (0, logger_1.createModuleLogger)('sync:compareMessages');
/**
 * Compares two arrays of sync messages (local vs remote)
 * and returns which ones are new or updated.
 *
 * @param localMessages Local sync records
 * @param remoteMessages Remote sync records
 * @returns CompareResult
 */
function compareMessages(localMessages, remoteMessages) {
    log.info("[compareMessages] Comparing ".concat(localMessages.length, " local \u2194 ").concat(remoteMessages.length, " remote"));
    var newMessages = [];
    var updatedMessages = [];
    // Index local messages by ID for quick lookup
    var localMap = new Map(localMessages.map(function (m) { return [m.id, m]; }));
    for (var _i = 0, remoteMessages_1 = remoteMessages; _i < remoteMessages_1.length; _i++) {
        var remoteMsg = remoteMessages_1[_i];
        var localMsg = localMap.get(remoteMsg.id);
        if (!localMsg) {
            // Not in local — it's new
            newMessages.push(remoteMsg);
        }
        else if (!(0, deep_equal_1.default)(localMsg.payload, remoteMsg.payload)) {
            // Exists locally but data differs — updated
            updatedMessages.push(remoteMsg);
        }
    }
    log.debug("[compareMessages] Found ".concat(newMessages.length, " new and ").concat(updatedMessages.length, " updated"));
    return {
        new: newMessages,
        updated: updatedMessages,
    };
}
