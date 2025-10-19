import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { useTrackingSheetValue } from './TrackingBudgetComponents';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function BalanceMenu({ categoryId, onCarryover, ...props }) {
    const { t } = useTranslation();
    const carryover = useTrackingSheetValue(trackingBudget.catCarryover(categoryId));
    return (_jsx(Menu, { ...props, onMenuSelect: name => {
            switch (name) {
                case 'carryover':
                    onCarryover?.(!carryover);
                    break;
                default:
                    throw new Error(`Unrecognized menu option: ${name}`);
            }
        }, items: [
            {
                name: 'carryover',
                text: carryover
                    ? t('Remove overspending rollover')
                    : t('Rollover overspending'),
            },
        ] }));
}
