import { jsx as _jsx } from "react/jsx-runtime";
import { useLayoutEffect, useState, } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
function RenderTotalsRow({ metadata, mode, totalsStyle, testStyle, scrollWidthTotals, renderTotals, }) {
    return (_jsx(View, { children: renderTotals({
            metadata,
            mode,
            totalsStyle,
            testStyle,
            scrollWidthTotals,
        }) }));
}
export function ReportTableTotals({ data, mode, totalScrollRef, compact, style, renderTotals, }) {
    const { t } = useTranslation();
    const [scrollWidthTotals, setScrollWidthTotals] = useState(0);
    useLayoutEffect(() => {
        if (totalScrollRef.current) {
            const [parent, child] = [
                totalScrollRef.current.offsetParent
                    ? (totalScrollRef.current.parentElement
                        ? totalScrollRef.current.parentElement.scrollHeight
                        : 0) || 0
                    : 0,
                totalScrollRef.current ? totalScrollRef.current.scrollHeight : 0,
            ];
            setScrollWidthTotals(parent > 0 && child > 0 ? parent - child : 0);
        }
    });
    const metadata = {
        id: '',
        name: t('Totals'),
        intervalData: data.intervalData,
        totalAssets: data.totalAssets,
        totalDebts: data.totalDebts,
        netAssets: data.netAssets,
        netDebts: data.netDebts,
        totalTotals: data.totalTotals,
    };
    const totalsStyle = {
        borderTopWidth: 1,
        borderColor: theme.tableBorder,
        justifyContent: 'center',
        color: theme.tableRowHeaderText,
        backgroundColor: theme.tableRowHeaderBackground,
        fontWeight: 600,
        ...style,
    };
    const testStyle = {
        overflowX: 'auto',
        scrollbarWidth: compact ? 'none' : 'inherit',
        ...styles.horizontalScrollbar,
        '::-webkit-scrollbar': {
            backgroundColor: theme.tableBackground,
            height: 12,
            dispaly: compact && 'none',
        },
        flexDirection: 'row',
        flex: 1,
    };
    return (_jsx(RenderTotalsRow, { metadata: metadata, mode: mode, totalsStyle: totalsStyle, testStyle: testStyle, scrollWidthTotals: scrollWidthTotals, renderTotals: renderTotals }));
}
