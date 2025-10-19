import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { BalanceWithCarryover, CarryoverIndicator, } from '@desktop-client/components/budget/BalanceWithCarryover';
import { useEnvelopeSheetValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { Modal, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { CellValueText } from '@desktop-client/components/spreadsheet/CellValue';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function EnvelopeIncomeBalanceMenuModal({ categoryId, onCarryover, onShowActivity, }) {
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    const { t } = useTranslation();
    const category = useCategory(categoryId);
    const carryover = useEnvelopeSheetValue(envelopeBudget.catCarryover(categoryId));
    if (!category) {
        return null;
    }
    return (_jsx(Modal, { name: "envelope-income-balance-menu", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: category.name, shrinkOnOverflow: true }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }, children: [_jsx(Text, { style: {
                                fontSize: 17,
                                fontWeight: 400,
                            }, children: _jsx(Trans, { children: "Balance" }) }), _jsx(BalanceWithCarryover, { isDisabled: true, shouldInlineGoalStatus: true, carryover: envelopeBudget.catCarryover(categoryId), balance: envelopeBudget.catSumAmount(categoryId), goal: envelopeBudget.catGoal(categoryId), budgeted: envelopeBudget.catBudgeted(categoryId), longGoal: envelopeBudget.catLongGoal(categoryId), CarryoverIndicator: ({ style }) => (_jsx(CarryoverIndicator, { style: {
                                    width: 15,
                                    height: 15,
                                    display: 'inline-flex',
                                    position: 'relative',
                                    ...style,
                                } })), children: props => (_jsx(CellValueText, { ...props, style: {
                                    textAlign: 'center',
                                    ...styles.veryLargeText,
                                } })) })] }), _jsx(Menu, { getItemStyle: () => defaultMenuItemStyle, onMenuSelect: name => {
                        switch (name) {
                            case 'carryover':
                                onCarryover?.(!carryover);
                                break;
                            case 'view':
                                onShowActivity?.();
                                break;
                            default:
                                throw new Error(`Unrecognized menu option: ${name}`);
                        }
                    }, items: [
                        {
                            name: 'carryover',
                            text: carryover
                                ? t('Disable auto hold')
                                : t('Enable auto hold'),
                        },
                        {
                            name: 'view',
                            text: t('View transactions'),
                        },
                    ] })] })) }));
}
