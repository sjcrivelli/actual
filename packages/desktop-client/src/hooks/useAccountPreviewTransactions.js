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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountPreviewTransactions = useAccountPreviewTransactions;
var react_1 = require("react");
var util_1 = require("loot-core/shared/util");
var useAccounts_1 = require("./useAccounts");
var usePayees_1 = require("./usePayees");
var usePreviewTransactions_1 = require("./usePreviewTransactions");
var useSheetValue_1 = require("./useSheetValue");
var useSyncedPref_1 = require("./useSyncedPref");
var useTransactions_1 = require("./useTransactions");
var bindings = require("@desktop-client/spreadsheet/bindings");
/**
 * Preview transactions for a given account or all accounts if no `accountId` is provided.
 * This will invert the payees, accounts, and amounts accordingly depending on which account
 * the preview transactions are being viewed from.
 */
function useAccountPreviewTransactions(_a) {
    var accountId = _a.accountId;
    var accounts = (0, useAccounts_1.useAccounts)();
    var accountsById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(accounts); }, [accounts]);
    var payees = (0, usePayees_1.usePayees)();
    var payeesById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(payees); }, [payees]);
    var getPayeeByTransferAccount = (0, react_1.useCallback)(function (transferAccountId) {
        return payees.find(function (p) { return p.transfer_acct === transferAccountId; }) || null;
    }, [payees]);
    var getTransferAccountByPayee = (0, react_1.useCallback)(function (payeeId) {
        var _a;
        if (!payeeId) {
            return null;
        }
        var transferAccountId = (_a = payeesById[payeeId]) === null || _a === void 0 ? void 0 : _a.transfer_acct;
        if (!transferAccountId) {
            return null;
        }
        return accountsById[transferAccountId];
    }, [accountsById, payeesById]);
    var accountSchedulesFilter = (0, react_1.useCallback)(function (schedule) {
        var _a;
        return !accountId ||
            schedule._account === accountId ||
            ((_a = getTransferAccountByPayee(schedule._payee)) === null || _a === void 0 ? void 0 : _a.id) === accountId;
    }, [accountId, getTransferAccountByPayee]);
    var accountBalanceValue = (0, useSheetValue_1.useSheetValue)(accountId
        ? bindings.accountBalance(accountId)
        : bindings.allAccountBalance());
    var showBalances = (0, useSyncedPref_1.useSyncedPref)("show-balances-".concat(accountId))[0];
    var _b = (0, usePreviewTransactions_1.usePreviewTransactions)({
        filter: accountSchedulesFilter,
        options: {
            calculateRunningBalances: showBalances === 'true',
            startingBalance: accountBalanceValue !== null && accountBalanceValue !== void 0 ? accountBalanceValue : 0,
        },
    }), allPreviewTransactions = _b.previewTransactions, allRunningBalances = _b.runningBalances, isLoading = _b.isLoading, error = _b.error;
    return (0, react_1.useMemo)(function () {
        if (!accountId) {
            return {
                previewTransactions: allPreviewTransactions,
                runningBalances: allRunningBalances,
                isLoading: isLoading,
                error: error,
            };
        }
        var _a = inverseBasedOnAccount({
            accountId: accountId,
            transactions: allPreviewTransactions,
            runningBalances: allRunningBalances,
            startingBalance: accountBalanceValue !== null && accountBalanceValue !== void 0 ? accountBalanceValue : 0,
            getPayeeByTransferAccount: getPayeeByTransferAccount,
            getTransferAccountByPayee: getTransferAccountByPayee,
        }), previewTransactions = _a.transactions, previewRunningBalances = _a.runningBalances;
        var transactionIds = new Set(previewTransactions.map(function (t) { return t.id; }));
        var runningBalances = new Map(__spreadArray([], previewRunningBalances.entries(), true).filter(function (_a) {
            var id = _a[0];
            return transactionIds.has(id);
        }));
        return {
            isLoading: isLoading,
            previewTransactions: previewTransactions,
            runningBalances: runningBalances,
            error: error,
        };
    }, [
        accountId,
        allPreviewTransactions,
        accountBalanceValue,
        allRunningBalances,
        getPayeeByTransferAccount,
        getTransferAccountByPayee,
        isLoading,
        error,
    ]);
}
function inverseBasedOnAccount(_a) {
    var accountId = _a.accountId, transactions = _a.transactions, runningBalances = _a.runningBalances, startingBalance = _a.startingBalance, getPayeeByTransferAccount = _a.getPayeeByTransferAccount, getTransferAccountByPayee = _a.getTransferAccountByPayee;
    var mappedTransactions = transactions.map(function (transaction) {
        var _a, _b, _c;
        var inverse = transaction.account !== accountId;
        var subtransactions = (_a = transaction.subtransactions) === null || _a === void 0 ? void 0 : _a.map(function (st) {
            var _a, _b;
            return (__assign(__assign({}, st), { amount: inverse ? -st.amount : st.amount, payee: (inverse ? (_a = getPayeeByTransferAccount(st.account)) === null || _a === void 0 ? void 0 : _a.id : st.payee) || '', account: inverse
                    ? ((_b = getTransferAccountByPayee(st.payee)) === null || _b === void 0 ? void 0 : _b.id) || ''
                    : st.account }));
        });
        return __assign(__assign(__assign({ inversed: inverse }, transaction), { amount: inverse ? -transaction.amount : transaction.amount, payee: (inverse
                ? (_b = getPayeeByTransferAccount(transaction.account)) === null || _b === void 0 ? void 0 : _b.id
                : transaction.payee) || '', account: inverse
                ? ((_c = getTransferAccountByPayee(transaction.payee)) === null || _c === void 0 ? void 0 : _c.id) || ''
                : transaction.account }), (subtransactions && { subtransactions: subtransactions }));
    });
    // Recalculate running balances if any transaction was inversed.
    // This is necessary because the running balances are calculated based on the
    // original transaction amounts and accounts, and we need to adjust them
    // based on the inversed transactions.
    var anyInversed = mappedTransactions.some(function (t) { return t.inversed; });
    var mappedRunningBalances = anyInversed
        ? (0, useTransactions_1.calculateRunningBalancesBottomUp)(mappedTransactions, 'all', startingBalance !== null && startingBalance !== void 0 ? startingBalance : 0)
        : runningBalances;
    return {
        transactions: mappedTransactions,
        runningBalances: mappedRunningBalances,
    };
}
