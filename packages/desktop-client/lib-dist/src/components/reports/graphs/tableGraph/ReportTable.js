import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useLayoutEffect, useRef, } from 'react';
import { Block } from '@actual-app/components/block';
import { View } from '@actual-app/components/view';
import { ReportTableHeader } from './ReportTableHeader';
import { ReportTableList } from './ReportTableList';
import { ReportTableRow } from './ReportTableRow';
import { ReportTableTotals } from './ReportTableTotals';
export function ReportTable({ saveScrollWidth, headerScrollRef, listScrollRef, totalScrollRef, handleScroll, groupBy, balanceTypeOp, data, filters, mode, intervalsCount, interval, compact, style, compactStyle, showHiddenCategories, showOffBudget, }) {
    const contentRef = useRef(null);
    useLayoutEffect(() => {
        if (contentRef.current && saveScrollWidth) {
            saveScrollWidth(contentRef.current ? contentRef.current.offsetWidth : 0);
        }
    });
    const renderRow = useCallback(({ item, mode, style }) => {
        return (_jsx(ReportTableRow, { item: item, balanceTypeOp: balanceTypeOp, groupBy: groupBy, mode: mode, filters: filters, startDate: data.startDate, endDate: data.endDate, intervalsCount: intervalsCount, compact: compact, style: style, compactStyle: compactStyle, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, interval: interval }));
    }, []);
    const renderTotals = useCallback(({ metadata, mode, totalsStyle, testStyle, scrollWidthTotals, }) => {
        return (_jsx(ReportTableRow, { item: metadata, balanceTypeOp: balanceTypeOp, groupBy: groupBy, mode: mode, filters: filters, startDate: data.startDate, endDate: data.endDate, intervalsCount: intervalsCount, compact: compact, style: totalsStyle, compactStyle: compactStyle, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, totalStyle: testStyle, totalScrollRef: totalScrollRef, handleScroll: handleScroll, height: 32 + scrollWidthTotals, interval: interval, colorized: true }));
    }, []);
    return (_jsxs(View, { children: [_jsx(ReportTableHeader, { headerScrollRef: headerScrollRef, handleScroll: handleScroll, data: data.intervalData, groupBy: groupBy, interval: interval, balanceTypeOp: balanceTypeOp, compact: compact, style: style, compactStyle: compactStyle, mode: mode }), _jsx(View, { style: {
                    flex: 1,
                    flexDirection: 'row',
                    outline: 'none',
                    '& .animated .animated-row': { transition: '.25s transform' },
                }, tabIndex: 1, children: _jsx(Block, { innerRef: listScrollRef, onScroll: handleScroll, id: "list", style: {
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        '::-webkit-scrollbar': { display: 'none' },
                        flex: 1,
                        outline: 'none',
                        '& .animated .animated-row': { transition: '.25s transform' },
                    }, children: _jsx(ReportTableList, { data: data, mode: mode, groupBy: groupBy, renderRow: renderRow, style: style }) }) }), _jsx(ReportTableTotals, { data: data, mode: mode, totalScrollRef: totalScrollRef, compact: compact, style: style, renderTotals: renderTotals })] }));
}
