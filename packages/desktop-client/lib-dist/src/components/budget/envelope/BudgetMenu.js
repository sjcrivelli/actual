import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
export function BudgetMenu({ onCopyLastMonthAverage, onSetMonthsAverage, onApplyBudgetTemplate, ...props }) {
    const { t } = useTranslation();
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const onMenuSelect = (name) => {
        switch (name) {
            case 'copy-single-last':
                onCopyLastMonthAverage?.();
                break;
            case 'set-single-3-avg':
                onSetMonthsAverage?.(3);
                break;
            case 'set-single-6-avg':
                onSetMonthsAverage?.(6);
                break;
            case 'set-single-12-avg':
                onSetMonthsAverage?.(12);
                break;
            case 'apply-single-category-template':
                onApplyBudgetTemplate?.();
                break;
            default:
                throw new Error(`Unrecognized menu item: ${name}`);
        }
    };
    return (_jsx(Menu, { ...props, onMenuSelect: onMenuSelect, items: [
            {
                name: 'copy-single-last',
                text: t('Copy last month’s budget'),
            },
            {
                name: 'set-single-3-avg',
                text: t('Set to 3 month average'),
            },
            {
                name: 'set-single-6-avg',
                text: t('Set to 6 month average'),
            },
            {
                name: 'set-single-12-avg',
                text: t('Set to yearly average'),
            },
            ...(isGoalTemplatesEnabled
                ? [
                    {
                        name: 'apply-single-category-template',
                        text: t('Apply budget template'),
                    },
                ]
                : []),
        ] }));
}
