import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext } from 'react';
import * as monthUtils from 'loot-core/shared/months';
export function getValidMonthBounds(bounds, startMonth, endMonth) {
    return {
        start: startMonth < bounds.start ? bounds.start : startMonth,
        end: endMonth > bounds.end ? bounds.end : endMonth,
    };
}
export const MonthsContext = createContext(null);
export function MonthsProvider({ startMonth, numMonths, monthBounds, type, children, }) {
    const endMonth = monthUtils.addMonths(startMonth, numMonths - 1);
    const bounds = getValidMonthBounds(monthBounds, startMonth, endMonth);
    const months = monthUtils.rangeInclusive(bounds.start, bounds.end);
    return (_jsx(MonthsContext.Provider, { value: { months, type }, children: children }));
}
