"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormats = void 0;
exports.isDateFormat = isDateFormat;
exports.parseDate = parseDate;
exports.formatDate = formatDate;
exports.applyFieldMappings = applyFieldMappings;
exports.parseAmountFields = parseAmountFields;
exports.stripCsvImportTransaction = stripCsvImportTransaction;
var d = require("date-fns");
var months_1 = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
exports.dateFormats = [
    { format: 'yyyy mm dd', label: 'YYYY MM DD' },
    { format: 'yy mm dd', label: 'YY MM DD' },
    { format: 'mm dd yyyy', label: 'MM DD YYYY' },
    { format: 'mm dd yy', label: 'MM DD YY' },
    { format: 'dd mm yyyy', label: 'DD MM YYYY' },
    { format: 'dd mm yy', label: 'DD MM YY' },
];
function isDateFormat(format) {
    return exports.dateFormats.some(function (f) { return f.format === format; });
}
function parseDate(str, order) {
    if (typeof str !== 'string') {
        return null;
    }
    function pad(v) {
        return v && v.length === 1 ? '0' + v : v;
    }
    var dateGroups = function (a, b) { return function (str) {
        var parts = str
            .replace(/\bjan(\.|uary)?\b/i, '01')
            .replace(/\bfeb(\.|ruary)?\b/i, '02')
            .replace(/\bmar(\.|ch)?\b/i, '03')
            .replace(/\bapr(\.|il)?\b/i, '04')
            .replace(/\bmay\.?\b/i, '05')
            .replace(/\bjun(\.|e)?\b/i, '06')
            .replace(/\bjul(\.|y)?\b/i, '07')
            .replace(/\baug(\.|ust)?\b/i, '08')
            .replace(/\bsep(\.|tember)?\b/i, '09')
            .replace(/\boct(\.|ober)?\b/i, '10')
            .replace(/\bnov(\.|ember)?\b/i, '11')
            .replace(/\bdec(\.|ember)?\b/i, '12')
            .replace(/^[^\d]+/, '')
            .replace(/[^\d]+$/, '')
            .split(/[^\d]+/);
        if (parts.length >= 3) {
            return parts.slice(0, 3);
        }
        var digits = str.replace(/[^\d]/g, '');
        return [digits.slice(0, a), digits.slice(a, a + b), digits.slice(a + b)];
    }; };
    var yearFirst = dateGroups(4, 2);
    var twoDig = dateGroups(2, 2);
    var parts, year, month, day;
    switch (order) {
        case 'dd mm yyyy':
            parts = twoDig(str);
            year = parts[2];
            month = parts[1];
            day = parts[0];
            break;
        case 'dd mm yy':
            parts = twoDig(str);
            year = "20".concat(parts[2]);
            month = parts[1];
            day = parts[0];
            break;
        case 'yyyy mm dd':
            parts = yearFirst(str);
            year = parts[0];
            month = parts[1];
            day = parts[2];
            break;
        case 'yy mm dd':
            parts = twoDig(str);
            year = "20".concat(parts[0]);
            month = parts[1];
            day = parts[2];
            break;
        case 'mm dd yy':
            parts = twoDig(str);
            year = "20".concat(parts[2]);
            month = parts[0];
            day = parts[1];
            break;
        default:
        case 'mm dd yyyy':
            parts = twoDig(str);
            year = parts[2];
            month = parts[0];
            day = parts[1];
    }
    var parsed = "".concat(year, "-").concat(pad(month), "-").concat(pad(day));
    if (!d.isValid(d.parseISO(parsed))) {
        return null;
    }
    return parsed;
}
function formatDate(date, format) {
    if (!date) {
        return null;
    }
    try {
        return (0, months_1.format)(date, format);
    }
    catch (e) { }
    return null;
}
function applyFieldMappings(transaction, mappings) {
    var result = {};
    for (var _i = 0, _a = Object.entries(mappings); _i < _a.length; _i++) {
        var _b = _a[_i], originalField = _b[0], target = _b[1];
        var field = originalField === 'payee' ? 'payee_name' : originalField;
        result[field] = transaction[target || field];
    }
    // Keep preview fields on the mapped transactions
    result.trx_id = transaction.trx_id;
    result.existing = transaction.existing;
    result.ignored = transaction.ignored;
    result.selected = transaction.selected;
    result.selected_merge = transaction.selected_merge;
    result.tombstone = transaction.tombstone;
    return result;
}
function parseAmount(amount, mapper) {
    if (amount == null) {
        return null;
    }
    var parsed = typeof amount === 'string' ? (0, util_1.looselyParseAmount)(amount) : amount;
    if (parsed === null) {
        return null;
    }
    return mapper(parsed);
}
function parseAmountFields(trans, splitMode, inOutMode, outValue, flipAmount, multiplierAmount) {
    var multiplier = parseFloat(multiplierAmount) || 1.0;
    /** Keep track of the transaction amount as inflow and outflow.
     *
     * Inflow/outflow is taken from a positive/negative transaction amount
     * respectively, or the inflow/outflow fields if split mode is enabled.
     */
    var value = {
        outflow: 0,
        inflow: 0,
    };
    // Determine the base value of the transaction from the amount or inflow/outflow fields
    if (splitMode && !inOutMode) {
        // Split mode is a little weird; first we look for an outflow and
        // if that has a value, we never want to show a number in the
        // inflow. Same for `amount`; we choose outflow first and then inflow
        value.outflow = parseAmount(trans.outflow, function (n) { return -Math.abs(n); }) || 0;
        value.inflow = value.outflow
            ? 0
            : parseAmount(trans.inflow, function (n) { return Math.abs(n); }) || 0;
    }
    else {
        var amount = parseAmount(trans.amount, function (n) { return n; }) || 0;
        if (amount >= 0)
            value.inflow = amount;
        else
            value.outflow = amount;
    }
    // Apply in/out
    if (inOutMode) {
        // The 'In/Out' field of a transaction will tell us
        // whether the transaction value is inflow or outflow.
        var transactionValue = value.outflow || value.inflow;
        if (trans.inOut === outValue) {
            value.outflow = -Math.abs(transactionValue);
            value.inflow = 0;
        }
        else {
            value.inflow = Math.abs(transactionValue);
            value.outflow = 0;
        }
    }
    // Apply flip
    if (flipAmount) {
        var oldInflow = value.inflow;
        value.inflow = Math.abs(value.outflow);
        value.outflow = -Math.abs(oldInflow);
    }
    // Apply multiplier
    value.inflow *= multiplier;
    value.outflow *= multiplier;
    if (splitMode) {
        return {
            amount: value.outflow || value.inflow,
            outflow: value.outflow,
            inflow: value.inflow,
        };
    }
    else {
        return {
            amount: value.outflow || value.inflow,
            outflow: null,
            inflow: null,
        };
    }
}
function stripCsvImportTransaction(transaction) {
    var existing = transaction.existing, ignored = transaction.ignored, selected = transaction.selected, selected_merge = transaction.selected_merge, trx_id = transaction.trx_id, tombstone = transaction.tombstone, trans = __rest(transaction, ["existing", "ignored", "selected", "selected_merge", "trx_id", "tombstone"]);
    return trans;
}
