import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, } from 'recharts';
import { adjustTextSize } from './adjustTextSize';
import { renderCustomLabel } from './renderCustomLabel';
import { Container } from '@desktop-client/components/reports/Container';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { usePrivacyMode } from '@desktop-client/hooks/usePrivacyMode';
const CustomTooltip = ({ active, payload, balanceTypeOp, format, }) => {
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
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: payload[0].payload.date }) }), _jsxs("div", { style: { lineHeight: 1.5 }, children: [['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Assets:'), right: format(payload[0].payload.totalAssets, 'financial') })), ['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Debts:'), right: format(payload[0].payload.totalDebts, 'financial') })), ['netAssets'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net Assets:'), right: format(payload[0].payload.netAssets, 'financial') })), ['netDebts'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net Debts:'), right: format(payload[0].payload.netDebts, 'financial') })), ['totalTotals'].includes(balanceTypeOp) && (_jsx(AlignedText, { left: t('Net:'), right: _jsx("strong", { children: format(payload[0].payload.totalTotals, 'financial') }) }))] })] }) }));
    }
    return _jsx("div", {});
};
const customLabel = ({ props, width, end, format, }) => {
    //Add margin to first and last object
    const calcX = (typeof props.x === 'number' ? props.x : 0) +
        (props.index === end ? -10 : props.index === 0 ? 5 : 0);
    const calcY = (typeof props.y === 'number' ? props.y : 0) -
        ((typeof props.value === 'number' ? props.value : 0) > 0 ? 10 : -10);
    const textAnchor = props.index === 0 ? 'start' : 'middle';
    const display = typeof props.value !== 'string' && props.value !== 0
        ? `${format(props.value || 0, 'financial-no-decimals')}`
        : '';
    const textSize = adjustTextSize({ sized: width, type: 'area' });
    return renderCustomLabel(calcX, calcY, textAnchor, display, textSize);
};
export function AreaGraph({ style, data, balanceTypeOp, compact, viewLabels, showTooltip = true, }) {
    const format = useFormat();
    const privacyMode = usePrivacyMode();
    const dataMax = Math.max(...data.intervalData.map(i => i[balanceTypeOp]));
    const dataMin = Math.min(...data.intervalData.map(i => i[balanceTypeOp]));
    const labelsMargin = viewLabels ? 30 : 0;
    const dataDiff = dataMax - dataMin;
    const absDataMax = Math.max(Math.abs(dataMax), Math.abs(dataMin));
    //Calculate how much to add to max and min values for graph range
    const extendRangeAmount = Math.floor(dataDiff / 20);
    const labelsMin = 
    //If min is zero or graph range passes zero then set it to zero
    dataMin === 0 || Math.abs(dataMin) <= extendRangeAmount
        ? 0
        : //Else add the range and round to nearest 100s
            Math.floor((dataMin - extendRangeAmount) / 100) * 100;
    //Same as above but for max
    const labelsMax = dataMax === 0 || Math.abs(dataMax) <= extendRangeAmount
        ? 0
        : Math.ceil((dataMax + extendRangeAmount) / 100) * 100;
    const lastLabel = data.intervalData.length - 1;
    const tickFormatter = (tick) => {
        if (!privacyMode)
            return `${format(tick, 'financial-no-decimals')}`; // Formats the tick values as strings with commas
        return '...';
    };
    const gradientOffset = () => {
        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    const off = gradientOffset();
    const leftMargin = Math.abs(absDataMax) > 1000000 ? 20 : 0;
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data.intervalData && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(AreaChart, { width: width, height: height, data: data.intervalData, margin: {
                            top: 0,
                            right: labelsMargin,
                            left: leftMargin,
                            bottom: 10,
                        }, children: [compact ? null : (_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false })), compact ? null : (_jsx(XAxis, { dataKey: "date", tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText } })), compact ? null : (_jsx(YAxis, { dataKey: balanceTypeOp, domain: [
                                    viewLabels ? labelsMin : 'auto',
                                    viewLabels ? labelsMax : 'auto',
                                ], tickFormatter: tickFormatter, tick: { fill: theme.pageText }, tickLine: { stroke: theme.pageText }, tickSize: 0 })), showTooltip && (_jsx(Tooltip, { content: _jsx(CustomTooltip, { balanceTypeOp: balanceTypeOp, format: format }), isAnimationActive: false })), _jsxs("defs", { children: [_jsxs("linearGradient", { id: `fill${balanceTypeOp}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: off, stopColor: theme.reportsBlue, stopOpacity: 0.2 }), _jsx("stop", { offset: off, stopColor: theme.reportsRed, stopOpacity: 0.2 })] }), _jsxs("linearGradient", { id: `stroke${balanceTypeOp}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: off, stopColor: theme.reportsBlue, stopOpacity: 1 }), _jsx("stop", { offset: off, stopColor: theme.reportsRed, stopOpacity: 1 })] })] }), _jsx(Area, { type: "linear", dot: false, activeDot: false, animationDuration: 0, dataKey: balanceTypeOp, stroke: `url(#stroke${balanceTypeOp})`, fill: `url(#fill${balanceTypeOp})`, fillOpacity: 1, children: viewLabels && !compact && (_jsx(LabelList, { dataKey: balanceTypeOp, content: props => customLabel({
                                        props,
                                        width,
                                        end: lastLabel,
                                        format,
                                    }) })) })] })] }) })) }));
}
