import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, } from 'recharts';
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
const CustomTooltip = ({ compact, tooltip, active, payload, label, format, }) => {
    const { t } = useTranslation();
    const { sumTotals, items } = useMemo(() => {
        return (payload ?? [])
            .slice(0)
            .reverse()
            .reduce((acc, item) => {
            acc.sumTotals += item.value;
            acc.items.push(item);
            return acc;
        }, {
            sumTotals: 0,
            items: [],
        });
    }, [payload]);
    if (active && items.length) {
        return (_jsx("div", { className: css({
                zIndex: 1000,
                pointerEvents: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                backgroundColor: theme.menuBackground,
                color: theme.menuItemText,
                padding: 10,
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: label }) }), _jsxs("div", { style: { lineHeight: 1.4 }, children: [items.map((pay, i) => {
                                return (pay.value !== 0 &&
                                    (compact ? i < 5 : true) && (_jsx(AlignedText, { left: pay.name, right: format(pay.value, 'financial'), style: {
                                        color: pay.color,
                                        textDecoration: tooltip === pay.name ? 'underline' : 'inherit',
                                    } }, pay.name)));
                            }), payload.length > 5 && compact && '...', _jsx(AlignedText, { left: t('Total'), right: format(sumTotals, 'financial'), style: {
                                    fontWeight: 600,
                                } })] })] }) }));
    }
};
const customLabel = props => {
    const calcX = props.x + props.width / 2;
    const calcY = props.y + props.height / 2;
    const textAnchor = 'middle';
    const display = props.value && `${props.format(props.value, 'financial-no-decimals')}`;
    const textSize = '12px';
    const showLabel = props.height;
    const showLabelThreshold = 20;
    const fill = theme.reportsInnerLabel;
    return renderCustomLabel(calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill);
};
export function StackedBarGraph({ style, data, filters, groupBy, compact, viewLabels, balanceTypeOp, showHiddenCategories, showOffBudget, showTooltip = true, interval, }) {
    const navigate = useNavigate();
    const categories = useCategories();
    const accounts = useAccounts();
    const privacyMode = usePrivacyMode();
    const format = useFormat();
    const customLabelWithFormat = props => customLabel({ ...props, format });
    const [pointer, setPointer] = useState('');
    const [tooltip, setTooltip] = useState('');
    const largestValue = data.intervalData
        .map(c => c[balanceTypeOp])
        .reduce((acc, cur) => (Math.abs(cur) > Math.abs(acc) ? cur : acc), 0);
    const leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 0;
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data.intervalData && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(BarChart, { width: width, height: height, data: data.intervalData, margin: { top: 0, right: 0, left: leftMargin, bottom: 10 }, style: { cursor: pointer }, stackOffset: "sign" //stacked by sign
                        , children: [showTooltip && (_jsx(Tooltip, { content: _jsx(CustomTooltip, { compact: compact, tooltip: tooltip, format: format }), formatter: numberFormatterTooltip, isAnimationActive: false, cursor: { fill: 'transparent' } })), _jsx(XAxis, { dataKey: "date", tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } }), !compact && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), !compact && (_jsx(YAxis, { tickFormatter: value => getCustomTick(format(value, 'financial-no-decimals'), privacyMode), tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, tickSize: 0 })), data.legend
                                .slice(0)
                                .reverse()
                                .map(entry => (_jsx(Bar, { dataKey: entry.name, stackId: "a", fill: entry.color, onMouseLeave: () => {
                                    setPointer('');
                                    setTooltip('');
                                }, onMouseEnter: () => {
                                    setTooltip(entry.name);
                                    if (!['Group', 'Interval'].includes(groupBy)) {
                                        setPointer('pointer');
                                    }
                                }, onClick: e => ((compact && showTooltip) || !compact) &&
                                    !['Group', 'Interval'].includes(groupBy) &&
                                    showActivity({
                                        navigate,
                                        categories,
                                        accounts,
                                        balanceTypeOp,
                                        filters,
                                        showHiddenCategories,
                                        showOffBudget,
                                        type: 'time',
                                        startDate: e.payload?.intervalStartDate,
                                        endDate: e.payload?.intervalEndDate,
                                        field: groupBy.toLowerCase(),
                                        id: entry.id,
                                        interval,
                                    }), children: viewLabels && !compact && (_jsx(LabelList, { dataKey: entry.name, content: customLabelWithFormat })) }, entry.name)))] })] }) })) }));
}
