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
var db = require("../server/db");
var transfer = require("./transfer");
beforeEach(global.emptyDatabase());
function prepareDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'two', name: 'two' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: 'one' })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: 'two' })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createTransaction(account_1, amount_1) {
    return __awaiter(this, arguments, void 0, function (account, amount, extra) {
        var transaction, _a;
        var _b;
        if (extra === void 0) { extra = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = { id: null, account: account, amount: amount };
                    return [4 /*yield*/, db.insertPayee({ name: 'Non-transfer ' + account })];
                case 1:
                    transaction = __assign.apply(void 0, [(_b.payee = _c.sent(), _b.date = '2017-01-01', _b), extra]);
                    _a = transaction;
                    return [4 /*yield*/, db.insertTransaction(transaction)];
                case 2:
                    _a.id = _c.sent();
                    return [4 /*yield*/, db.getTransaction(transaction.id)];
                case 3: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
describe('Transfer', function () {
    test('Transfers are properly verified', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, existingTransfer, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    _w.sent();
                    // happy path, two valid transactions
                    _a = expect;
                    _c = (_b = transfer).validForTransfer;
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 2:
                    _d = [_w.sent()];
                    return [4 /*yield*/, createTransaction('two', -5)];
                case 3:
                    // happy path, two valid transactions
                    _a.apply(void 0, [_c.apply(_b, _d.concat([_w.sent()]))]).toBeTruthy();
                    // amount not zeroed out
                    _e = expect;
                    _g = (_f = transfer).validForTransfer;
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 4:
                    _h = [_w.sent()];
                    return [4 /*yield*/, createTransaction('two', 5)];
                case 5:
                    // amount not zeroed out
                    _e.apply(void 0, [_g.apply(_f, _h.concat([_w.sent()]))]).toBeFalsy();
                    // amount not match
                    _j = expect;
                    _l = (_k = transfer).validForTransfer;
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 6:
                    _m = [_w.sent()];
                    return [4 /*yield*/, createTransaction('two', -6)];
                case 7:
                    // amount not match
                    _j.apply(void 0, [_l.apply(_k, _m.concat([_w.sent()]))]).toBeFalsy();
                    // accounts match
                    _o = expect;
                    _q = (_p = transfer).validForTransfer;
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 8:
                    _r = [_w.sent()];
                    return [4 /*yield*/, createTransaction('one', -5)];
                case 9:
                    // accounts match
                    _o.apply(void 0, [_q.apply(_p, _r.concat([_w.sent()]))]).toBeFalsy();
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 10:
                    existingTransfer = _w.sent();
                    _s = expect;
                    _u = (_t = transfer).validForTransfer;
                    return [4 /*yield*/, createTransaction('one', 5)];
                case 11:
                    _v = [_w.sent()];
                    return [4 /*yield*/, createTransaction('two', -5, {
                            transfer_id: existingTransfer.id,
                        })];
                case 12:
                    _s.apply(void 0, [_u.apply(_t, _v.concat([_w.sent()]))]).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
});
