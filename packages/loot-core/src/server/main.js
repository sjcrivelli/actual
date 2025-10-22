"use strict";
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
exports.lib = exports.handlers = void 0;
exports.getDefaultDocumentDir = getDefaultDocumentDir;
exports.initApp = initApp;
exports.init = init;
// @ts-strict-ignore
require("./polyfills");
var injectAPI = require("@actual-app/api/injected");
var asyncStorage = require("../platform/server/asyncStorage");
var connection = require("../platform/server/connection");
var fs = require("../platform/server/fs");
var log_1 = require("../platform/server/log");
var sqlite = require("../platform/server/sqlite");
var query_1 = require("../shared/query");
var util_1 = require("../shared/util");
var app_1 = require("./accounts/app");
var app_2 = require("./admin/app");
var api_1 = require("./api");
var aql_1 = require("./aql");
var app_3 = require("./auth/app");
var app_4 = require("./budget/app");
var app_5 = require("./budgetfiles/app");
var app_6 = require("./dashboard/app");
var db = require("./db");
var encryption = require("./encryption");
var app_7 = require("./encryption/app");
var app_8 = require("./filters/app");
var main_app_1 = require("./main-app");
var mutators_1 = require("./mutators");
var app_9 = require("./notes/app");
var app_10 = require("./payees/app");
var post_1 = require("./post");
var app_11 = require("./preferences/app");
var prefs = require("./prefs");
var app_12 = require("./reports/app");
var app_13 = require("./rules/app");
var app_14 = require("./schedules/app");
var server_config_1 = require("./server-config");
var app_15 = require("./spreadsheet/app");
var sync_1 = require("./sync");
var app_16 = require("./sync/app");
var app_17 = require("./tags/app");
var app_18 = require("./tools/app");
var app_19 = require("./transactions/app");
var rules = require("./transactions/transaction-rules");
var undo_1 = require("./undo");
// handlers
// need to work around the type system here because the object
// is /currently/ empty but we promise to fill it in later
exports.handlers = {};
exports.handlers['undo'] = (0, mutators_1.mutator)(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, undo_1.undo)()];
        });
    });
});
exports.handlers['redo'] = (0, mutators_1.mutator)(function () {
    return (0, undo_1.redo)();
});
exports.handlers['make-filters-from-conditions'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var conditions = _b.conditions, applySpecialCases = _b.applySpecialCases;
        return __generator(this, function (_c) {
            return [2 /*return*/, rules.conditionsToAQL(conditions, { applySpecialCases: applySpecialCases })];
        });
    });
};
exports.handlers['query'] = function (query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (query['table'] == null) {
                throw new Error('query has no table, did you forgot to call `.serialize`?');
            }
            return [2 /*return*/, (0, aql_1.aqlQuery)(query)];
        });
    });
};
exports.handlers['get-server-version'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var version, res, info, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, server_config_1.getServer)()) {
                        return [2 /*return*/, { error: 'no-server' }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/info')];
                case 2:
                    res = _a.sent();
                    info = JSON.parse(res);
                    version = info.build.version;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, { error: 'network-failure' }];
                case 4: return [2 /*return*/, { version: version }];
            }
        });
    });
};
exports.handlers['get-server-url'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, server_config_1.getServer)() && (0, server_config_1.getServer)().BASE_SERVER];
        });
    });
};
exports.handlers['set-server-url'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var result;
        var url = _b.url, _c = _b.validate, validate = _c === void 0 ? true : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(url == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, asyncStorage.removeItem('user-token')];
                case 1:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 2:
                    url = url.replace(/\/+$/, '');
                    if (!validate) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, mutators_1.runHandler)(exports.handlers['subscribe-needs-bootstrap'], {
                            url: url,
                        })];
                case 3:
                    result = _d.sent();
                    if ('error' in result) {
                        return [2 /*return*/, { error: result.error }];
                    }
                    _d.label = 4;
                case 4: return [4 /*yield*/, asyncStorage.setItem('server-url', url)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, asyncStorage.setItem('did-bootstrap', true)];
                case 6:
                    _d.sent();
                    (0, server_config_1.setServer)(url);
                    return [2 /*return*/, {}];
            }
        });
    });
};
exports.handlers['app-focused'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (prefs.getPrefs() && prefs.getPrefs().id) {
                // First we sync
                (0, sync_1.fullSync)();
            }
            return [2 /*return*/];
        });
    });
};
exports.handlers = (0, api_1.installAPI)(exports.handlers);
injectAPI.override(function (name, args) { return (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args); });
// A hack for now until we clean up everything
main_app_1.app.handlers = exports.handlers;
main_app_1.app.combine(app_3.app, app_14.app, app_4.app, app_6.app, app_9.app, app_11.app, app_18.app, app_8.app, app_12.app, app_13.app, app_2.app, app_19.app, app_1.app, app_10.app, app_15.app, app_16.app, app_5.app, app_7.app, app_17.app);
function getDefaultDocumentDir() {
    return fs.join(process.env.ACTUAL_DOCUMENT_DIR, 'Actual');
}
function setupDocumentsDir() {
    return __awaiter(this, void 0, void 0, function () {
        function ensureExists(dir) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs.exists(dir)];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            return [4 /*yield*/, fs.mkdir(dir)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        var documentDir, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('document-dir')];
                case 1:
                    documentDir = _a.sent();
                    if (!documentDir) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, ensureExists(documentDir)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    documentDir = null;
                    return [3 /*break*/, 5];
                case 5:
                    if (!documentDir) {
                        documentDir = getDefaultDocumentDir();
                    }
                    return [4 /*yield*/, ensureExists(documentDir)];
                case 6:
                    _a.sent();
                    fs._setDocumentDir(documentDir);
                    return [2 /*return*/];
            }
        });
    });
}
function initApp(isDev, socketName) {
    return __awaiter(this, void 0, void 0, function () {
        var keysStr, keys_1, e_2, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sqlite.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([asyncStorage.init(), fs.init()])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, setupDocumentsDir()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, asyncStorage.getItem('encrypt-keys')];
                case 4:
                    keysStr = _a.sent();
                    if (!keysStr) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    keys_1 = JSON.parse(keysStr);
                    // Load all the keys
                    return [4 /*yield*/, Promise.all(Object.keys(keys_1).map(function (fileId) {
                            return encryption.loadKey(keys_1[fileId]);
                        }))];
                case 6:
                    // Load all the keys
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    log_1.logger.log('Error loading key', e_2);
                    throw new Error('load-key-error');
                case 8: return [4 /*yield*/, asyncStorage.getItem('server-url')];
                case 9:
                    url = _a.sent();
                    if (!!url) return [3 /*break*/, 11];
                    return [4 /*yield*/, asyncStorage.removeItem('user-token')];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    (0, server_config_1.setServer)(url);
                    connection.init(socketName, main_app_1.app.handlers);
                    // Allow running DB queries locally
                    global.$query = aql_1.aqlQuery;
                    global.$q = query_1.q;
                    if (isDev) {
                        global.$send = function (name, args) { return (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args); };
                        global.$db = db;
                        global.$setSyncingMode = sync_1.setSyncingMode;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function init(config) {
    return __awaiter(this, void 0, void 0, function () {
        var dataDir, serverURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config) {
                        dataDir = config.dataDir;
                        serverURL = config.serverURL;
                        // Set verbose mode if specified
                        if (config.verbose !== undefined) {
                            (0, log_1.setVerboseMode)(config.verbose);
                        }
                    }
                    else {
                        dataDir = process.env.ACTUAL_DATA_DIR;
                        serverURL = process.env.ACTUAL_SERVER_URL;
                    }
                    return [4 /*yield*/, sqlite.init()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([asyncStorage.init({ persist: false }), fs.init()])];
                case 2:
                    _a.sent();
                    fs._setDocumentDir(dataDir || process.cwd());
                    if (!serverURL) return [3 /*break*/, 5];
                    (0, server_config_1.setServer)(serverURL);
                    if (!config.password) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, mutators_1.runHandler)(exports.handlers['subscribe-sign-in'], {
                            password: config.password,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    // This turns off all server URLs. In this mode we don't want any
                    // access to the server, we are doing things locally
                    (0, server_config_1.setServer)(null);
                    main_app_1.app.events.on('load-budget', function () {
                        (0, sync_1.setSyncingMode)('offline');
                    });
                    _a.label = 6;
                case 6: return [2 /*return*/, exports.lib];
            }
        });
    });
}
// Export a few things required for the platform
exports.lib = {
    getDataDir: fs.getDataDir,
    sendMessage: function (msg, args) { return connection.send(msg, args); },
    send: function (name, args) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    }); },
    on: function (name, func) { return main_app_1.app.events.on(name, func); },
    q: query_1.q,
    db: db,
    amountToInteger: util_1.amountToInteger,
    integerToAmount: util_1.integerToAmount,
};
