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
// @ts-strict-ignore
var nativeFs = require("fs");
var fetchClient = require("../platform/client/fetch");
var sqlite = require("../platform/server/sqlite");
var db = require("../server/db");
var mutators_1 = require("../server/mutators");
var server_config_1 = require("../server/server-config");
var sheet = require("../server/sheet");
var sync_1 = require("../server/sync");
var rules = require("../server/transactions/transaction-rules");
var update_1 = require("../server/update");
var test_helpers_1 = require("../shared/test-helpers");
vi.mock('../platform/client/fetch');
vi.mock('../platform/exceptions');
vi.mock('../platform/server/asyncStorage');
vi.mock('../platform/server/connection');
vi.mock('../server/post');
// By default, syncing is disabled
(0, sync_1.setSyncingMode)('disabled');
// Set a mock url for the testing server
(0, server_config_1.setServer)('https://test.env');
process.on('unhandledRejection', function (reason) {
    console.log('REJECTION', reason);
});
global.IS_TESTING = true;
var _time = 123456789;
var _oldDateNow = global.Date.now;
global.Date.now = function () { return _time; };
global.restoreDateNow = function () { return (global.Date.now = _oldDateNow); };
global.restoreFakeDateNow = function () { return (global.Date.now = function () { return _time; }); };
global.stepForwardInTime = function (time) {
    if (time) {
        _time = time;
    }
    else {
        _time += 1000;
    }
};
global.resetTime = function () {
    _time = 123456789;
};
var _id = 1;
global.resetRandomId = function () {
    _id = 1;
};
vi.mock('uuid', function () { return ({
    v4: function () {
        return 'id' + _id++;
    },
}); });
vi.mock('../server/migrate/migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
    var realMigrations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vi.importActual('../server/migrate/migrations')];
            case 1:
                realMigrations = _a.sent();
                return [2 /*return*/, __assign(__assign({}, realMigrations), { migrate: function (db) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _id = 100000000;
                                        return [4 /*yield*/, realMigrations.migrate(db)];
                                    case 1:
                                        _a.sent();
                                        _id = 1;
                                        return [2 /*return*/];
                                }
                            });
                        }); } })];
        }
    });
}); });
global.getDatabaseDump = function (tables) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, data, grouped;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!tables) return [3 /*break*/, 2];
                    return [4 /*yield*/, sqlite.runQuery(db.getDatabase(), "SELECT name FROM sqlite_master WHERE type='table'", [], true)];
                case 1:
                    rows = _a.sent();
                    tables = rows.map(function (row) { return row.name; });
                    _a.label = 2;
                case 2: return [4 /*yield*/, Promise.all(tables.map(function (table) { return __awaiter(_this, void 0, void 0, function () {
                        var sortColumn, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    switch (table) {
                                        case 'spreadsheet_cells':
                                            sortColumn = 'name';
                                            break;
                                        case 'created_budgets':
                                            sortColumn = 'month';
                                            break;
                                        case 'db_version':
                                            sortColumn = 'version';
                                            break;
                                        default:
                                            sortColumn = 'id';
                                    }
                                    _a = [table];
                                    return [4 /*yield*/, sqlite.runQuery(db.getDatabase(), 'SELECT * FROM ' + table + ' ORDER BY ' + sortColumn, [], true)];
                                case 1: return [2 /*return*/, _a.concat([
                                        _b.sent()
                                    ])];
                            }
                        });
                    }); }))];
                case 3:
                    data = _a.sent();
                    grouped = {};
                    data.forEach(function (table) { return (grouped[table[0]] = table[1]); });
                    return [2 /*return*/, grouped];
            }
        });
    });
};
// If you want to test the sql.js backend, you need this so it knows
// where to find the webassembly file
// process.env.PUBLIC_URL =
//   __dirname + '/../../../../node_modules/@jlongster/sql.js/dist/';
global.emptyDatabase = function (avoidUpdate) {
    var _this = this;
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var path, memoryDB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = ':memory:';
                    // let path = `/tmp/foo-${Math.random()}.sqlite`;
                    // console.log('Using db ' + path);
                    return [4 /*yield*/, sqlite.init()];
                case 1:
                    // let path = `/tmp/foo-${Math.random()}.sqlite`;
                    // console.log('Using db ' + path);
                    _a.sent();
                    return [4 /*yield*/, sqlite.openDatabase(path)];
                case 2:
                    memoryDB = _a.sent();
                    sqlite.execQuery(memoryDB, nativeFs.readFileSync(__dirname + '/../server/sql/init.sql', 'utf8'));
                    db.setDatabase(memoryDB);
                    return [4 /*yield*/, db.runQuery('INSERT INTO db_version (version) VALUES (?)', ['0.0.1'])];
                case 3:
                    _a.sent();
                    if (!!avoidUpdate) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, update_1.updateVersion)()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.loadClock()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
};
beforeEach(function () {
    // This is necessary to create a valid rules state
    rules.resetState();
    (0, test_helpers_1.resetTracer)();
});
afterEach(function () {
    global.resetRandomId();
    test_helpers_1.tracer.end();
    fetchClient.clearServer();
    return new Promise(function (resolve) {
        if (sheet.get()) {
            sheet.get().onFinish(function () {
                sheet.unloadSpreadsheet();
                resolve(undefined);
            });
        }
        else {
            resolve(undefined);
        }
    });
});
// Tests by default are allowed to mutate the db at any time
beforeEach(function () { return (0, mutators_1.enableGlobalMutations)(); });
afterEach(function () { return (0, mutators_1.disableGlobalMutations)(); });
