import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { ReportOptions } from '@desktop-client/components/reports/ReportOptions';
import { Row, Cell } from '@desktop-client/components/table';
export function ReportTableHeader({ groupBy, interval, data, balanceTypeOp, headerScrollRef, handleScroll, compact, style, compactStyle, mode, }) {
    const { t } = useTranslation();
    return (_jsx(Row, { collapsed: true, style: {
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderColor: theme.tableBorder,
            color: theme.tableHeaderText,
            backgroundColor: theme.tableHeaderBackground,
            fontWeight: 600,
            ...style,
        }, children: _jsxs(View, { innerRef: headerScrollRef, onScroll: handleScroll, id: "header", style: {
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': { display: 'none' },
                flexDirection: 'row',
                flex: 1,
            }, children: [_jsx(Cell, { style: {
                        width: compact ? 80 : 125,
                        flexShrink: 0,
                        flexGrow: 1,
                    }, valueStyle: compactStyle, value: groupBy === 'Interval'
                        ? ReportOptions.intervalMap.get(interval)
                        : groupBy }), mode === 'time'
                    ? data.map((header, index) => {
                        return (_jsx(Cell, { style: {
                                minWidth: compact ? 50 : 85,
                            }, valueStyle: compactStyle, value: header.date, width: "flex" }, index));
                    })
                    : balanceTypeOp === 'totalTotals' && (_jsxs(_Fragment, { children: [_jsx(Cell, { style: {
                                    minWidth: compact ? 50 : 85,
                                }, valueStyle: compactStyle, value: t('Deposits'), width: "flex" }), _jsx(Cell, { style: {
                                    minWidth: compact ? 50 : 85,
                                }, valueStyle: compactStyle, value: t('Payments'), width: "flex" })] })), _jsx(Cell, { style: {
                        minWidth: compact ? 50 : 85,
                    }, valueStyle: compactStyle, value: t('Totals'), width: "flex" }), _jsx(Cell, { style: {
                        minWidth: compact ? 50 : 85,
                    }, valueStyle: compactStyle, value: t('Average'), width: "flex" })] }) }));
}
