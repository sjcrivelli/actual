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
exports.getAvailableBackups = getAvailableBackups;
exports.updateBackups = updateBackups;
exports.makeBackup = makeBackup;
exports.loadBackup = loadBackup;
exports.startBackupService = startBackupService;
exports.stopBackupService = stopBackupService;
// @ts-strict-ignore
var dateFns = require("date-fns");
var uuid_1 = require("uuid");
var connection = require("../../platform/server/connection");
var fs = require("../../platform/server/fs");
var log_1 = require("../../platform/server/log");
var sqlite = require("../../platform/server/sqlite");
var monthUtils = require("../../shared/months");
var cloudStorage = require("../cloud-storage");
var prefs = require("../prefs");
// A special backup that represents the latest version of the db that
// can be reverted to after loading a backup
var LATEST_BACKUP_FILENAME = 'db.latest.sqlite';
var serviceInterval = null;
function getBackups(id) {
    return __awaiter(this, void 0, void 0, function () {
        var budgetDir, backupDir, paths, backups;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budgetDir = fs.getBudgetDir(id);
                    backupDir = fs.join(budgetDir, 'backups');
                    paths = [];
                    return [4 /*yield*/, fs.exists(backupDir)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.listDir(backupDir)];
                case 2:
                    paths = _a.sent();
                    paths = paths.filter(function (file) { return file.match(/\.sqlite$/); });
                    _a.label = 3;
                case 3: return [4 /*yield*/, Promise.all(paths.map(function (path) { return __awaiter(_this, void 0, void 0, function () {
                        var mtime;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.getModifiedTime(fs.join(backupDir, path))];
                                case 1:
                                    mtime = _a.sent();
                                    return [2 /*return*/, {
                                            id: path,
                                            date: new Date(mtime),
                                        }];
                            }
                        });
                    }); }))];
                case 4:
                    backups = _a.sent();
                    backups.sort(function (b1, b2) {
                        if (b1.date < b2.date) {
                            return 1;
                        }
                        else if (b1.date > b2.date) {
                            return -1;
                        }
                        return 0;
                    });
                    return [2 /*return*/, backups];
            }
        });
    });
}
function getLatestBackup(id) {
    return __awaiter(this, void 0, void 0, function () {
        var budgetDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.exists(fs.join(budgetDir, LATEST_BACKUP_FILENAME))];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, {
                                id: LATEST_BACKUP_FILENAME,
                                date: null,
                                isLatest: true,
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function getAvailableBackups(id) {
    return __awaiter(this, void 0, void 0, function () {
        var backups, latestBackup;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBackups(id)];
                case 1:
                    backups = _a.sent();
                    return [4 /*yield*/, getLatestBackup(id)];
                case 2:
                    latestBackup = _a.sent();
                    if (latestBackup) {
                        backups.unshift(latestBackup);
                    }
                    return [2 /*return*/, backups.map(function (backup) { return (__assign(__assign({}, backup), { date: backup.date ? dateFns.format(backup.date, 'yyyy-MM-dd H:mm') : null })); })];
            }
        });
    });
}
function updateBackups(backups) {
    return __awaiter(this, void 0, void 0, function () {
        var byDay, removed, _i, _a, day, dayBackups, isToday, _b, _c, backup, currentBackups;
        return __generator(this, function (_d) {
            byDay = backups.reduce(function (groups, backup) {
                var day = dateFns.format(backup.date, 'yyyy-MM-dd');
                groups[day] = groups[day] || [];
                groups[day].push(backup);
                return groups;
            }, {});
            removed = [];
            for (_i = 0, _a = Object.keys(byDay); _i < _a.length; _i++) {
                day = _a[_i];
                dayBackups = byDay[day];
                isToday = day === monthUtils.currentDay();
                // Allow 3 backups of the current day (so fine-grained edits are
                // kept around). Otherwise only keep around one backup per day.
                // And only keep a total of 10 backups.
                for (_b = 0, _c = dayBackups.slice(isToday ? 3 : 1); _b < _c.length; _b++) {
                    backup = _c[_b];
                    removed.push(backup.id);
                }
            }
            currentBackups = backups.filter(function (backup) { return !removed.includes(backup.id); });
            return [2 /*return*/, removed.concat(currentBackups.slice(10).map(function (backup) { return backup.id; }))];
        });
    });
}
function makeBackup(id) {
    return __awaiter(this, void 0, void 0, function () {
        var budgetDir, backupId, backupPath, db, toRemove, _a, _i, toRemove_1, id_1, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.exists(fs.join(budgetDir, LATEST_BACKUP_FILENAME))];
                case 1:
                    if (!_e.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.removeFile(fs.join(fs.getBudgetDir(id), LATEST_BACKUP_FILENAME))];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    backupId = "".concat((0, uuid_1.v4)(), ".sqlite");
                    backupPath = fs.join(budgetDir, 'backups', backupId);
                    return [4 /*yield*/, fs.exists(fs.join(budgetDir, 'backups'))];
                case 4:
                    if (!!(_e.sent())) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs.mkdir(fs.join(budgetDir, 'backups'))];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6: return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'db.sqlite'), backupPath)];
                case 7:
                    _e.sent();
                    db = sqlite.openDatabase(backupPath);
                    return [4 /*yield*/, sqlite.runQuery(db, 'DELETE FROM messages_crdt')];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, sqlite.runQuery(db, 'DELETE FROM messages_clock')];
                case 9:
                    _e.sent();
                    sqlite.closeDatabase(db);
                    _a = updateBackups;
                    return [4 /*yield*/, getBackups(id)];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])];
                case 11:
                    toRemove = _e.sent();
                    _i = 0, toRemove_1 = toRemove;
                    _e.label = 12;
                case 12:
                    if (!(_i < toRemove_1.length)) return [3 /*break*/, 15];
                    id_1 = toRemove_1[_i];
                    return [4 /*yield*/, fs.removeFile(fs.join(budgetDir, 'backups', id_1))];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 12];
                case 15:
                    _c = (_b = connection).send;
                    _d = ['backups-updated'];
                    return [4 /*yield*/, getAvailableBackups(id)];
                case 16:
                    _c.apply(_b, _d.concat([_e.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
function loadBackup(id, backupId) {
    return __awaiter(this, void 0, void 0, function () {
        var budgetDir, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budgetDir = fs.getBudgetDir(id);
                    return [4 /*yield*/, fs.exists(fs.join(budgetDir, LATEST_BACKUP_FILENAME))];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 5];
                    // If this is the first time we're loading a backup, save the
                    // current version so the user can easily revert back to it
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'db.sqlite'), fs.join(budgetDir, LATEST_BACKUP_FILENAME))];
                case 2:
                    // If this is the first time we're loading a backup, save the
                    // current version so the user can easily revert back to it
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'metadata.json'), fs.join(budgetDir, 'metadata.latest.json'))];
                case 3:
                    _a.sent();
                    // Restart the backup service to make sure the user has the full
                    // amount of time to figure out which one they want
                    stopBackupService();
                    startBackupService(id);
                    return [4 /*yield*/, prefs.loadPrefs(id)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!(backupId === LATEST_BACKUP_FILENAME)) return [3 /*break*/, 14];
                    log_1.logger.log('Reverting backup');
                    // If reverting back to the latest, copy and delete the latest
                    // backup
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, LATEST_BACKUP_FILENAME), fs.join(budgetDir, 'db.sqlite'))];
                case 6:
                    // If reverting back to the latest, copy and delete the latest
                    // backup
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'metadata.latest.json'), fs.join(budgetDir, 'metadata.json'))];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, fs.removeFile(fs.join(budgetDir, LATEST_BACKUP_FILENAME))];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, fs.removeFile(fs.join(budgetDir, 'metadata.latest.json'))];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    e_1 = _a.sent();
                    return [3 /*break*/, 13];
                case 13:
                    prefs.unloadPrefs();
                    return [3 /*break*/, 22];
                case 14:
                    log_1.logger.log('Loading backup', backupId);
                    // This function is only ever called when a budget isn't loaded,
                    // so it's safe to load our prefs in. We need to forget about any
                    // syncing data if we are loading a backup (the current sync data
                    // will be restored if the user reverts to the original version)
                    return [4 /*yield*/, prefs.loadPrefs(id)];
                case 15:
                    // This function is only ever called when a budget isn't loaded,
                    // so it's safe to load our prefs in. We need to forget about any
                    // syncing data if we are loading a backup (the current sync data
                    // will be restored if the user reverts to the original version)
                    _a.sent();
                    return [4 /*yield*/, prefs.savePrefs({
                            groupId: null,
                            lastSyncedTimestamp: null,
                            lastUploaded: null,
                        })];
                case 16:
                    _a.sent();
                    _a.label = 17;
                case 17:
                    _a.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, cloudStorage.upload()];
                case 18:
                    _a.sent();
                    return [3 /*break*/, 20];
                case 19:
                    e_2 = _a.sent();
                    return [3 /*break*/, 20];
                case 20:
                    prefs.unloadPrefs();
                    return [4 /*yield*/, fs.copyFile(fs.join(budgetDir, 'backups', backupId), fs.join(budgetDir, 'db.sqlite'))];
                case 21:
                    _a.sent();
                    _a.label = 22;
                case 22: return [2 /*return*/];
            }
        });
    });
}
function startBackupService(id) {
    var _this = this;
    if (serviceInterval) {
        clearInterval(serviceInterval);
    }
    // Make a backup every 15 minutes
    serviceInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.logger.log('Making backup');
                    return [4 /*yield*/, makeBackup(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 1000 * 60 * 15);
}
function stopBackupService() {
    clearInterval(serviceInterval);
    serviceInterval = null;
}
