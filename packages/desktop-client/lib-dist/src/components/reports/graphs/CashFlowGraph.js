import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import * as d from 'date-fns';
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';
import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { Container } from '@desktop-client/components/reports/Container';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
const MAX_BAR_SIZE = 50;
const ANIMATION_DURATION = 1000; // in ms
function CustomTooltip({ active, payload, isConcise, format, }) {
    const locale = useLocale();
    const { t } = useTranslation();
    if (!active || !payload || !Array.isArray(payload) || !payload[0]) {
        return null;
    }
    const [{ payload: data }] = payload;
    return (_jsx("div", { className: css({
            pointerEvents: 'none',
            borderRadius: 2,
            boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
            backgroundColor: theme.menuBackground,
            color: theme.menuItemText,
            padding: 10,
        }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: d.format(data.date, isConcise ? 'MMMM yyyy' : 'MMMM dd, yyyy', {
                            locale,
                        }) }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [_jsx(AlignedText, { left: t('Income:'), right: format(data.income, 'financial') }), _jsx(AlignedText, { left: t('Expenses:'), right: format(data.expenses, 'financial') }), _jsx(AlignedText, { left: t('Change:'), right: _jsx("strong", { children: format(data.income + data.expenses, 'financial') }) }), data.transfers !== 0 && (_jsx(AlignedText, { left: t('Transfers:'), right: format(data.transfers, 'financial') })), _jsx(AlignedText, { left: t('Balance:'), right: format(data.balance, 'financial') })] })] }) }));
}
export function CashFlowGraph({ graphData, isConcise, showBalance = true, style, }) {
    const locale = useLocale();
    const privacyMode = usePrivacyMode();
    const [yAxisIsHovered, setYAxisIsHovered] = useState(false);
    const format = useFormat();
    const data = graphData.expenses.map((row, idx) => ({
        date: row.x,
        expenses: row.y,
        income: graphData.income[idx].y,
        balance: graphData.balances[idx].y,
        transfers: graphData.transfers[idx].y,
    }));
    return (_jsx(Container, { style: style, children: (width, height) => (_jsx(ResponsiveContainer, { children: _jsxs(ComposedChart, { width: width, height: height, stackOffset: "sign", data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "date", tick: { fill: theme.reportsLabel }, tickFormatter: x => {
                            // eslint-disable-next-line actual/typography
                            return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                                locale,
                            });
                        }, minTickGap: 50 }), _jsx(YAxis, { tick: { fill: theme.reportsLabel }, tickCount: 8, tickFormatter: value => privacyMode && !yAxisIsHovered
                            ? '...'
                            : format(value, 'financial-no-decimals'), onMouseEnter: () => setYAxisIsHovered(true), onMouseLeave: () => setYAxisIsHovered(false) }), _jsx(Tooltip, { labelFormatter: x => {
                            // eslint-disable-next-line actual/typography
                            return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                                locale,
                            });
                        }, content: _jsx(CustomTooltip, { isConcise: isConcise, format: format }), isAnimationActive: false }), _jsx(ReferenceLine, { y: 0, stroke: "#000" }), _jsx(Bar, { dataKey: "income", stackId: "a", fill: chartTheme.colors.blue, maxBarSize: MAX_BAR_SIZE, animationDuration: ANIMATION_DURATION }), _jsx(Bar, { dataKey: "expenses", stackId: "a", fill: chartTheme.colors.red, maxBarSize: MAX_BAR_SIZE, animationDuration: ANIMATION_DURATION }), _jsx(Line, { type: "monotone", dataKey: "balance", dot: false, hide: !showBalance, stroke: theme.pageTextLight, strokeWidth: 2, animationDuration: ANIMATION_DURATION })] }) })) }));
}
