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
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var db = require("../db");
var prefs = require("../prefs");
var sheet = require("../sheet");
var mockSyncServer = require("../tests/mockSyncServer");
var encoder = require("./encoder");
var utils_1 = require("./utils");
var index_1 = require("./index");
beforeEach(function () {
    mockSyncServer.reset();
    (0, index_1.setSyncingMode)('enabled');
    return global.emptyDatabase()();
});
afterEach(function () {
    global.resetTime();
    (0, index_1.setSyncingMode)('disabled');
});
describe('Sync', function () {
    it('should send messages to the server', function () { return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    prefs.loadPrefs();
                    prefs.savePrefs({ groupId: 'group' });
                    timestamp = crdt_1.Timestamp.send();
                    return [4 /*yield*/, (0, index_1.sendMessages)([
                            {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 3200,
                                timestamp: timestamp,
                            },
                        ])];
                case 1:
                    _c.sent();
                    global.stepForwardInTime();
                    timestamp = crdt_1.Timestamp.send();
                    return [4 /*yield*/, (0, index_1.sendMessages)([
                            {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 4200,
                                timestamp: timestamp,
                            },
                        ])];
                case 2:
                    _c.sent();
                    expect((0, crdt_1.getClock)().timestamp.toString()).toEqual(timestamp.toString());
                    expect(mockSyncServer.getClock().merkle).toEqual((0, crdt_1.getClock)().merkle);
                    _a = expect;
                    return [4 /*yield*/, db.all('SELECT * FROM messages_crdt')];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toMatchSnapshot();
                    _b = expect;
                    return [4 /*yield*/, db.all('SELECT * FROM messages_clock')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should resend old messages to the server', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prefs.loadPrefs();
                    prefs.savePrefs({ groupId: 'group' });
                    global.stepForwardInTime(Date.parse('2018-11-13T13:20:00.000Z'));
                    return [4 /*yield*/, (0, index_1.applyMessages)([
                            global.stepForwardInTime() || {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 3200,
                                timestamp: crdt_1.Timestamp.send(),
                            },
                            global.stepForwardInTime() || {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 3200,
                                timestamp: crdt_1.Timestamp.send(),
                            },
                        ])];
                case 1:
                    _a.sent();
                    // Move the clock forward so that the above 2 messages are not
                    // automatically sent out, but will need to be re-sent by way of
                    // the merkle tree
                    prefs.savePrefs({ lastSyncedTimestamp: (0, crdt_1.getClock)().timestamp.toString() });
                    expect(mockSyncServer.getMessages().length).toBe(0);
                    return [4 /*yield*/, (0, index_1.fullSync)()];
                case 2:
                    result = _a.sent();
                    if ((0, utils_1.isError)(result))
                        throw result.error;
                    expect(result.messages.length).toBe(0);
                    expect(mockSyncServer.getMessages().length).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should sync multiple clients', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    prefs.loadPrefs();
                    prefs.savePrefs({
                        groupId: 'group',
                        lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
                    });
                    _b = (_a = mockSyncServer.handlers)['/sync/sync'];
                    return [4 /*yield*/, encoder.encode('group', 'client', crdt_1.Timestamp.parse('1970-01-01T01:17:37.000Z-0000-0000testinguuid2'), [
                            {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 'N:3200',
                                timestamp: crdt_1.Timestamp.parse('1970-01-02T05:17:36.789Z-0000-0000testinguuid2'),
                            },
                            {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 'N:4200',
                                timestamp: crdt_1.Timestamp.parse('1970-01-02T10:17:36.999Z-0000-0000testinguuid2'),
                            },
                        ])];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, index_1.applyMessages)([
                            global.stepForwardInTime(Date.parse('1970-01-03T10:17:37.000Z')) || {
                                dataset: 'transactions',
                                row: 'foo',
                                column: 'amount',
                                value: 5000,
                                timestamp: crdt_1.Timestamp.send(),
                            },
                        ])];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, index_1.fullSync)()];
                case 4:
                    result = _c.sent();
                    if ((0, utils_1.isError)(result))
                        throw result.error;
                    expect(result.messages.length).toBe(2);
                    expect(mockSyncServer.getMessages().length).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
function registerBudgetMonths(months) {
    return __awaiter(this, void 0, void 0, function () {
        var createdMonths, _i, months_1, month;
        return __generator(this, function (_a) {
            createdMonths = new Set();
            for (_i = 0, months_1 = months; _i < months_1.length; _i++) {
                month = months_1[_i];
                createdMonths.add(month);
            }
            sheet.get().meta().createdMonths = months;
            return [2 /*return*/];
        });
    });
}
function asSecondClient(func) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prefs.loadPrefs();
                    prefs.savePrefs({
                        groupId: 'group',
                        lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
                    });
                    return [4 /*yield*/, func()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, global.emptyDatabase()()];
                case 2:
                    _a.sent();
                    prefs.savePrefs({
                        groupId: 'group',
                        lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function expectCellToExist(sheetName, name) {
    var value = sheet.get().getCellValueLoose(sheetName, name);
    expect(value).not.toBe(null);
}
function expectCellNotToExist(sheetName, name, voided) {
    var value = sheet.get().getCellValueLoose(sheetName, name);
    expect(value).toBe(voided ? 0 : null);
}
describe('Sync projections', function () {
    test('synced categories should have budgets created', function () { return __awaiter(void 0, void 0, void 0, function () {
        var groupId, fooId, barId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                case 2:
                                    groupId = _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                case 3:
                                    fooId = _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'bar', cat_group: 'group1' })];
                                case 4:
                                    barId = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _a.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
                    expectCellNotToExist('budget201701', 'sum-amount-' + barId);
                    expectCellNotToExist('budget201701', 'group-sum-amount-' + barId);
                    return [4 /*yield*/, (0, index_1.fullSync)()];
                case 3:
                    _a.sent();
                    // Make sure the budget cells have been created
                    expectCellToExist('budget201701', 'sum-amount-' + fooId);
                    expectCellToExist('budget201702', 'sum-amount-' + fooId);
                    expectCellToExist('budget201701', 'sum-amount-' + barId);
                    expectCellToExist('budget201702', 'sum-amount-' + barId);
                    expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
                    expectCellToExist('budget201702', 'group-sum-amount-' + groupId);
                    return [2 /*return*/];
            }
        });
    }); });
    test('creating and deleting categories in same sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fooId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                case 3:
                                    fooId = _a.sent();
                                    return [4 /*yield*/, db.deleteCategory({ id: fooId })];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _a.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
                    return [4 /*yield*/, (0, index_1.fullSync)()];
                case 3:
                    _a.sent();
                    expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
                    return [2 /*return*/];
            }
        });
    }); });
    test('synced categories should have budgets deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fooId, messages, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({
                                            id: 'group1',
                                            name: 'group1',
                                        })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                case 3:
                                    fooId = _a.sent();
                                    return [4 /*yield*/, db.deleteCategory({ id: fooId })];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _c.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    messages = mockSyncServer.getMessages();
                    // Apply all but the last message (which deletes the category)
                    return [4 /*yield*/, (0, index_1.applyMessages)(messages.slice(0, -1))];
                case 3:
                    // Apply all but the last message (which deletes the category)
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 4:
                    _a.apply(void 0, [(_c.sent()).length]).toBe(1);
                    expectCellToExist('budget201701', 'sum-amount-' + fooId);
                    // Apply the last message and make sure it deleted the appropriate
                    // budget cells
                    return [4 /*yield*/, (0, index_1.applyMessages)([messages[messages.length - 1]])];
                case 5:
                    // Apply the last message and make sure it deleted the appropriate
                    // budget cells
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 6:
                    _b.apply(void 0, [(_c.sent()).length]).toBe(0);
                    expectCellNotToExist('budget201701', 'sum-amount-' + fooId, true);
                    return [2 /*return*/];
            }
        });
    }); });
    test('creating and deleting groups in same sync', function () { return __awaiter(void 0, void 0, void 0, function () {
        var groupId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                case 2:
                                    groupId = _a.sent();
                                    return [4 /*yield*/, db.deleteCategoryGroup({ id: groupId })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _a.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId);
                    return [4 /*yield*/, (0, index_1.fullSync)()];
                case 3:
                    _a.sent();
                    expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId);
                    return [2 /*return*/];
            }
        });
    }); });
    test('synced groups should have budgets deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var groupId, fooId, messages, firstMessages, secondMessages, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({
                                            id: 'group1',
                                            name: 'group1',
                                        })];
                                case 2:
                                    groupId = _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                case 3:
                                    fooId = _a.sent();
                                    return [4 /*yield*/, db.deleteCategory({ id: fooId })];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, db.deleteCategoryGroup({ id: groupId })];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _e.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    messages = mockSyncServer.getMessages();
                    firstMessages = messages.filter(function (m) { return m.column !== 'tombstone'; });
                    secondMessages = messages.filter(function (m) { return m.column === 'tombstone'; });
                    // Apply all the good messages
                    return [4 /*yield*/, (0, index_1.applyMessages)(firstMessages)];
                case 3:
                    // Apply all the good messages
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 4:
                    _a.apply(void 0, [(_e.sent()).length]).toBe(1);
                    _b = expect;
                    return [4 /*yield*/, db.getCategoriesGrouped()];
                case 5:
                    _b.apply(void 0, [(_e.sent()).length]).toBe(1);
                    expectCellToExist('budget201701', 'sum-amount-' + fooId);
                    expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
                    // Apply the messages that deletes it
                    return [4 /*yield*/, (0, index_1.applyMessages)(secondMessages)];
                case 6:
                    // Apply the messages that deletes it
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 7:
                    _c.apply(void 0, [(_e.sent()).length]).toBe(0);
                    _d = expect;
                    return [4 /*yield*/, db.getCategoriesGrouped()];
                case 8:
                    _d.apply(void 0, [(_e.sent()).length]).toBe(0);
                    expectCellNotToExist('budget201701', 'sum-amount-' + fooId, true);
                    expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId, true);
                    return [2 /*return*/];
            }
        });
    }); });
    test('categories should update the budget when moved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var groupId, fooId, messages, firstMessages, secondMessages, cat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asSecondClient(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                case 2:
                                    groupId = _a.sent();
                                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group2', name: 'group2' })];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                case 4:
                                    fooId = _a.sent();
                                    return [4 /*yield*/, db.moveCategory(fooId, 'group2', null)];
                                case 5:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 2:
                    _a.sent();
                    registerBudgetMonths(['2017-01', '2017-02']);
                    messages = mockSyncServer.getMessages();
                    firstMessages = messages.slice(0, -2);
                    secondMessages = messages.slice(-2);
                    // Apply all the good messages
                    return [4 /*yield*/, (0, index_1.applyMessages)(firstMessages)];
                case 3:
                    // Apply all the good messages
                    _a.sent();
                    return [4 /*yield*/, db.getCategories()];
                case 4:
                    cat = (_a.sent())[0];
                    expect(cat.cat_group).toBe('group1');
                    expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
                    // Apply the messages that deletes it
                    return [4 /*yield*/, (0, index_1.applyMessages)(secondMessages)];
                case 5:
                    // Apply the messages that deletes it
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
