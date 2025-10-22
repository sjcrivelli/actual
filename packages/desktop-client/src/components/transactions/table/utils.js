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
exports.serializeTransaction = serializeTransaction;
exports.deserializeTransaction = deserializeTransaction;
exports.isLastChild = isLastChild;
exports.selectAscDesc = selectAscDesc;
exports.getDisplayValue = getDisplayValue;
exports.makeTemporaryTransactions = makeTemporaryTransactions;
var date_fns_1 = require("date-fns");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var months_1 = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
function serializeTransaction(transaction, showZeroInDeposit) {
    var amount = transaction.amount, originalDate = transaction.date;
    var debit = amount < 0 ? -amount : null;
    var credit = amount > 0 ? amount : null;
    if (amount === 0) {
        if (showZeroInDeposit) {
            credit = 0;
        }
        else {
            debit = 0;
        }
    }
    var date = originalDate;
    // Validate the date format
    if (!(0, date_fns_1.isValid)((0, date_fns_1.parseISO)(date))) {
        // Be a little forgiving if the date isn't valid. This at least
        // stops the UI from crashing, but this is a serious problem with
        // the data. This allows the user to go through and see empty
        // dates and manually fix them.
        console.error("Date \u2018".concat(date, "\u2019 is not valid."));
        // TODO: the fact that the date type is not nullable but we are setting it to null needs to be changed
        date = null;
    }
    // Convert with decimals here so the value doesn't lose decimals and formatter will show or hide them.
    return __assign(__assign({}, transaction), { date: date, debit: debit != null ? (0, util_1.integerToCurrencyWithDecimal)(debit) : '', credit: credit != null ? (0, util_1.integerToCurrencyWithDecimal)(credit) : '' });
}
function deserializeTransaction(transaction, originalTransaction) {
    var debit = transaction.debit, credit = transaction.credit, originalDate = transaction.date, realTransaction = __rest(transaction, ["debit", "credit", "date"]);
    var amount;
    if (debit !== '') {
        var parsed = (0, arithmetic_1.evalArithmetic)(debit, null);
        amount = parsed != null ? -parsed : null;
    }
    else {
        amount = (0, arithmetic_1.evalArithmetic)(credit, null);
    }
    amount =
        amount != null ? (0, util_1.amountToInteger)(amount) : originalTransaction.amount;
    var date = originalDate;
    if (date == null) {
        date = originalTransaction.date || (0, months_1.currentDay)();
    }
    return __assign(__assign({}, realTransaction), { date: date, amount: amount });
}
function isLastChild(transactions, index) {
    var trans = transactions[index];
    return (trans &&
        trans.is_child &&
        (transactions[index + 1] == null ||
            transactions[index + 1].parent_id !== trans.parent_id));
}
function selectAscDesc(field, ascDesc, clicked, defaultAscDesc) {
    if (defaultAscDesc === void 0) { defaultAscDesc = 'asc'; }
    return field === clicked
        ? ascDesc === 'asc'
            ? 'desc'
            : 'asc'
        : defaultAscDesc;
}
function getDisplayValue(obj, name) {
    return obj ? obj[name] : '';
}
function makeTemporaryTransactions(currentAccountId, currentCategoryId, lastDate) {
    return [
        {
            id: 'temp',
            date: lastDate || (0, months_1.currentDay)(),
            // TODO: consider making this default to an empty string
            account: (currentAccountId || null),
            category: currentCategoryId || undefined,
            cleared: false,
            // TODO: either make this nullable or find a way to make this not null
            amount: null,
        },
    ];
}
