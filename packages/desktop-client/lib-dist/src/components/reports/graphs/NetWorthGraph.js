import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { parse, getDay } from 'date-fns';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { computePadding } from './util/computePadding';
import { Container } from '@desktop-client/components/reports/Container';
import { numberFormatterTooltip } from '@desktop-client/components/reports/numberFormatter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
export function NetWorthGraph({ style, graphData, compact = false, showTooltip = true, interval = 'Monthly', }) {
    const { t } = useTranslation();
    const privacyMode = usePrivacyMode();
    const id = useId();
    const format = useFormat();
    // Use more aggressive smoothening for high-frequency data
    const interpolationType = interval === 'Daily' || interval === 'Weekly' ? 'basis' : 'monotone';
    const tickFormatter = tick => {
        const res = privacyMode
            ? '...'
            : `${format(Math.round(tick), 'financial-no-decimals')}`;
        return res;
    };
    const gradientOffset = () => {
        const dataMax = Math.max(...graphData.data.map(i => i.y));
        const dataMin = Math.min(...graphData.data.map(i => i.y));
        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    const off = gradientOffset();
    const gradientId = `splitColor-${id}`;
    // Generate weekly tick positions when viewing Daily data
    const weeklyTicks = useMemo(() => {
        if (interval !== 'Daily') {
            return undefined;
        }
        return graphData.data
            .filter(point => {
            const date = parse(point.x, 'yy-MM-dd', new Date());
            return getDay(date) === 1; // Monday
        })
            .map(point => point.x);
    }, [interval, graphData.data]);
    // eslint-disable-next-line react/no-unstable-nested-components
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (_jsx("div", { className: css([
                    {
                        zIndex: 1000,
                        pointerEvents: 'none',
                        borderRadius: 2,
                        boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                        backgroundColor: theme.menuBackground,
                        color: theme.menuItemText,
                        padding: 10,
                    },
                    style,
                ]), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: payload[0].payload.date }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [_jsx(AlignedText, { left: t('Assets:'), right: payload[0].payload.assets }), _jsx(AlignedText, { left: t('Debt:'), right: payload[0].payload.debt }), _jsx(AlignedText, { left: t('Net worth:'), right: _jsx("strong", { children: payload[0].payload.networth }) }), _jsx(AlignedText, { left: t('Change:'), right: payload[0].payload.change })] })] }) }));
        }
    };
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => graphData && (_jsx(ResponsiveContainer, { children: _jsx("div", { style: { ...(!compact && { marginTop: '15px' }) }, children: _jsxs(AreaChart, { width: width, height: height, data: graphData.data, margin: {
                        top: 0,
                        right: 0,
                        left: compact
                            ? 0
                            : computePadding(graphData.data.map(item => item.y), value => format(value, 'financial-no-decimals')),
                        bottom: 0,
                    }, children: [compact ? null : (_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false })), _jsx(XAxis, { dataKey: "x", hide: compact, tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, ticks: weeklyTicks }), _jsx(YAxis, { dataKey: "y", domain: ['auto', 'auto'], hide: compact, tickFormatter: tickFormatter, tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } }), showTooltip && (_jsx(Tooltip, { content: _jsx(CustomTooltip, {}), formatter: numberFormatterTooltip, isAnimationActive: false })), _jsx("defs", { children: _jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: off, stopColor: theme.reportsBlue, stopOpacity: 0.2 }), _jsx("stop", { offset: off, stopColor: theme.reportsRed, stopOpacity: 0.2 })] }) }), _jsx(Area, { type: interpolationType, dot: false, activeDot: false, animationDuration: 0, dataKey: "y", stroke: theme.reportsBlue, strokeWidth: 2, fill: `url(#${gradientId})`, fillOpacity: 1, connectNulls: true })] }) }) })) }));
}
