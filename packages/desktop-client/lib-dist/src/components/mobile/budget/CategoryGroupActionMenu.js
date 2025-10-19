import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
export function CategoryGroupActionMenu({ onApplyBudgetTemplatesInGroup, ...props }) {
    const { t } = useTranslation();
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    return (_jsx(Menu, { ...props, onMenuSelect: name => {
            switch (name) {
                case 'apply-budget-templates-in-group':
                    onApplyBudgetTemplatesInGroup();
                    break;
            }
        }, items: [
            ...(isGoalTemplatesEnabled
                ? [
                    {
                        name: 'apply-budget-templates-in-group',
                        text: t('Apply budget template'),
                    },
                ]
                : []),
        ] }));
}
