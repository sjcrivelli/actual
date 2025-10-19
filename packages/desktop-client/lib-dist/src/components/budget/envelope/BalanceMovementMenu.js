import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { BalanceMenu } from './BalanceMenu';
import { CoverMenu } from './CoverMenu';
import { useEnvelopeSheetValue } from './EnvelopeBudgetComponents';
import { TransferMenu } from './TransferMenu';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function BalanceMovementMenu({ categoryId, month, onBudgetAction, onClose = () => { }, }) {
    const catBalance = useEnvelopeSheetValue(envelopeBudget.catBalance(categoryId)) ?? 0;
    const [menu, _setMenu] = useState('menu');
    const ref = useRef(null);
    // Keep focus inside the popover on menu change
    const setMenu = useCallback((menu) => {
        ref.current?.focus();
        _setMenu(menu);
    }, [ref]);
    return (_jsxs("span", { tabIndex: -1, ref: ref, children: [menu === 'menu' && (_jsx(BalanceMenu, { categoryId: categoryId, onCarryover: carryover => {
                    onBudgetAction(month, 'carryover', {
                        category: categoryId,
                        flag: carryover,
                    });
                    onClose();
                }, onTransfer: () => setMenu('transfer'), onCover: () => setMenu('cover') })), menu === 'transfer' && (_jsx(TransferMenu, { categoryId: categoryId, initialAmount: catBalance, showToBeBudgeted: true, onClose: onClose, onSubmit: (amount, toCategoryId) => {
                    onBudgetAction(month, 'transfer-category', {
                        amount,
                        from: categoryId,
                        to: toCategoryId,
                    });
                } })), menu === 'cover' && (_jsx(CoverMenu, { categoryId: categoryId, onClose: onClose, onSubmit: fromCategoryId => {
                    onBudgetAction(month, 'cover-overspending', {
                        to: categoryId,
                        from: fromCategoryId,
                    });
                } }))] }));
}
