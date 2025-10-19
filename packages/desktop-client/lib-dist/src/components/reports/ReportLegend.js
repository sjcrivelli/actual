import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { LegendItem } from './LegendItem';
import { ReportOptions } from './ReportOptions';
export function ReportLegend({ legend, groupBy, interval }) {
    return (_jsxs(View, { style: {
            backgroundColor: theme.pageBackground,
            alignItems: 'center',
            flex: 1,
            overflowY: 'auto',
        }, children: [_jsx(Text, { style: {
                    ...styles.largeText,
                    alignItems: 'center',
                    marginBottom: 2,
                    fontWeight: 400,
                    paddingTop: 10,
                }, children: groupBy === 'Interval'
                    ? ReportOptions.intervalMap.get(interval)
                    : groupBy }), _jsx(View, { children: legend &&
                    legend.map(item => {
                        return (_jsx(LegendItem, { color: item.color, label: item.name }, item.name));
                    }) })] }));
}
