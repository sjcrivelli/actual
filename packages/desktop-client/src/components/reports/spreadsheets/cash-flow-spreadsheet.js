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
exports.simpleCashFlow = simpleCashFlow;
exports.cashFlowByDate = cashFlowByDate;
var react_1 = require("react");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var d = require("date-fns");
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var util_1 = require("@desktop-client/components/reports/util");
function simpleCashFlow(startMonth, endMonth, conditions, conditionsOp) {
    var _this = this;
    if (conditions === void 0) { conditions = []; }
    if (conditionsOp === void 0) { conditionsOp = 'and'; }
    var start = monthUtils.firstDayOfMonth(startMonth);
    var end = monthUtils.lastDayOfMonth(endMonth);
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        function makeQuery() {
            var _a;
            return (0, query_1.q)('transactions')
                .filter((_a = {},
                _a[conditionsOpKey] = filters,
                _a))
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
        var filters, conditionsOpKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                        conditions: conditions.filter(function (cond) { return !cond.customName; }),
                    })];
                case 1:
                    filters = (_a.sent()).filters;
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    return [2 /*return*/, (0, util_1.runAll)([
                            makeQuery().filter({ amount: { $gt: 0 } }),
                            makeQuery().filter({ amount: { $lt: 0 } }),
                        ], function (data) {
                            setData({
                                graphData: {
                                    income: data[0],
                                    expense: data[1],
                                },
                            });
                        })];
            }
        });
    }); };
}
function cashFlowByDate(startMonth, endMonth, isConcise, conditions, conditionsOp, locale, format) {
    var _this = this;
    if (conditions === void 0) { conditions = []; }
    var start = monthUtils.firstDayOfMonth(startMonth);
    var end = monthUtils.lastDayOfMonth(endMonth);
    var fixedEnd = end > monthUtils.currentDay() ? monthUtils.currentDay() : end;
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        function makeQuery() {
            var _a;
            var query = (0, query_1.q)('transactions')
                .filter((_a = {},
                _a[conditionsOpKey] = filters,
                _a))
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
        var filters, conditionsOpKey;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                        conditions: conditions.filter(function (cond) { return !cond.customName; }),
                    })];
                case 1:
                    filters = (_b.sent()).filters;
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    return [2 /*return*/, (0, util_1.runAll)([
                            (0, query_1.q)('transactions')
                                .filter((_a = {},
                                _a[conditionsOpKey] = filters,
                                _a.date = { $transform: '$month', $lt: start },
                                _a['account.offbudget'] = false,
                                _a))
                                .calculate({ $sum: '$amount' }),
                            makeQuery().filter({ amount: { $gt: 0 } }),
                            makeQuery().filter({ amount: { $lt: 0 } }),
                        ], function (data) {
                            setData(recalculate(data, start, fixedEnd, isConcise, locale, format));
                        })];
            }
        });
    }); };
}
function recalculate(data, start, end, isConcise, locale, format) {
    var startingBalance = data[0], income = data[1], expense = data[2];
    var convIncome = income.map(function (trans) {
        return __assign(__assign({}, trans), { isTransfer: trans.isTransfer !== null });
    });
    var convExpense = expense.map(function (trans) {
        return __assign(__assign({}, trans), { isTransfer: trans.isTransfer !== null });
    });
    var dates = isConcise
        ? monthUtils.rangeInclusive(monthUtils.getMonth(start), monthUtils.getMonth(end))
        : monthUtils.dayRangeInclusive(start, end);
    var incomes = (0, util_1.indexCashFlow)(convIncome);
    var expenses = (0, util_1.indexCashFlow)(convExpense);
    var balance = startingBalance;
    var totalExpenses = 0;
    var totalIncome = 0;
    var totalTransfers = 0;
    var graphData = dates.reduce(function (res, date) {
        var income = 0;
        var expense = 0;
        var creditTransfers = 0;
        var debitTransfers = 0;
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
        var x = d.parseISO(date);
        var label = (<div>
          <div style={{ marginBottom: 10 }}>
            <strong>
              {d.format(x, isConcise ? 'MMMM yyyy' : 'MMMM d, yyyy', {
                locale: locale,
            })}
            </strong>
          </div>
          <div style={{ lineHeight: 1.5 }}>
            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Income:')} right={format(income, 'financial')}/>
            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Expenses:')} right={format(expense, 'financial')}/>
            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Change:')} right={<strong>{format(income + expense, 'financial')}</strong>}/>
            {creditTransfers + debitTransfers !== 0 && (<aligned_text_1.AlignedText left={(0, i18next_1.t)('Transfers:')} right={format(creditTransfers + debitTransfers, 'financial')}/>)}
            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Balance:')} right={format(balance, 'financial')}/>
          </div>
        </div>);
        res.income.push({ x: x, y: income });
        res.expenses.push({ x: x, y: expense });
        res.transfers.push({
            x: x,
            y: creditTransfers + debitTransfers,
        });
        res.balances.push({
            x: x,
            y: balance,
            premadeLabel: label,
            amount: balance,
        });
        return res;
    }, { expenses: [], income: [], transfers: [], balances: [] });
    var balances = graphData.balances;
    return {
        graphData: graphData,
        balance: balances[balances.length - 1].amount,
        totalExpenses: totalExpenses,
        totalIncome: totalIncome,
        totalTransfers: totalTransfers,
        totalChange: balances[balances.length - 1].amount - balances[0].amount,
    };
}
