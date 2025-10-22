"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingBudget = exports.envelopeBudget = void 0;
exports.accountBalance = accountBalance;
exports.accountBalanceCleared = accountBalanceCleared;
exports.accountBalanceUncleared = accountBalanceUncleared;
exports.allAccountBalance = allAccountBalance;
exports.onBudgetAccountBalance = onBudgetAccountBalance;
exports.offBudgetAccountBalance = offBudgetAccountBalance;
exports.closedAccountBalance = closedAccountBalance;
exports.categoryBalance = categoryBalance;
exports.categoryBalanceCleared = categoryBalanceCleared;
exports.categoryBalanceUncleared = categoryBalanceUncleared;
exports.uncategorizedBalance = uncategorizedBalance;
exports.uncategorizedCount = uncategorizedCount;
var query_1 = require("loot-core/shared/query");
var _1 = require(".");
var queries_1 = require("@desktop-client/queries");
var accountParametrizedField = (0, _1.parametrizedField)();
var categoryParametrizedField = (0, _1.parametrizedField)();
var envelopeParametrizedField = (0, _1.parametrizedField)();
var trackingParametrizedField = (0, _1.parametrizedField)();
function accountBalance(accountId) {
    return {
        name: accountParametrizedField('balance')(accountId),
        query: (0, query_1.q)('transactions')
            .filter({ account: accountId })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
function accountBalanceCleared(accountId) {
    return {
        name: accountParametrizedField('balanceCleared')(accountId),
        query: (0, query_1.q)('transactions')
            .filter({ account: accountId, cleared: true })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
function accountBalanceUncleared(accountId) {
    return {
        name: accountParametrizedField('balanceUncleared')(accountId),
        query: (0, query_1.q)('transactions')
            .filter({ account: accountId, cleared: false })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
function allAccountBalance() {
    return {
        query: (0, query_1.q)('transactions')
            .filter({ 'account.closed': false })
            .calculate({ $sum: '$amount' }),
        name: 'accounts-balance',
    };
}
function onBudgetAccountBalance() {
    return {
        name: "onbudget-accounts-balance",
        query: (0, query_1.q)('transactions')
            .filter({ 'account.offbudget': false, 'account.closed': false })
            .calculate({ $sum: '$amount' }),
    };
}
function offBudgetAccountBalance() {
    return {
        name: "offbudget-accounts-balance",
        query: (0, query_1.q)('transactions')
            .filter({ 'account.offbudget': true, 'account.closed': false })
            .calculate({ $sum: '$amount' }),
    };
}
function closedAccountBalance() {
    return {
        name: "closed-accounts-balance",
        query: (0, query_1.q)('transactions')
            .filter({ 'account.closed': true })
            .calculate({ $sum: '$amount' }),
    };
}
function categoryBalance(categoryId, month) {
    return {
        name: categoryParametrizedField('balance')(categoryId),
        query: (0, query_1.q)('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
function categoryBalanceCleared(categoryId, month) {
    return {
        name: categoryParametrizedField('balanceCleared')(categoryId),
        query: (0, query_1.q)('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
            cleared: true,
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
function categoryBalanceUncleared(categoryId, month) {
    return {
        name: categoryParametrizedField('balanceUncleared')(categoryId),
        query: (0, query_1.q)('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
            cleared: false,
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
function uncategorizedBalance() {
    return {
        name: 'uncategorized-balance',
        query: (0, queries_1.uncategorizedTransactions)().calculate({ $sum: '$amount' }),
    };
}
function uncategorizedCount() {
    return {
        name: 'uncategorized-amount',
        query: (0, queries_1.uncategorizedTransactions)().calculate({ $count: '$id' }),
    };
}
exports.envelopeBudget = {
    incomeAvailable: 'available-funds',
    lastMonthOverspent: 'last-month-overspent',
    forNextMonth: 'buffered-selected',
    totalBudgeted: 'total-budgeted',
    toBudget: 'to-budget',
    fromLastMonth: 'from-last-month',
    manualBuffered: 'buffered',
    autoBuffered: 'buffered-auto',
    totalIncome: 'total-income',
    totalSpent: 'total-spent',
    totalBalance: 'total-leftover',
    groupSumAmount: envelopeParametrizedField('group-sum-amount'),
    groupIncomeReceived: 'total-income',
    groupBudgeted: envelopeParametrizedField('group-budget'),
    groupBalance: envelopeParametrizedField('group-leftover'),
    catBudgeted: envelopeParametrizedField('budget'),
    catSumAmount: envelopeParametrizedField('sum-amount'),
    catBalance: envelopeParametrizedField('leftover'),
    catCarryover: envelopeParametrizedField('carryover'),
    catGoal: envelopeParametrizedField('goal'),
    catLongGoal: envelopeParametrizedField('long-goal'),
};
exports.trackingBudget = {
    totalBudgetedExpense: 'total-budgeted',
    totalBudgetedIncome: 'total-budget-income',
    totalBudgetedSaved: 'total-saved',
    totalIncome: 'total-income',
    totalSpent: 'total-spent',
    totalSaved: 'real-saved',
    totalLeftover: 'total-leftover',
    groupSumAmount: trackingParametrizedField('group-sum-amount'),
    groupIncomeReceived: 'total-income',
    groupBudgeted: trackingParametrizedField('group-budget'),
    groupBalance: trackingParametrizedField('group-leftover'),
    catBudgeted: trackingParametrizedField('budget'),
    catSumAmount: trackingParametrizedField('sum-amount'),
    catBalance: trackingParametrizedField('leftover'),
    catCarryover: trackingParametrizedField('carryover'),
    catGoal: trackingParametrizedField('goal'),
    catLongGoal: trackingParametrizedField('long-goal'),
};
