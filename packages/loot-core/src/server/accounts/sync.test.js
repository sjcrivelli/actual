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
var monthUtils = require("../../shared/months");
var db = require("../db");
var mappings_1 = require("../db/mappings");
var post_1 = require("../post");
var server_config_1 = require("../server-config");
var transaction_rules_1 = require("../transactions/transaction-rules");
var sync_1 = require("./sync");
vi.mock('../../shared/months', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = [{}];
                return [4 /*yield*/, vi.importActual('../../shared/months')];
            case 1: return [2 /*return*/, (__assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { currentDay: vi.fn(), currentMonth: vi.fn() }]))];
        }
    });
}); });
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vi.resetAllMocks();
                vi.mocked(monthUtils.currentDay).mockReturnValue('2017-10-15');
                vi.mocked(monthUtils.currentMonth).mockReturnValue('2017-10');
                return [4 /*yield*/, global.emptyDatabase()()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, mappings_1.loadMappings)()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function getAllTransactions() {
    return db.all("SELECT t.*, p.name as payee_name\n       FROM v_transactions_internal t\n       LEFT JOIN payees p ON p.id = t.payee\n       ORDER BY date DESC, amount DESC, id\n     ");
}
function prepareDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, acct, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1', is_income: 1 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'income',
                            cat_group: 'group1',
                            is_income: 1,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().GOCARDLESS_SERVER + '/accounts', {
                            client_id: '',
                            group_id: '',
                            item_id: '1',
                        })];
                case 3:
                    accounts = (_a.sent()).accounts;
                    acct = accounts[0];
                    return [4 /*yield*/, db.insertAccount({
                            id: 'one',
                            account_id: acct.account_id,
                            name: acct.official_name,
                            balance_current: acct.balances.current,
                        })];
                case 4:
                    id = _a.sent();
                    return [4 /*yield*/, db.insertPayee({
                            id: 'transfer-' + id,
                            name: '',
                            transfer_acct: id,
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, { id: id, account_id: acct.account_id }];
            }
        });
    });
}
function getAllPayees() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPayees()];
                case 1: return [2 /*return*/, (_a.sent()).filter(function (p) { return p.transfer_acct == null; })];
            }
        });
    });
}
describe('Account sync', function () {
    test('reconcile creates payees correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, payees, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    id = (_a.sent()).id;
                    return [4 /*yield*/, getAllPayees()];
                case 2:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [
                            { date: '2020-01-02', payee_name: 'bakkerij', amount: 4133 },
                            { date: '2020-01-03', payee_name: 'kroger', amount: 5000 },
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 4:
                    payees = _a.sent();
                    expect(payees.length).toBe(2);
                    return [4 /*yield*/, getAllTransactions()];
                case 5:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(2);
                    expect(transactions.find(function (t) { return t.amount === 4133; }).payee).toBe(payees.find(function (p) { return p.name === 'Bakkerij'; }).id);
                    expect(transactions.find(function (t) { return t.amount === 5000; }).payee).toBe(payees.find(function (p) { return p.name === 'Kroger'; }).id);
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile handles transactions with undefined fields', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, transactions, payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, db.insertTransaction({
                            id: 'one',
                            account: acctId,
                            amount: 2948,
                            date: '2020-01-01',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-02' },
                            { date: '2020-01-01', amount: 2948 },
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(2);
                    expect(transactions).toMatchSnapshot();
                    return [4 /*yield*/, getAllPayees()];
                case 5:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    // Make _at least_ the date is required
                    return [4 /*yield*/, expect((0, sync_1.reconcileTransactions)(acctId, [{}])).rejects.toThrow(/`date` is required/)];
                case 6:
                    // Make _at least_ the date is required
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile doesnt rematch deleted transactions if reimport disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, reimportKey, transactions1, transactions2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    reimportKey = "sync-reimport-deleted-".concat(acctId);
                    return [4 /*yield*/, db.update('preferences', { id: reimportKey, value: 'false' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-01', imported_id: 'finid' },
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions1 = _a.sent();
                    expect(transactions1.length).toBe(1);
                    return [4 /*yield*/, db.deleteTransaction(transactions1[0])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-01', imported_id: 'finid' },
                        ])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 7:
                    transactions2 = _a.sent();
                    expect(transactions2.length).toBe(1);
                    expect(transactions2).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile does rematch deleted transactions by default', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, transactions1, transactions2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-01', imported_id: 'finid' },
                        ])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 3:
                    transactions1 = _a.sent();
                    expect(transactions1.length).toBe(1);
                    return [4 /*yield*/, db.deleteTransaction(transactions1[0])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-01', imported_id: 'finid' },
                        ])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 6:
                    transactions2 = _a.sent();
                    expect(transactions2.length).toBe(2);
                    expect(transactions2).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile run rules with inferred payee', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, catId, payeeId, transactions, payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'group2',
                            name: 'group2',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Food',
                            cat_group: 'group2',
                        })];
                case 3:
                    catId = _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: 'bakkerij' })];
                case 4:
                    payeeId = _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: payeeId }],
                            actions: [{ op: 'set', field: 'category', value: catId }],
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-02', payee_name: 'Bakkerij', amount: 4133 },
                        ])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 7:
                    transactions = _a.sent();
                    // Even though the payee was inferred from the string name (no
                    // renaming rules ran), it should match the above rule and set the
                    // category
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].payee).toBe(payeeId);
                    expect(transactions[0].category).toBe(catId);
                    return [4 /*yield*/, getAllPayees()];
                case 8:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    expect(payees[0].id).toBe(payeeId);
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile avoids creating blank payees', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, transactions, payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-02', payee_name: '     ', amount: 4133 },
                        ])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getAllTransactions()];
                case 3:
                    transactions = _a.sent();
                    // Even though the payee was inferred from the string name (no
                    // renaming rules ran), it should match the above rule and set the
                    // category
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].payee).toBe(null);
                    expect(transactions[0].amount).toBe(4133);
                    expect(transactions[0].date).toBe(20200102);
                    return [4 /*yield*/, getAllPayees()];
                case 4:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile run rules dont create unnecessary payees', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, payeeId, payees, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, db.insertPayee({ name: 'bakkerij-renamed' })];
                case 2:
                    payeeId = _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'imported_payee', value: 'Bakkerij' }],
                            actions: [{ op: 'set', field: 'payee', value: payeeId }],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                            { date: '2020-01-02', payee_name: 'bakkerij', amount: 4133 },
                        ])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 5:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    expect(payees[0].id).toBe(payeeId);
                    return [4 /*yield*/, getAllTransactions()];
                case 6:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].payee).toBe(payeeId);
                    return [2 /*return*/];
            }
        });
    }); });
    var testMapped = function (version) {
        test("reconcile matches unmapped and mapped payees (".concat(version, ")"), function () { return __awaiter(void 0, void 0, void 0, function () {
            var acctId, payeeId1, payeeId2, updated, payees, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDatabase()];
                    case 1:
                        acctId = (_a.sent()).id;
                        if (version === 'v1') {
                            // This is quite complicated, but important to test. If a payee is
                            // merged with another, a rule sets the payee of a transaction to
                            // the updated one, make sure it still matches an existing
                            // transaction that points to the old merged payee
                        }
                        else if (version === 'v2') {
                            // This is similar to v1, but inverted: make sure that
                            // if a rule sets the payee to an *old* payee, that it still
                            // matches to a transaction with the new payee that it was merged
                            // to
                        }
                        return [4 /*yield*/, db.insertPayee({ name: 'bakkerij2' })];
                    case 2:
                        payeeId1 = _a.sent();
                        return [4 /*yield*/, db.insertPayee({ name: 'bakkerij-renamed' })];
                    case 3:
                        payeeId2 = _a.sent();
                        // Insert a rule *before* payees are merged. Not that v2 would
                        // fail if we inserted this rule after, because the rule would
                        // set to an *old* payee but the matching would take place on a
                        // *new* payee. But that's ok - it would fallback to matching
                        // amount anyway, so while it loses some fidelity, it's an edge
                        // case that we don't need to worry much about because the user
                        // shouldn't be able able to create rules for a merged payee.
                        // Unless they sync in a rule...
                        return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                                stage: null,
                                conditionsOp: 'and',
                                conditions: [{ op: 'is', field: 'imported_payee', value: 'Bakkerij' }],
                                actions: [{ op: 'set', field: 'payee', value: payeeId2 }],
                            })];
                    case 4:
                        // Insert a rule *before* payees are merged. Not that v2 would
                        // fail if we inserted this rule after, because the rule would
                        // set to an *old* payee but the matching would take place on a
                        // *new* payee. But that's ok - it would fallback to matching
                        // amount anyway, so while it loses some fidelity, it's an edge
                        // case that we don't need to worry much about because the user
                        // shouldn't be able able to create rules for a merged payee.
                        // Unless they sync in a rule...
                        _a.sent();
                        if (!(version === 'v1')) return [3 /*break*/, 6];
                        return [4 /*yield*/, db.mergePayees(payeeId2, [payeeId1])];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(version === 'v2')) return [3 /*break*/, 8];
                        return [4 /*yield*/, db.mergePayees(payeeId1, [payeeId2])];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, db.insertTransaction({
                            id: 'one',
                            account: acctId,
                            amount: -2947,
                            date: '2017-10-15',
                            payee: payeeId1,
                        })];
                    case 9:
                        _a.sent();
                        // It will try to match to this one first, make sure it matches
                        // the above transaction though
                        return [4 /*yield*/, db.insertTransaction({
                                id: 'two',
                                account: acctId,
                                amount: -2947,
                                date: '2017-10-17',
                                payee: null,
                            })];
                    case 10:
                        // It will try to match to this one first, make sure it matches
                        // the above transaction though
                        _a.sent();
                        return [4 /*yield*/, (0, sync_1.reconcileTransactions)(acctId, [
                                {
                                    date: '2017-10-17',
                                    payee_name: 'bakkerij',
                                    amount: -2947,
                                    imported_id: 'imported1',
                                },
                            ])];
                    case 11:
                        updated = (_a.sent()).updated;
                        return [4 /*yield*/, getAllPayees()];
                    case 12:
                        payees = _a.sent();
                        expect(payees.length).toBe(1);
                        expect(payees[0].id).toBe(version === 'v1' ? payeeId2 : payeeId1);
                        expect(updated.length).toBe(1);
                        expect(updated[0]).toBe('one');
                        return [4 /*yield*/, getAllTransactions()];
                    case 13:
                        transactions = _a.sent();
                        expect(transactions.length).toBe(2);
                        expect(transactions.find(function (t) { return t.id === 'one'; }).imported_id).toBe('imported1');
                        return [2 /*return*/];
                }
            });
        }); });
    };
    testMapped('v1');
    testMapped('v2');
    test('addTransactions simply adds transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acctId, payeeId, transactions, added, payees, getName, allTransactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    acctId = (_a.sent()).id;
                    return [4 /*yield*/, db.insertPayee({ name: 'bakkerij-renamed' })];
                case 2:
                    payeeId = _a.sent();
                    // Make sure it still runs rules
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'imported_payee', value: 'Bakkerij' }],
                            actions: [{ op: 'set', field: 'payee', value: payeeId }],
                        })];
                case 3:
                    // Make sure it still runs rules
                    _a.sent();
                    transactions = [
                        {
                            date: '2017-10-17',
                            payee_name: 'BAKKerij',
                            amount: -2947,
                        },
                        {
                            date: '2017-10-18',
                            payee_name: 'bakkERIj2',
                            amount: -2947,
                        },
                        {
                            date: '2017-10-19',
                            payee_name: 'bakkerij3',
                            amount: -2947,
                        },
                        {
                            date: '2017-10-20',
                            payee_name: 'BakkeriJ3',
                            amount: -2947,
                        },
                    ];
                    return [4 /*yield*/, (0, sync_1.addTransactions)(acctId, transactions)];
                case 4:
                    added = _a.sent();
                    expect(added.length).toBe(transactions.length);
                    return [4 /*yield*/, getAllPayees()];
                case 5:
                    payees = _a.sent();
                    expect(payees.length).toBe(3);
                    getName = function (id) { return payees.find(function (p) { return p.id === id; }).name; };
                    return [4 /*yield*/, getAllTransactions()];
                case 6:
                    allTransactions = _a.sent();
                    expect(allTransactions.length).toBe(4);
                    expect(allTransactions.map(function (t) { return getName(t.payee); })).toEqual([
                        'bakkerij3',
                        'bakkerij3',
                        'bakkERIj2',
                        'bakkerij-renamed',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('reconcile does not merge transactions with different ‘imported_id’ values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, payees, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    id = (_a.sent()).id;
                    return [4 /*yield*/, getAllPayees()];
                case 2:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    // Add first transaction
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [
                            {
                                date: '2024-04-05',
                                amount: -1239,
                                imported_payee: 'Acme Inc.',
                                payee_name: 'Acme Inc.',
                                imported_id: 'b85cdd57-5a1c-4ca5-bd54-12e5b56fa02c',
                                notes: 'TEST TRANSACTION',
                                cleared: true,
                            },
                        ])];
                case 3:
                    // Add first transaction
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 4:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 5:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    // Add second transaction
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [
                            {
                                date: '2024-04-06',
                                amount: -1239,
                                imported_payee: 'Acme Inc.',
                                payee_name: 'Acme Inc.',
                                imported_id: 'ca1589b2-7bc3-4587-a157-476170b383a7',
                                notes: 'TEST TRANSACTION',
                                cleared: true,
                            },
                        ])];
                case 6:
                    // Add second transaction
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 7:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 8:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(2);
                    expect(transactions.find(function (t) { return t.imported_id === 'b85cdd57-5a1c-4ca5-bd54-12e5b56fa02c'; }).amount).toBe(-1239);
                    expect(transactions.find(function (t) { return t.imported_id === 'ca1589b2-7bc3-4587-a157-476170b383a7'; }).amount).toBe(-1239);
                    return [2 /*return*/];
            }
        });
    }); });
    test('given an imported tx with no imported_id, ' +
        'when using fuzzy search V2, existing transaction has an imported_id, matches amount, and is within 7 days of imported tx, ' +
        'then imported tx should reconcile with existing transaction from fuzzy match', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, payees, existingTx, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    id = (_a.sent()).id;
                    return [4 /*yield*/, getAllPayees()];
                case 2:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    existingTx = {
                        date: '2024-04-05',
                        amount: -1239,
                        imported_payee: 'Acme Inc.',
                        payee_name: 'Acme Inc.',
                        imported_id: 'b85cdd57-5a1c-4ca5-bd54-12e5b56fa02c',
                        notes: 'TEST TRANSACTION',
                        cleared: true,
                    };
                    // Add transaction to represent existing transaction with imoprted_id
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [existingTx])];
                case 3:
                    // Add transaction to represent existing transaction with imoprted_id
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 4:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 5:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    // Import transaction similar to existing but with different date and no imported_id
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [
                            __assign(__assign({}, existingTx), { date: '2024-04-06', imported_id: null }),
                        ])];
                case 6:
                    // Import transaction similar to existing but with different date and no imported_id
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 7:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 8:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].amount).toBe(-1239);
                    return [2 /*return*/];
            }
        });
    }); });
    test('given an imported tx has an imported_id, ' +
        'when not using fuzzy search V2, existing transaction has an imported_id, matches amount, and is within 7 days of imported tx, ' +
        'then imported tx should reconcile with existing transaction from fuzzy match', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, payees, existingTx, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    id = (_a.sent()).id;
                    return [4 /*yield*/, getAllPayees()];
                case 2:
                    payees = _a.sent();
                    expect(payees.length).toBe(0);
                    existingTx = {
                        date: '2024-04-05',
                        amount: -1239,
                        imported_payee: 'Acme Inc.',
                        payee_name: 'Acme Inc.',
                        imported_id: 'b85cdd57-5a1c-4ca5-bd54-12e5b56fa02c',
                        notes: 'TEST TRANSACTION',
                        cleared: true,
                    };
                    // Add transaction to represent existing transaction with imoprted_id
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [existingTx])];
                case 3:
                    // Add transaction to represent existing transaction with imoprted_id
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 4:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 5:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    // Import transaction similar to existing but with different date and imported_id
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(id, [
                            __assign(__assign({}, existingTx), { date: '2024-04-06', imported_id: 'something-else-entirely' }),
                        ], false, false)];
                case 6:
                    // Import transaction similar to existing but with different date and imported_id
                    _a.sent();
                    return [4 /*yield*/, getAllPayees()];
                case 7:
                    payees = _a.sent();
                    expect(payees.length).toBe(1);
                    return [4 /*yield*/, getAllTransactions()];
                case 8:
                    transactions = _a.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].amount).toBe(-1239);
                    return [2 /*return*/];
            }
        });
    }); });
});
