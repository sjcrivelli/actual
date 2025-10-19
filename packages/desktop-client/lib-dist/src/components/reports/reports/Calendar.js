import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';
import { animated, config, useSpring } from 'react-spring';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgArrowThickDown, SvgArrowThickUp, SvgCheveronDown, SvgCheveronUp, } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { useDrag } from '@use-gesture/react';
import { format as formatDate, parseISO } from 'date-fns';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import { ungroupTransactions } from 'loot-core/shared/transactions';
import { EditablePageHeaderTitle } from '@desktop-client/components/EditablePageHeaderTitle';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import { TransactionList as TransactionListMobile } from '@desktop-client/components/mobile/transactions/TransactionList';
import { MobilePageHeader, Page, PageHeader, } from '@desktop-client/components/Page';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { CalendarGraph } from '@desktop-client/components/reports/graphs/CalendarGraph';
import { Header } from '@desktop-client/components/reports/Header';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { calculateTimeRange } from '@desktop-client/components/reports/reportRanges';
import { calendarSpreadsheet, } from '@desktop-client/components/reports/spreadsheets/calendar-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { fromDateRepr } from '@desktop-client/components/reports/util';
import { TransactionList } from '@desktop-client/components/transactions/TransactionList';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { SchedulesProvider } from '@desktop-client/hooks/useCachedSchedules';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useMergedRefs } from '@desktop-client/hooks/useMergedRefs';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useResizeObserver } from '@desktop-client/hooks/useResizeObserver';
import { useRuleConditionFilters } from '@desktop-client/hooks/useRuleConditionFilters';
import { SelectedProviderWithItems } from '@desktop-client/hooks/useSelected';
import { SplitsExpandedProvider } from '@desktop-client/hooks/useSplitsExpanded';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useTransactions } from '@desktop-client/hooks/useTransactions';
import { useWidget } from '@desktop-client/hooks/useWidget';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
const CHEVRON_HEIGHT = 42;
const SUMMARY_HEIGHT = 140;
export function Calendar() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { data: widget, isLoading } = useWidget(params.id ?? '', 'calendar-card');
    if (isLoading) {
        return _jsx(LoadingIndicator, {});
    }
    return _jsx(CalendarInner, { widget: widget, parameters: searchParams });
}
function CalendarInner({ widget, parameters }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const format = useFormat();
    const [start, setStart] = useState(monthUtils.dayFromDate(monthUtils.currentMonth()));
    const [end, setEnd] = useState(monthUtils.currentDay());
    const [mode, setMode] = useState('full');
    const [query, setQuery] = useState(undefined);
    const [dirty, setDirty] = useState(false);
    const [latestTransaction, setLatestTransaction] = useState('');
    const { transactions: transactionsGrouped, loadMore: loadMoreTransactions } = useTransactions({ query });
    const allTransactions = useMemo(() => ungroupTransactions(transactionsGrouped), [transactionsGrouped]);
    const accounts = useAccounts();
    const payees = usePayees();
    const { grouped: categoryGroups } = useCategories();
    const [_firstDayOfWeekIdx] = useSyncedPref('firstDayOfWeekIdx');
    const firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    const { conditions, conditionsOp, onApply: onApplyFilter, onDelete: onDeleteFilter, onUpdate: onUpdateFilter, onConditionsOpChange, } = useRuleConditionFilters(widget?.meta?.conditions, widget?.meta?.conditionsOp);
    useEffect(() => {
        const day = parameters.get('day');
        const month = parameters.get('month');
        if (day && onApplyFilter) {
            onApplyFilter({
                conditions: [
                    ...(widget?.meta?.conditions || []),
                    {
                        op: 'is',
                        field: 'date',
                        value: day,
                    },
                ],
                conditionsOp: 'and',
                id: [],
            });
        }
        if (month && onApplyFilter) {
            onApplyFilter({
                conditions: [
                    ...(widget?.meta?.conditions || []),
                    {
                        field: 'date',
                        op: 'is',
                        value: month,
                        options: {
                            month: true,
                        },
                    },
                ],
                conditionsOp: 'and',
                id: [],
            });
        }
    }, [widget?.meta?.conditions, onApplyFilter, parameters]);
    const params = useMemo(() => {
        if (dirty === true) {
            setDirty(false);
        }
        return calendarSpreadsheet(start, end, conditions, conditionsOp, firstDayOfWeekIdx);
    }, [start, end, conditions, conditionsOp, firstDayOfWeekIdx, dirty]);
    const [sortField, setSortField] = useState('');
    const [ascDesc, setAscDesc] = useState('desc');
    useEffect(() => {
        const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
        send('make-filters-from-conditions', {
            conditions: conditions.filter(cond => !cond.customName),
        })
            .then((data) => {
            let query = q('transactions')
                .filter({
                [conditionsOpKey]: data.filters,
            })
                .filter({
                $and: [
                    { date: { $gte: monthUtils.firstDayOfMonth(start) } },
                    { date: { $lte: monthUtils.lastDayOfMonth(end) } },
                ],
            })
                .select('*');
            if (sortField) {
                query = query.orderBy({
                    [getField(sortField)]: ascDesc,
                });
            }
            setQuery(query.options({ splits: 'grouped' }));
        })
            .catch((error) => {
            console.error('Error generating filters:', error);
        });
    }, [start, end, conditions, conditionsOp, sortField, ascDesc]);
    const [flexAlignment, setFlexAlignment] = useState('center');
    const scrollbarContainer = useRef(null);
    const ref = useResizeObserver(() => {
        setFlexAlignment(scrollbarContainer.current &&
            scrollbarContainer.current.scrollWidth >
                scrollbarContainer.current.clientWidth
            ? 'flex-start'
            : 'center');
    });
    const mergedRef = useMergedRefs(ref, scrollbarContainer);
    const data = useReport('calendar', params);
    const [allMonths, setAllMonths] = useState([]);
    useEffect(() => {
        async function run() {
            const earliestTransaction = await send('get-earliest-transaction');
            setEarliestTransaction(earliestTransaction
                ? earliestTransaction.date
                : monthUtils.currentDay());
            const latestTransaction = await send('get-latest-transaction');
            setLatestTransaction(latestTransaction ? latestTransaction.date : monthUtils.currentDay());
            const currentMonth = monthUtils.currentMonth();
            let earliestMonth = earliestTransaction
                ? monthUtils.monthFromDate(parseISO(fromDateRepr(earliestTransaction.date)))
                : currentMonth;
            const latestMonth = latestTransaction
                ? monthUtils.monthFromDate(parseISO(fromDateRepr(latestTransaction.date)))
                : currentMonth;
            // Make sure the month selects are at least populates with a
            // year's worth of months. We can undo this when we have fancier
            // date selects.
            const yearAgo = monthUtils.subMonths(latestMonth, 12);
            if (earliestMonth > yearAgo) {
                earliestMonth = yearAgo;
            }
            const allMonths = monthUtils
                .rangeInclusive(earliestMonth, latestMonth)
                .map(month => ({
                name: month,
                pretty: monthUtils.format(month, 'MMMM, yyyy', locale),
            }))
                .reverse();
            setAllMonths(allMonths);
        }
        run();
    }, [locale]);
    useEffect(() => {
        if (latestTransaction) {
            const [initialStart, initialEnd, initialMode] = calculateTimeRange(widget?.meta?.timeFrame, {
                start: monthUtils.dayFromDate(monthUtils.currentMonth()),
                end: monthUtils.currentDay(),
                mode: 'full',
            }, latestTransaction);
            setStart(initialStart);
            setEnd(initialEnd);
            setMode(initialMode);
        }
    }, [latestTransaction, widget?.meta?.timeFrame]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isNarrowWidth } = useResponsive();
    const title = widget?.meta?.name || t('Calendar');
    const table = useRef(null);
    const dateFormat = useDateFormat();
    const onSaveWidgetName = async (newName) => {
        if (!widget) {
            throw new Error('No widget that could be saved.');
        }
        const name = newName || t('Calendar');
        await send('dashboard-update-widget', {
            id: widget.id,
            meta: {
                ...(widget.meta ?? {}),
                name,
            },
        });
    };
    function onChangeDates(start, end, mode) {
        setStart(start);
        setEnd(end);
        setMode(mode);
    }
    async function onSaveWidget() {
        if (!widget) {
            throw new Error('No widget that could be saved.');
        }
        try {
            await send('dashboard-update-widget', {
                id: widget.id,
                meta: {
                    ...(widget.meta ?? {}),
                    conditions,
                    conditionsOp,
                    timeFrame: {
                        start,
                        end,
                        mode,
                    },
                },
            });
            dispatch(addNotification({
                notification: {
                    type: 'message',
                    message: t('Dashboard widget successfully saved.'),
                },
            }));
        }
        catch (error) {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    message: t('Failed to save dashboard widget.'),
                },
            }));
            console.error('Error saving widget:', error);
        }
    }
    const { totalIncome, totalExpense } = useMemo(() => {
        if (!data || !data.calendarData) {
            return { totalIncome: 0, totalExpense: 0 };
        }
        return {
            totalIncome: data.calendarData.reduce((prev, cur) => prev + cur.totalIncome, 0),
            totalExpense: data.calendarData.reduce((prev, cur) => prev + cur.totalExpense, 0),
        };
    }, [data]);
    const onSort = useCallback((headerClicked, ascDesc) => {
        if (headerClicked === sortField) {
            setAscDesc(ascDesc);
        }
        else {
            setSortField(headerClicked);
            setAscDesc('desc');
        }
    }, [sortField]);
    const onOpenTransaction = useCallback((transaction) => {
        navigate(`/transactions/${transaction.id}`);
    }, [navigate]);
    const refContainer = useRef(null);
    useEffect(() => {
        if (refContainer.current) {
            setTotalHeight(refContainer.current.clientHeight - SUMMARY_HEIGHT);
        }
    }, [query]);
    const [totalHeight, setTotalHeight] = useState(0);
    const closeY = useRef(3000);
    const openY = 0;
    const [mobileTransactionsOpen, setMobileTransactionsOpen] = useState(false);
    const [{ y }, api] = useSpring(() => ({
        y: closeY.current,
        immediate: false,
    }));
    useEffect(() => {
        closeY.current = totalHeight;
        api.start({
            y: mobileTransactionsOpen ? openY : closeY.current,
            immediate: false,
        });
    }, [totalHeight, mobileTransactionsOpen, api]);
    const open = useCallback(({ canceled }) => {
        api.start({
            y: openY,
            immediate: false,
            config: canceled ? config.wobbly : config.stiff,
        });
        setMobileTransactionsOpen(true);
    }, [api]);
    const close = useCallback((velocity = 0) => {
        api.start({
            y: closeY.current,
            config: { ...config.stiff, velocity },
        });
        setMobileTransactionsOpen(false);
    }, [api]);
    const bind = useDrag(({ offset: [, oy], cancel }) => {
        if (oy < 0) {
            cancel();
            api.start({ y: 0, immediate: true });
            return;
        }
        if (oy > totalHeight * 0.05 && mobileTransactionsOpen) {
            cancel();
            close();
            setMobileTransactionsOpen(false);
        }
        else if (!mobileTransactionsOpen) {
            if (oy / totalHeight > 0.05) {
                cancel();
                open({ canceled: true });
                setMobileTransactionsOpen(true);
            }
            else {
                api.start({ y: oy, immediate: true });
            }
        }
    }, {
        from: () => [0, y.get()],
        filterTaps: true,
        bounds: {
            top: -totalHeight + CHEVRON_HEIGHT,
            bottom: totalHeight - CHEVRON_HEIGHT,
        },
        axis: 'y',
        rubberband: true,
    });
    const [earliestTransaction, setEarliestTransaction] = useState('');
    return (_jsxs(Page, { header: isNarrowWidth ? (_jsx(MobilePageHeader, { title: title, leftContent: _jsx(MobileBackButton, { onPress: () => navigate('/reports') }) })) : (_jsx(PageHeader, { title: widget ? (_jsx(EditablePageHeaderTitle, { title: title, onSave: onSaveWidgetName })) : (title) })), padding: 0, children: [_jsx(View, { style: { minHeight: !isNarrowWidth ? '120px' : 'unset' }, children: _jsx(Header, { allMonths: allMonths, start: start, end: end, earliestTransaction: earliestTransaction, latestTransaction: latestTransaction, firstDayOfWeekIdx: firstDayOfWeekIdx, mode: mode, onChangeDates: onChangeDates, filters: conditions, onApply: onApplyFilter, onUpdateFilter: onUpdateFilter, onDeleteFilter: onDeleteFilter, conditionsOp: conditionsOp, onConditionsOpChange: onConditionsOpChange, show1Month: true, children: widget && (_jsx(Button, { variant: "primary", onPress: onSaveWidget, children: _jsx(Trans, { children: "Save widget" }) })) }) }), _jsxs(View, { ref: refContainer, style: { flexGrow: 1 }, children: [_jsx(View, { style: {
                            backgroundColor: theme.pageBackground,
                            paddingTop: 0,
                            minHeight: '350px',
                            overflowY: 'auto',
                        }, children: _jsxs(View, { style: {
                                flexDirection: isNarrowWidth ? 'column-reverse' : 'row',
                                justifyContent: 'flex-start',
                                flexGrow: 1,
                                gap: 16,
                                position: 'relative',
                                marginBottom: 16,
                            }, children: [data && (_jsx(View, { ref: mergedRef, style: {
                                        flexGrow: 1,
                                        flexDirection: 'row',
                                        gap: '20px',
                                        overflow: 'auto',
                                        height: '100%',
                                        justifyContent: flexAlignment,
                                        display: 'flex',
                                        ...styles.horizontalScrollbar,
                                    }, children: data.calendarData.map((calendar, index) => (_jsx(CalendarWithHeader, { calendar: calendar, onApplyFilter: onApplyFilter, firstDayOfWeekIdx: firstDayOfWeekIdx, conditions: conditions, conditionsOp: conditionsOp, format: format }, index))) })), _jsx(CalendarCardHeader, { start: start, end: end, totalExpense: totalExpense, totalIncome: totalIncome, isNarrowWidth: isNarrowWidth, format: format })] }) }), _jsx(SelectedProviderWithItems, { name: "transactions", items: [], fetchAllIds: async () => [], registerDispatch: () => { }, selectAllFilter: (item) => !item._unmatched && !item.is_parent, children: _jsx(SchedulesProvider, { query: undefined, children: _jsx(View, { style: {
                                    width: '100%',
                                    flexGrow: 1,
                                    overflow: isNarrowWidth ? 'auto' : 'hidden',
                                }, 
                                // TODO: make TableHandleRef conform to HTMLDivEle
                                ref: table, children: !isNarrowWidth ? (_jsx(SplitsExpandedProvider, { initialMode: "collapse", children: _jsx(TransactionList, { tableRef: table, account: undefined, transactions: transactionsGrouped, allTransactions: allTransactions, loadMoreTransactions: loadMoreTransactions, accounts: accounts, category: undefined, categoryGroups: categoryGroups, payees: payees, balances: null, showBalances: false, showReconciled: true, showCleared: false, showAccount: true, isAdding: false, isNew: () => false, isMatched: () => false, dateFormat: dateFormat, hideFraction: false, renderEmpty: () => (_jsx(View, { style: {
                                                color: theme.tableText,
                                                marginTop: 20,
                                                textAlign: 'center',
                                                fontStyle: 'italic',
                                            }, children: _jsx(Trans, { children: "No transactions" }) })), onSort: onSort, sortField: sortField, ascDesc: ascDesc, onChange: () => { }, onRefetch: () => setDirty(true), onCloseAddTransaction: () => { }, onCreatePayee: async () => null, onApplyFilter: () => { }, onBatchDelete: () => { }, onBatchDuplicate: () => { }, onBatchLinkSchedule: () => { }, onBatchUnlinkSchedule: () => { }, onCreateRule: () => { }, onScheduleAction: () => { }, onMakeAsNonSplitTransactions: () => { }, showSelection: false, allowSplitTransaction: false }) })) : (_jsxs(animated.div, { ...bind(), style: {
                                        y,
                                        touchAction: 'pan-x',
                                        backgroundColor: theme.mobileNavBackground,
                                        borderTop: `1px solid ${theme.menuBorder}`,
                                        ...styles.shadow,
                                        height: totalHeight + CHEVRON_HEIGHT,
                                        width: '100%',
                                        position: 'fixed',
                                        zIndex: 100,
                                        bottom: 0,
                                        display: isNarrowWidth ? 'flex' : 'none',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }, children: [_jsxs(Button, { variant: "bare", onPress: () => !mobileTransactionsOpen
                                                ? open({ canceled: false })
                                                : close(), className: css({
                                                color: theme.pageTextSubdued,
                                                height: 42,
                                                '&[data-pressed]': { backgroundColor: 'transparent' },
                                            }), children: [!mobileTransactionsOpen && (_jsxs(_Fragment, { children: [_jsx(SvgCheveronUp, { width: 16, height: 16 }), _jsx(Trans, { children: "Show transactions" })] })), mobileTransactionsOpen && (_jsxs(_Fragment, { children: [_jsx(SvgCheveronDown, { width: 16, height: 16 }), _jsx(Trans, { children: "Hide transactions" })] }))] }), _jsx(View, { style: { height: '100%', width: '100%', overflow: 'auto' }, children: _jsx(TransactionListMobile, { isLoading: false, onLoadMore: loadMoreTransactions, transactions: allTransactions, onOpenTransaction: onOpenTransaction, isLoadingMore: false }) })] })) }) }) })] })] }));
}
function CalendarWithHeader({ calendar, onApplyFilter, firstDayOfWeekIdx, conditions, conditionsOp, format, }) {
    const { t } = useTranslation();
    return (_jsxs(View, { style: {
            minWidth: '300px',
            maxWidth: '300px',
            padding: 10,
            borderRadius: 4,
            backgroundColor: theme.tableBackground,
        }, onClick: () => onApplyFilter({
            conditions: [...conditions.filter(f => f.field !== 'date')],
            conditionsOp,
            id: [],
        }), children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    marginBottom: 16,
                }, children: [_jsx(Button, { variant: "bare", style: {
                            color: theme.pageTextSubdued,
                            fontWeight: 'bold',
                            fontSize: '14px',
                            margin: 0,
                            padding: 0,
                            display: 'inline-block',
                            width: 'max-content',
                        }, onPress: () => {
                            onApplyFilter({
                                conditions: [
                                    ...conditions.filter(f => f.field !== 'date'),
                                    {
                                        field: 'date',
                                        op: 'is',
                                        value: formatDate(calendar.start, 'yyyy-MM'),
                                        options: {
                                            month: true,
                                        },
                                    },
                                ],
                                conditionsOp: 'and',
                                id: [],
                            });
                        }, children: formatDate(calendar.start, 'MMMM yyyy') }), _jsxs(View, { style: { display: 'grid', gridTemplateColumns: '16px 1fr', gap: 2 }, children: [_jsx(SvgArrowThickUp, { width: 16, height: 16, style: { color: chartTheme.colors.blue, flexShrink: 0 } }), _jsx(View, { style: {
                                    color: chartTheme.colors.blue,
                                    flexDirection: 'row',
                                    flexGrow: 1,
                                    justifyContent: 'start',
                                }, "aria-label": t('Income'), children: _jsx(PrivacyFilter, { children: format(calendar.totalIncome, 'financial') }) }), _jsx(SvgArrowThickDown, { width: 16, height: 16, style: { color: chartTheme.colors.red, flexShrink: 0 } }), _jsx(View, { style: {
                                    color: chartTheme.colors.red,
                                    flexDirection: 'row',
                                    flexGrow: 1,
                                    justifyContent: 'start',
                                }, "aria-label": t('Expenses'), children: _jsx(PrivacyFilter, { children: format(calendar.totalExpense, 'financial') }) })] })] }), _jsx(View, { style: { flexGrow: 1, display: 'block', marginBottom: 20 }, children: _jsx(CalendarGraph, { data: calendar.data, start: calendar.start, onDayClick: date => {
                        if (date) {
                            onApplyFilter({
                                conditions: [
                                    ...conditions.filter(f => f.field !== 'date'),
                                    {
                                        field: 'date',
                                        op: 'is',
                                        value: formatDate(date, 'yyyy-MM-dd'),
                                    },
                                ],
                                conditionsOp: 'and',
                                id: [],
                            });
                        }
                        else {
                            onApplyFilter({
                                conditions: [...conditions.filter(f => f.field !== 'date')],
                                conditionsOp: 'and',
                                id: [],
                            });
                        }
                    }, firstDayOfWeekIdx: firstDayOfWeekIdx }) })] }));
}
function CalendarCardHeader({ start, end, totalIncome, totalExpense, isNarrowWidth, format, }) {
    return (_jsx(View, { style: {
            ...styles.smallText,
            marginLeft: isNarrowWidth ? 0 : 16,
            marginTop: isNarrowWidth ? 16 : 0,
            justifyContent: isNarrowWidth ? 'center' : 'flex-end',
            flexDirection: 'row',
            height: '100px',
            minWidth: '210px',
        }, children: _jsxs(View, { style: {
                width: '200px',
                borderRadius: 4,
                backgroundColor: theme.tableBackground,
                padding: 10,
            }, children: [_jsx(DateRange, { start: start, end: end }), _jsx(View, { style: { lineHeight: 1.5 }, children: _jsxs(View, { style: {
                            display: 'grid',
                            gridTemplateColumns: '70px 1fr',
                            gridAutoRows: '1fr',
                        }, children: [_jsx(View, { style: {
                                    textAlign: 'right',
                                    marginRight: 4,
                                }, children: _jsx(Trans, { children: "Income:" }) }), _jsx(View, { style: { color: chartTheme.colors.blue }, children: _jsx(PrivacyFilter, { children: format(totalIncome, 'financial') }) }), _jsx(View, { style: {
                                    textAlign: 'right',
                                    marginRight: 4,
                                }, children: _jsx(Trans, { children: "Expenses:" }) }), _jsx(View, { style: { color: chartTheme.colors.red }, children: _jsx(PrivacyFilter, { children: format(totalExpense, 'financial') }) })] }) })] }) }));
}
function getField(field) {
    if (!field) {
        return 'date';
    }
    switch (field) {
        case 'account':
            return 'account.name';
        case 'payee':
            return 'payee.name';
        case 'category':
            return 'category.name';
        case 'payment':
            return 'amount';
        case 'deposit':
            return 'amount';
        default:
            return field;
    }
}
