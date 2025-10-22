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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareMessages = exports.applyMessages = exports.DEFAULT_RETRY_DELAY_MS = exports.DEFAULT_SYNC_INTERVAL_MS = void 0;
exports.sync = sync;
exports.startScheduledSync = startScheduledSync;
exports.stopSync = stopSync;
var applyMessages_1 = require("./handlers/applyMessages");
var compareMessages_1 = require("./handlers/compareMessages");
var reconcile_1 = require("./handlers/reconcile");
var scheduleFullSync_1 = require("./handlers/scheduleFullSync");
var logger_1 = require("../../shared/logger");
var configValidation_1 = require("./utils/configValidation");
var node_perf_hooks_1 = require("node:perf_hooks");
// Core controller handles orchestration between local/remote
var controller_1 = require("./controller");
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
function sync(config) {
    return __awaiter(this, void 0, void 0, function () {
        var start, _a, localChanges, remoteChanges, diff, applied, reconciliation, end, result, error_1, end, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    start = node_perf_hooks_1.performance.now();
                    logger_1.logger.info('[sync] Starting synchronization process...');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    // 🔍 Validate environment + configuration
                    (0, configValidation_1.validateConfig)(config);
                    logger_1.logger.debug('[sync] Config validated.');
                    return [4 /*yield*/, (0, controller_1.runSyncController)(config)];
                case 2:
                    _a = _c.sent(), localChanges = _a.localChanges, remoteChanges = _a.remoteChanges;
                    diff = (0, compareMessages_1.compareMessages)(localChanges, remoteChanges);
                    logger_1.logger.debug("[sync] Found ".concat(diff.new.length, " new / ").concat(diff.updated.length, " updated records."));
                    return [4 /*yield*/, (0, applyMessages_1.applyMessages)(diff)];
                case 3:
                    applied = _c.sent();
                    logger_1.logger.debug("[sync] Applied ".concat(applied.appliedCount, " updates successfully."));
                    return [4 /*yield*/, (0, reconcile_1.reconcile)(diff, config)];
                case 4:
                    reconciliation = _c.sent();
                    logger_1.logger.debug("[sync] Reconciliation complete: ".concat(reconciliation.conflictsResolved, " conflicts."));
                    // 🕒 Optionally schedule next full sync
                    if (config.autoSchedule) {
                        (0, scheduleFullSync_1.scheduleFullSync)(config, exports.DEFAULT_SYNC_INTERVAL_MS);
                        logger_1.logger.debug('[sync] Next full sync scheduled.');
                    }
                    end = node_perf_hooks_1.performance.now();
                    result = {
                        status: 'success',
                        durationMs: Math.round(end - start),
                        applied: applied.appliedCount,
                        resolved: reconciliation.conflictsResolved,
                        timestamp: new Date().toISOString(),
                    };
                    logger_1.logger.info("[sync] \u2705 Completed successfully in ".concat(result.durationMs, "ms"));
                    return [2 /*return*/, result];
                case 5:
                    error_1 = _c.sent();
                    end = node_perf_hooks_1.performance.now();
                    logger_1.logger.error('[sync] ❌ Sync failed:', error_1);
                    result = {
                        status: 'failed',
                        durationMs: Math.round(end - start),
                        error: (_b = error_1.message) !== null && _b !== void 0 ? _b : 'Unknown error',
                        timestamp: new Date().toISOString(),
                    };
                    return [2 /*return*/, result];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ------------------------------------------------------------
// 3️⃣ Helper: startScheduledSync()
// ------------------------------------------------------------
/**
 * Starts a background sync loop.
 */
function startScheduledSync(config) {
    var _this = this;
    (0, configValidation_1.validateConfig)(config);
    logger_1.logger.info("[sync] Background sync loop started (interval ".concat(exports.DEFAULT_SYNC_INTERVAL_MS / 1000, "s)."));
    var run = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sync(config)];
                case 1:
                    _a.sent();
                    setTimeout(run, exports.DEFAULT_SYNC_INTERVAL_MS);
                    return [2 /*return*/];
            }
        });
    }); };
    run().catch(function (err) { return logger_1.logger.error('[sync] Background loop error:', err); });
}
// ------------------------------------------------------------
// 4️⃣ Graceful Shutdown
// ------------------------------------------------------------
function stopSync() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.info('[sync] Stopping background synchronization...');
            return [2 /*return*/];
        });
    });
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
    sync: sync,
    startScheduledSync: startScheduledSync,
    stopSync: stopSync,
};
