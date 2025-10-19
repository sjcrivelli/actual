import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
import { styles } from '@actual-app/components/styles';
import { AreaGraph } from './graphs/AreaGraph';
import { BarGraph } from './graphs/BarGraph';
import { BarLineGraph } from './graphs/BarLineGraph';
import { DonutGraph } from './graphs/DonutGraph';
import { LineGraph } from './graphs/LineGraph';
import { StackedBarGraph } from './graphs/StackedBarGraph';
import { ReportTable } from './graphs/tableGraph/ReportTable';
import { ReportOptions } from './ReportOptions';
export function ChooseGraph({ data, filters = [], mode, graphType, balanceType, groupBy, interval, setScrollWidth, viewLabels = false, compact, style, showHiddenCategories = false, showOffBudget = false, showTooltip = true, intervalsCount, }) {
    const graphStyle = compact
        ? { ...style }
        : { flexGrow: 1, overflow: 'hidden' };
    const balanceTypeOp = ReportOptions.balanceTypeMap.get(balanceType) || 'totalDebts';
    const saveScrollWidth = (value) => {
        setScrollWidth?.(value || 0);
    };
    const rowStyle = compact
        ? { flex: '0 0 20px', height: 20 }
        : {};
    const compactStyle = compact ? { ...styles.tinyText } : {};
    const headerScrollRef = useRef(null);
    const listScrollRef = useRef(null);
    const totalScrollRef = useRef(null);
    const handleScroll = (scroll) => {
        if (scroll.currentTarget.id === 'header' &&
            totalScrollRef.current &&
            listScrollRef.current) {
            totalScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            listScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
        if (scroll.currentTarget.id === 'total' &&
            headerScrollRef.current &&
            listScrollRef.current) {
            headerScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            listScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
        if (scroll.currentTarget.id === 'list' &&
            totalScrollRef.current &&
            headerScrollRef.current) {
            headerScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            totalScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
    };
    if (graphType === 'AreaGraph') {
        return (_jsx(AreaGraph, { style: graphStyle, compact: compact, data: data, balanceTypeOp: balanceTypeOp, viewLabels: viewLabels, showTooltip: showTooltip }));
    }
    if (graphType === 'BarGraph') {
        return (_jsx(BarGraph, { style: graphStyle, compact: compact, data: data, filters: filters, groupBy: groupBy, balanceTypeOp: balanceTypeOp, viewLabels: viewLabels, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, showTooltip: showTooltip }));
    }
    if (graphType === 'BarLineGraph') {
        return (_jsx(BarLineGraph, { style: graphStyle, compact: compact, data: data, showTooltip: showTooltip }));
    }
    if (graphType === 'DonutGraph') {
        return (_jsx(DonutGraph, { style: graphStyle, data: data, filters: filters, groupBy: groupBy, balanceTypeOp: balanceTypeOp, viewLabels: viewLabels, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, showTooltip: showTooltip }));
    }
    if (graphType === 'LineGraph') {
        return (_jsx(LineGraph, { style: graphStyle, compact: compact, data: data, filters: filters, groupBy: groupBy, balanceTypeOp: balanceTypeOp, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, showTooltip: showTooltip, interval: interval }));
    }
    if (graphType === 'StackedBarGraph') {
        return (_jsx(StackedBarGraph, { style: graphStyle, compact: compact, data: data, filters: filters, viewLabels: viewLabels, balanceTypeOp: balanceTypeOp, groupBy: groupBy, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, showTooltip: showTooltip, interval: interval }));
    }
    if (graphType === 'TableGraph') {
        return (_jsx(ReportTable, { saveScrollWidth: saveScrollWidth, headerScrollRef: headerScrollRef, listScrollRef: listScrollRef, totalScrollRef: totalScrollRef, handleScroll: handleScroll, balanceTypeOp: balanceTypeOp, groupBy: groupBy, data: data, filters: filters, mode: mode, intervalsCount: intervalsCount, interval: interval, compact: compact, style: rowStyle, compactStyle: compactStyle, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget }));
    }
    return null;
}
