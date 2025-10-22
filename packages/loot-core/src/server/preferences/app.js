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
var asyncStorage = require("../../platform/server/asyncStorage");
var fs = require("../../platform/server/fs");
var util_1 = require("../../shared/util");
var app_1 = require("../app");
var db = require("../db");
var main_1 = require("../main");
var mutators_1 = require("../mutators");
var post_1 = require("../post");
var prefs_1 = require("../prefs");
var server_config_1 = require("../server-config");
var undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('preferences/save', (0, mutators_1.mutator)((0, undo_1.undoable)(saveSyncedPrefs)));
exports.app.method('preferences/get', getSyncedPrefs);
exports.app.method('save-global-prefs', saveGlobalPrefs);
exports.app.method('load-global-prefs', loadGlobalPrefs);
exports.app.method('save-prefs', saveMetadataPrefs);
exports.app.method('load-prefs', loadMetadataPrefs);
function saveSyncedPrefs(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, value = _b.value, isGlobal = _b.isGlobal;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!id) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.update('preferences', __assign({ id: id, value: value }, (isGlobal !== undefined && { isGlobal: isGlobal ? 1 : 0 })))];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getSyncedPrefs() {
    return __awaiter(this, void 0, void 0, function () {
        var prefs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.all('SELECT id, value FROM preferences')];
                case 1:
                    prefs = _a.sent();
                    return [2 /*return*/, prefs.reduce(function (carry, _a) {
                            var value = _a.value, id = _a.id;
                            carry[id] = value;
                            return carry;
                        }, {})];
            }
        });
    });
}
function saveGlobalPrefs(prefs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!prefs) {
                        return [2 /*return*/, 'ok'];
                    }
                    if (!(prefs.maxMonths !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, asyncStorage.setItem('max-months', '' + prefs.maxMonths)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(prefs.categoryExpandedState !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, asyncStorage.setItem('category-expanded-state', '' + prefs.categoryExpandedState)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _a = prefs.documentDir !== undefined;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs.exists(prefs.documentDir)];
                case 5:
                    _a = (_b.sent());
                    _b.label = 6;
                case 6:
                    if (!_a) return [3 /*break*/, 8];
                    return [4 /*yield*/, asyncStorage.setItem('document-dir', prefs.documentDir)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    if (!(prefs.floatingSidebar !== undefined)) return [3 /*break*/, 10];
                    return [4 /*yield*/, asyncStorage.setItem('floating-sidebar', '' + prefs.floatingSidebar)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    if (!(prefs.language !== undefined)) return [3 /*break*/, 12];
                    return [4 /*yield*/, asyncStorage.setItem('language', prefs.language)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    if (!(prefs.theme !== undefined)) return [3 /*break*/, 14];
                    return [4 /*yield*/, asyncStorage.setItem('theme', prefs.theme)];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14:
                    if (!(prefs.preferredDarkTheme !== undefined)) return [3 /*break*/, 16];
                    return [4 /*yield*/, asyncStorage.setItem('preferred-dark-theme', prefs.preferredDarkTheme)];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    if (!(prefs.serverSelfSignedCert !== undefined)) return [3 /*break*/, 18];
                    return [4 /*yield*/, asyncStorage.setItem('server-self-signed-cert', prefs.serverSelfSignedCert)];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18:
                    if (!(prefs.syncServerConfig !== undefined)) return [3 /*break*/, 20];
                    return [4 /*yield*/, asyncStorage.setItem('syncServerConfig', prefs.syncServerConfig)];
                case 19:
                    _b.sent();
                    _b.label = 20;
                case 20:
                    if (!(prefs.notifyWhenUpdateIsAvailable !== undefined)) return [3 /*break*/, 22];
                    return [4 /*yield*/, asyncStorage.setItem('notifyWhenUpdateIsAvailable', prefs.notifyWhenUpdateIsAvailable)];
                case 21:
                    _b.sent();
                    _b.label = 22;
                case 22: return [2 /*return*/, 'ok'];
            }
        });
    });
}
function loadGlobalPrefs() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, floatingSidebar, categoryExpandedState, maxMonths, documentDir, encryptKey, language, theme, preferredDarkTheme, serverSelfSignedCert, syncServerConfig, notifyWhenUpdateIsAvailable;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, asyncStorage.multiGet([
                        'floating-sidebar',
                        'category-expanded-state',
                        'max-months',
                        'document-dir',
                        'encrypt-key',
                        'language',
                        'theme',
                        'preferred-dark-theme',
                        'server-self-signed-cert',
                        'syncServerConfig',
                        'notifyWhenUpdateIsAvailable',
                    ])];
                case 1:
                    _a = _b.sent(), floatingSidebar = _a["floating-sidebar"], categoryExpandedState = _a["category-expanded-state"], maxMonths = _a["max-months"], documentDir = _a["document-dir"], encryptKey = _a["encrypt-key"], language = _a.language, theme = _a.theme, preferredDarkTheme = _a["preferred-dark-theme"], serverSelfSignedCert = _a["server-self-signed-cert"], syncServerConfig = _a.syncServerConfig, notifyWhenUpdateIsAvailable = _a.notifyWhenUpdateIsAvailable;
                    return [2 /*return*/, {
                            floatingSidebar: floatingSidebar === 'true',
                            categoryExpandedState: (0, util_1.stringToInteger)(categoryExpandedState || '') || 0,
                            maxMonths: (0, util_1.stringToInteger)(maxMonths || '') || 1,
                            documentDir: documentDir || (0, main_1.getDefaultDocumentDir)(),
                            keyId: encryptKey && JSON.parse(encryptKey).id,
                            language: language,
                            theme: theme === 'light' ||
                                theme === 'dark' ||
                                theme === 'auto' ||
                                theme === 'development' ||
                                theme === 'midnight'
                                ? theme
                                : 'auto',
                            preferredDarkTheme: preferredDarkTheme === 'dark' || preferredDarkTheme === 'midnight'
                                ? preferredDarkTheme
                                : 'dark',
                            serverSelfSignedCert: serverSelfSignedCert || undefined,
                            syncServerConfig: syncServerConfig || undefined,
                            notifyWhenUpdateIsAvailable: notifyWhenUpdateIsAvailable === undefined
                                ? true
                                : notifyWhenUpdateIsAvailable, // default to true
                        }];
            }
        });
    });
}
function saveMetadataPrefs(prefsToSet) {
    return __awaiter(this, void 0, void 0, function () {
        var cloudFileId, userToken, syncServer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!prefsToSet) {
                        return [2 /*return*/, 'ok'];
                    }
                    cloudFileId = (0, prefs_1.getPrefs)().cloudFileId;
                    if (!(prefsToSet.budgetName && cloudFileId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _b.sent();
                    syncServer = (_a = (0, server_config_1.getServer)()) === null || _a === void 0 ? void 0 : _a.SYNC_SERVER;
                    if (!syncServer) {
                        throw new Error('No sync server set');
                    }
                    return [4 /*yield*/, (0, post_1.post)(syncServer + '/update-user-filename', {
                            token: userToken,
                            fileId: cloudFileId,
                            name: prefsToSet.budgetName,
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, prefs_1.savePrefs)(prefsToSet)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function loadMetadataPrefs() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, prefs_1.getPrefs)()];
        });
    });
}
