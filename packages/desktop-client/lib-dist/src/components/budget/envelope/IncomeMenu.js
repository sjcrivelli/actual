import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { useEnvelopeSheetValue } from './EnvelopeBudgetComponents';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function IncomeMenu({ categoryId, month, onBudgetAction, onShowActivity, onClose = () => { }, }) {
    const { t } = useTranslation();
    const carryover = useEnvelopeSheetValue(envelopeBudget.catCarryover(categoryId));
    return (_jsx("span", { children: _jsx(Menu, { onMenuSelect: name => {
                switch (name) {
                    case 'view':
                        onShowActivity(categoryId, month);
                        break;
                    case 'carryover':
                        if (!carryover)
                            onBudgetAction(month, 'reset-hold');
                        onBudgetAction(month, 'carryover', {
                            category: categoryId,
                            flag: !carryover,
                        });
                        onClose();
                        break;
                    default:
                        throw new Error(`Unrecognized menu option: ${name}`);
                }
            }, items: [
                {
                    name: 'carryover',
                    text: carryover ? t('Disable auto hold') : t('Enable auto hold'),
                },
                {
                    name: 'view',
                    text: t('View transactions'),
                },
            ] }) }));
}
