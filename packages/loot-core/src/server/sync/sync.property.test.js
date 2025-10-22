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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var jsverify_1 = require("jsverify");
var db = require("../db");
var prefs = require("../prefs");
var sheet = require("../sheet");
var mockSyncServer = require("../tests/mockSyncServer");
var encoder = require("./encoder");
var utils_1 = require("./utils");
var sync = require("./index");
var uuidGenerator = jsverify_1.default.integer(97, 122).smap(function (x) { return String.fromCharCode(x); }, function (x) { return x.charCodeAt(Number(x)); });
beforeEach(function () {
    sync.setSyncingMode('enabled');
    mockSyncServer.reset();
    global.restoreDateNow();
});
afterEach(function () {
    sync.setSyncingMode('disabled');
    global.resetTime();
});
var schema = {
    spreadsheet_cells: {
        expr: 'text',
    },
    accounts: {
        account_id: 'text',
        name: 'text',
        balance_current: 'integer',
        balance_available: 'integer',
        balance_limit: 'integer',
        mask: 'text',
        official_name: 'text',
        type: 'text',
        subtype: 'text',
        bank: 'text',
        offbudget: 'integer',
        closed: 'integer',
        tombstone: 'integer',
    },
    transactions: {
        isParent: 'integer',
        isChild: 'integer',
        acct: 'text',
        category: 'text',
        amount: 'integer',
        description: 'text',
        notes: 'text',
        date: 'integer',
        financial_id: 'text',
        type: 'text',
        location: 'text',
        error: 'text',
        imported_description: 'text',
        starting_balance_flag: 'integer',
        transferred_id: 'text',
        sort_order: 'real',
        tombstone: 'integer',
    },
    categories: {
        name: 'text',
        is_income: 'integer',
        cat_group: 'text',
        sort_order: 'real',
        tombstone: 'integer',
    },
    category_groups: {
        name: 'text',
        is_income: 'integer',
        sort_order: 'real',
        tombstone: 'integer',
    },
    category_mapping: { transferId: 'text' },
    payees: {
        name: 'text',
        transfer_acct: 'text',
        category: 'text',
        tombstone: 'integer',
    },
    payee_mapping: { targetId: 'text' },
};
// The base time is 2019-08-09T18:14:31.903Z
var baseTime = 1565374471903;
var clientId1 = '80dd7da215247293';
var clientId2 = '90xU1sd5124329ac';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeGen(_a) {
    var table = _a.table, row = _a.row, field = _a.field, value = _a.value;
    return jsverify_1.default.record({
        dataset: jsverify_1.default.constant(table),
        row: row || uuidGenerator,
        column: jsverify_1.default.constant(field),
        value: value,
        timestamp: jsverify_1.default.integer(1000, 10000).smap(function (x) {
            var clientId;
            switch (jsverify_1.default.random(0, 1)) {
                case 0:
                    clientId = clientId1;
                    break;
                case 1:
                default:
                    clientId = clientId2;
            }
            return new crdt_1.Timestamp(baseTime + x, 0, clientId);
        }, function (x) { return x.millis() - baseTime; }),
    });
}
var generators = [];
Object.keys(schema).forEach(function (table) {
    Object.keys(schema[table]).reduce(function (obj, field) {
        if (table === 'spreadsheet_cells' && field === 'expr') {
            generators.push(makeGen({
                table: table,
                row: jsverify_1.default.asciinestring.smap(function (x) { return 'sheet!' + x; }, function (x) { return x; }),
                field: 'expr',
                value: jsverify_1.default.constant(JSON.stringify('fooooo')),
            }));
            return obj;
        }
        var type = schema[table][field];
        switch (type) {
            case 'text':
                generators.push(makeGen({ table: table, field: field, value: jsverify_1.default.asciinestring }));
                break;
            case 'integer':
                if (field === 'amount') {
                    generators.push(makeGen({ table: table, field: field, value: jsverify_1.default.uint8 }));
                }
                else {
                    generators.push(makeGen({ table: table, field: field, value: jsverify_1.default.elements([0, 1]) }));
                }
                break;
            case 'real':
                generators.push(makeGen({ table: table, field: field, value: jsverify_1.default.uint32 }));
                break;
            default:
                throw new Error('Unknown type: ' + type);
        }
        return obj;
    }, {});
});
function shuffle(arr) {
    var src = __spreadArray([], arr, true);
    var shuffled = new Array(src.length);
    var item;
    while ((item = src.pop())) {
        var idx = Math.floor(Math.random() * shuffled.length);
        if (shuffled[idx]) {
            src.push(item);
        }
        else {
            shuffled[idx] = item;
        }
    }
    return shuffled;
}
function divide(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i += 10) {
        res.push(arr.slice(i, i + 10));
    }
    return res;
}
function run(msgs) {
    return __awaiter(this, void 0, void 0, function () {
        var knownTimestamps, res, chunks, client1Sync, _a, _b, syncPromise, lastReceive, _c, _d, result, serverMerkle, diff;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    mockSyncServer.reset();
                    knownTimestamps = new Set();
                    res = msgs.reduce(function (acc, msg) {
                        // Filter out duplicate timestamps
                        var ts = msg.timestamp.toString();
                        if (knownTimestamps.has(ts)) {
                            return acc;
                        }
                        knownTimestamps.add(ts);
                        if (msg.timestamp.node() === clientId1) {
                            acc.firstMessages.push(msg);
                        }
                        else if (msg.timestamp.node() === clientId2) {
                            acc.secondMessages.push(msg);
                        }
                        else {
                            throw new Error('unknown client');
                        }
                        return acc;
                    }, { firstMessages: [], secondMessages: [] });
                    prefs.loadPrefs();
                    prefs.savePrefs({
                        groupId: 'group',
                        lastSyncedTimestamp: new crdt_1.Timestamp(Date.now(), 0, '0000000000000000').toString(),
                    });
                    return [4 /*yield*/, global.emptyDatabase()()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db, function () { })];
                case 2:
                    _e.sent();
                    chunks = divide(res.firstMessages);
                    client1Sync = Promise.all(chunks.slice(0, -1).map(function (slice) { return sync.receiveMessages(slice); }));
                    return [4 /*yield*/, client1Sync];
                case 3:
                    _e.sent();
                    _b = (_a = mockSyncServer.handlers)['/sync/sync'];
                    return [4 /*yield*/, encoder.encode('group', clientId2, crdt_1.Timestamp.zero, res.secondMessages.map(function (x) { return (__assign(__assign({}, x), { value: sync.serializeValue(x.value), timestamp: x.timestamp.toString() })); }))];
                case 4: return [4 /*yield*/, _b.apply(_a, [_e.sent()])];
                case 5:
                    _e.sent();
                    syncPromise = sync.fullSync();
                    lastReceive = sync.receiveMessages(chunks[chunks.length - 1]);
                    _d = (_c = mockSyncServer.handlers)['/sync/sync'];
                    return [4 /*yield*/, encoder.encode('group', clientId2, crdt_1.Timestamp.zero, res.secondMessages.map(function (x) { return (__assign(__assign({}, x), { value: sync.serializeValue(x.value), timestamp: x.timestamp.toString() })); }))];
                case 6:
                    _d.apply(_c, [_e.sent()]);
                    return [4 /*yield*/, syncPromise];
                case 7:
                    result = _e.sent();
                    if ((0, utils_1.isError)(result)) {
                        console.log(result.error);
                        throw result.error;
                    }
                    serverMerkle = mockSyncServer.getClock().merkle;
                    diff = crdt_1.merkle.diff(serverMerkle, (0, crdt_1.getClock)().merkle);
                    if (diff !== null) {
                        return [2 /*return*/, false];
                    }
                    // Make sure that last batch of messages is applied
                    return [4 /*yield*/, lastReceive];
                case 8:
                    // Make sure that last batch of messages is applied
                    _e.sent();
                    // The full sync should have looped completely until it was fully in
                    // sync, including the messages we sent while it was syncing. Make
                    // sure it properly finished by compared the previous merkle trie on
                    // the server.
                    diff = crdt_1.merkle.diff(serverMerkle, (0, crdt_1.getClock)().merkle);
                    if (diff !== null) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
describe('sync property test', function () {
    it.skip('should always sync clients into the same state', function () { return __awaiter(void 0, void 0, void 0, function () {
        var test;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jsverify_1.default.check(jsverify_1.default.forall(jsverify_1.default.tuple(Array.from(new Array(100)).map(function () { return jsverify_1.default.oneof(generators); })), function (msgs) { return __awaiter(void 0, void 0, void 0, function () {
                        var r, e_1, i, shuffled;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, run(msgs)];
                                case 1:
                                    r = _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    console.log(e_1);
                                    throw e_1;
                                case 3:
                                    if (r === false) {
                                        return [2 /*return*/, false];
                                    }
                                    i = 0;
                                    _a.label = 4;
                                case 4:
                                    if (!(i < 10)) return [3 /*break*/, 7];
                                    shuffled = shuffle(msgs);
                                    return [4 /*yield*/, run(shuffled)];
                                case 5:
                                    r = _a.sent();
                                    if (r === false) {
                                        return [2 /*return*/, false];
                                    }
                                    _a.label = 6;
                                case 6:
                                    i++;
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/, true];
                            }
                        });
                    }); }), { tests: 100, quiet: true })];
                case 1:
                    test = _a.sent();
                    if (test.counterexample) {
                        console.log('---------------------');
                        console.log(test.counterexample[0].map(function (x) { return (__assign(__assign({}, x), { timestamp: x.timestamp.toString() })); }));
                        throw new Error('property test failed');
                    }
                    return [2 /*return*/];
            }
        });
    }); }, 50000);
    it.skip('should run a counterexample that needs to be fixed', function () { return __awaiter(void 0, void 0, void 0, function () {
        function convert(data) {
            return data.map(function (x) { return (__assign(__assign({}, x), { timestamp: crdt_1.Timestamp.parse(x.timestamp) })); });
        }
        var msgs, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msgs = convert([
                        {
                            dataset: 'accounts',
                            row: 't',
                            column: 'balance_limit',
                            value: 0,
                            timestamp: '2019-08-09T18:14:34.545Z-0000-90xU1sd5124329ac',
                        },
                        // ...
                    ]);
                    return [4 /*yield*/, run(msgs)];
                case 1:
                    res = _a.sent();
                    expect(res).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
