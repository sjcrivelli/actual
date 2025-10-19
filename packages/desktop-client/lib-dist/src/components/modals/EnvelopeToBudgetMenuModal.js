import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { ToBudgetMenu } from '@desktop-client/components/budget/envelope/budgetsummary/ToBudgetMenu';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
export function EnvelopeToBudgetMenuModal({ onTransfer, onCover, onHoldBuffer, onResetHoldBuffer, onBudgetAction, month, }) {
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    return (_jsx(Modal, { name: "envelope-summary-to-budget-menu", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { showLogo: true, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(ToBudgetMenu, { getItemStyle: () => defaultMenuItemStyle, onTransfer: onTransfer, onCover: onCover, onHoldBuffer: onHoldBuffer, onResetHoldBuffer: onResetHoldBuffer, onBudgetAction: onBudgetAction, month: month })] })) }));
}
