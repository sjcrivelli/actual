import { q } from 'loot-core/shared/query';
import { parametrizedField, } from '.';
import { uncategorizedTransactions } from '@desktop-client/queries';
const accountParametrizedField = parametrizedField();
const categoryParametrizedField = parametrizedField();
const envelopeParametrizedField = parametrizedField();
const trackingParametrizedField = parametrizedField();
export function accountBalance(accountId) {
    return {
        name: accountParametrizedField('balance')(accountId),
        query: q('transactions')
            .filter({ account: accountId })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
export function accountBalanceCleared(accountId) {
    return {
        name: accountParametrizedField('balanceCleared')(accountId),
        query: q('transactions')
            .filter({ account: accountId, cleared: true })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
export function accountBalanceUncleared(accountId) {
    return {
        name: accountParametrizedField('balanceUncleared')(accountId),
        query: q('transactions')
            .filter({ account: accountId, cleared: false })
            .options({ splits: 'none' })
            .calculate({ $sum: '$amount' }),
    };
}
export function allAccountBalance() {
    return {
        query: q('transactions')
            .filter({ 'account.closed': false })
            .calculate({ $sum: '$amount' }),
        name: 'accounts-balance',
    };
}
export function onBudgetAccountBalance() {
    return {
        name: `onbudget-accounts-balance`,
        query: q('transactions')
            .filter({ 'account.offbudget': false, 'account.closed': false })
            .calculate({ $sum: '$amount' }),
    };
}
export function offBudgetAccountBalance() {
    return {
        name: `offbudget-accounts-balance`,
        query: q('transactions')
            .filter({ 'account.offbudget': true, 'account.closed': false })
            .calculate({ $sum: '$amount' }),
    };
}
export function closedAccountBalance() {
    return {
        name: `closed-accounts-balance`,
        query: q('transactions')
            .filter({ 'account.closed': true })
            .calculate({ $sum: '$amount' }),
    };
}
export function categoryBalance(categoryId, month) {
    return {
        name: categoryParametrizedField('balance')(categoryId),
        query: q('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
export function categoryBalanceCleared(categoryId, month) {
    return {
        name: categoryParametrizedField('balanceCleared')(categoryId),
        query: q('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
            cleared: true,
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
export function categoryBalanceUncleared(categoryId, month) {
    return {
        name: categoryParametrizedField('balanceUncleared')(categoryId),
        query: q('transactions')
            .filter({
            category: categoryId,
            date: { $transform: '$month', $eq: month },
            cleared: false,
        })
            .options({ splits: 'inline' })
            .calculate({ $sum: '$amount' }),
    };
}
export function uncategorizedBalance() {
    return {
        name: 'uncategorized-balance',
        query: uncategorizedTransactions().calculate({ $sum: '$amount' }),
    };
}
export function uncategorizedCount() {
    return {
        name: 'uncategorized-amount',
        query: uncategorizedTransactions().calculate({ $count: '$id' }),
    };
}
export const envelopeBudget = {
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
export const trackingBudget = {
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
