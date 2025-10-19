import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { View } from '@actual-app/components/view';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import { integerToCurrency, amountToInteger } from 'loot-core/shared/util';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { addToBeBudgetedGroup, removeCategoriesFromGroups, } from '@desktop-client/components/budget/util';
import { useCategories } from '@desktop-client/hooks/useCategories';
export function TransferMenu({ categoryId, initialAmount = 0, showToBeBudgeted, onSubmit, onClose, }) {
    const { grouped: originalCategoryGroups } = useCategories();
    const filteredCategoryGroups = useMemo(() => {
        const expenseCategoryGroups = originalCategoryGroups.filter(g => !g.is_income);
        const categoryGroups = showToBeBudgeted
            ? addToBeBudgetedGroup(expenseCategoryGroups)
            : expenseCategoryGroups;
        return categoryId
            ? removeCategoriesFromGroups(categoryGroups, categoryId)
            : categoryGroups;
    }, [originalCategoryGroups, categoryId, showToBeBudgeted]);
    const _initialAmount = integerToCurrency(Math.max(initialAmount, 0));
    const [amount, setAmount] = useState(null);
    const [toCategoryId, setToCategoryId] = useState(null);
    const _onSubmit = (newAmount, categoryId) => {
        const parsedAmount = evalArithmetic(newAmount || '');
        if (parsedAmount && categoryId) {
            onSubmit?.(amountToInteger(parsedAmount), categoryId);
        }
        onClose();
    };
    return (_jsx(Form, { onSubmit: e => {
            e.preventDefault();
            _onSubmit(amount, toCategoryId);
        }, children: _jsxs(View, { style: { padding: 10 }, children: [_jsx(View, { style: { marginBottom: 5 }, children: _jsx(Trans, { children: "Transfer this amount:" }) }), _jsx(View, { children: _jsx(InitialFocus, { children: _jsx(Input, { defaultValue: _initialAmount, onUpdate: setAmount }) }) }), _jsx(View, { style: { margin: '10px 0 5px 0' }, children: "To:" }), _jsx(CategoryAutocomplete, { categoryGroups: filteredCategoryGroups, value: null, openOnFocus: true, onSelect: (id) => setToCategoryId(id || null), inputProps: {
                        placeholder: '(none)',
                    }, showHiddenCategories: true }), _jsx(View, { style: {
                        alignItems: 'flex-end',
                        marginTop: 10,
                    }, children: _jsx(Button, { type: "submit", variant: "primary", style: {
                            fontSize: 12,
                            paddingTop: 3,
                            paddingBottom: 3,
                        }, children: _jsx(Trans, { children: "Transfer" }) }) })] }) }));
}
