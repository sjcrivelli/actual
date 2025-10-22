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
var util_1 = require("../../mocks/util");
var db = require("../db");
var transfer = require("./transfer");
beforeEach(global.emptyDatabase());
function getAllTransactions() {
    return db.all("SELECT t.*, p.name as payee_name\n       FROM v_transactions t\n       LEFT JOIN payees p ON p.id = t.payee\n       ORDER BY date DESC, amount DESC, id\n     ");
}
function prepareDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1', is_income: 0 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: '1',
                            name: 'cat1',
                            cat_group: 'group1',
                            is_income: 0,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'two', name: 'two' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'three', name: 'three', offbudget: 1 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: 'one' })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: 'two' })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: '',
                            transfer_acct: 'three',
                        })];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe('Transfer', function () {
    test('transfers are properly inserted/updated/deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transaction, differ, _a, transferTwo, transferThree, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    _t.sent();
                    _r = {
                        account: 'one',
                        amount: 5000
                    };
                    return [4 /*yield*/, db.insertPayee({ name: 'Non-transfer' })];
                case 2:
                    transaction = (_r.payee = _t.sent(),
                        _r.date = '2017-01-01',
                        _r);
                    return [4 /*yield*/, db.insertTransaction(transaction)];
                case 3:
                    _t.sent();
                    return [4 /*yield*/, transfer.onInsert(transaction)];
                case 4:
                    _t.sent();
                    _a = util_1.expectSnapshotWithDiffer;
                    return [4 /*yield*/, getAllTransactions()];
                case 5:
                    differ = _a.apply(void 0, [_t.sent()]);
                    return [4 /*yield*/, db.first("SELECT * FROM payees WHERE transfer_acct = 'two'")];
                case 6:
                    transferTwo = _t.sent();
                    return [4 /*yield*/, db.first("SELECT * FROM payees WHERE transfer_acct = 'three'")];
                case 7:
                    transferThree = _t.sent();
                    transaction = {
                        account: 'one',
                        amount: 5000,
                        payee: transferTwo.id,
                        date: '2017-01-01',
                    };
                    _b = transaction;
                    return [4 /*yield*/, db.insertTransaction(transaction)];
                case 8:
                    _b.id = _t.sent();
                    return [4 /*yield*/, transfer.onInsert(transaction)];
                case 9:
                    _t.sent();
                    _d = (_c = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 10:
                    _d.apply(_c, [_t.sent()]);
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 11:
                    // Fill the transaction out
                    transaction = _t.sent();
                    expect(transaction.transfer_id).toBeDefined();
                    transaction = __assign(__assign({}, transaction), { date: '2017-01-05', notes: 'This is a note' });
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 12:
                    _t.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 13:
                    _t.sent();
                    _f = (_e = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 14:
                    _f.apply(_e, [_t.sent()]);
                    transaction = __assign(__assign({}, transaction), { payee: transferThree.id });
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 15:
                    _t.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 16:
                    _t.sent();
                    _h = (_g = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 17:
                    _h.apply(_g, [_t.sent()]);
                    _j = [__assign({}, transaction)];
                    _s = {};
                    return [4 /*yield*/, db.insertPayee({ name: 'Not transferred anymore' })];
                case 18:
                    transaction = __assign.apply(void 0, _j.concat([(_s.payee = _t.sent(), _s)]));
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 19:
                    _t.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 20:
                    _t.sent();
                    _l = (_k = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 21:
                    _l.apply(_k, [_t.sent()]);
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 22:
                    // Make sure it's not a linked transaction anymore
                    transaction = _t.sent();
                    expect(transaction.transfer_id).toBeNull();
                    // Re-transfer it
                    transaction = __assign(__assign({}, transaction), { payee: transferTwo.id });
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 23:
                    _t.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 24:
                    _t.sent();
                    _o = (_m = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 25:
                    _o.apply(_m, [_t.sent()]);
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 26:
                    transaction = _t.sent();
                    expect(transaction.transfer_id).toBeDefined();
                    return [4 /*yield*/, db.deleteTransaction(transaction)];
                case 27:
                    _t.sent();
                    return [4 /*yield*/, transfer.onDelete(transaction)];
                case 28:
                    _t.sent();
                    _q = (_p = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 29:
                    _q.apply(_p, [_t.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('transfers are properly de-categorized', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transferTwo, transferThree, transaction, _a, differ, _b, _c, _d, _e, _f, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, db.first("SELECT * FROM payees WHERE transfer_acct = 'two'")];
                case 2:
                    transferTwo = _k.sent();
                    return [4 /*yield*/, db.first("SELECT * FROM payees WHERE transfer_acct = 'three'")];
                case 3:
                    transferThree = _k.sent();
                    _j = {
                        account: 'one',
                        amount: 5000
                    };
                    return [4 /*yield*/, db.insertPayee({ name: 'Non-transfer' })];
                case 4:
                    transaction = (_j.payee = _k.sent(),
                        _j.date = '2017-01-01',
                        _j.category = '1',
                        _j);
                    _a = transaction;
                    return [4 /*yield*/, db.insertTransaction(transaction)];
                case 5:
                    _a.id = _k.sent();
                    return [4 /*yield*/, transfer.onInsert(transaction)];
                case 6:
                    _k.sent();
                    _b = util_1.expectSnapshotWithDiffer;
                    return [4 /*yield*/, getAllTransactions()];
                case 7:
                    differ = _b.apply(void 0, [_k.sent()]);
                    _c = [{}];
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 8:
                    transaction = __assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_k.sent())])), { payee: transferThree.id, notes: 'hi' }]);
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 9:
                    _k.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 10:
                    _k.sent();
                    _e = (_d = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 11:
                    _e.apply(_d, [_k.sent()]);
                    _f = [{}];
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 12:
                    transaction = __assign.apply(void 0, [__assign.apply(void 0, _f.concat([(_k.sent())])), { payee: transferTwo.id }]);
                    return [4 /*yield*/, db.updateTransaction(transaction)];
                case 13:
                    _k.sent();
                    return [4 /*yield*/, transfer.onUpdate(transaction)];
                case 14:
                    _k.sent();
                    _h = (_g = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 15:
                    _h.apply(_g, [_k.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('split transfers are retained on child transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, transferOne, transferTwo, parent, _b, differ, _c, _d, _e, child, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: 
                // test: first add a txn having a transfer acct payee
                // then mark it as `is_parent` and add a child txn
                // the child txn should have a different transfer acct payee
                // and `is_child` set to true
                return [4 /*yield*/, prepareDatabase()];
                case 1:
                    // test: first add a txn having a transfer acct payee
                    // then mark it as `is_parent` and add a child txn
                    // the child txn should have a different transfer acct payee
                    // and `is_child` set to true
                    _j.sent();
                    return [4 /*yield*/, Promise.all([
                            db.first("SELECT * FROM payees WHERE transfer_acct = 'one'"),
                            db.first("SELECT * FROM payees WHERE transfer_acct = 'two'"),
                        ])];
                case 2:
                    _a = _j.sent(), transferOne = _a[0], transferTwo = _a[1];
                    parent = {
                        account: 'one',
                        amount: 5000,
                        payee: transferTwo.id,
                        date: '2017-01-01',
                    };
                    _b = parent;
                    return [4 /*yield*/, db.insertTransaction(parent)];
                case 3:
                    _b.id = _j.sent();
                    return [4 /*yield*/, transfer.onInsert(parent)];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, db.getTransaction(parent.id)];
                case 5:
                    parent = _j.sent();
                    _c = util_1.expectSnapshotWithDiffer;
                    return [4 /*yield*/, getAllTransactions()];
                case 6:
                    differ = _c.apply(void 0, [_j.sent()]);
                    // mark the txn as parent
                    return [4 /*yield*/, db.updateTransaction({ id: parent.id, is_parent: true })];
                case 7:
                    // mark the txn as parent
                    _j.sent();
                    return [4 /*yield*/, transfer.onUpdate(parent)];
                case 8:
                    _j.sent();
                    _e = (_d = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 9:
                    _e.apply(_d, [_j.sent()]);
                    child = {
                        account: 'one',
                        amount: 2000,
                        payee: transferOne.id,
                        date: '2017-01-01',
                        is_child: true,
                        parent_id: parent.id,
                    };
                    _f = child;
                    return [4 /*yield*/, db.insertTransaction(child)];
                case 10:
                    _f.id = _j.sent();
                    return [4 /*yield*/, transfer.onInsert(child)];
                case 11:
                    _j.sent();
                    _h = (_g = differ).expectToMatchDiff;
                    return [4 /*yield*/, getAllTransactions()];
                case 12:
                    _h.apply(_g, [_j.sent()]);
                    return [4 /*yield*/, db.getTransaction(child.id)];
                case 13:
                    // ensure that the child txn has the correct transfer acct payee
                    child = _j.sent();
                    expect(child.transfer_id).not.toBe(parent.transfer_id);
                    expect(child.payee).toBe(transferOne.id);
                    return [2 /*return*/];
            }
        });
    }); });
});
