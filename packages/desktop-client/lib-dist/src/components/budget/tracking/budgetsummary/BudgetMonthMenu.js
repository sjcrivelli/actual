import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
export function BudgetMonthMenu({ onCopyLastMonthBudget, onSetBudgetsToZero, onSetMonthsAverage, onCheckTemplates, onApplyBudgetTemplates, onOverwriteWithBudgetTemplates, ...props }) {
    const { t } = useTranslation();
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    return (_jsx(Menu, { ...props, onMenuSelect: name => {
            switch (name) {
                case 'copy-last':
                    onCopyLastMonthBudget();
                    break;
                case 'set-zero':
                    onSetBudgetsToZero();
                    break;
                case 'set-3-avg':
                    onSetMonthsAverage(3);
                    break;
                case 'set-6-avg':
                    onSetMonthsAverage(6);
                    break;
                case 'set-12-avg':
                    onSetMonthsAverage(12);
                    break;
                case 'check-templates':
                    onCheckTemplates();
                    break;
                case 'apply-goal-template':
                    onApplyBudgetTemplates();
                    break;
                case 'overwrite-goal-template':
                    onOverwriteWithBudgetTemplates();
                    break;
            }
        }, items: [
            { name: 'copy-last', text: t('Copy last month’s budget') },
            { name: 'set-zero', text: t('Set budgets to zero') },
            {
                name: 'set-3-avg',
                text: t('Set budgets to 3 month average'),
            },
            {
                name: 'set-6-avg',
                text: t('Set budgets to 6 month average'),
            },
            {
                name: 'set-12-avg',
                text: t('Set budgets to 12 month average'),
            },
            ...(isGoalTemplatesEnabled
                ? [
                    {
                        name: 'check-templates',
                        text: t('Check templates'),
                    },
                    {
                        name: 'apply-goal-template',
                        text: t('Apply budget template'),
                    },
                    {
                        name: 'overwrite-goal-template',
                        text: t('Overwrite with budget template'),
                    },
                ]
                : []),
        ] }));
}
