import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { computePadding } from './util/computePadding';
import { Container } from '@desktop-client/components/reports/Container';
import { numberFormatterTooltip } from '@desktop-client/components/reports/numberFormatter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
const CustomTooltip = ({ active, payload, balanceTypeOp, selection, compare, format, }) => {
    const { t } = useTranslation();
    if (active && payload && payload.length) {
        const comparison = ['average', 'budget'].includes(selection)
            ? payload[0].payload[selection] * -1
            : (payload[0].payload.months[selection]?.cumulative ?? 0) * -1;
        return (_jsx("div", { className: css({
                zIndex: 1000,
                pointerEvents: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                backgroundColor: theme.menuBackground,
                color: theme.menuItemText,
                padding: 10,
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: _jsxs(Trans, { children: ["Day:", ' ', {
                                        dayOfMonth: Number(payload[0].payload.day) >= 28
                                            ? t('28+')
                                            : payload[0].payload.day,
                                    }] }) }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [payload[0].payload.months[compare]?.cumulative ? (_jsx(AlignedText, { left: t('Compare:'), right: format(payload[0].payload.months[compare]?.cumulative * -1, 'financial') })) : null, ['cumulative'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: selection === 'average'
                                    ? t('Average:')
                                    : selection === 'budget'
                                        ? t('Budgeted:')
                                        : t('To:'), right: format(Math.round(comparison), 'financial') })), payload[0].payload.months[compare]?.cumulative ? (_jsx(AlignedText, { left: t('Difference:'), right: format(Math.round(payload[0].payload.months[compare]?.cumulative * -1 -
                                    comparison), 'financial') })) : null] })] }) }));
    }
};
export function SpendingGraph({ style, data, compact, mode, compare, compareTo, }) {
    const privacyMode = usePrivacyMode();
    const balanceTypeOp = 'cumulative';
    const format = useFormat();
    const selection = mode === 'single-month' ? compareTo : mode;
    const thisMonthMax = data.intervalData.reduce((a, b) => a.months[compare]?.[balanceTypeOp] < b.months[compare]?.[balanceTypeOp]
        ? a
        : b).months[compare]?.[balanceTypeOp];
    const selectionMax = ['average', 'budget'].includes(selection)
        ? data.intervalData[27][selection]
        : data.intervalData.reduce((a, b) => a.months[selection]?.[balanceTypeOp] <
            b.months[selection]?.[balanceTypeOp]
            ? a
            : b).months[selection]?.[balanceTypeOp];
    const maxYAxis = selectionMax > thisMonthMax;
    const dataMax = Math.max(...data.intervalData.map(i => i.months[compare]?.cumulative));
    const dataMin = Math.min(...data.intervalData.map(i => i.months[compare]?.cumulative));
    const tickFormatter = tick => {
        if (!privacyMode)
            return `${format(tick, 'financial-no-decimals')}`;
        return '...';
    };
    const gradientOffset = () => {
        if (!dataMax || dataMax <= 0) {
            return 0;
        }
        if (!dataMin || dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    const getVal = (obj, month) => {
        if (['average', 'budget'].includes(month)) {
            return obj[month] && -1 * obj[month];
        }
        else {
            return (obj.months[month]?.[balanceTypeOp] &&
                -1 * obj.months[month][balanceTypeOp]);
        }
    };
    const getDate = obj => {
        return Number(obj.day) >= 28 ? '28+' : obj.day;
    };
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data.intervalData && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '5px' } }), _jsxs(AreaChart, { width: width, height: height, data: data.intervalData, margin: {
                            top: 0,
                            right: 0,
                            left: computePadding(data.intervalData
                                .map(item => getVal(item, maxYAxis ? compare : selection))
                                .filter(value => value !== undefined), (value) => format(value, 'financial-no-decimals')),
                            bottom: 0,
                        }, children: [compact ? null : (_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false })), compact ? null : (_jsx(XAxis, { dataKey: val => getDate(val), tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } })), compact ? null : (_jsx(YAxis, { dataKey: val => getVal(val, maxYAxis ? compare : selection), domain: [0, 'auto'], tickFormatter: tickFormatter, tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, tickSize: 0 })), _jsx(Tooltip, { content: _jsx(CustomTooltip, { balanceTypeOp: balanceTypeOp, selection: selection, compare: compare, format: format }), formatter: numberFormatterTooltip, isAnimationActive: false }), _jsxs("defs", { children: [_jsx("linearGradient", { id: `fill${balanceTypeOp}`, x1: "0", y1: "0", x2: "0", y2: "1", children: _jsx("stop", { offset: gradientOffset(), stopColor: theme.reportsGreen, stopOpacity: 0.2 }) }), _jsx("linearGradient", { id: `stroke${balanceTypeOp}`, x1: "0", y1: "0", x2: "0", y2: "1", children: _jsx("stop", { offset: gradientOffset(), stopColor: theme.reportsGreen, stopOpacity: 1 }) })] }), _jsx(Area, { type: "linear", dot: false, activeDot: {
                                    fill: theme.reportsGreen,
                                    fillOpacity: 1,
                                    r: 10,
                                }, animationDuration: 0, dataKey: val => getVal(val, compare), stroke: `url(#stroke${balanceTypeOp})`, strokeWidth: 3, fill: `url(#fill${balanceTypeOp})`, fillOpacity: 1 }), _jsx(Area, { type: "linear", dot: false, activeDot: false, animationDuration: 0, dataKey: val => getVal(val, selection), stroke: theme.reportsGray, strokeDasharray: "10 10", strokeWidth: 3, fill: theme.reportsGray, fillOpacity: 0.2 })] })] }) })) }));
}
