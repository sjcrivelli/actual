import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as Platform from 'loot-core/shared/platform';
import { amountToInteger, integerToAmount } from 'loot-core/shared/util';
import { BudgetMenu } from '@desktop-client/components/budget/tracking/BudgetMenu';
import { useTrackingSheetValue } from '@desktop-client/components/budget/tracking/TrackingBudgetComponents';
import { Modal, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { FocusableAmountInput } from '@desktop-client/components/mobile/transactions/FocusableAmountInput';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function TrackingBudgetMenuModal({ categoryId, onUpdateBudget, onCopyLastMonthAverage, onSetMonthsAverage, onApplyBudgetTemplate, }) {
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    const budgeted = useTrackingSheetValue(trackingBudget.catBudgeted(categoryId));
    const category = useCategory(categoryId);
    const [amountFocused, setAmountFocused] = useState(false);
    const _onUpdateBudget = (amount) => {
        onUpdateBudget?.(amountToInteger(amount));
    };
    useEffect(() => {
        // iOS does not support automatically opening up the keyboard for the
        // total amount field. Hence we should not focus on it on page render.
        if (!Platform.isIOSAgent) {
            setAmountFocused(true);
        }
    }, []);
    if (!category) {
        return null;
    }
    return (_jsx(Modal, { name: "tracking-budget-menu", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: category.name, shrinkOnOverflow: true }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }, children: [_jsx(Text, { style: {
                                fontSize: 17,
                                fontWeight: 400,
                            }, children: _jsx(Trans, { children: "Budgeted" }) }), _jsx(FocusableAmountInput, { value: integerToAmount(budgeted || 0), focused: amountFocused, onFocus: () => setAmountFocused(true), onBlur: () => setAmountFocused(false), onEnter: close, zeroSign: "+", focusedStyle: {
                                width: 'auto',
                                padding: '5px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                minWidth: '100%',
                            }, textStyle: { ...styles.veryLargeText, textAlign: 'center' }, onUpdateAmount: _onUpdateBudget, "data-testid": "budget-amount" })] }), _jsx(BudgetMenu, { getItemStyle: () => defaultMenuItemStyle, onCopyLastMonthAverage: onCopyLastMonthAverage, onSetMonthsAverage: onSetMonthsAverage, onApplyBudgetTemplate: onApplyBudgetTemplate })] })) }));
}
