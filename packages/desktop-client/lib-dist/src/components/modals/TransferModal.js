import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { addToBeBudgetedGroup, removeCategoriesFromGroups, } from '@desktop-client/components/budget/util';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FieldLabel, TapField, } from '@desktop-client/components/mobile/MobileForms';
import { AmountInput } from '@desktop-client/components/util/AmountInput';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function TransferModal({ title, categoryId, month, amount: initialAmount, showToBeBudgeted, onSubmit, }) {
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
        const filteredCategories = filteredCategoryGroups.flatMap(g => g.categories || []);
        return [filteredCategoryGroups, filteredCategories];
    }, [categoryId, originalCategoryGroups, showToBeBudgeted]);
    const [amount, setAmount] = useState(initialAmount);
    const [toCategoryId, setToCategoryId] = useState(null);
    const dispatch = useDispatch();
    const openCategoryModal = () => {
        dispatch(pushModal({
            modal: {
                name: 'category-autocomplete',
                options: {
                    categoryGroups,
                    month,
                    showHiddenCategories: true,
                    onSelect: categoryId => {
                        setToCategoryId(categoryId);
                    },
                },
            },
        }));
    };
    const _onSubmit = (newAmount, categoryId) => {
        if (newAmount && categoryId) {
            onSubmit?.(newAmount, categoryId);
        }
    };
    const toCategory = categories.find(c => c.id === toCategoryId);
    return (_jsx(Modal, { name: "transfer", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: title, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { children: [_jsxs(View, { children: [_jsx(FieldLabel, { title: t('Transfer this amount:') }), _jsx(InitialFocus, { children: _jsx(AmountInput, { value: initialAmount, autoDecimals: true, style: {
                                            marginLeft: styles.mobileEditingPadding,
                                            marginRight: styles.mobileEditingPadding,
                                        }, inputStyle: {
                                            height: styles.mobileMinHeight,
                                        }, onUpdate: setAmount, onEnter: () => {
                                            if (!toCategoryId) {
                                                openCategoryModal();
                                            }
                                        } }) })] }), _jsx(FieldLabel, { title: "To:" }), _jsx(TapField, { value: toCategory?.name, onPress: openCategoryModal }), _jsx(View, { style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 10,
                            }, children: _jsx(Button, { variant: "primary", style: {
                                    height: styles.mobileMinHeight,
                                    marginLeft: styles.mobileEditingPadding,
                                    marginRight: styles.mobileEditingPadding,
                                }, onPress: () => {
                                    _onSubmit(amount, toCategoryId);
                                    close();
                                }, children: _jsx(Trans, { children: "Transfer" }) }) })] })] })) }));
}
