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
exports.BalanceHistoryGraph = BalanceHistoryGraph;
var react_1 = require("react");
var react_virtualized_auto_sizer_1 = require("react-virtualized-auto-sizer");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var recharts_1 = require("recharts");
var monthUtils = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var query = require("@desktop-client/queries");
var liveQuery_1 = require("@desktop-client/queries/liveQuery");
var LABEL_WIDTH = 70;
function BalanceHistoryGraph(_a) {
    var accountId = _a.accountId, style = _a.style, ref = _a.ref;
    var locale = (0, useLocale_1.useLocale)();
    var _b = (0, react_1.useState)([]), balanceData = _b[0], setBalanceData = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), hoveredValue = _d[0], setHoveredValue = _d[1];
    var _e = (0, react_1.useState)(null), startingBalance = _e[0], setStartingBalance = _e[1];
    var _f = (0, react_1.useState)(null), monthlyTotals = _f[0], setMonthlyTotals = _f[1];
    var percentageChange = (0, react_1.useMemo)(function () {
        if (balanceData.length < 2)
            return 0;
        var firstBalance = balanceData[0].balance;
        var lastBalance = balanceData[balanceData.length - 1].balance;
        if (firstBalance === 0)
            return 0;
        return ((lastBalance - firstBalance) / Math.abs(firstBalance)) * 100;
    }, [balanceData]);
    var color = (0, react_1.useMemo)(function () { return (percentageChange >= 0 ? theme_1.theme.noticeTextLight : theme_1.theme.errorText); }, [percentageChange]);
    (0, react_1.useEffect)(function () {
        // Reset state when accountId changes
        setStartingBalance(null);
        setMonthlyTotals(null);
        setLoading(true);
        var endDate = new Date();
        var startDate = (0, date_fns_1.subMonths)(endDate, 12);
        var startingBalanceQuery = query
            .transactions(accountId)
            .filter({
            date: { $lt: monthUtils.firstDayOfMonth(startDate) },
        })
            .calculate({ $sum: '$amount' });
        var monthlyTotalsQuery = query
            .transactions(accountId)
            .filter({
            $and: [
                { date: { $gte: monthUtils.firstDayOfMonth(startDate) } },
                { date: { $lte: monthUtils.lastDayOfMonth(endDate) } },
            ],
        })
            .groupBy({ $month: '$date' })
            .select([{ date: { $month: '$date' } }, { amount: { $sum: '$amount' } }]);
        var startingBalanceLive = (0, liveQuery_1.liveQuery)(startingBalanceQuery, {
            onData: function (data) {
                setStartingBalance(data[0] || 0);
            },
            onError: function (error) {
                console.error('Error fetching starting balance:', error);
                setLoading(false);
            },
        });
        var monthlyTotalsLive = (0, liveQuery_1.liveQuery)(monthlyTotalsQuery, {
            onData: function (data) {
                setMonthlyTotals(data.map(function (d) { return ({
                    date: d.date,
                    balance: d.amount,
                }); }));
            },
            onError: function (error) {
                console.error('Error fetching monthly totals:', error);
                setLoading(false);
            },
        });
        return function () {
            startingBalanceLive === null || startingBalanceLive === void 0 ? void 0 : startingBalanceLive.unsubscribe();
            monthlyTotalsLive === null || monthlyTotalsLive === void 0 ? void 0 : monthlyTotalsLive.unsubscribe();
        };
    }, [accountId, locale]);
    // Process data when both startingBalance and monthlyTotals are available
    (0, react_1.useEffect)(function () {
        if (startingBalance !== null && monthlyTotals !== null) {
            var endDate = new Date();
            var startDate = (0, date_fns_1.subMonths)(endDate, 12);
            var months_1 = (0, date_fns_1.eachMonthOfInterval)({
                start: startDate,
                end: endDate,
            }).map(function (m) { return (0, date_fns_1.format)(m, 'yyyy-MM'); });
            function processData(startingBalanceValue, monthlyTotalsValue) {
                var currentBalance = startingBalanceValue;
                var totals = __spreadArray([], monthlyTotalsValue, true);
                totals.reverse().forEach(function (month) {
                    currentBalance = currentBalance + month.balance;
                    month.balance = currentBalance;
                });
                // if the account doesn't have recent transactions
                // then the empty months will be missing from our data
                // so add in entries for those here
                if (totals.length === 0) {
                    //handle case of no transactions in the last year
                    months_1.forEach(function (expectedMonth) {
                        return totals.push({
                            date: expectedMonth,
                            balance: startingBalanceValue,
                        });
                    });
                }
                else if (totals.length < months_1.length) {
                    // iterate through each array together and add in missing data
                    var totalsIndex_1 = 0;
                    var mostRecent_1 = startingBalanceValue;
                    months_1.forEach(function (expectedMonth) {
                        if (totalsIndex_1 > totals.length - 1) {
                            // fill in the data at the end of the window
                            totals.push({
                                date: expectedMonth,
                                balance: mostRecent_1,
                            });
                        }
                        else if (totals[totalsIndex_1].date === expectedMonth) {
                            // a matched month
                            mostRecent_1 = totals[totalsIndex_1].balance;
                            totalsIndex_1 += 1;
                        }
                        else {
                            // a missing month in the middle
                            totals.push({
                                date: expectedMonth,
                                balance: mostRecent_1,
                            });
                        }
                    });
                }
                var balances = totals
                    .sort(function (a, b) { return monthUtils.differenceInCalendarMonths(a.date, b.date); })
                    .map(function (t) {
                    return {
                        balance: t.balance,
                        date: monthUtils.format(t.date, 'MMM yyyy', locale),
                    };
                });
                setBalanceData(balances);
                setHoveredValue(balances[balances.length - 1]);
                setLoading(false);
            }
            processData(startingBalance, monthlyTotals);
        }
    }, [startingBalance, monthlyTotals, locale]);
    // State to track if the chart is hovered (used to conditionally render PrivacyFilter)
    var _g = (0, react_1.useState)(false), isHovered = _g[0], setIsHovered = _g[1];
    return (<view_1.View ref={ref} style={__assign({ margin: 10 }, style)}>
      <react_virtualized_auto_sizer_1.default>
        {function (_a) {
            var width = _a.width, height = _a.height;
            if (loading) {
                return (<div style={{ width: width, height: height }}>
                <LoadingIndicator_1.LoadingIndicator />
              </div>);
            }
            return (<view_1.View style={{ width: width }}>
              <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                }} onMouseEnter={function () { return setIsHovered(true); }} onMouseLeave={function () { return setIsHovered(false); }}>
                <recharts_1.AreaChart data={balanceData} width={width - LABEL_WIDTH} height={height}>
                  <defs>
                    <linearGradient id="fillLight" x1="0.9" y1="0" x2="0.3" y2="1">
                      <stop stopColor={theme_1.theme.noticeTextLight} stopOpacity={1}/>
                      <stop offset="90%" stopColor={theme_1.theme.noticeTextLight} stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="fillError" x1="0.9" y1="0" x2="0.3" y2="1">
                      <stop stopColor={theme_1.theme.errorText} stopOpacity={1}/>
                      <stop offset="90%" stopColor={theme_1.theme.errorText} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <recharts_1.YAxis domain={['dataMin', 'dataMax']} hide={true}/>
                  <recharts_1.Tooltip contentStyle={{
                    display: 'none',
                }} labelFormatter={function (label, items) {
                    var _a;
                    var data = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.payload;
                    if (data) {
                        setHoveredValue(data);
                    }
                    return '';
                }} isAnimationActive={false}/>
                  <recharts_1.Area type="monotone" dataKey="balance" stroke={color} strokeWidth={2} animationDuration={0} fill={color === theme_1.theme.noticeTextLight
                    ? 'url(#fillLight)'
                    : 'url(#fillError)'}/>
                </recharts_1.AreaChart>

                <space_between_1.SpaceBetween direction="vertical" style={__assign({ alignItems: 'flex-end', justifyContent: 'space-between', width: LABEL_WIDTH, textAlign: 'right' }, styles_1.styles.verySmallText)}>
                  {percentageChange === 0 ? (<div />) : (<text_1.Text style={{ color: color }}>
                      {percentageChange >= 0 ? '+' : ''}
                      {percentageChange.toFixed(1)}%
                    </text_1.Text>)}

                  {hoveredValue && (<view_1.View>
                      <text_1.Text style={{ fontWeight: 800 }}>
                        {hoveredValue.date}
                      </text_1.Text>
                      <PrivacyFilter_1.PrivacyFilter activationFilters={[function () { return !isHovered; }]}>
                        <text_1.Text>{(0, util_1.integerToCurrency)(hoveredValue.balance)}</text_1.Text>
                      </PrivacyFilter_1.PrivacyFilter>
                    </view_1.View>)}
                </space_between_1.SpaceBetween>
              </div>
            </view_1.View>);
        }}
      </react_virtualized_auto_sizer_1.default>
    </view_1.View>);
}
