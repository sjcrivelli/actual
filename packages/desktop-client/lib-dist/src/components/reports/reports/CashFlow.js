import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { AlignedText } from '@actual-app/components/aligned-text';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Paragraph } from '@actual-app/components/paragraph';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as d from 'date-fns';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { EditablePageHeaderTitle } from '@desktop-client/components/EditablePageHeaderTitle';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import { MobilePageHeader, Page, PageHeader, } from '@desktop-client/components/Page';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Change } from '@desktop-client/components/reports/Change';
import { CashFlowGraph } from '@desktop-client/components/reports/graphs/CashFlowGraph';
import { Header } from '@desktop-client/components/reports/Header';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { calculateTimeRange } from '@desktop-client/components/reports/reportRanges';
import { cashFlowByDate } from '@desktop-client/components/reports/spreadsheets/cash-flow-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useRuleConditionFilters } from '@desktop-client/hooks/useRuleConditionFilters';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useWidget } from '@desktop-client/hooks/useWidget';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
export const defaultTimeFrame = {
    start: monthUtils.dayFromDate(monthUtils.currentMonth()),
    end: monthUtils.currentDay(),
    mode: 'sliding-window',
};
export function CashFlow() {
    const params = useParams();
    const { data: widget, isLoading } = useWidget(params.id ?? '', 'cash-flow-card');
    if (isLoading) {
        return _jsx(LoadingIndicator, {});
    }
    return _jsx(CashFlowInner, { widget: widget });
}
function CashFlowInner({ widget }) {
    const locale = useLocale();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const format = useFormat();
    const { conditions, conditionsOp, onApply: onApplyFilter, onDelete: onDeleteFilter, onUpdate: onUpdateFilter, onConditionsOpChange, } = useRuleConditionFilters(widget?.meta?.conditions, widget?.meta?.conditionsOp);
    const [allMonths, setAllMonths] = useState(null);
    const [start, setStart] = useState(monthUtils.currentMonth());
    const [end, setEnd] = useState(monthUtils.currentMonth());
    const [mode, setMode] = useState('sliding-window');
    const [showBalance, setShowBalance] = useState(widget?.meta?.showBalance ?? true);
    const [latestTransaction, setLatestTransaction] = useState('');
    const [isConcise, setIsConcise] = useState(() => {
        const numDays = d.differenceInCalendarDays(d.parseISO(end), d.parseISO(start));
        return numDays > 31 * 3;
    });
    const params = useMemo(() => cashFlowByDate(start, end, isConcise, conditions, conditionsOp, locale, format), [start, end, isConcise, conditions, conditionsOp, locale, format]);
    const data = useReport('cash_flow', params);
    useEffect(() => {
        async function run() {
            const earliestTransaction = await send('get-earliest-transaction');
            setEarliestTransaction(earliestTransaction
                ? earliestTransaction.date
                : monthUtils.currentDay());
            const latestTransaction = await send('get-latest-transaction');
            setLatestTransaction(latestTransaction ? latestTransaction.date : monthUtils.currentDay());
            const earliestMonth = earliestTransaction
                ? monthUtils.monthFromDate(d.parseISO(earliestTransaction.date))
                : monthUtils.currentMonth();
            const latestMonth = latestTransaction
                ? monthUtils.monthFromDate(d.parseISO(latestTransaction.date))
                : monthUtils.currentMonth();
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
            const [initialStart, initialEnd, initialMode] = calculateTimeRange(widget?.meta?.timeFrame, defaultTimeFrame, latestTransaction);
            setStart(initialStart);
            setEnd(initialEnd);
            setMode(initialMode);
        }
    }, [latestTransaction, widget?.meta?.timeFrame]);
    function onChangeDates(start, end, mode) {
        const numDays = d.differenceInCalendarDays(d.parseISO(end), d.parseISO(start));
        const isConcise = numDays > 31 * 3;
        setStart(start);
        setEnd(end);
        setMode(mode);
        setIsConcise(isConcise);
    }
    const navigate = useNavigate();
    const { isNarrowWidth } = useResponsive();
    async function onSaveWidget() {
        if (!widget) {
            throw new Error('No widget that could be saved.');
        }
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
                showBalance,
            },
        });
        dispatch(addNotification({
            notification: {
                type: 'message',
                message: t('Dashboard widget successfully saved.'),
            },
        }));
    }
    const title = widget?.meta?.name || t('Cash Flow');
    const onSaveWidgetName = async (newName) => {
        if (!widget) {
            throw new Error('No widget that could be saved.');
        }
        const name = newName || t('Cash Flow');
        await send('dashboard-update-widget', {
            id: widget.id,
            meta: {
                ...(widget.meta ?? {}),
                name,
            },
        });
    };
    const [earliestTransaction, setEarliestTransaction] = useState('');
    const [_firstDayOfWeekIdx] = useSyncedPref('firstDayOfWeekIdx');
    const firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    if (!allMonths || !data) {
        return null;
    }
    const { graphData, totalExpenses, totalIncome, totalTransfers } = data;
    return (_jsxs(Page, { header: isNarrowWidth ? (_jsx(MobilePageHeader, { title: title, leftContent: _jsx(MobileBackButton, { onPress: () => navigate('/reports') }) })) : (_jsx(PageHeader, { title: widget ? (_jsx(EditablePageHeaderTitle, { title: title, onSave: onSaveWidgetName })) : (title) })), padding: 0, children: [_jsx(Header, { allMonths: allMonths, start: start, end: end, earliestTransaction: earliestTransaction, latestTransaction: latestTransaction, firstDayOfWeekIdx: firstDayOfWeekIdx, mode: mode, show1Month: true, onChangeDates: onChangeDates, onApply: onApplyFilter, filters: conditions, onUpdateFilter: onUpdateFilter, onDeleteFilter: onDeleteFilter, conditionsOp: conditionsOp, onConditionsOpChange: onConditionsOpChange, children: _jsxs(View, { style: { flexDirection: 'row', gap: 10 }, children: [_jsx(Button, { onPress: () => setShowBalance(state => !state), children: showBalance ? t('Hide balance') : t('Show balance') }), widget && (_jsx(Button, { variant: "primary", onPress: onSaveWidget, children: _jsx(Trans, { children: "Save widget" }) }))] }) }), _jsxs(View, { style: {
                    backgroundColor: theme.tableBackground,
                    padding: 20,
                    paddingTop: 0,
                    flex: '1 0 auto',
                    overflowY: 'auto',
                }, children: [_jsxs(View, { style: {
                            paddingTop: 20,
                            alignItems: 'flex-end',
                            color: theme.pageText,
                        }, children: [_jsx(AlignedText, { style: { marginBottom: 5, minWidth: 160 }, left: _jsx(Block, { children: _jsx(Trans, { children: "Income:" }) }), right: _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(PrivacyFilter, { children: format(totalIncome, 'financial') }) }) }), _jsx(AlignedText, { style: { marginBottom: 5, minWidth: 160 }, left: _jsx(Block, { children: _jsx(Trans, { children: "Expenses:" }) }), right: _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(PrivacyFilter, { children: format(totalExpenses, 'financial') }) }) }), _jsx(AlignedText, { style: { marginBottom: 5, minWidth: 160 }, left: _jsx(Block, { children: _jsx(Trans, { children: "Transfers:" }) }), right: _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(PrivacyFilter, { children: format(totalTransfers, 'financial') }) }) }), _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(PrivacyFilter, { children: _jsx(Change, { amount: totalIncome + totalExpenses + totalTransfers }) }) })] }), _jsx(CashFlowGraph, { graphData: graphData, isConcise: isConcise, showBalance: showBalance }), _jsx(View, { style: {
                            marginTop: 30,
                            userSelect: 'none',
                        }, children: _jsxs(Trans, { children: [_jsx(Paragraph, { children: _jsx("strong", { children: "How is cash flow calculated?" }) }), _jsx(Paragraph, { children: "Cash flow shows the balance of your budgeted accounts over time, and the amount of expenses/income each day or month. Your budgeted accounts are considered to be \u201Ccash on hand,\u201D so this gives you a picture of how available money fluctuates." })] }) })] })] }));
}
