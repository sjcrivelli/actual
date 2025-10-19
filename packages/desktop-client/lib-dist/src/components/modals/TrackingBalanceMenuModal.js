import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { BalanceWithCarryover, CarryoverIndicator, } from '@desktop-client/components/budget/BalanceWithCarryover';
import { BalanceMenu } from '@desktop-client/components/budget/tracking/BalanceMenu';
import { Modal, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { CellValueText } from '@desktop-client/components/spreadsheet/CellValue';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function TrackingBalanceMenuModal({ categoryId, onCarryover, }) {
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    const category = useCategory(categoryId);
    if (!category) {
        return null;
    }
    return (_jsx(Modal, { name: "tracking-balance-menu", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: category.name, shrinkOnOverflow: true }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }, children: [_jsx(Text, { style: {
                                fontSize: 17,
                                fontWeight: 400,
                            }, children: _jsx(Trans, { children: "Balance" }) }), _jsx(BalanceWithCarryover, { isDisabled: true, carryover: trackingBudget.catCarryover(categoryId), balance: trackingBudget.catBalance(categoryId), goal: trackingBudget.catGoal(categoryId), budgeted: trackingBudget.catBudgeted(categoryId), longGoal: trackingBudget.catLongGoal(categoryId), CarryoverIndicator: ({ style }) => (_jsx(CarryoverIndicator, { style: {
                                    width: 15,
                                    height: 15,
                                    display: 'inline-flex',
                                    position: 'relative',
                                    ...style,
                                } })), children: props => (_jsx(CellValueText, { ...props, style: {
                                    textAlign: 'center',
                                    ...styles.veryLargeText,
                                } })) })] }), _jsx(BalanceMenu, { categoryId: categoryId, getItemStyle: () => defaultMenuItemStyle, onCarryover: onCarryover })] })) }));
}
