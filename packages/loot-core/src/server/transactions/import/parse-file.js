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
exports.parseFile = parseFile;
// @ts-strict-ignore
var sync_1 = require("csv-parse/sync");
var fs = require("../../../platform/server/fs");
var log_1 = require("../../../platform/server/log");
var util_1 = require("../../../shared/util");
var ofx2json_1 = require("./ofx2json");
var qif2json_1 = require("./qif2json");
var xmlcamt2json_1 = require("./xmlcamt2json");
/**
 * Parse OFX amount strings to numbers.
 * Handles various OFX amount formats including currency symbols, parentheses, and multiple decimal places.
 * Returns null for invalid amounts instead of NaN.
 */
function parseOfxAmount(amount) {
    if (!amount || typeof amount !== 'string') {
        return null;
    }
    // Handle parentheses for negative amounts (e.g., "(30.00)" -> "-30.00")
    var cleaned = amount.trim();
    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
        cleaned = '-' + cleaned.slice(1, -1);
    }
    // Remove currency symbols and other non-numeric characters except decimal point and minus sign
    cleaned = cleaned.replace(/[^\d.-]/g, '');
    // Handle multiple decimal points by keeping only the first one
    var decimalIndex = cleaned.indexOf('.');
    if (decimalIndex !== -1) {
        var beforeDecimal = cleaned.slice(0, decimalIndex);
        var afterDecimal = cleaned.slice(decimalIndex + 1).replace(/\./g, '');
        cleaned = beforeDecimal + '.' + afterDecimal;
    }
    // Ensure we have a valid number format
    if (!cleaned || cleaned === '-' || cleaned === '.') {
        return null;
    }
    var parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
}
function parseFile(filepath_1) {
    return __awaiter(this, arguments, void 0, function (filepath, options) {
        var errors, m, ext;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            errors = Array();
            m = filepath.match(/\.[^.]*$/);
            if (m) {
                ext = m[0];
                switch (ext.toLowerCase()) {
                    case '.qif':
                        return [2 /*return*/, parseQIF(filepath, options)];
                    case '.csv':
                    case '.tsv':
                        return [2 /*return*/, parseCSV(filepath, options)];
                    case '.ofx':
                    case '.qfx':
                        return [2 /*return*/, parseOFX(filepath, options)];
                    case '.xml':
                        return [2 /*return*/, parseCAMT(filepath, options)];
                    default:
                }
            }
            errors.push({
                message: 'Invalid file type',
                internal: '',
            });
            return [2 /*return*/, { errors: errors, transactions: [] }];
        });
    });
}
function parseCSV(filepath, options) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, contents, lines, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = Array();
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 1:
                    contents = _a.sent();
                    if (options.skipLines > 0) {
                        lines = contents.split(/\r?\n/);
                        contents = lines.slice(options.skipLines).join('\r\n');
                    }
                    try {
                        data = (0, sync_1.parse)(contents, {
                            columns: options === null || options === void 0 ? void 0 : options.hasHeaderRow,
                            bom: true,
                            delimiter: (options === null || options === void 0 ? void 0 : options.delimiter) || ',',
                            // eslint-disable-next-line actual/typography
                            quote: '"',
                            trim: true,
                            relax_column_count: true,
                            skip_empty_lines: true,
                        });
                    }
                    catch (err) {
                        errors.push({
                            message: 'Failed parsing: ' + err.message,
                            internal: err.message,
                        });
                        return [2 /*return*/, { errors: errors, transactions: [] }];
                    }
                    return [2 /*return*/, { errors: errors, transactions: data }];
            }
        });
    });
}
function parseQIF(filepath_1) {
    return __awaiter(this, arguments, void 0, function (filepath, options) {
        var errors, contents, data;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = Array();
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 1:
                    contents = _a.sent();
                    try {
                        data = (0, qif2json_1.qif2json)(contents);
                    }
                    catch (err) {
                        errors.push({
                            message: 'Failed parsing: doesn’t look like a valid QIF file.',
                            internal: err.stack,
                        });
                        return [2 /*return*/, { errors: errors, transactions: [] }];
                    }
                    return [2 /*return*/, {
                            errors: [],
                            transactions: data.transactions
                                .map(function (trans) { return ({
                                amount: trans.amount != null ? (0, util_1.looselyParseAmount)(trans.amount) : null,
                                date: trans.date,
                                payee_name: trans.payee,
                                imported_payee: trans.payee,
                                notes: options.importNotes ? trans.memo || null : null,
                            }); })
                                .filter(function (trans) { return trans.date != null && trans.amount != null; }),
                        }];
            }
        });
    });
}
function parseOFX(filepath, options) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, contents, data, err_1, useMemoFallback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = Array();
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 1:
                    contents = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, ofx2json_1.ofx2json)(contents)];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    errors.push({
                        message: 'Failed importing file',
                        internal: err_1.stack,
                    });
                    return [2 /*return*/, { errors: errors }];
                case 5:
                    useMemoFallback = options.fallbackMissingPayeeToMemo;
                    return [2 /*return*/, {
                            errors: errors,
                            transactions: data.transactions.map(function (trans) {
                                var parsedAmount = parseOfxAmount(trans.amount);
                                if (parsedAmount === null) {
                                    errors.push({
                                        message: "Invalid amount format: ".concat(trans.amount),
                                        internal: "Failed to parse amount: ".concat(trans.amount),
                                    });
                                }
                                return {
                                    amount: parsedAmount || 0,
                                    imported_id: trans.fitId,
                                    date: trans.date,
                                    payee_name: trans.name || (useMemoFallback ? trans.memo : null),
                                    imported_payee: trans.name || (useMemoFallback ? trans.memo : null),
                                    notes: options.importNotes ? trans.memo || null : null, //memo used for payee
                                };
                            }),
                        }];
            }
        });
    });
}
function parseCAMT(filepath_1) {
    return __awaiter(this, arguments, void 0, function (filepath, options) {
        var errors, contents, data, err_2;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = Array();
                    return [4 /*yield*/, fs.readFile(filepath)];
                case 1:
                    contents = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, xmlcamt2json_1.xmlCAMT2json)(contents)];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    log_1.logger.error(err_2);
                    errors.push({
                        message: 'Failed importing file',
                        internal: err_2.stack,
                    });
                    return [2 /*return*/, { errors: errors }];
                case 5: return [2 /*return*/, {
                        errors: errors,
                        transactions: data.map(function (trans) { return (__assign(__assign({}, trans), { notes: options.importNotes ? trans.notes : null })); }),
                    }];
            }
        });
    });
}
