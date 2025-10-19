import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, } from 'react';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { showActivity } from '@desktop-client/components/reports/graphs/showActivity';
import { Row, Cell } from '@desktop-client/components/table';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
const getAmountColor = (amount) => {
    if (amount === 0)
        return undefined;
    return amount > 0 ? theme.noticeText : theme.errorText;
};
export const ReportTableRow = memo(({ item, balanceTypeOp, groupBy, mode, filters = [], startDate = '', endDate, intervalsCount, compact, style, compactStyle, totalStyle, showHiddenCategories = false, showOffBudget = false, totalScrollRef, handleScroll, height, interval, colorized, }) => {
    const average = Math.round(item[balanceTypeOp] / intervalsCount);
    const groupByItem = groupBy === 'Interval' ? 'date' : 'name';
    const format = useFormat();
    const navigate = useNavigate();
    const { isNarrowWidth } = useResponsive();
    const categories = useCategories();
    const accounts = useAccounts();
    const pointer = !isNarrowWidth &&
        !['Group', 'Interval'].includes(groupBy) &&
        !compact &&
        !categories.grouped.map(g => g.id).includes(item.id)
        ? 'pointer'
        : 'inherit';
    const hoverUnderline = !isNarrowWidth &&
        !['Group', 'Interval'].includes(groupBy) &&
        !compact &&
        !categories.grouped.map(g => g.id).includes(item.id)
        ? {
            cursor: pointer,
            ':hover': { textDecoration: 'underline' },
            flexGrow: 0,
        }
        : {};
    return (_jsx(Row, { height: height, collapsed: true, style: {
            color: theme.tableText,
            backgroundColor: theme.tableBackground,
            ...style,
        }, children: _jsxs(View, { innerRef: totalScrollRef, onScroll: handleScroll, id: totalScrollRef ? 'total' : item.id, style: {
                flexDirection: 'row',
                flex: 1,
                ...totalStyle,
            }, children: [_jsx(Cell, { value: item[groupByItem], title: item[groupByItem], style: {
                        width: compact ? 80 : 125,
                        flexShrink: 0,
                        flexGrow: 1,
                    }, valueStyle: compactStyle }), item.intervalData && mode === 'time'
                    ? item.intervalData.map((intervalItem, index) => {
                        return (_jsx(Cell, { style: {
                                minWidth: compact ? 50 : 85,
                                ...(colorized && {
                                    color: getAmountColor(intervalItem[balanceTypeOp]),
                                }),
                            }, unexposedContent: ({ value }) => (_jsx(Text, { style: hoverUnderline, children: value })), valueStyle: compactStyle, value: format(intervalItem[balanceTypeOp], 'financial'), title: Math.abs(intervalItem[balanceTypeOp]) > 100000
                                ? format(intervalItem[balanceTypeOp], 'financial')
                                : undefined, onClick: () => !isNarrowWidth &&
                                !['Group', 'Interval'].includes(groupBy) &&
                                !compact &&
                                !categories.grouped.map(g => g.id).includes(item.id) &&
                                showActivity({
                                    navigate,
                                    categories,
                                    accounts,
                                    balanceTypeOp,
                                    filters,
                                    showHiddenCategories,
                                    showOffBudget,
                                    type: 'time',
                                    startDate: intervalItem.intervalStartDate || '',
                                    endDate: intervalItem.intervalEndDate || '',
                                    field: groupBy.toLowerCase(),
                                    id: item.id,
                                    interval,
                                }), width: "flex", privacyFilter: true }, index));
                    })
                    : balanceTypeOp === 'totalTotals' && (_jsxs(_Fragment, { children: [_jsx(Cell, { value: format(item.totalAssets, 'financial'), title: Math.abs(item.totalAssets) > 100000
                                    ? format(item.totalAssets, 'financial')
                                    : undefined, width: "flex", privacyFilter: true, style: {
                                    minWidth: compact ? 50 : 85,
                                    ...(colorized && {
                                        color: getAmountColor(item.totalAssets),
                                    }),
                                }, unexposedContent: ({ value }) => (_jsx(Text, { style: hoverUnderline, children: value })), valueStyle: compactStyle, onClick: () => !isNarrowWidth &&
                                    !['Group', 'Interval'].includes(groupBy) &&
                                    !compact &&
                                    !categories.grouped.map(g => g.id).includes(item.id) &&
                                    showActivity({
                                        navigate,
                                        categories,
                                        accounts,
                                        balanceTypeOp,
                                        filters,
                                        showHiddenCategories,
                                        showOffBudget,
                                        type: 'assets',
                                        startDate,
                                        endDate,
                                        field: groupBy.toLowerCase(),
                                        id: item.id,
                                    }) }), _jsx(Cell, { value: format(item.totalDebts, 'financial'), title: Math.abs(item.totalDebts) > 100000
                                    ? format(item.totalDebts, 'financial')
                                    : undefined, width: "flex", privacyFilter: true, style: {
                                    minWidth: compact ? 50 : 85,
                                    ...(colorized && {
                                        color: getAmountColor(item.totalDebts),
                                    }),
                                }, unexposedContent: ({ value }) => (_jsx(Text, { style: hoverUnderline, children: value })), valueStyle: compactStyle, onClick: () => !isNarrowWidth &&
                                    !['Group', 'Interval'].includes(groupBy) &&
                                    !compact &&
                                    !categories.grouped.map(g => g.id).includes(item.id) &&
                                    showActivity({
                                        navigate,
                                        categories,
                                        accounts,
                                        balanceTypeOp,
                                        filters,
                                        showHiddenCategories,
                                        showOffBudget,
                                        type: 'debts',
                                        startDate,
                                        endDate,
                                        field: groupBy.toLowerCase(),
                                        id: item.id,
                                    }) })] })), _jsx(Cell, { value: format(item[balanceTypeOp], 'financial'), title: Math.abs(item[balanceTypeOp]) > 100000
                        ? format(item[balanceTypeOp], 'financial')
                        : undefined, style: {
                        fontWeight: 600,
                        minWidth: compact ? 50 : 85,
                        ...(colorized && { color: getAmountColor(item[balanceTypeOp]) }),
                    }, unexposedContent: ({ value }) => (_jsx(Text, { style: hoverUnderline, children: value })), valueStyle: compactStyle, onClick: () => !isNarrowWidth &&
                        !['Group', 'Interval'].includes(groupBy) &&
                        !compact &&
                        !categories.grouped.map(g => g.id).includes(item.id) &&
                        showActivity({
                            navigate,
                            categories,
                            accounts,
                            balanceTypeOp,
                            filters,
                            showHiddenCategories,
                            showOffBudget,
                            type: 'totals',
                            startDate,
                            endDate,
                            field: groupBy.toLowerCase(),
                            id: item.id,
                        }), width: "flex", privacyFilter: true }), _jsx(Cell, { value: format(average, 'financial'), title: Math.abs(average / 100) > 100000
                        ? format(average, 'financial')
                        : undefined, style: {
                        fontWeight: 600,
                        minWidth: compact ? 50 : 85,
                        ...(colorized && { color: getAmountColor(average) }),
                    }, valueStyle: compactStyle, width: "flex", privacyFilter: true })] }) }, item.id));
});
ReportTableRow.displayName = 'ReportTableRow';
