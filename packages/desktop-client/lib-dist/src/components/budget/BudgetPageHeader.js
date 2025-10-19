import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo } from 'react';
import { View } from '@actual-app/components/view';
import { MonthPicker } from './MonthPicker';
import { getScrollbarWidth } from './util';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
export const BudgetPageHeader = memo(({ startMonth, onMonthSelect, numMonths, monthBounds }) => {
    const [categoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    const offsetMultipleMonths = numMonths === 1 ? 4 : 0;
    return (_jsx(View, { style: {
            marginLeft: 200 + 100 * categoryExpandedState + 5 - offsetMultipleMonths,
            flexShrink: 0,
        }, children: _jsx(View, { style: {
                marginRight: 5 + getScrollbarWidth() - offsetMultipleMonths,
            }, children: _jsx(MonthPicker, { startMonth: startMonth, numDisplayed: numMonths, monthBounds: monthBounds, style: { paddingTop: 5 }, onSelect: month => onMonthSelect(month) }) }) }));
});
BudgetPageHeader.displayName = 'BudgetPageHeader';
