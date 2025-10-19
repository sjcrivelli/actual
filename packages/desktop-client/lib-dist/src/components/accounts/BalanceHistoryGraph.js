import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { SpaceBetween } from '@actual-app/components/space-between';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { subMonths, format, eachMonthOfInterval } from 'date-fns';
import { AreaChart, Area, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import * as monthUtils from 'loot-core/shared/months';
import { integerToCurrency } from 'loot-core/shared/util';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { useLocale } from '@desktop-client/hooks/useLocale';
import * as query from '@desktop-client/queries';
import { liveQuery } from '@desktop-client/queries/liveQuery';
const LABEL_WIDTH = 70;
export function BalanceHistoryGraph({ accountId, style, ref, }) {
    const locale = useLocale();
    const [balanceData, setBalanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredValue, setHoveredValue] = useState(null);
    const [startingBalance, setStartingBalance] = useState(null);
    const [monthlyTotals, setMonthlyTotals] = useState(null);
    const percentageChange = useMemo(() => {
        if (balanceData.length < 2)
            return 0;
        const firstBalance = balanceData[0].balance;
        const lastBalance = balanceData[balanceData.length - 1].balance;
        if (firstBalance === 0)
            return 0;
        return ((lastBalance - firstBalance) / Math.abs(firstBalance)) * 100;
    }, [balanceData]);
    const color = useMemo(() => (percentageChange >= 0 ? theme.noticeTextLight : theme.errorText), [percentageChange]);
    useEffect(() => {
        // Reset state when accountId changes
        setStartingBalance(null);
        setMonthlyTotals(null);
        setLoading(true);
        const endDate = new Date();
        const startDate = subMonths(endDate, 12);
        const startingBalanceQuery = query
            .transactions(accountId)
            .filter({
            date: { $lt: monthUtils.firstDayOfMonth(startDate) },
        })
            .calculate({ $sum: '$amount' });
        const monthlyTotalsQuery = query
            .transactions(accountId)
            .filter({
            $and: [
                { date: { $gte: monthUtils.firstDayOfMonth(startDate) } },
                { date: { $lte: monthUtils.lastDayOfMonth(endDate) } },
            ],
        })
            .groupBy({ $month: '$date' })
            .select([{ date: { $month: '$date' } }, { amount: { $sum: '$amount' } }]);
        const startingBalanceLive = liveQuery(startingBalanceQuery, {
            onData: (data) => {
                setStartingBalance(data[0] || 0);
            },
            onError: error => {
                console.error('Error fetching starting balance:', error);
                setLoading(false);
            },
        });
        const monthlyTotalsLive = liveQuery(monthlyTotalsQuery, {
            onData: (data) => {
                setMonthlyTotals(data.map(d => ({
                    date: d.date,
                    balance: d.amount,
                })));
            },
            onError: error => {
                console.error('Error fetching monthly totals:', error);
                setLoading(false);
            },
        });
        return () => {
            startingBalanceLive?.unsubscribe();
            monthlyTotalsLive?.unsubscribe();
        };
    }, [accountId, locale]);
    // Process data when both startingBalance and monthlyTotals are available
    useEffect(() => {
        if (startingBalance !== null && monthlyTotals !== null) {
            const endDate = new Date();
            const startDate = subMonths(endDate, 12);
            const months = eachMonthOfInterval({
                start: startDate,
                end: endDate,
            }).map(m => format(m, 'yyyy-MM'));
            function processData(startingBalanceValue, monthlyTotalsValue) {
                let currentBalance = startingBalanceValue;
                const totals = [...monthlyTotalsValue];
                totals.reverse().forEach(month => {
                    currentBalance = currentBalance + month.balance;
                    month.balance = currentBalance;
                });
                // if the account doesn't have recent transactions
                // then the empty months will be missing from our data
                // so add in entries for those here
                if (totals.length === 0) {
                    //handle case of no transactions in the last year
                    months.forEach(expectedMonth => totals.push({
                        date: expectedMonth,
                        balance: startingBalanceValue,
                    }));
                }
                else if (totals.length < months.length) {
                    // iterate through each array together and add in missing data
                    let totalsIndex = 0;
                    let mostRecent = startingBalanceValue;
                    months.forEach(expectedMonth => {
                        if (totalsIndex > totals.length - 1) {
                            // fill in the data at the end of the window
                            totals.push({
                                date: expectedMonth,
                                balance: mostRecent,
                            });
                        }
                        else if (totals[totalsIndex].date === expectedMonth) {
                            // a matched month
                            mostRecent = totals[totalsIndex].balance;
                            totalsIndex += 1;
                        }
                        else {
                            // a missing month in the middle
                            totals.push({
                                date: expectedMonth,
                                balance: mostRecent,
                            });
                        }
                    });
                }
                const balances = totals
                    .sort((a, b) => monthUtils.differenceInCalendarMonths(a.date, b.date))
                    .map(t => {
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
    const [isHovered, setIsHovered] = useState(false);
    return (_jsx(View, { ref: ref, style: { margin: 10, ...style }, children: _jsx(AutoSizer, { children: ({ width, height }) => {
                if (loading) {
                    return (_jsx("div", { style: { width, height }, children: _jsx(LoadingIndicator, {}) }));
                }
                return (_jsx(View, { style: { width }, children: _jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsxs(AreaChart, { data: balanceData, width: width - LABEL_WIDTH, height: height, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "fillLight", x1: "0.9", y1: "0", x2: "0.3", y2: "1", children: [_jsx("stop", { stopColor: theme.noticeTextLight, stopOpacity: 1 }), _jsx("stop", { offset: "90%", stopColor: theme.noticeTextLight, stopOpacity: 0.2 })] }), _jsxs("linearGradient", { id: "fillError", x1: "0.9", y1: "0", x2: "0.3", y2: "1", children: [_jsx("stop", { stopColor: theme.errorText, stopOpacity: 1 }), _jsx("stop", { offset: "90%", stopColor: theme.errorText, stopOpacity: 0.2 })] })] }), _jsx(YAxis, { domain: ['dataMin', 'dataMax'], hide: true }), _jsx(RechartsTooltip, { contentStyle: {
                                            display: 'none',
                                        }, labelFormatter: (label, items) => {
                                            const data = items[0]?.payload;
                                            if (data) {
                                                setHoveredValue(data);
                                            }
                                            return '';
                                        }, isAnimationActive: false }), _jsx(Area, { type: "monotone", dataKey: "balance", stroke: color, strokeWidth: 2, animationDuration: 0, fill: color === theme.noticeTextLight
                                            ? 'url(#fillLight)'
                                            : 'url(#fillError)' })] }), _jsxs(SpaceBetween, { direction: "vertical", style: {
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    width: LABEL_WIDTH,
                                    textAlign: 'right',
                                    ...styles.verySmallText,
                                }, children: [percentageChange === 0 ? (_jsx("div", {})) : (_jsxs(Text, { style: { color }, children: [percentageChange >= 0 ? '+' : '', percentageChange.toFixed(1), "%"] })), hoveredValue && (_jsxs(View, { children: [_jsx(Text, { style: { fontWeight: 800 }, children: hoveredValue.date }), _jsx(PrivacyFilter, { activationFilters: [() => !isHovered], children: _jsx(Text, { children: integerToCurrency(hoveredValue.balance) }) })] }))] })] }) }));
            } }) }));
}
