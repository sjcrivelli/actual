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
exports.listenForSyncEvent = listenForSyncEvent;
// @ts-strict-ignore
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var accountsSlice_1 = require("./accounts/accountsSlice");
var appSlice_1 = require("./app/appSlice");
var budgetSlice_1 = require("./budget/budgetSlice");
var budgetfilesSlice_1 = require("./budgetfiles/budgetfilesSlice");
var modalsSlice_1 = require("./modals/modalsSlice");
var notificationsSlice_1 = require("./notifications/notificationsSlice");
var payeesSlice_1 = require("./payees/payeesSlice");
var prefsSlice_1 = require("./prefs/prefsSlice");
var usersSlice_1 = require("./users/usersSlice");
function listenForSyncEvent(store) {
    var _this = this;
    // TODO: Should this run on mobile too?
    var unlistenUnauthorized = (0, fetch_1.listen)('sync-event', function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var type = _b.type;
        return __generator(this, function (_c) {
            if (type === 'unauthorized') {
                store.dispatch((0, notificationsSlice_1.addNotification)({
                    notification: {
                        type: 'warning',
                        message: 'Unable to authenticate with server',
                        sticky: true,
                        id: 'auth-issue',
                    },
                }));
            }
            return [2 /*return*/];
        });
    }); });
    var attemptedSyncRepair = false;
    var unlistenSuccess = (0, fetch_1.listen)('sync-event', function (event) {
        var prefs = store.getState().prefs.local;
        if (!prefs || !prefs.id) {
            // Do nothing if no budget is loaded
            return;
        }
        if (event.type === 'success' || event.type === 'applied') {
            if (attemptedSyncRepair) {
                attemptedSyncRepair = false;
                store.dispatch((0, notificationsSlice_1.addNotification)({
                    notification: {
                        title: (0, i18next_1.t)('Syncing has been fixed!'),
                        message: (0, i18next_1.t)('Happy budgeting!'),
                        type: 'message',
                    },
                }));
            }
            var tables = event.tables;
            if (tables.includes('prefs')) {
                store.dispatch((0, prefsSlice_1.loadPrefs)());
            }
            if (tables.includes('categories') ||
                tables.includes('category_groups') ||
                tables.includes('category_mapping')) {
                store.dispatch((0, budgetSlice_1.reloadCategories)());
            }
            if (
            // Sync on accounts change because so that transfer payees are updated
            tables.includes('accounts') ||
                tables.includes('payees') ||
                tables.includes('payee_mapping')) {
                store.dispatch((0, payeesSlice_1.reloadPayees)());
            }
            if (tables.includes('accounts')) {
                store.dispatch((0, accountsSlice_1.reloadAccounts)());
            }
        }
        else if (event.type === 'error') {
            var notif = null;
            var learnMore = "[".concat((0, i18next_1.t)('Learn more'), "](https://actualbudget.org/docs/getting-started/sync/#debugging-sync-issues)");
            var githubIssueLink = 'https://github.com/actualbudget/actual/issues/new?assignees=&labels=bug&template=bug-report.yml&title=%5BBug%5D%3A+';
            switch (event.subtype) {
                case 'out-of-sync':
                    if (attemptedSyncRepair) {
                        notif = {
                            title: (0, i18next_1.t)('Your data is still out of sync'),
                            message: (0, i18next_1.t)('We were unable to repair your sync state, sorry! You need to reset your sync state.') +
                                ' ' +
                                learnMore,
                            sticky: true,
                            id: 'reset-sync',
                            button: {
                                title: (0, i18next_1.t)('Reset sync'),
                                action: function () {
                                    store.dispatch((0, appSlice_1.resetSync)());
                                },
                            },
                        };
                    }
                    else {
                        // A bug happened during the sync process. Sync state needs
                        // to be reset.
                        notif = {
                            title: (0, i18next_1.t)('Your data is out of sync'),
                            message: (0, i18next_1.t)('There was a problem syncing your data. We can try to repair your sync state to fix it.') +
                                ' ' +
                                learnMore,
                            type: 'warning',
                            sticky: true,
                            id: 'repair-sync',
                            button: {
                                title: (0, i18next_1.t)('Repair'),
                                action: function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                attemptedSyncRepair = true;
                                                return [4 /*yield*/, (0, fetch_1.send)('sync-repair')];
                                            case 1:
                                                _a.sent();
                                                store.dispatch((0, appSlice_1.sync)());
                                                return [2 /*return*/];
                                        }
                                    });
                                }); },
                            },
                        };
                    }
                    break;
                case 'file-old-version':
                    // Tell the user something is wrong with the key state on
                    // the server and the key needs to be recreated
                    notif = {
                        title: (0, i18next_1.t)('Actual has updated the syncing format'),
                        message: (0, i18next_1.t)('This happens rarely (if ever again). The internal syncing format ' +
                            'has changed and you need to reset sync. This will upload data from ' +
                            'this device and revert all other devices. ' +
                            '[Learn more about what this means](https://actualbudget.org/docs/getting-started/sync/#what-does-resetting-sync-mean).' +
                            '\n\n' +
                            'Old encryption keys are not migrated. If using encryption, [reset encryption here](#makeKey).'),
                        messageActions: {
                            makeKey: function () {
                                return store.dispatch((0, modalsSlice_1.pushModal)({
                                    modal: { name: 'create-encryption-key', options: {} },
                                }));
                            },
                        },
                        sticky: true,
                        id: 'old-file',
                        button: {
                            title: (0, i18next_1.t)('Reset sync'),
                            action: function () {
                                store.dispatch((0, appSlice_1.resetSync)());
                            },
                        },
                    };
                    break;
                case 'file-key-mismatch':
                    // Tell the user something is wrong with the key state on
                    // the server and the key needs to be recreated
                    notif = {
                        title: (0, i18next_1.t)('Your encryption key need to be reset'),
                        message: (0, i18next_1.t)('Something went wrong when registering your encryption key id. ' +
                            'You need to recreate your key. ') + learnMore,
                        sticky: true,
                        id: 'invalid-key-state',
                        button: {
                            title: (0, i18next_1.t)('Reset key'),
                            action: function () {
                                store.dispatch((0, modalsSlice_1.pushModal)({
                                    modal: { name: 'create-encryption-key', options: {} },
                                }));
                            },
                        },
                    };
                    break;
                case 'file-not-found':
                    notif = {
                        title: (0, i18next_1.t)('This file is not a cloud file'),
                        message: (0, i18next_1.t)('You need to register it to take advantage ' +
                            'of syncing which allows you to use it across devices and never worry ' +
                            'about losing your data.') +
                            ' ' +
                            learnMore,
                        type: 'warning',
                        sticky: true,
                        id: 'register-file',
                        button: {
                            title: (0, i18next_1.t)('Register'),
                            action: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, store.dispatch((0, budgetfilesSlice_1.uploadBudget)({}))];
                                        case 1:
                                            _a.sent();
                                            store.dispatch((0, appSlice_1.sync)());
                                            store.dispatch((0, prefsSlice_1.loadPrefs)());
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        },
                    };
                    break;
                case 'file-needs-upload':
                    notif = {
                        title: (0, i18next_1.t)('File needs upload'),
                        message: (0, i18next_1.t)('Something went wrong when creating this cloud file. You need ' +
                            'to upload this file to fix it.') +
                            ' ' +
                            learnMore,
                        sticky: true,
                        id: 'upload-file',
                        button: {
                            title: (0, i18next_1.t)('Upload'),
                            action: function () {
                                store.dispatch((0, appSlice_1.resetSync)());
                            },
                        },
                    };
                    break;
                case 'file-has-reset':
                case 'file-has-new-key':
                    // These two cases happen when the current group or key on
                    // the server does not match the local one. This can mean a
                    // few things depending on the state, and we try to show an
                    // appropriate message and call to action to fix it.
                    var cloudFileId_1 = store.getState().prefs.local.cloudFileId;
                    notif = {
                        title: (0, i18next_1.t)('Syncing has been reset on this cloud file'),
                        message: (0, i18next_1.t)('You need to revert it to continue syncing. Any unsynced ' +
                            'data will be lost. If you like, you can instead ' +
                            '[upload this file](#upload) to be the latest version.') +
                            ' ' +
                            learnMore,
                        messageActions: { upload: function () { return store.dispatch((0, appSlice_1.resetSync)()); } },
                        sticky: true,
                        id: 'needs-revert',
                        button: {
                            title: (0, i18next_1.t)('Revert'),
                            action: function () {
                                store.dispatch((0, budgetfilesSlice_1.closeAndDownloadBudget)({ cloudFileId: cloudFileId_1 }));
                            },
                        },
                    };
                    break;
                case 'encrypt-failure':
                case 'decrypt-failure':
                    if (event.meta.isMissingKey) {
                        notif = {
                            title: (0, i18next_1.t)('Missing encryption key'),
                            message: (0, i18next_1.t)('Unable to encrypt your data because you are missing the key. ' +
                                'Create your key to sync your data.'),
                            sticky: true,
                            id: 'encrypt-failure-missing',
                            button: {
                                title: (0, i18next_1.t)('Create key'),
                                action: function () {
                                    store.dispatch((0, modalsSlice_1.pushModal)({
                                        modal: {
                                            name: 'fix-encryption-key',
                                            options: {
                                                onSuccess: function () { return store.dispatch((0, appSlice_1.sync)()); },
                                            },
                                        },
                                    }));
                                },
                            },
                        };
                    }
                    else {
                        notif = {
                            message: (0, i18next_1.t)('Unable to encrypt your data. You have the correct ' +
                                'key so this is likely an internal failure. To fix this, ' +
                                'reset your sync data with a new key.'),
                            sticky: true,
                            id: 'encrypt-failure',
                            button: {
                                title: (0, i18next_1.t)('Reset key'),
                                action: function () {
                                    store.dispatch((0, modalsSlice_1.pushModal)({
                                        modal: { name: 'create-encryption-key', options: {} },
                                    }));
                                },
                            },
                        };
                    }
                    break;
                case 'invalid-schema':
                    console.trace('invalid-schema', event.meta);
                    notif = {
                        title: (0, i18next_1.t)('Update required'),
                        message: (0, i18next_1.t)('We couldn’t apply changes from the server. This probably means you ' +
                            'need to update the app to support the latest database.'),
                        type: 'warning',
                    };
                    break;
                case 'apply-failure':
                    console.trace('apply-failure', event.meta);
                    notif = {
                        message: (0, i18next_1.t)('We couldn’t apply that change to the database. Please report this as a bug by [opening a GitHub issue]({{githubIssueLink}}).', { githubIssueLink: githubIssueLink }),
                    };
                    break;
                case 'network':
                    // Show nothing
                    break;
                case 'token-expired':
                    notif = {
                        title: 'Login expired',
                        message: 'Please login again.',
                        sticky: true,
                        id: 'login-expired',
                        button: {
                            title: 'Go to login',
                            action: function () {
                                store.dispatch((0, usersSlice_1.signOut)());
                            },
                        },
                    };
                    break;
                default:
                    console.trace('unknown error', event);
                    notif = {
                        message: (0, i18next_1.t)('We had problems syncing your changes. Please report this as a bug by [opening a GitHub issue]({{githubIssueLink}}).', { githubIssueLink: githubIssueLink }),
                    };
            }
            if (notif) {
                store.dispatch((0, notificationsSlice_1.addNotification)({ notification: __assign({ type: 'error' }, notif) }));
            }
        }
    });
    return function () {
        unlistenUnauthorized();
        unlistenSuccess();
    };
}
