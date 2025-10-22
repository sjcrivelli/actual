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
exports.useDisplayPayee = useDisplayPayee;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var query_1 = require("loot-core/shared/query");
var useAccounts_1 = require("./useAccounts");
var usePayees_1 = require("./usePayees");
var useTransactions_1 = require("./useTransactions");
function useDisplayPayee(_a) {
    var transaction = _a.transaction;
    var t = (0, react_i18next_1.useTranslation)().t;
    var subtransactionsQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('transactions').filter({ parent_id: transaction === null || transaction === void 0 ? void 0 : transaction.id }).select('*'); }, [transaction === null || transaction === void 0 ? void 0 : transaction.id]);
    var _b = (0, useTransactions_1.useTransactions)({
        query: subtransactionsQuery,
    }).transactions, subtransactions = _b === void 0 ? [] : _b;
    var accounts = (0, useAccounts_1.useAccounts)();
    var payeesById = (0, usePayees_1.usePayeesById)();
    var payee = payeesById[(transaction === null || transaction === void 0 ? void 0 : transaction.payee) || ''];
    return (0, react_1.useMemo)(function () {
        if (subtransactions.length === 0) {
            return getPrettyPayee({
                t: t,
                transaction: transaction,
                payee: payee,
                transferAccount: accounts.find(function (a) { var _a; return a.id === ((_a = payeesById[(transaction === null || transaction === void 0 ? void 0 : transaction.payee) || '']) === null || _a === void 0 ? void 0 : _a.transfer_acct); }),
            });
        }
        var _a = (subtransactions === null || subtransactions === void 0 ? void 0 : subtransactions.reduce(function (_a, sub) {
            var counts = _a.counts, result = __rest(_a, ["counts"]);
            if (sub.payee) {
                counts[sub.payee] = (counts[sub.payee] || 0) + 1;
                if (counts[sub.payee] > result.maxCount) {
                    return {
                        counts: counts,
                        maxCount: counts[sub.payee],
                        mostCommonPayeeTransaction: sub,
                    };
                }
            }
            return __assign({ counts: counts }, result);
        }, { counts: {}, maxCount: 0, mostCommonPayeeTransaction: null })) || {}, counts = _a.counts, mostCommonPayeeTransaction = _a.mostCommonPayeeTransaction;
        if (!mostCommonPayeeTransaction) {
            return t('Split (no payee)');
        }
        var mostCommonPayee = payeesById[mostCommonPayeeTransaction.payee || ''];
        if (!mostCommonPayee) {
            return t('Split (no payee)');
        }
        var numDistinctPayees = Object.keys(counts).length;
        return getPrettyPayee({
            t: t,
            transaction: mostCommonPayeeTransaction,
            payee: mostCommonPayee,
            transferAccount: accounts.find(function (a) {
                var _a;
                return a.id ===
                    ((_a = payeesById[mostCommonPayeeTransaction.payee || '']) === null || _a === void 0 ? void 0 : _a.transfer_acct);
            }),
            numHiddenPayees: numDistinctPayees - 1,
        });
    }, [subtransactions, payeesById, accounts, transaction, payee, t]);
}
function getPrettyPayee(_a) {
    var t = _a.t, transaction = _a.transaction, payee = _a.payee, transferAccount = _a.transferAccount, _b = _a.numHiddenPayees, numHiddenPayees = _b === void 0 ? 0 : _b;
    if (!transaction) {
        return '';
    }
    var formatPayeeName = function (payeeName) {
        return numHiddenPayees > 0
            ? "".concat(payeeName, " ").concat(t('(+{{numHiddenPayees}} more)', {
                numHiddenPayees: numHiddenPayees,
            }))
            : payeeName;
    };
    var payeeId = transaction.payee;
    if (transferAccount) {
        return formatPayeeName(transferAccount.name);
    }
    else if (payee) {
        return formatPayeeName(payee.name);
    }
    else if (payeeId && payeeId.startsWith('new:')) {
        return formatPayeeName(payeeId.slice('new:'.length));
    }
    return '';
}
