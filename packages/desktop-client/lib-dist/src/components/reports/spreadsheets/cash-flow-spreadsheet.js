import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlignedText } from '@actual-app/components/aligned-text';
import * as d from 'date-fns';
import { t } from 'i18next';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import { runAll, indexCashFlow } from '@desktop-client/components/reports/util';
export function simpleCashFlow(startMonth, endMonth, conditions = [], conditionsOp = 'and') {
    const start = monthUtils.firstDayOfMonth(startMonth);
    const end = monthUtils.lastDayOfMonth(endMonth);
    return async (spreadsheet, setData) => {
        const { filters } = await send('make-filters-from-conditions', {
            conditions: conditions.filter(cond => !cond.customName),
        });
        const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
        function makeQuery() {
            return q('transactions')
                .filter({
                [conditionsOpKey]: filters,
            })
                .filter({
                $and: [
                    { date: { $gte: start } },
                    {
                        date: {
                            $lte: end > monthUtils.currentDay() ? monthUtils.currentDay() : end,
                        },
                    },
                ],
                'account.offbudget': false,
                'payee.transfer_acct': null,
            })
                .calculate({ $sum: '$amount' });
        }
        return runAll([
            makeQuery().filter({ amount: { $gt: 0 } }),
            makeQuery().filter({ amount: { $lt: 0 } }),
        ], data => {
            setData({
                graphData: {
                    income: data[0],
                    expense: data[1],
                },
            });
        });
    };
}
export function cashFlowByDate(startMonth, endMonth, isConcise, conditions = [], conditionsOp, locale, format) {
    const start = monthUtils.firstDayOfMonth(startMonth);
    const end = monthUtils.lastDayOfMonth(endMonth);
    const fixedEnd = end > monthUtils.currentDay() ? monthUtils.currentDay() : end;
    return async (spreadsheet, setData) => {
        const { filters } = await send('make-filters-from-conditions', {
            conditions: conditions.filter(cond => !cond.customName),
        });
        const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
        function makeQuery() {
            const query = q('transactions')
                .filter({
                [conditionsOpKey]: filters,
            })
                .filter({
                $and: [
                    { date: { $transform: '$month', $gte: start } },
                    { date: { $transform: '$month', $lte: fixedEnd } },
                ],
                'account.offbudget': false,
            });
            if (isConcise) {
                return query
                    .groupBy([{ $month: '$date' }, 'payee.transfer_acct'])
                    .select([
                    { date: { $month: '$date' } },
                    { isTransfer: 'payee.transfer_acct' },
                    { amount: { $sum: '$amount' } },
                ]);
            }
            return query
                .groupBy(['date', 'payee.transfer_acct'])
                .select([
                'date',
                { isTransfer: 'payee.transfer_acct' },
                { amount: { $sum: '$amount' } },
            ]);
        }
        return runAll([
            q('transactions')
                .filter({
                [conditionsOpKey]: filters,
                date: { $transform: '$month', $lt: start },
                'account.offbudget': false,
            })
                .calculate({ $sum: '$amount' }),
            makeQuery().filter({ amount: { $gt: 0 } }),
            makeQuery().filter({ amount: { $lt: 0 } }),
        ], data => {
            setData(recalculate(data, start, fixedEnd, isConcise, locale, format));
        });
    };
}
function recalculate(data, start, end, isConcise, locale, format) {
    const [startingBalance, income, expense] = data;
    const convIncome = income.map(trans => {
        return { ...trans, isTransfer: trans.isTransfer !== null };
    });
    const convExpense = expense.map(trans => {
        return { ...trans, isTransfer: trans.isTransfer !== null };
    });
    const dates = isConcise
        ? monthUtils.rangeInclusive(monthUtils.getMonth(start), monthUtils.getMonth(end))
        : monthUtils.dayRangeInclusive(start, end);
    const incomes = indexCashFlow(convIncome);
    const expenses = indexCashFlow(convExpense);
    let balance = startingBalance;
    let totalExpenses = 0;
    let totalIncome = 0;
    let totalTransfers = 0;
    const graphData = dates.reduce((res, date) => {
        let income = 0;
        let expense = 0;
        let creditTransfers = 0;
        let debitTransfers = 0;
        if (incomes[date]) {
            income = !incomes[date].false ? 0 : incomes[date].false;
            creditTransfers = !incomes[date].true ? 0 : incomes[date].true;
        }
        if (expenses[date]) {
            expense = !expenses[date].false ? 0 : expenses[date].false;
            debitTransfers = !expenses[date].true ? 0 : expenses[date].true;
        }
        totalExpenses += expense;
        totalIncome += income;
        balance += income + expense + creditTransfers + debitTransfers;
        totalTransfers += creditTransfers + debitTransfers;
        const x = d.parseISO(date);
        const label = (_jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: d.format(x, isConcise ? 'MMMM yyyy' : 'MMMM d, yyyy', {
                            locale,
                        }) }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [_jsx(AlignedText, { left: t('Income:'), right: format(income, 'financial') }), _jsx(AlignedText, { left: t('Expenses:'), right: format(expense, 'financial') }), _jsx(AlignedText, { left: t('Change:'), right: _jsx("strong", { children: format(income + expense, 'financial') }) }), creditTransfers + debitTransfers !== 0 && (_jsx(AlignedText, { left: t('Transfers:'), right: format(creditTransfers + debitTransfers, 'financial') })), _jsx(AlignedText, { left: t('Balance:'), right: format(balance, 'financial') })] })] }));
        res.income.push({ x, y: income });
        res.expenses.push({ x, y: expense });
        res.transfers.push({
            x,
            y: creditTransfers + debitTransfers,
        });
        res.balances.push({
            x,
            y: balance,
            premadeLabel: label,
            amount: balance,
        });
        return res;
    }, { expenses: [], income: [], transfers: [], balances: [] });
    const { balances } = graphData;
    return {
        graphData,
        balance: balances[balances.length - 1].amount,
        totalExpenses,
        totalIncome,
        totalTransfers,
        totalChange: balances[balances.length - 1].amount - balances[0].amount,
    };
}
