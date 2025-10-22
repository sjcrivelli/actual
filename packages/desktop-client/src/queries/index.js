"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountFilter = accountFilter;
exports.transactions = transactions;
exports.transactionsSearch = transactionsSearch;
exports.uncategorizedTransactions = uncategorizedTransactions;
// @ts-strict-ignore
var date_fns_1 = require("date-fns");
var months_1 = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var util_1 = require("loot-core/shared/util");
function accountFilter(accountId, field) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (field === void 0) { field = 'account'; }
    if (accountId) {
        if (accountId === 'onbudget') {
            return {
                $and: [
                    (_a = {}, _a["".concat(field, ".offbudget")] = false, _a),
                    (_b = {}, _b["".concat(field, ".closed")] = false, _b),
                ],
            };
        }
        else if (accountId === 'offbudget') {
            return {
                $and: [
                    (_c = {}, _c["".concat(field, ".offbudget")] = true, _c),
                    (_d = {}, _d["".concat(field, ".closed")] = false, _d),
                ],
            };
        }
        else if (accountId === 'closed') {
            return _e = {}, _e["".concat(field, ".closed")] = true, _e;
        }
        else if (accountId === 'uncategorized') {
            return _f = {},
                _f["".concat(field, ".offbudget")] = false,
                _f.category = null,
                _f.is_parent = false,
                _f.$or = [
                    {
                        'payee.transfer_acct.offbudget': true,
                        'payee.transfer_acct': null,
                    },
                ],
                _f;
        }
        else {
            return _g = {}, _g[field] = accountId, _g;
        }
    }
    return null;
}
function transactions(accountId) {
    var query = (0, query_1.q)('transactions').options({ splits: 'grouped' });
    var filter = accountFilter(accountId);
    if (filter) {
        query = query.filter(filter);
    }
    return query;
}
function transactionsSearch(currentQuery, search, dateFormat) {
    var amount = (0, util_1.currencyToAmount)(search);
    // Support various date formats
    var parsedDate;
    if ((0, months_1.getDayMonthRegex)(dateFormat).test(search)) {
        parsedDate = (0, date_fns_1.parse)(search, (0, months_1.getDayMonthFormat)(dateFormat), new Date());
    }
    else if ((0, months_1.getShortYearRegex)(dateFormat).test(search)) {
        parsedDate = (0, date_fns_1.parse)(search, (0, months_1.getShortYearFormat)(dateFormat), new Date());
    }
    else {
        parsedDate = (0, date_fns_1.parse)(search, dateFormat, new Date());
    }
    return currentQuery.filter({
        $or: {
            'payee.name': { $like: "%".concat(search, "%") },
            'payee.transfer_acct.name': { $like: "%".concat(search, "%") },
            notes: { $like: "%".concat(search, "%") },
            'category.name': { $like: "%".concat(search, "%") },
            'account.name': { $like: "%".concat(search, "%") },
            $or: [
                (0, date_fns_1.isValid)(parsedDate) && { date: (0, months_1.dayFromDate)(parsedDate) },
                amount != null && {
                    amount: { $transform: '$abs', $eq: (0, util_1.amountToInteger)(amount) },
                },
                amount != null &&
                    Number.isInteger(amount) && {
                    amount: {
                        $transform: { $abs: { $idiv: ['$', 100] } },
                        $eq: amount,
                    },
                },
            ].filter(Boolean),
        },
    });
}
function uncategorizedTransactions() {
    return (0, query_1.q)('transactions').filter({
        'account.offbudget': false,
        category: null,
        $or: [
            {
                'payee.transfer_acct.offbudget': true,
                'payee.transfer_acct': null,
            },
        ],
    });
}
