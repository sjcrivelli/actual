import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useContext } from 'react';
import * as monthUtils from 'loot-core/shared/months';
const Context = createContext(null);
export function TrackingBudgetProvider({ summaryCollapsed, onBudgetAction, onToggleSummaryCollapse, children, }) {
    const currentMonth = monthUtils.currentMonth();
    return (_jsx(Context.Provider, { value: {
            currentMonth,
            summaryCollapsed,
            onBudgetAction,
            onToggleSummaryCollapse,
        }, children: children }));
}
export function useTrackingBudget() {
    return useContext(Context);
}
