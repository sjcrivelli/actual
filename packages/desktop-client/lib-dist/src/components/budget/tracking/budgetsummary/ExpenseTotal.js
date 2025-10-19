import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { BudgetTotal } from './BudgetTotal';
import { ExpenseProgress } from './ExpenseProgress';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function ExpenseTotal({ style }) {
    const { t } = useTranslation();
    return (_jsx(BudgetTotal, { title: t('Expenses'), current: trackingBudget.totalSpent, target: trackingBudget.totalBudgetedExpense, ProgressComponent: ExpenseProgress, style: style }));
}
