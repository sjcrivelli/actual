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
exports.xmlCAMT2json = xmlCAMT2json;
// @ts-strict-ignore
var xml2js_1 = require("xml2js");
function findKeys(obj, key) {
    var result = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (i === key) {
            if (Array.isArray(obj[i])) {
                result = result.concat(obj[i]);
            }
            else {
                result.push(obj[i]);
            }
        }
        if (typeof obj[i] === 'object') {
            result = result.concat(findKeys(obj[i], key));
        }
    }
    return result;
}
function getPayeeNameFromTxDtls(TxDtls, isDebit) {
    if (TxDtls === null || TxDtls === void 0 ? void 0 : TxDtls.RltdPties) {
        var key = isDebit ? TxDtls.RltdPties.Cdtr : TxDtls.RltdPties.Dbtr;
        var Nm = findKeys(key, 'Nm');
        return Nm.length > 0 ? Nm[0] : null;
    }
    return null;
}
function getNotesFromTxDtls(TxDtls) {
    if (TxDtls === null || TxDtls === void 0 ? void 0 : TxDtls.RmtInf) {
        var Ustrd = TxDtls.RmtInf.Ustrd;
        return Array.isArray(Ustrd) ? Ustrd.join(' ') : Ustrd;
    }
    return null;
}
function convertToNumberOrNull(value) {
    var number = Number(value);
    return isNaN(number) ? null : number;
}
function getDtOrDtTm(Date) {
    if (!Date) {
        return null;
    }
    if ('DtTm' in Date) {
        return Date.DtTm.slice(0, 10);
    }
    return Date === null || Date === void 0 ? void 0 : Date.Dt;
}
function xmlCAMT2json(content) {
    return __awaiter(this, void 0, void 0, function () {
        var data, entries, transactions, _loop_1, _i, entries_1, entry;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, xml2js_1.parseStringPromise)(content, { explicitArray: false })];
                case 1:
                    data = _e.sent();
                    entries = findKeys(data, 'Ntry');
                    transactions = [];
                    _loop_1 = function (entry) {
                        /*
                          For (camt.052/054) could filter on entry.Sts= BOOK or PDNG, currently importing all entries
                        */
                        var id = entry.AcctSvcrRef;
                        var amount = convertToNumberOrNull((_a = entry.Amt) === null || _a === void 0 ? void 0 : _a._);
                        var isDebit = entry.CdtDbtInd === 'DBIT';
                        var date = getDtOrDtTm(entry.ValDt) || getDtOrDtTm(entry.BookgDt);
                        if (Array.isArray((_b = entry.NtryDtls) === null || _b === void 0 ? void 0 : _b.TxDtls)) {
                            // we add subtransactions as normal transactions as importing split with subtransactions is not supported
                            // amount, and payee_name are not processed correctly for subtransaction.
                            entry.NtryDtls.TxDtls.forEach(function (TxDtls) {
                                var subPayee = getPayeeNameFromTxDtls(TxDtls, isDebit);
                                var subNotes = getNotesFromTxDtls(TxDtls);
                                var Amt = findKeys(TxDtls, 'Amt');
                                var amount = Amt.length > 0 ? convertToNumberOrNull(Amt[0]._) : null;
                                transactions.push({
                                    amount: isDebit ? -amount : amount,
                                    date: date,
                                    payee_name: subPayee,
                                    imported_payee: subPayee,
                                    notes: subNotes,
                                });
                            });
                        }
                        else {
                            var payee_name = void 0;
                            var notes = void 0;
                            payee_name = getPayeeNameFromTxDtls((_c = entry.NtryDtls) === null || _c === void 0 ? void 0 : _c.TxDtls, isDebit);
                            if (!payee_name && entry.AddtlNtryInf) {
                                payee_name = entry.AddtlNtryInf;
                            }
                            notes = getNotesFromTxDtls((_d = entry.NtryDtls) === null || _d === void 0 ? void 0 : _d.TxDtls);
                            if (!notes && entry.AddtlNtryInf && entry.AddtlNtryInf !== payee_name) {
                                notes = entry.AddtlNtryInf;
                            }
                            if (!payee_name && !notes && entry.NtryRef) {
                                notes = entry.NtryRef;
                            }
                            if (payee_name && notes && payee_name.includes(notes)) {
                                notes = null;
                            }
                            var transaction = {
                                amount: isDebit ? -amount : amount,
                                date: date,
                                payee_name: payee_name,
                                imported_payee: payee_name,
                                notes: notes,
                            };
                            if (id) {
                                transaction.imported_id = id;
                            }
                            transactions.push(transaction);
                        }
                    };
                    for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        entry = entries_1[_i];
                        _loop_1(entry);
                    }
                    return [2 /*return*/, transactions.filter(function (trans) { return trans.date != null && trans.amount != null; })];
            }
        });
    });
}
