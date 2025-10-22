"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeQuery = makeQuery;
var query_1 = require("loot-core/shared/query");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
function makeQuery(name, startDate, endDate, interval, conditionsOpKey, filters) {
    var _a;
    var _b;
    var intervalGroup = interval === 'Monthly'
        ? { $month: '$date' }
        : interval === 'Yearly'
            ? { $year: '$date' }
            : { $day: '$date' };
    var intervalFilter = interval === 'Weekly'
        ? '$day'
        : '$' + ((_b = ReportOptions_1.ReportOptions.intervalMap.get(interval)) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || 'month';
    var query = (0, query_1.q)('transactions')
        //Apply filters and split by "Group By"
        .filter((_a = {},
        _a[conditionsOpKey] = filters,
        _a))
        //Apply month range filters
        .filter({
        $and: [
            { date: { $transform: intervalFilter, $gte: startDate } },
            { date: { $transform: intervalFilter, $lte: endDate } },
        ],
    })
        //Show assets or debts
        .filter(name === 'assets' ? { amount: { $gt: 0 } } : { amount: { $lt: 0 } });
    return query
        .groupBy([
        intervalGroup,
        { $id: '$account' },
        { $id: '$payee' },
        { $id: '$category' },
        { $id: '$payee.transfer_acct.id' },
    ])
        .select([
        { date: intervalGroup },
        { category: { $id: '$category.id' } },
        { categoryHidden: { $id: '$category.hidden' } },
        { categoryIncome: { $id: '$category.is_income' } },
        { categoryGroup: { $id: '$category.group.id' } },
        { categoryGroupHidden: { $id: '$category.group.hidden' } },
        { account: { $id: '$account.id' } },
        { accountOffBudget: { $id: '$account.offbudget' } },
        { payee: { $id: '$payee.id' } },
        { transferAccount: { $id: '$payee.transfer_acct.id' } },
        { amount: { $sum: '$amount' } },
    ]);
}
