import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import useTranslation
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useCategories } from '@desktop-client/hooks/useCategories';
export function ConfirmCategoryDeleteModal({ group: groupId, category: categoryId, onDelete, }) {
    const { t } = useTranslation(); // Initialize translation hook
    const [transferCategory, setTransferCategory] = useState(null);
    const [error, setError] = useState(null);
    const { grouped: categoryGroups, list: categories } = useCategories();
    const group = categoryGroups.find(g => g.id === groupId);
    const category = categories.find(c => c.id === categoryId);
    const renderError = (error) => {
        let msg;
        switch (error) {
            case 'required-transfer':
                msg = 'You must select a category';
                break;
            default:
                msg = 'Something bad happened, sorry!';
        }
        return (_jsx(Text, { style: {
                marginTop: 15,
                color: theme.errorText,
            }, children: msg }));
    };
    const isIncome = !!(category || group).is_income;
    return (_jsx(Modal, { name: "confirm-category-delete", containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Confirm Delete'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { lineHeight: 1.5 }, children: [group ? (_jsxs(Block, { children: [!isIncome ? (_jsxs(Trans, { children: ["Categories in the group", ' ', _jsx("strong", { children: { group: group.name } }), ' ', "are used by existing transactions."] })) : (_jsxs(Trans, { children: ["Categories in the group", ' ', _jsx("strong", { children: { group: group.name } }), ' ', "are used by existing transactions or it has a positive leftover balance currently."] })), _jsxs(Trans, { children: [_jsx("strong", { children: "Are you sure you want to delete it?" }), " If so, you must select another category to transfer existing transactions and balance to."] })] })) : (_jsxs(Block, { children: [!isIncome ? (_jsxs(Trans, { children: [_jsx("strong", { children: { category: category.name } }), ' ', "is used by existing transactions."] })) : (_jsxs(Trans, { children: [_jsx("strong", { children: { category: category.name } }), ' ', "is used by existing transactions or it has a positive leftover balance currently."] })), _jsxs(Trans, { children: [_jsx("strong", { children: "Are you sure you want to delete it?" }), " If so, you must select another category to transfer existing transactions and balance to."] })] })), error && renderError(error), _jsxs(View, { style: {
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }, children: [_jsx(Text, { children: _jsx(Trans, { children: "Transfer to:" }) }), _jsx(View, { style: { flex: 1, marginLeft: 10, marginRight: 30 }, children: _jsx(CategoryAutocomplete, { categoryGroups: group
                                            ? categoryGroups.filter(g => g.id !== group.id && !!g.is_income === isIncome)
                                            : categoryGroups
                                                .filter(g => !!g.is_income === isIncome)
                                                .map(g => ({
                                                ...g,
                                                categories: g.categories.filter(c => c.id !== category.id),
                                            })), value: transferCategory, focused: true, inputProps: {
                                            placeholder: t('Select category...'),
                                        }, onSelect: category => setTransferCategory(category), showHiddenCategories: true }) }), _jsx(Button, { variant: "primary", onPress: () => {
                                        if (!transferCategory) {
                                            setError('required-transfer');
                                        }
                                        else {
                                            onDelete(transferCategory);
                                            close();
                                        }
                                    }, children: _jsx(Trans, { children: "Delete" }) })] })] })] })) }));
}
