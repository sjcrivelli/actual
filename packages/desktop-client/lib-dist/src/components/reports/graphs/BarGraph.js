import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { BarChart, Bar, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, } from 'recharts';
import { adjustTextSize } from './adjustTextSize';
import { renderCustomLabel } from './renderCustomLabel';
import { showActivity } from './showActivity';
import { Container } from '@desktop-client/components/reports/Container';
import { getCustomTick } from '@desktop-client/components/reports/getCustomTick';
import { numberFormatterTooltip } from '@desktop-client/components/reports/numberFormatter';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
const CustomTooltip = ({ active, payload, balanceTypeOp, yAxis, format, }) => {
    const { t } = useTranslation();
    if (active && payload && payload.length) {
        return (_jsx("div", { className: css({
                zIndex: 1000,
                pointerEvents: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                backgroundColor: theme.menuBackground,
                color: theme.menuItemText,
                padding: 10,
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: payload[0].payload[yAxis] }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Assets:'), right: format(payload[0].payload.totalAssets, 'financial') })), ['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Debts:'), right: format(payload[0].payload.totalDebts, 'financial') })), ['netAssets'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net Assets:'), right: format(payload[0].payload.netAssets, 'financial') })), ['netDebts'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net Debts:'), right: format(payload[0].payload.netDebts, 'financial') })), ['totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net:'), right: _jsx("strong", { children: format(payload[0].payload.totalTotals, 'financial') }) }))] })] }) }));
    }
};
const customLabel = (props, typeOp, format) => {
    const calcX = props.x + props.width / 2;
    const calcY = props.y - (props.value > 0 ? 15 : -15);
    const textAnchor = 'middle';
    const display = props.value !== 0 && `${format(props.value, 'financial-no-decimals')}`;
    const textSize = adjustTextSize({
        sized: props.width,
        type: typeOp === 'totalTotals' ? 'default' : 'variable',
        values: props.value,
    });
    return renderCustomLabel(calcX, calcY, textAnchor, display, textSize);
};
export function BarGraph({ style, data, filters, groupBy, balanceTypeOp, compact, viewLabels, showHiddenCategories, showOffBudget, showTooltip = true, }) {
    const navigate = useNavigate();
    const categories = useCategories();
    const accounts = useAccounts();
    const privacyMode = usePrivacyMode();
    const format = useFormat();
    const [pointer, setPointer] = useState('');
    const yAxis = groupBy === 'Interval' ? 'date' : 'name';
    const splitData = groupBy === 'Interval' ? 'intervalData' : 'data';
    const labelsMargin = viewLabels ? 30 : 0;
    const getVal = obj => {
        if (['totalDebts', 'netDebts'].includes(balanceTypeOp)) {
            return -1 * obj[balanceTypeOp];
        }
        return obj[balanceTypeOp];
    };
    const longestLabelLength = data[splitData]
        .map(c => c[yAxis])
        .reduce((acc, cur) => (cur.length > acc ? cur.length : acc), 0);
    const largestValue = data[splitData]
        .map(c => c[balanceTypeOp])
        .reduce((acc, cur) => (Math.abs(cur) > Math.abs(acc) ? cur : acc), 0);
    const leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 0;
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data[splitData] && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(BarChart, { width: width, height: height, stackOffset: "sign", data: data[splitData], style: { cursor: pointer }, margin: {
                            top: labelsMargin,
                            right: 0,
                            left: leftMargin,
                            bottom: 0,
                        }, children: [showTooltip && (_jsx(Tooltip, { cursor: { fill: 'transparent' }, content: _jsx(CustomTooltip, { balanceTypeOp: balanceTypeOp, yAxis: yAxis, format: format }), formatter: numberFormatterTooltip, isAnimationActive: false })), !compact && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), !compact && (_jsx(XAxis, { dataKey: yAxis, angle: -35, textAnchor: "end", height: Math.sqrt(longestLabelLength) * 25, tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } })), !compact && (_jsx(YAxis, { tickFormatter: value => getCustomTick(format(value, 'financial-no-decimals'), privacyMode), tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, tickSize: 0 })), !compact && (_jsx(ReferenceLine, { y: 0, stroke: theme.pageTextLight })), _jsxs(Bar, { dataKey: val => getVal(val), stackId: "a", onMouseLeave: () => setPointer(''), onMouseEnter: () => !['Group', 'Interval'].includes(groupBy) &&
                                    setPointer('pointer'), onClick: item => ((compact && showTooltip) || !compact) &&
                                    !['Group', 'Interval'].includes(groupBy) &&
                                    showActivity({
                                        navigate,
                                        categories,
                                        accounts,
                                        balanceTypeOp,
                                        filters,
                                        showHiddenCategories,
                                        showOffBudget,
                                        type: 'totals',
                                        startDate: data.startDate,
                                        endDate: data.endDate,
                                        field: groupBy.toLowerCase(),
                                        id: item.id,
                                    }), children: [viewLabels && !compact && (_jsx(LabelList, { dataKey: val => getVal(val), content: e => customLabel(e, balanceTypeOp, format) })), data.legend.map((entry, index) => (_jsx(Cell, { fill: entry.color, name: entry.name }, `cell-${index}`)))] })] })] }) })) }));
}
