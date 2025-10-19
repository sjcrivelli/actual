import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { ComposedChart, Line, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Container } from '@desktop-client/components/reports/Container';
import { numberFormatterTooltip } from '@desktop-client/components/reports/numberFormatter';
import { useFormat } from '@desktop-client/hooks/useFormat';
const CustomTooltip = ({ active, payload }) => {
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
            }), children: _jsxs("div", { children: [_jsx("div", { style: { marginBottom: 10 }, children: _jsx("strong", { children: payload[0].payload.date }) }), _jsx("div", { style: { lineHeight: 1.5 }, children: _jsxs(PrivacyFilter, { children: [_jsx(AlignedText, { left: t('Assets:'), right: payload[0].payload.assets }), _jsx(AlignedText, { left: t('Debt:'), right: payload[0].payload.debt }), _jsx(AlignedText, { left: t('Change:'), right: _jsx("strong", { children: payload[0].payload.change }) })] }) })] }) }));
    }
};
export function BarLineGraph({ style, data, compact, showTooltip = true, }) {
    const format = useFormat();
    const tickFormatter = tick => {
        return `${format(Math.round(tick), 'financial')}`; // Formats the tick values as strings with commas
    };
    return (_jsx(Container, { style: {
            ...style,
            ...(compact && { height: 'auto' }),
        }, children: (width, height) => data && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(ComposedChart, { width: width, height: height, data: data.data, margin: { top: 0, right: 0, left: 0, bottom: 0 }, children: [showTooltip && (_jsx(Tooltip, { content: _jsx(CustomTooltip, {}), formatter: numberFormatterTooltip, isAnimationActive: false })), !compact && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), !compact && _jsx(XAxis, { dataKey: "x" }), !compact && (_jsx(YAxis, { dataKey: "y", tickFormatter: tickFormatter })), _jsx(Bar, { type: "monotone", dataKey: "y", fill: "#8884d8" }), _jsx(Line, { type: "monotone", dataKey: "y", stroke: "#8884d8" })] })] }) })) }));
}
