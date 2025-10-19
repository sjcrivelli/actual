import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { showActivity } from './showActivity';
import { Container } from '@desktop-client/components/reports/Container';
import { getCustomTick } from '@desktop-client/components/reports/getCustomTick';
import { numberFormatterTooltip } from '@desktop-client/components/reports/numberFormatter';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
const CustomTooltip = ({ compact, tooltip, active, payload, format, }) => {
    const { t } = useTranslation();
    const { sumTotals, items } = useMemo(() => {
        return (payload ?? [])
            .sort((p1, p2) => p2.value - p1.value)
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
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: payload[0].payload.date }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [items.map((p, index) => {
                                return ((compact ? index < 4 : true) && (_jsx(AlignedText, { left: p.dataKey, right: format(p.value, 'financial'), style: {
                                        color: p.color,
                                        textDecoration: tooltip === p.dataKey ? 'underline' : 'inherit',
                                    } }, index)));
                            }), payload.length > 5 && compact && '...', _jsx(AlignedText, { left: t('Total'), right: format(sumTotals, 'financial'), style: {
                                    fontWeight: 600,
                                } })] })] }) }));
    }
};
export function LineGraph({ style, data, filters, groupBy, compact, balanceTypeOp, showHiddenCategories, showOffBudget, showTooltip = true, interval, }) {
    const navigate = useNavigate();
    const categories = useCategories();
    const accounts = useAccounts();
    const privacyMode = usePrivacyMode();
    const format = useFormat();
    const [pointer, setPointer] = useState('');
    const [tooltip, setTooltip] = useState('');
    const largestValue = data.intervalData
        .map(c => c[balanceTypeOp])
        .reduce((acc, cur) => (Math.abs(cur) > Math.abs(acc) ? cur : acc), 0);
    const leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 5;
    const onShowActivity = (item, id, payload) => {
        showActivity({
            navigate,
            categories,
            accounts,
            balanceTypeOp,
            filters,
            showHiddenCategories,
            showOffBudget,
            type: 'time',
            startDate: payload.payload.intervalStartDate,
            endDate: payload.payload.intervalEndDate,
            field: groupBy.toLowerCase(),
            id,
            interval,
        });
    };
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(LineChart, { width: width, height: height, data: data.intervalData, margin: { top: 10, right: 10, left: leftMargin, bottom: 10 }, style: { cursor: pointer }, children: [showTooltip && (_jsx(Tooltip, { content: _jsx(CustomTooltip, { compact: compact, tooltip: tooltip, format: format }), formatter: numberFormatterTooltip, isAnimationActive: false })), !compact && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), !compact && (_jsx(XAxis, { dataKey: "date", tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } })), !compact && (_jsx(YAxis, { tickFormatter: value => getCustomTick(format(value, 'financial-no-decimals'), privacyMode), tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, tickSize: 0 })), data.legend.map((entry, index) => {
                                return (_jsx(Line, { strokeWidth: 2, type: "monotone", dataKey: entry.name, stroke: entry.color, activeDot: {
                                        r: entry.name === tooltip && !compact ? 8 : 3,
                                        onMouseEnter: () => {
                                            setTooltip(entry.name);
                                            if (!['Group', 'Interval'].includes(groupBy)) {
                                                setPointer('pointer');
                                            }
                                        },
                                        onMouseLeave: () => {
                                            setPointer('');
                                            setTooltip('');
                                        },
                                        onClick: (e, payload) => ((compact && showTooltip) || !compact) &&
                                            !['Group', 'Interval'].includes(groupBy) &&
                                            onShowActivity(e, entry.id, payload),
                                    } }, index));
                            })] })] }) })) }));
}
