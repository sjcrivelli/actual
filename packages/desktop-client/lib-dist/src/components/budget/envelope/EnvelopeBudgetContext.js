import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import * as monthUtils from 'loot-core/shared/months';
const EnvelopeBudgetContext = createContext({
    summaryCollapsed: false,
    onBudgetAction: () => {
        throw new Error('Unitialised context method called: onBudgetAction');
    },
    onToggleSummaryCollapse: () => {
        throw new Error('Unitialised context method called: onToggleSummaryCollapse');
    },
    currentMonth: 'unknown',
});
export function EnvelopeBudgetProvider({ summaryCollapsed, onBudgetAction, onToggleSummaryCollapse, children, }) {
    const currentMonth = monthUtils.currentMonth();
    return (_jsx(EnvelopeBudgetContext.Provider, { value: {
            currentMonth,
            summaryCollapsed,
            onBudgetAction,
            onToggleSummaryCollapse,
        }, children: children }));
}
export function useEnvelopeBudget() {
    return useContext(EnvelopeBudgetContext);
}
