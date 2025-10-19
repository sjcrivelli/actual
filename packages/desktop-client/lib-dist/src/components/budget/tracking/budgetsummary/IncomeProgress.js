import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { fraction } from './fraction';
import { PieProgress } from './PieProgress';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
export function IncomeProgress({ current, target }) {
    let totalIncome = useSheetValue(current) || 0;
    const totalBudgeted = useSheetValue(target) || 0;
    let over = false;
    if (totalIncome < 0) {
        over = true;
        totalIncome = -totalIncome;
    }
    const frac = fraction(totalIncome, totalBudgeted);
    return (_jsx(PieProgress, { progress: frac, color: over ? theme.errorText : theme.noticeTextLight, backgroundColor: over ? theme.errorBackground : theme.tableBackground, style: { width: 20, height: 20 } }));
}
