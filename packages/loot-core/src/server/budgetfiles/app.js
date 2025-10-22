"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.app = void 0;
// @ts-strict-ignore
var CRDT = require("@actual-app/crdt");
var budget_1 = require("../../mocks/budget");
var exceptions_1 = require("../../platform/exceptions");
var asyncStorage = require("../../platform/server/asyncStorage");
var connection = require("../../platform/server/connection");
var fs = require("../../platform/server/fs");
var log_1 = require("../../platform/server/log");
var Platform = require("../../shared/platform");
var app_1 = require("../app");
var budget = require("../budget/base");
var cloudStorage = require("../cloud-storage");
var db = require("../db");
var mappings = require("../db/mappings");
var importers_1 = require("../importers");
var main_app_1 = require("../main-app");
var mutators_1 = require("../mutators");
var prefs = require("../prefs");
var server_config_1 = require("../server-config");
var sheet = require("../sheet");
var sync_1 = require("../sync");
var syncMigrations = require("../sync/migrate");
var rules = require("../transactions/transaction-rules");
var undo_1 = require("../undo");
var update_1 = require("../update");
var budget_name_1 = require("../util/budget-name");
var backups_1 = require("./backups");
var DEMO_BUDGET_ID = '_demo-budget';
var TEST_BUDGET_ID = '_test-budget';
exports.app = (0, app_1.createApp)();
exports.app.method('validate-budget-name', handleValidateBudgetName);
exports.app.method('unique-budget-name', handleUniqueBudgetName);
exports.app.method('get-budgets', getBudgets);
exports.app.method('get-remote-files', getRemoteFiles);
exports.app.method('get-user-file-info', getUserFileInfo);
exports.app.method('reset-budget-cache', (0, mutators_1.mutator)(resetBudgetCache));
exports.app.method('upload-budget', uploadBudget);
exports.app.method('download-budget', downloadBudget);
exports.app.method('sync-budget', syncBudget);
exports.app.method('load-budget', loadBudget);
exports.app.method('create-demo-budget', createDemoBudget);
exports.app.method('close-budget', closeBudget);
exports.app.method('delete-budget', deleteBudget);
exports.app.method('duplicate-budget', duplicateBudget);
exports.app.method('create-budget', createBudget);
exports.app.method('import-budget', importBudget);
exports.app.method('export-budget', exportBudget);
exports.app.method('upload-file-web', uploadFileWeb);
exports.app.method('backups-get', getBackups);
exports.app.method('backup-load', loadBackup);
exports.app.method('backup-make', makeBackup);
exports.app.method('get-last-opened-backup', getLastOpenedBackup);
function handleValidateBudgetName(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var name = _b.name;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, budget_name_1.validateBudgetName)(name)];
        });
    });
}
function handleUniqueBudgetName(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var name = _b.name;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, budget_name_1.uniqueBudgetName)(name)];
        });
    });
}
function getBudgets() {
    return __awaiter(this, void 0, void 0, function () {
        var paths, budgets;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.listDir(fs.getDocumentDir())];
                case 1:
                    paths = _a.sent();
                    return [4 /*yield*/, Promise.all(paths.map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                            var prefsPath, prefs_1, _a, _b, e_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        prefsPath = fs.join(fs.getDocumentDir(), name, 'metadata.json');
                                        return [4 /*yield*/, fs.exists(prefsPath)];
                                    case 1:
                                        if (!_c.sent()) return [3 /*break*/, 6];
                                        _c.label = 2;
                                    case 2:
                                        _c.trys.push([2, 4, , 5]);
                                        _b = (_a = JSON).parse;
                                        return [4 /*yield*/, fs.readFile(prefsPath)];
                                    case 3:
                                        prefs_1 = _b.apply(_a, [_c.sent()]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_1 = _c.sent();
                                        log_1.logger.log('Error parsing metadata:', e_1.stack);
                                        return [2 /*return*/, null];
                                    case 5:
                                        // We treat the directory name as the canonical id so that if
                                        // the user moves it around/renames/etc, nothing breaks. The
                                        // id is stored in prefs just for convenience (and the prefs
                                        // will always update to the latest given id)
                                        if (name !== DEMO_BUDGET_ID) {
                                            return [2 /*return*/, __assign(__assign(__assign(__assign(__assign({ id: name }, (prefs_1.cloudFileId ? { cloudFileId: prefs_1.cloudFileId } : {})), (prefs_1.encryptKeyId ? { encryptKeyId: prefs_1.encryptKeyId } : {})), (prefs_1.groupId ? { groupId: prefs_1.groupId } : {})), (prefs_1.owner ? { owner: prefs_1.owner } : {})), { name: prefs_1.budgetName || '(no name)' })];
                                        }
                                        _c.label = 6;
                                    case 6: return [2 /*return*/, null];
                                }
                            });
                        }); }))];
                case 2:
                    budgets = _a.sent();
                    return [2 /*return*/, budgets.filter(Boolean)];
            }
        });
    });
}
function getRemoteFiles() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, cloudStorage.listRemoteFiles()];
        });
    });
}
function getUserFileInfo(fileId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, cloudStorage.getRemoteFile(fileId)];
        });
    });
}
function resetBudgetCache() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Recomputing everything will update the cache
                return [4 /*yield*/, sheet.loadUserBudgets(db)];
                case 1:
                    // Recomputing everything will update the cache
                    _a.sent();
                    sheet.get().recomputeAll();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function uploadBudget() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var e_2;
        var _b = _a === void 0 ? {} : _a, id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!id) return [3 /*break*/, 2];
                    if (prefs.getPrefs()) {
                        throw new Error('upload-budget: id given but prefs already loaded');
                    }
                    return [4 /*yield*/, prefs.loadPrefs(id)];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_2 = _c.sent();
                    log_1.logger.log(e_2);
                    if (e_2.type === 'FileUploadError') {
                        return [2 /*return*/, { error: e_2 }];
                    }
                    (0, exceptions_1.captureException)(e_2);
                    return [2 /*return*/, { error: { reason: 'internal' } }];
                case 5:
                    if (id) {
                        prefs.unloadPrefs();
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/, {}];
            }
        });
    });
}
function downloadBudget(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var result, e_3, name_1, id;
        var cloudFileId = _b.cloudFileId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, cloudStorage.download(cloudFileId)];
                case 1:
                    result = _c.sent();
                    return [3 /*break*/, 7];
                case 2:
                    e_3 = _c.sent();
                    if (!(e_3.type === 'FileDownloadError')) return [3 /*break*/, 5];
                    if (!(e_3.reason === 'file-exists' && e_3.meta.id)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prefs.loadPrefs(e_3.meta.id)];
                case 3:
                    _c.sent();
                    name_1 = prefs.getPrefs().budgetName;
                    prefs.unloadPrefs();
                    e_3.meta = __assign(__assign({}, e_3.meta), { name: name_1 });
                    _c.label = 4;
                case 4: return [2 /*return*/, { error: e_3 }];
                case 5:
                    (0, exceptions_1.captureException)(e_3);
                    return [2 /*return*/, { error: { reason: 'internal' } }];
                case 6: return [3 /*break*/, 7];
                case 7:
                    id = result.id;
                    return [4 /*yield*/, closeBudget()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, loadBudget({ id: id })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, syncBudget()];
                case 10:
                    result = _c.sent();
                    if (result.error) {
                        return [2 /*return*/, result];
                    }
                    return [2 /*return*/, { id: id }];
            }
        });
    });
}
// open and sync, but don’t close
function syncBudget() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, sync_1.setSyncingMode)('enabled');
                    return [4 /*yield*/, (0, sync_1.initialFullSync)()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function loadBudget(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var currentPrefs, res;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    currentPrefs = prefs.getPrefs();
                    if (!currentPrefs) return [3 /*break*/, 3];
                    if (!(currentPrefs.id === id)) return [3 /*break*/, 1];
                    // If it's already loaded, do nothing
                    return [2 /*return*/, {}];
                case 1: 
                // Otherwise, close the currently loaded budget
                return [4 /*yield*/, closeBudget()];
                case 2:
                    // Otherwise, close the currently loaded budget
                    _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, _loadBudget(id)];
                case 4:
                    res = _c.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
function createDemoBudget() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Make sure the read only flag isn't leftover (normally it's
                // reset when signing in, but you don't have to sign in for the
                // demo budget)
                return [4 /*yield*/, asyncStorage.setItem('readOnly', '')];
                case 1:
                    // Make sure the read only flag isn't leftover (normally it's
                    // reset when signing in, but you don't have to sign in for the
                    // demo budget)
                    _a.sent();
                    return [2 /*return*/, createBudget({
                            budgetName: 'Demo Budget',
                            testMode: true,
                            testBudgetId: DEMO_BUDGET_ID,
                        })];
            }
        });
    });
}
function closeBudget() {
    return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, exceptions_1.captureBreadcrumb)({ message: 'Closing budget' });
                    // The spreadsheet may be running, wait for it to complete
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 1:
                    // The spreadsheet may be running, wait for it to complete
                    _a.sent();
                    sheet.unloadSpreadsheet();
                    (0, sync_1.clearFullSyncTimeout)();
                    return [4 /*yield*/, main_app_1.app.stopServices()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.closeDatabase()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, asyncStorage.setItem('lastBudget', '')];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_4 = _a.sent();
                    return [3 /*break*/, 7];
                case 7:
                    prefs.unloadPrefs();
                    return [4 /*yield*/, (0, backups_1.stopBackupService)()];
                case 8:
                    _a.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function deleteBudget(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var budgetDir, e_5;
        var id = _b.id, cloudFileId = _b.cloudFileId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!cloudFileId) return [3 /*break*/, 2];
                    return [4 /*yield*/, cloudStorage.removeFile(cloudFileId).catch(function () { })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    if (!id) return [3 /*break*/, 8];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, db.openDatabase(id)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, db.closeDatabase()];
                case 5:
                    _c.sent();
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.removeDirRecursively(budgetDir)];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_5 = _c.sent();
                    return [2 /*return*/, 'fail'];
                case 8: return [2 /*return*/, 'ok'];
            }
        });
    });
}
function duplicateBudget(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, valid, message, budgetDir, newId, metadataText, metadata, newBudgetDir, error_1, newBudgetDir, _d, error, error_2;
        var id = _b.id, newName = _b.newName, cloudSync = _b.cloudSync, open = _b.open;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, budget_name_1.validateBudgetName)(newName)];
                case 1:
                    _c = _e.sent(), valid = _c.valid, message = _c.message;
                    if (!valid)
                        throw new Error(message);
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, (0, budget_name_1.idFromBudgetName)(newName)];
                case 2:
                    newId = _e.sent();
                    return [4 /*yield*/, fs.readFile(fs.join(budgetDir, 'metadata.json'))];
                case 3:
                    metadataText = _e.sent();
                    metadata = JSON.parse(metadataText);
                    metadata.id = newId;
                    metadata.budgetName = newName;
                    [
                        'cloudFileId',
                        'groupId',
                        'lastUploaded',
                        'encryptKeyId',
                        'lastSyncedTimestamp',
                    ].forEach(function (item) {
                        if (metadata[item])
                            delete metadata[item];
                    });
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 8, , 15]);
                    newBudgetDir = fs.getBudgetDir(newId);
                    return [4 /*yield*/, fs.mkdir(newBudgetDir)];
                case 5:
                    _e.sent();
                    // write metadata for new budget
                    return [4 /*yield*/, fs.writeFile(fs.join(newBudgetDir, 'metadata.json'), JSON.stringify(metadata))];
                case 6:
                    // write metadata for new budget
                    _e.sent();
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'db.sqlite'), fs.join(newBudgetDir, 'db.sqlite'))];
                case 7:
                    _e.sent();
                    return [3 /*break*/, 15];
                case 8:
                    error_1 = _e.sent();
                    _e.label = 9;
                case 9:
                    _e.trys.push([9, 13, , 14]);
                    newBudgetDir = fs.getBudgetDir(newId);
                    return [4 /*yield*/, fs.exists(newBudgetDir)];
                case 10:
                    if (!_e.sent()) return [3 /*break*/, 12];
                    return [4 /*yield*/, fs.removeDirRecursively(newBudgetDir)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    _d = _e.sent();
                    return [3 /*break*/, 14];
                case 14: // Ignore cleanup errors
                throw new Error("Failed to duplicate budget file: ".concat(error_1.message));
                case 15: return [4 /*yield*/, _loadBudget(newId)];
                case 16:
                    error = (_e.sent()).error;
                    if (error) {
                        log_1.logger.log('Error duplicating budget: ' + error);
                        return [2 /*return*/, error];
                    }
                    if (!cloudSync) return [3 /*break*/, 20];
                    _e.label = 17;
                case 17:
                    _e.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 18:
                    _e.sent();
                    return [3 /*break*/, 20];
                case 19:
                    error_2 = _e.sent();
                    log_1.logger.warn('Failed to sync duplicated budget to cloud:', error_2);
                    return [3 /*break*/, 20];
                case 20: return [4 /*yield*/, closeBudget()];
                case 21:
                    _e.sent();
                    if (!(open === 'original')) return [3 /*break*/, 23];
                    return [4 /*yield*/, _loadBudget(id)];
                case 22:
                    _e.sent();
                    _e.label = 23;
                case 23:
                    if (!(open === 'copy')) return [3 /*break*/, 25];
                    return [4 /*yield*/, _loadBudget(newId)];
                case 24:
                    _e.sent();
                    _e.label = 25;
                case 25: return [2 /*return*/, newId];
            }
        });
    });
}
function createBudget() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var id, budgetDir, error, e_6;
        var _b = _a === void 0 ? {} : _a, budgetName = _b.budgetName, avoidUpload = _b.avoidUpload, testMode = _b.testMode, testBudgetId = _b.testBudgetId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!testMode) return [3 /*break*/, 4];
                    budgetName = budgetName || 'Test Budget';
                    id = testBudgetId || TEST_BUDGET_ID;
                    return [4 /*yield*/, fs.exists(fs.getBudgetDir(id))];
                case 1:
                    if (!_c.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.removeDirRecursively(fs.getBudgetDir(id))];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [3 /*break*/, 8];
                case 4:
                    if (!!budgetName) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, budget_name_1.uniqueBudgetName)()];
                case 5:
                    budgetName = _c.sent();
                    _c.label = 6;
                case 6: return [4 /*yield*/, (0, budget_name_1.idFromBudgetName)(budgetName)];
                case 7:
                    id = _c.sent();
                    _c.label = 8;
                case 8:
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.mkdir(budgetDir)];
                case 9:
                    _c.sent();
                    // Create the initial database
                    return [4 /*yield*/, fs.copyFile(fs.bundledDatabasePath, fs.join(budgetDir, 'db.sqlite'))];
                case 10:
                    // Create the initial database
                    _c.sent();
                    // Create the initial prefs file
                    return [4 /*yield*/, fs.writeFile(fs.join(budgetDir, 'metadata.json'), JSON.stringify(prefs.getDefaultPrefs(id, budgetName)))];
                case 11:
                    // Create the initial prefs file
                    _c.sent();
                    return [4 /*yield*/, _loadBudget(id)];
                case 12:
                    error = (_c.sent()).error;
                    if (error) {
                        log_1.logger.log('Error creating budget: ' + error);
                        return [2 /*return*/, { error: error }];
                    }
                    if (!(!avoidUpload && !testMode)) return [3 /*break*/, 16];
                    _c.label = 13;
                case 13:
                    _c.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 14:
                    _c.sent();
                    return [3 /*break*/, 16];
                case 15:
                    e_6 = _c.sent();
                    return [3 /*break*/, 16];
                case 16:
                    if (!testMode) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, budget_1.createTestBudget)(main_app_1.app.handlers)];
                case 17:
                    _c.sent();
                    _c.label = 18;
                case 18: return [2 /*return*/, {}];
            }
        });
    });
}
function importBudget(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var buffer, _c, _d, results, err_1;
        var filepath = _b.filepath, type = _b.type;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fs.exists(filepath)];
                case 1:
                    if (!(_e.sent())) {
                        throw new Error("File not found at the provided path: ".concat(filepath));
                    }
                    _d = (_c = Buffer).from;
                    return [4 /*yield*/, fs.readFile(filepath, 'binary')];
                case 2:
                    buffer = _d.apply(_c, [_e.sent()]);
                    return [4 /*yield*/, (0, importers_1.handleBudgetImport)(type, filepath, buffer)];
                case 3:
                    results = _e.sent();
                    return [2 /*return*/, results || {}];
                case 4:
                    err_1 = _e.sent();
                    err_1.message = 'Error importing budget: ' + err_1.message;
                    (0, exceptions_1.captureException)(err_1);
                    return [2 /*return*/, { error: 'internal-error' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function exportBudget() {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = {};
                    return [4 /*yield*/, cloudStorage.exportBuffer()];
                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                        _a)];
                case 2:
                    err_2 = _b.sent();
                    err_2.message = 'Error exporting budget: ' + err_2.message;
                    (0, exceptions_1.captureException)(err_2);
                    return [2 /*return*/, { error: 'internal-error' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function onSheetChange(_a) {
    var names = _a.names;
    var nodes = names.map(function (name) {
        var node = sheet.get()._getNode(name);
        return { name: node.name, value: node.value };
    });
    connection.send('cells-changed', nodes);
}
function _loadBudget(id) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, e_7, userId, e_8, result, e_9, _a, budgetType;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    try {
                        dir = fs.getBudgetDir(id);
                    }
                    catch (e) {
                        (0, exceptions_1.captureException)(new Error('`getBudgetDir` failed in `loadBudget`: ' + e.message));
                        return [2 /*return*/, { error: 'budget-not-found' }];
                    }
                    (0, exceptions_1.captureBreadcrumb)({ message: 'Loading budget ' + dir });
                    return [4 /*yield*/, fs.exists(dir)];
                case 1:
                    if (!(_c.sent())) {
                        (0, exceptions_1.captureException)(new Error('budget directory does not exist'));
                        return [2 /*return*/, { error: 'budget-not-found' }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, prefs.loadPrefs(id)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, db.openDatabase(id)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5:
                    e_7 = _c.sent();
                    (0, exceptions_1.captureBreadcrumb)({ message: 'Error loading budget ' + id });
                    (0, exceptions_1.captureException)(e_7);
                    return [4 /*yield*/, closeBudget()];
                case 6:
                    _c.sent();
                    return [2 /*return*/, { error: 'opening-budget' }];
                case 7:
                    if (!!prefs.getPrefs().userId) return [3 /*break*/, 10];
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 8:
                    userId = _c.sent();
                    return [4 /*yield*/, prefs.savePrefs({ userId: userId })];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 14]);
                    return [4 /*yield*/, (0, update_1.updateVersion)()];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 12:
                    e_8 = _c.sent();
                    log_1.logger.warn('Error updating', e_8);
                    result = void 0;
                    if (e_8.message.includes('out-of-sync-migrations')) {
                        result = { error: 'out-of-sync-migrations' };
                    }
                    else if (e_8.message.includes('out-of-sync-data')) {
                        result = { error: 'out-of-sync-data' };
                    }
                    else {
                        (0, exceptions_1.captureException)(e_8);
                        log_1.logger.info('Error updating budget ' + id, e_8);
                        log_1.logger.log('Error updating budget', e_8);
                        result = { error: 'loading-budget' };
                    }
                    return [4 /*yield*/, closeBudget()];
                case 13:
                    _c.sent();
                    return [2 /*return*/, result];
                case 14: return [4 /*yield*/, db.loadClock()];
                case 15:
                    _c.sent();
                    if (!prefs.getPrefs().resetClock) return [3 /*break*/, 18];
                    // If we need to generate a fresh clock, we need to generate a new
                    // client id. This happens when the database is transferred to a
                    // new device.
                    //
                    // TODO: The client id should be stored elsewhere. It shouldn't
                    // work this way, but it's fine for now.
                    CRDT.getClock().timestamp.setNode(CRDT.makeClientId());
                    return [4 /*yield*/, db.runQuery('INSERT OR REPLACE INTO messages_clock (id, clock) VALUES (1, ?)', [CRDT.serializeClock(CRDT.getClock())])];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, prefs.savePrefs({ resetClock: false })];
                case 17:
                    _c.sent();
                    _c.label = 18;
                case 18:
                    if (!(!Platform.isBrowser && process.env.NODE_ENV !== 'test')) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, backups_1.startBackupService)(id)];
                case 19:
                    _c.sent();
                    _c.label = 20;
                case 20:
                    _c.trys.push([20, 22, , 24]);
                    return [4 /*yield*/, sheet.loadSpreadsheet(db, onSheetChange)];
                case 21:
                    _c.sent();
                    return [3 /*break*/, 24];
                case 22:
                    e_9 = _c.sent();
                    (0, exceptions_1.captureException)(e_9);
                    return [4 /*yield*/, closeBudget()];
                case 23:
                    _c.sent();
                    return [2 /*return*/, { error: 'opening-budget' }];
                case 24: return [4 /*yield*/, db.first('SELECT value from preferences WHERE id = ?', ['budgetType'])];
                case 25:
                    _a = ((_b = (_c.sent())) !== null && _b !== void 0 ? _b : {}).value, budgetType = _a === void 0 ? 'envelope' : _a;
                    sheet.get().meta().budgetType = budgetType;
                    return [4 /*yield*/, budget.createAllBudgets()];
                case 26:
                    _c.sent();
                    // Load all the in-memory state
                    return [4 /*yield*/, mappings.loadMappings()];
                case 27:
                    // Load all the in-memory state
                    _c.sent();
                    return [4 /*yield*/, rules.loadRules()];
                case 28:
                    _c.sent();
                    return [4 /*yield*/, syncMigrations.listen()];
                case 29:
                    _c.sent();
                    return [4 /*yield*/, main_app_1.app.startServices()];
                case 30:
                    _c.sent();
                    (0, undo_1.clearUndo)();
                    if (!(process.env.NODE_ENV !== 'test')) return [3 /*break*/, 35];
                    if (!(id === DEMO_BUDGET_ID)) return [3 /*break*/, 31];
                    (0, sync_1.setSyncingMode)('disabled');
                    return [3 /*break*/, 34];
                case 31:
                    if ((0, server_config_1.getServer)()) {
                        (0, sync_1.setSyncingMode)('enabled');
                    }
                    else {
                        (0, sync_1.setSyncingMode)('disabled');
                    }
                    return [4 /*yield*/, asyncStorage.setItem('lastBudget', id)];
                case 32:
                    _c.sent();
                    return [4 /*yield*/, cloudStorage.possiblyUpload()];
                case 33:
                    _c.sent();
                    _c.label = 34;
                case 34: return [3 /*break*/, 36];
                case 35:
                    // we're in a test - disable the sync
                    (0, sync_1.setSyncingMode)('disabled');
                    _c.label = 36;
                case 36:
                    exports.app.events.emit('load-budget', { id: id });
                    return [2 /*return*/, {}];
            }
        });
    });
}
function uploadFileWeb(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var filename = _b.filename, contents = _b.contents;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!Platform.isBrowser) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, fs.writeFile('/uploads/' + filename, contents)];
                case 1:
                    _c.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function getBackups(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, backups_1.getAvailableBackups)(id)];
        });
    });
}
function loadBackup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, backupId = _b.backupId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, backups_1.loadBackup)(id, backupId)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function makeBackup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, backups_1.makeBackup)(id)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getLastOpenedBackup() {
    return __awaiter(this, void 0, void 0, function () {
        var id, budgetDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('lastBudget')];
                case 1:
                    id = _a.sent();
                    if (!(id && id !== '')) return [3 /*break*/, 3];
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.exists(budgetDir)];
                case 2:
                    // We never want to give back a budget that does not exist on the
                    // filesystem anymore, so first check that it exists
                    if (_a.sent()) {
                        return [2 /*return*/, id];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
