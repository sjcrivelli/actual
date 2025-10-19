import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect, } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Bar, BarChart, LabelList, ResponsiveContainer } from 'recharts';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { defaultTimeFrame } from './CashFlow';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Change } from '@desktop-client/components/reports/Change';
import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { Container } from '@desktop-client/components/reports/Container';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { calculateTimeRange } from '@desktop-client/components/reports/reportRanges';
import { simpleCashFlow } from '@desktop-client/components/reports/spreadsheets/cash-flow-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { useFormat } from '@desktop-client/hooks/useFormat';
function CustomLabel({ value = 0, name, position = 'left', x = 0, y = 0, width: barWidth = 0, height: barHeight = 0, }) {
    const format = useFormat();
    const valueLengthOffset = 20;
    const yOffset = barHeight < 25 ? 105 : y;
    const labelXOffsets = {
        right: 6,
        left: -valueLengthOffset + 1,
    };
    const valueXOffsets = {
        right: 6,
        left: -valueLengthOffset + 2,
    };
    const anchorValue = {
        right: 'start',
        left: 'end',
    };
    return (_jsxs(_Fragment, { children: [_jsx("text", { x: x + barWidth + labelXOffsets[position], y: yOffset + 10, textAnchor: anchorValue[position], fill: theme.tableText, children: name }), _jsx("text", { x: x + barWidth + valueXOffsets[position], y: yOffset + 26, textAnchor: anchorValue[position], fill: theme.tableText, children: _jsx(PrivacyFilter, { children: format(value, 'financial') }) })] }));
}
export function CashFlowCard({ widgetId, isEditing, meta = {}, onMetaChange, onRemove, }) {
    const { t } = useTranslation();
    const [latestTransaction, setLatestTransaction] = useState('');
    const [nameMenuOpen, setNameMenuOpen] = useState(false);
    useEffect(() => {
        async function fetchLatestTransaction() {
            const latestTrans = await send('get-latest-transaction');
            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
        }
        fetchLatestTransaction();
    }, []);
    const [start, end] = calculateTimeRange(meta?.timeFrame, defaultTimeFrame, latestTransaction);
    const params = useMemo(() => simpleCashFlow(start, end, meta?.conditions, meta?.conditionsOp), [start, end, meta?.conditions, meta?.conditionsOp]);
    const data = useReport('cash_flow_simple', params);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const onCardHover = useCallback(() => setIsCardHovered(true), []);
    const onCardHoverEnd = useCallback(() => setIsCardHovered(false), []);
    const { graphData } = data || {};
    const expenses = -(graphData?.expense || 0);
    const income = graphData?.income || 0;
    return (_jsx(ReportCard, { isEditing: isEditing, disableClick: nameMenuOpen, to: `/reports/cash-flow/${widgetId}`, menuItems: [
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ], onMenuSelect: item => {
            switch (item) {
                case 'rename':
                    setNameMenuOpen(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error(`Unrecognized selection: ${item}`);
            }
        }, children: _jsxs(View, { style: { flex: 1 }, onPointerEnter: onCardHover, onPointerLeave: onCardHoverEnd, children: [_jsxs(View, { style: { flexDirection: 'row', padding: 20 }, children: [_jsxs(View, { style: { flex: 1 }, children: [_jsx(ReportCardName, { name: meta?.name || t('Cash Flow'), isEditing: nameMenuOpen, onChange: newName => {
                                        onMetaChange({
                                            ...meta,
                                            name: newName,
                                        });
                                        setNameMenuOpen(false);
                                    }, onClose: () => setNameMenuOpen(false) }), _jsx(DateRange, { start: start, end: end })] }), data && (_jsx(View, { style: { textAlign: 'right' }, children: _jsx(PrivacyFilter, { activationFilters: [!isCardHovered], children: _jsx(Change, { amount: income - expenses }) }) }))] }), data ? (_jsx(Container, { style: { height: 'auto', flex: 1 }, children: (width, height) => (_jsx(ResponsiveContainer, { children: _jsxs(BarChart, { width: width, height: height, data: [
                                {
                                    income,
                                    expenses,
                                },
                            ], margin: {
                                top: 10,
                                bottom: 0,
                            }, children: [_jsx(Bar, { dataKey: "income", fill: chartTheme.colors.blue, barSize: 14, children: _jsx(LabelList, { dataKey: "income", position: "left", content: _jsx(CustomLabel, { name: t('Income') }) }) }), _jsx(Bar, { dataKey: "expenses", fill: chartTheme.colors.red, barSize: 14, children: _jsx(LabelList, { dataKey: "expenses", position: "right", content: _jsx(CustomLabel, { name: t('Expenses') }) }) })] }) })) })) : (_jsx(LoadingIndicator, {}))] }) }));
}
