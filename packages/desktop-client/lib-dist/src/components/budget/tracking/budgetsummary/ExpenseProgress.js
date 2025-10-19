import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { fraction } from './fraction';
import { PieProgress } from './PieProgress';
import { useTrackingSheetValue } from '@desktop-client/components/budget/tracking/TrackingBudgetComponents';
export function ExpenseProgress({ current, target }) {
    let totalSpent = useTrackingSheetValue(current) || 0;
    const totalBudgeted = useTrackingSheetValue(target) || 0;
    // Reverse total spent, and also set a bottom boundary of 0 (in case
    // income goes into an expense category and it's "positive", don't
    // show that in the graph)
    totalSpent = Math.max(-totalSpent, 0);
    let frac;
    let over = false;
    if (totalSpent > totalBudgeted) {
        frac = (totalSpent - totalBudgeted) / totalBudgeted;
        over = true;
    }
    else {
        frac = fraction(totalSpent, totalBudgeted);
    }
    return (_jsx(PieProgress, { progress: frac, color: over ? theme.errorText : theme.noticeTextLight, backgroundColor: over ? theme.errorBackground : theme.tableBackground, style: { width: 20, height: 20 } }));
}
