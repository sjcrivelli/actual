import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { addToBeBudgetedGroup, removeCategoriesFromGroups, } from '@desktop-client/components/budget/util';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FieldLabel, TapField, } from '@desktop-client/components/mobile/MobileForms';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CoverModal({ title, categoryId, month, showToBeBudgeted = true, onSubmit, }) {
    const { t } = useTranslation();
    const { grouped: originalCategoryGroups } = useCategories();
    const [categoryGroups, categories] = useMemo(() => {
        const expenseGroups = originalCategoryGroups.filter(g => !g.is_income);
        const categoryGroups = showToBeBudgeted
            ? addToBeBudgetedGroup(expenseGroups)
            : expenseGroups;
        const filteredCategoryGroups = categoryId
            ? removeCategoriesFromGroups(categoryGroups, categoryId)
            : categoryGroups;
        const filteredCategoryies = filteredCategoryGroups.flatMap(g => g.categories || []);
        return [filteredCategoryGroups, filteredCategoryies];
    }, [categoryId, originalCategoryGroups, showToBeBudgeted]);
    const [fromCategoryId, setFromCategoryId] = useState(null);
    const dispatch = useDispatch();
    const onCategoryClick = useCallback(() => {
        dispatch(pushModal({
            modal: {
                name: 'category-autocomplete',
                options: {
                    categoryGroups,
                    month,
                    onSelect: categoryId => {
                        setFromCategoryId(categoryId);
                    },
                },
            },
        }));
    }, [categoryGroups, dispatch, month]);
    const _onSubmit = (categoryId) => {
        if (categoryId) {
            onSubmit?.(categoryId);
        }
    };
    const fromCategory = categories.find(c => c.id === fromCategoryId);
    return (_jsx(Modal, { name: "cover", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: title, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { children: [_jsx(FieldLabel, { title: t('Cover from a category:') }), _jsx(TapField, { value: fromCategory?.name, onPress: onCategoryClick })] }), _jsx(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                    }, children: _jsx(Button, { variant: "primary", style: {
                            height: styles.mobileMinHeight,
                            marginLeft: styles.mobileEditingPadding,
                            marginRight: styles.mobileEditingPadding,
                        }, onPress: () => {
                            _onSubmit(fromCategoryId);
                            close();
                        }, children: _jsx(Trans, { children: "Transfer" }) }) })] })) }));
}
