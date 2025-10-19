import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { RenderTableRow } from './RenderTableRow';
import { Row } from '@desktop-client/components/table';
export function ReportTableList({ data, mode, groupBy, renderRow, style, }) {
    const metadata = groupBy === 'Category'
        ? data.groupedData || []
        : groupBy === 'Interval'
            ? data.intervalData.map(interval => {
                return {
                    id: '',
                    name: '',
                    date: interval.date,
                    totalAssets: interval.totalAssets,
                    totalDebts: interval.totalDebts,
                    netAssets: interval.netAssets,
                    netDebts: interval.netDebts,
                    totalTotals: interval.totalTotals,
                    intervalData: [],
                    categories: [],
                };
            })
            : data.data;
    return (_jsx(View, { children: metadata ? (_jsx(View, { children: metadata.map((item, index) => {
                return (_jsxs(View, { children: [_jsx(RenderTableRow, { index: index, renderRow: renderRow, mode: mode, metadata: metadata, style: {
                                ...(item.categories && {
                                    color: theme.tableRowHeaderText,
                                    backgroundColor: theme.tableRowHeaderBackground,
                                    fontWeight: 600,
                                }),
                                ...style,
                            } }), item.categories && (_jsxs(_Fragment, { children: [_jsx(View, { children: item.categories.map((category, i) => {
                                        return (_jsx(RenderTableRow, { index: i, renderRow: renderRow, mode: mode, metadata: metadata, parent_index: index, style: style }, category.id));
                                    }) }), _jsx(Row, { height: 20 })] }))] }, index));
            }) })) : (_jsx(View, { width: "flex" })) }));
}
