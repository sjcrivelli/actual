import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { useContext, } from 'react';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { MonthsContext } from './MonthsContext';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
export function RenderMonths({ component: Component, editingMonth, args, style, }) {
    const { months } = useContext(MonthsContext);
    return months.map((month, index) => {
        const editing = editingMonth === month;
        return (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(month), children: _jsx(View, { style: {
                    flex: 1,
                    borderLeft: '1px solid ' + theme.tableBorder,
                    ...style,
                }, children: _jsx(Component, { month: month, editing: editing, ...args }) }) }, index));
    });
}
