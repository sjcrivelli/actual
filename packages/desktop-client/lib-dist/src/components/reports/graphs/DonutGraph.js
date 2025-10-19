import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { theme } from '@actual-app/components/theme';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip, } from 'recharts';
import { adjustTextSize } from './adjustTextSize';
import { renderCustomLabel } from './renderCustomLabel';
import { showActivity } from './showActivity';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Container } from '@desktop-client/components/reports/Container';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
const RADIAN = Math.PI / 180;
const canDeviceHover = () => window.matchMedia('(hover: hover)').matches;
const ActiveShapeMobile = props => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, format, } = props;
    const yAxis = payload.name ?? payload.date;
    const sin = Math.sin(-RADIAN * 240);
    const my = cy + outerRadius * sin;
    const ey = my - 5;
    return (_jsxs("g", { children: [_jsx("text", { x: cx, y: cy + outerRadius * Math.sin(-RADIAN * 270) + 15, dy: 0, textAnchor: "middle", fill: fill, children: `${yAxis}` }), _jsxs(PrivacyFilter, { children: [_jsx("text", { x: cx + outerRadius * Math.cos(-RADIAN * 240) - 30, y: ey, dy: 0, textAnchor: "end", fill: fill, children: `${format(value, 'financial')}` }), _jsx("text", { x: cx + outerRadius * Math.cos(-RADIAN * 330) + 10, y: ey, dy: 0, textAnchor: "start", fill: "#999", children: `${(percent * 100).toFixed(2)}%` })] }), _jsx(Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle, fill: fill }), _jsx(Sector, { cx: cx, cy: cy, startAngle: startAngle, endAngle: endAngle, innerRadius: innerRadius - 8, outerRadius: innerRadius - 6, fill: fill })] }));
};
const ActiveShapeMobileWithFormat = props => (_jsx(ActiveShapeMobile, { ...props, format: props.format }));
const ActiveShape = props => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, format, } = props;
    const yAxis = payload.name ?? payload.date;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (innerRadius - 10) * cos;
    const sy = cy + (innerRadius - 10) * sin;
    const mx = cx + (innerRadius - 30) * cos;
    const my = cy + (innerRadius - 30) * sin;
    const ex = cx + (cos >= 0 ? 1 : -1) * yAxis.length * 4;
    const ey = cy + 8;
    const textAnchor = cos <= 0 ? 'start' : 'end';
    return (_jsxs("g", { children: [_jsx(Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle, fill: fill }), _jsx(Sector, { cx: cx, cy: cy, startAngle: startAngle, endAngle: endAngle, innerRadius: outerRadius + 6, outerRadius: outerRadius + 10, fill: fill }), _jsx("path", { d: `M${sx},${sy}L${mx},${my}L${ex},${ey}`, stroke: fill, fill: "none" }), _jsx("circle", { cx: ex, cy: ey, r: 3, fill: fill, stroke: "none" }), _jsx("text", { x: ex + (cos <= 0 ? 1 : -1) * 16, y: ey, textAnchor: textAnchor, fill: fill, children: `${yAxis}` }), _jsxs(PrivacyFilter, { children: [_jsx("text", { x: ex + (cos <= 0 ? 1 : -1) * 16, y: ey, dy: 18, textAnchor: textAnchor, fill: fill, children: `${format(value, 'financial')}` }), _jsx("text", { x: ex + (cos <= 0 ? 1 : -1) * 16, y: ey, dy: 36, textAnchor: textAnchor, fill: "#999", children: `(${(percent * 100).toFixed(2)}%)` })] })] }));
};
const ActiveShapeWithFormat = props => (_jsx(ActiveShape, { ...props, format: props.format }));
const customLabel = props => {
    const radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.5;
    const size = props.cx > props.cy ? props.cy : props.cx;
    const calcX = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
    const calcY = props.cy + radius * Math.sin(-props.midAngle * RADIAN);
    const textAnchor = calcX > props.cx ? 'start' : 'end';
    const display = props.value !== 0 && `${(props.percent * 100).toFixed(0)}%`;
    const textSize = adjustTextSize({ sized: size, type: 'donut' });
    const showLabel = props.percent;
    const showLabelThreshold = 0.05;
    const fill = theme.reportsInnerLabel;
    return renderCustomLabel(calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill);
};
export function DonutGraph({ style, data, filters, groupBy, balanceTypeOp, viewLabels, showHiddenCategories, showOffBudget, showTooltip = true, }) {
    const format = useFormat();
    const yAxis = groupBy === 'Interval' ? 'date' : 'name';
    const splitData = groupBy === 'Interval' ? 'intervalData' : 'data';
    const navigate = useNavigate();
    const categories = useCategories();
    const accounts = useAccounts();
    const [pointer, setPointer] = useState('');
    const getVal = (obj) => {
        if (['totalDebts', 'netDebts'].includes(balanceTypeOp)) {
            return -1 * obj[balanceTypeOp];
        }
        else {
            return obj[balanceTypeOp];
        }
    };
    const [activeIndex, setActiveIndex] = useState(0);
    return (_jsx(Container, { style: style, children: (width, height) => {
            const compact = height <= 300 || width <= 300;
            return (data[splitData] && (_jsx(ResponsiveContainer, { children: _jsxs("div", { children: [!compact && _jsx("div", { style: { marginTop: '15px' } }), _jsxs(PieChart, { width: width, height: height, style: { cursor: pointer }, children: [_jsx(Pie, { activeShape: width < 220 || height < 130
                                        ? undefined
                                        : compact
                                            ? props => (_jsx(ActiveShapeMobileWithFormat, { ...props, format: format }))
                                            : props => (_jsx(ActiveShapeWithFormat, { ...props, format: format })), dataKey: val => getVal(val), nameKey: yAxis, isAnimationActive: false, data: data[splitData]?.map(item => ({
                                        ...item,
                                    })) ?? [], innerRadius: Math.min(width, height) * 0.2, fill: "#8884d8", labelLine: false, label: e => viewLabels && !compact ? customLabel(e) : _jsx("div", {}), startAngle: 90, endAngle: -270, onMouseLeave: () => setPointer(''), onMouseEnter: (_, index) => {
                                        if (canDeviceHover()) {
                                            setActiveIndex(index);
                                            if (!['Group', 'Interval'].includes(groupBy)) {
                                                setPointer('pointer');
                                            }
                                        }
                                    }, onClick: (item, index) => {
                                        if (!canDeviceHover()) {
                                            setActiveIndex(index);
                                        }
                                        if (!['Group', 'Interval'].includes(groupBy) &&
                                            (canDeviceHover() || activeIndex === index) &&
                                            ((compact && showTooltip) || !compact)) {
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
                                            });
                                        }
                                    }, children: data.legend.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { content: () => null, defaultIndex: activeIndex, active: true })] })] }) })));
        } }));
}
