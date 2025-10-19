import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { BudgetTotal } from './BudgetTotal';
import { IncomeProgress } from './IncomeProgress';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function IncomeTotal({ style }) {
    const { t } = useTranslation();
    return (_jsx(BudgetTotal, { title: t('Income'), current: trackingBudget.totalIncome, target: trackingBudget.totalBudgetedIncome, ProgressComponent: IncomeProgress, style: style }));
}
