import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { View } from '@actual-app/components/view';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { addToBeBudgetedGroup, removeCategoriesFromGroups, } from '@desktop-client/components/budget/util';
import { useCategories } from '@desktop-client/hooks/useCategories';
export function CoverMenu({ showToBeBudgeted = true, categoryId, onSubmit, onClose, }) {
    const { t } = useTranslation();
    const { grouped: originalCategoryGroups } = useCategories();
    const [fromCategoryId, setFromCategoryId] = useState(null);
    const filteredCategoryGroups = useMemo(() => {
        const expenseGroups = originalCategoryGroups.filter(g => !g.is_income);
        const categoryGroups = showToBeBudgeted
            ? addToBeBudgetedGroup(expenseGroups)
            : expenseGroups;
        return categoryId
            ? removeCategoriesFromGroups(categoryGroups, categoryId)
            : categoryGroups;
    }, [categoryId, showToBeBudgeted, originalCategoryGroups]);
    function _onSubmit() {
        if (fromCategoryId) {
            onSubmit(fromCategoryId);
        }
        onClose();
    }
    return (_jsx(Form, { onSubmit: e => {
            e.preventDefault();
            _onSubmit();
        }, children: _jsxs(View, { style: { padding: 10 }, children: [_jsx(View, { style: { marginBottom: 5 }, children: _jsx(Trans, { children: "Cover from a category:" }) }), _jsx(InitialFocus, { children: node => (_jsx(CategoryAutocomplete, { categoryGroups: filteredCategoryGroups, value: null, openOnFocus: true, onSelect: (id) => setFromCategoryId(id || null), inputProps: {
                            ref: node,
                            placeholder: t('(none)'),
                        }, showHiddenCategories: false })) }), _jsx(View, { style: {
                        alignItems: 'flex-end',
                        marginTop: 10,
                    }, children: _jsx(Button, { type: "submit", variant: "primary", style: {
                            fontSize: 12,
                            paddingTop: 3,
                        }, children: _jsx(Trans, { children: "Transfer" }) }) })] }) }));
}
