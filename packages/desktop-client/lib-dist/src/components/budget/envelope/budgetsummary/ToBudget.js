import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useRef, useState, } from 'react';
import { Popover } from '@actual-app/components/popover';
import { View } from '@actual-app/components/view';
import { ToBudgetAmount } from './ToBudgetAmount';
import { ToBudgetMenu } from './ToBudgetMenu';
import { CoverMenu } from '@desktop-client/components/budget/envelope/CoverMenu';
import { useEnvelopeSheetValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { HoldMenu } from '@desktop-client/components/budget/envelope/HoldMenu';
import { TransferMenu } from '@desktop-client/components/budget/envelope/TransferMenu';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function ToBudget({ month, prevMonthName, onBudgetAction, style, amountStyle, isCollapsed = false, }) {
    const [menuStep, _setMenuStep] = useState('actions');
    const triggerRef = useRef(null);
    const ref = useRef(null);
    const setMenuStep = useCallback((menu) => {
        if (menu)
            ref.current?.focus();
        _setMenuStep(menu);
    }, [ref, _setMenuStep]);
    const availableValue = useEnvelopeSheetValue({
        name: envelopeBudget.toBudget,
        value: 0,
    });
    if (typeof availableValue !== 'number' && availableValue !== null) {
        throw new Error('Expected availableValue to be a number but got ' + availableValue);
    }
    const { setMenuOpen, menuOpen, handleContextMenu, resetPosition, position, asContextMenu, } = useContextMenu();
    return (_jsxs(_Fragment, { children: [_jsx(View, { ref: triggerRef, children: _jsx(ToBudgetAmount, { onClick: () => {
                        resetPosition();
                        setMenuOpen(true);
                    }, prevMonthName: prevMonthName, style: style, amountStyle: amountStyle, isTotalsListTooltipDisabled: !isCollapsed || menuOpen, onContextMenu: handleContextMenu }) }), _jsx(Popover, { triggerRef: triggerRef, placement: asContextMenu ? 'bottom start' : 'bottom', isOpen: menuOpen, onOpenChange: () => {
                    setMenuStep('actions');
                    setMenuOpen(false);
                }, style: { width: 200, margin: 1 }, isNonModal: true, ...position, children: _jsxs("span", { tabIndex: -1, ref: ref, children: [menuStep === 'actions' && (_jsx(ToBudgetMenu, { onTransfer: () => setMenuStep('transfer'), onCover: () => setMenuStep('cover'), onHoldBuffer: () => setMenuStep('buffer'), onResetHoldBuffer: () => {
                                onBudgetAction(month, 'reset-hold');
                                setMenuOpen(false);
                            }, month: month, onBudgetAction: onBudgetAction })), menuStep === 'buffer' && (_jsx(HoldMenu, { onClose: () => setMenuOpen(false), onSubmit: amount => {
                                onBudgetAction(month, 'hold', { amount });
                            } })), menuStep === 'transfer' && (_jsx(TransferMenu, { initialAmount: availableValue ?? undefined, onClose: () => setMenuOpen(false), onSubmit: (amount, categoryId) => {
                                onBudgetAction(month, 'transfer-available', {
                                    amount,
                                    category: categoryId,
                                });
                            } })), menuStep === 'cover' && (_jsx(CoverMenu, { showToBeBudgeted: false, onClose: () => setMenuOpen(false), onSubmit: categoryId => {
                                onBudgetAction(month, 'cover-overbudgeted', {
                                    category: categoryId,
                                });
                            } }))] }) })] }));
}
