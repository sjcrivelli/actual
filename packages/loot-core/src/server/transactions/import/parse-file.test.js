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
var d = require("date-fns");
var util_1 = require("../../../shared/util");
var sync_1 = require("../../accounts/sync");
var db = require("../../db");
var prefs = require("../../prefs");
var parse_file_1 = require("./parse-file");
beforeEach(global.emptyDatabase());
// libofx spits out errors that contain the entire
// source code of the file in the stack which makes
// it hard to test.
var old = console.warn;
beforeAll(function () {
    console.warn = function () { };
});
afterAll(function () {
    console.warn = old;
});
function getTransactions(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.runQuery('SELECT * FROM transactions WHERE acct = ?', [accountId], true)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function importFileWithRealTime(accountId, filepath, dateFormat, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, errors, originalTransactions, transactions, added;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Emscripten requires a real Date.now!
                    global.restoreDateNow();
                    return [4 /*yield*/, (0, parse_file_1.parseFile)(filepath, options)];
                case 1:
                    _a = _b.sent(), errors = _a.errors, originalTransactions = _a.transactions;
                    global.restoreFakeDateNow();
                    transactions = originalTransactions;
                    if (transactions) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        transactions = transactions.map(function (trans) { return (__assign(__assign({}, trans), { amount: (0, util_1.amountToInteger)(trans.amount), date: dateFormat
                                ? d.format(d.parse(trans.date, dateFormat, new Date()), 'yyyy-MM-dd')
                                : trans.date })); });
                    }
                    if (errors.length > 0) {
                        return [2 /*return*/, { errors: errors, added: [] }];
                    }
                    return [4 /*yield*/, (0, sync_1.reconcileTransactions)(accountId, transactions)];
                case 2:
                    added = (_b.sent()).added;
                    return [2 /*return*/, { errors: errors, added: added }];
            }
        });
    });
}
describe('File import', function () {
    test('qif import works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/data.qif', 'MM/dd/yy', { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('ofx import works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/data.ofx', null, { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); }, 45000);
    test('ofx import works (credit card)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/credit-card.ofx', null, { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); }, 45000);
    test('qfx import works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/data.qfx', null, { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); }, 45000);
    test('import notes are respected when importing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errorsWithNotes, _a, errorsWithoutNotes, transactionsWithoutNotes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/data.ofx', null, { importNotes: true })];
                case 2:
                    errorsWithNotes = (_b.sent()).errors;
                    expect(errorsWithNotes.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot('transactions with notes');
                    // Clear transactions
                    return [4 /*yield*/, db.runQuery('DELETE FROM transactions WHERE acct = ?', ['one'])];
                case 4:
                    // Clear transactions
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/data.ofx', null, { importNotes: false })];
                case 5:
                    errorsWithoutNotes = (_b.sent()).errors;
                    expect(errorsWithoutNotes.length).toBe(0);
                    return [4 /*yield*/, getTransactions('one')];
                case 6:
                    transactionsWithoutNotes = _b.sent();
                    expect(transactionsWithoutNotes.every(function (t) { return t.notes === null; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); }, 45000);
    test('matches extensions correctly (case-insensitive, etc)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/best.data-ever$.QFX')];
                case 2:
                    res = _a.sent();
                    expect(res.errors.length).toBe(0);
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/big.data.QiF', 'MM/dd/yy')];
                case 3:
                    res = _a.sent();
                    expect(res.errors.length).toBe(0);
                    return [4 /*yield*/, importFileWithRealTime('one', 'foo.txt')];
                case 4:
                    res = _a.sent();
                    expect(res.errors.length).toBe(1);
                    expect(res.errors[0].message).toBe('Invalid file type');
                    return [2 /*return*/];
            }
        });
    }); }, 45000);
    test('handles non-ASCII characters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/8859-1.qfx', 'yyyy-MM-dd', { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('handles html escaped plaintext', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/html-vals.qfx', 'yyyy-MM-dd', { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('CAMT.053 import works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prefs.loadPrefs();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, importFileWithRealTime('one', __dirname + '/../../../mocks/files/camt/camt.053.xml', null, { importNotes: true })];
                case 2:
                    errors = (_b.sent()).errors;
                    expect(errors.length).toBe(0);
                    _a = expect;
                    return [4 /*yield*/, getTransactions('one')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
