import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { FormError } from '@actual-app/components/form-error';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { integerToCurrency } from 'loot-core/shared/util';
import { closeAccount } from '@desktop-client/accounts/accountsSlice';
import { AccountAutocomplete } from '@desktop-client/components/autocomplete/AccountAutocomplete';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
function needsCategory(account, currentTransfer, accounts) {
    const acct = accounts.find(a => a.id === currentTransfer);
    const isOffBudget = acct && acct.offbudget === 1;
    // The user must select a category if transferring from a budgeted
    // account to an off budget account
    return account.offbudget === 0 && isOffBudget;
}
export function CloseAccountModal({ account, balance, canDelete, }) {
    const { t } = useTranslation(); // Initialize translation hook
    const accounts = useAccounts().filter(a => a.closed === 0);
    const { grouped: categoryGroups, list: categories } = useCategories();
    const [loading, setLoading] = useState(false);
    const [transferAccountId, setTransferAccountId] = useState('');
    const transferAccount = accounts.find(a => a.id === transferAccountId);
    const [categoryId, setCategoryId] = useState('');
    const category = categories.find(c => c.id === categoryId);
    const [transferError, setTransferError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const dispatch = useDispatch();
    const { isNarrowWidth } = useResponsive();
    const onSelectAccount = accId => {
        setTransferAccountId(accId);
        if (transferError && accId) {
            setTransferError(false);
        }
    };
    const onSelectCategory = catId => {
        setCategoryId(catId);
        if (categoryError && catId) {
            setCategoryError(false);
        }
    };
    const narrowStyle = isNarrowWidth
        ? {
            userSelect: 'none',
            height: styles.mobileMinHeight,
            ...styles.mediumText,
        }
        : {};
    const onSubmit = (event) => {
        event.preventDefault();
        const transferError = balance !== 0 && !transferAccountId;
        setTransferError(transferError);
        const categoryError = needsCategory(account, transferAccountId, accounts) && !categoryId;
        setCategoryError(categoryError);
        if (transferError || categoryError) {
            return false;
        }
        setLoading(true);
        dispatch(closeAccount({
            id: account.id,
            transferAccountId: transferAccountId || null,
            categoryId: categoryId || null,
        }));
        return true;
    };
    return (_jsx(Modal, { name: "close-account", isLoading: loading, containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Close Account'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { children: [_jsxs(Paragraph, { children: [_jsxs(Trans, { children: ["Are you sure you want to close", ' ', _jsx("strong", { children: { accountName: account.name } }), "?", ' '] }), canDelete ? (_jsx("span", { children: _jsx(Trans, { children: "This account has no transactions so it will be permanently deleted." }) })) : (_jsx("span", { children: _jsx(Trans, { children: "This account has transactions so we can\u2019t permanently delete it." }) }))] }), _jsxs(Form, { onSubmit: e => {
                                if (onSubmit(e)) {
                                    close();
                                }
                            }, children: [balance !== 0 && (_jsxs(View, { children: [_jsx(Paragraph, { children: _jsxs(Trans, { children: ["This account has a balance of", ' ', _jsx("strong", { children: {
                                                            balance: integerToCurrency(balance),
                                                        } }), ". To close this account, select a different account to transfer this balance to:"] }) }), _jsx(View, { style: { marginBottom: 15 }, children: _jsx(AccountAutocomplete, { includeClosedAccounts: false, hiddenAccounts: [account.id], value: transferAccountId, inputProps: {
                                                    placeholder: t('Select account...'),
                                                    autoFocus: true,
                                                    ...(isNarrowWidth && {
                                                        value: transferAccount?.name || '',
                                                        style: {
                                                            ...narrowStyle,
                                                        },
                                                        onClick: () => {
                                                            dispatch(pushModal({
                                                                modal: {
                                                                    name: 'account-autocomplete',
                                                                    options: {
                                                                        includeClosedAccounts: false,
                                                                        hiddenAccounts: [account.id],
                                                                        onSelect: onSelectAccount,
                                                                    },
                                                                },
                                                            }));
                                                        },
                                                    }),
                                                }, onSelect: onSelectAccount }) }), transferError && (_jsx(FormError, { style: { marginBottom: 15 }, children: _jsx(Trans, { children: "Transfer is required" }) })), needsCategory(account, transferAccountId, accounts) && (_jsxs(View, { style: { marginBottom: 15 }, children: [_jsx(Paragraph, { children: _jsx(Trans, { children: "Since you are transferring the balance from an on budget account to an off budget account, this transaction must be categorized. Select a category:" }) }), _jsx(CategoryAutocomplete, { categoryGroups: categoryGroups, value: categoryId, inputProps: {
                                                        placeholder: t('Select category...'),
                                                        ...(isNarrowWidth && {
                                                            value: category?.name || '',
                                                            style: {
                                                                ...narrowStyle,
                                                            },
                                                            onClick: () => {
                                                                dispatch(pushModal({
                                                                    modal: {
                                                                        name: 'category-autocomplete',
                                                                        options: {
                                                                            categoryGroups,
                                                                            showHiddenCategories: true,
                                                                            onSelect: onSelectCategory,
                                                                        },
                                                                    },
                                                                }));
                                                            },
                                                        }),
                                                    }, onSelect: onSelectCategory }), categoryError && (_jsx(FormError, { children: _jsx(Trans, { children: "Category is required" }) }))] }))] })), !canDelete && (_jsx(View, { style: { marginBottom: 15 }, children: _jsx(Text, { style: { fontSize: 12 }, children: _jsxs(Trans, { children: ["You can also", ' ', _jsx(Link, { variant: "text", onClick: () => {
                                                        setLoading(true);
                                                        dispatch(closeAccount({
                                                            id: account.id,
                                                            forced: true,
                                                        }));
                                                        close();
                                                    }, style: { color: theme.errorText }, children: "force close" }), ' ', "the account which will delete it and all its transactions permanently. Doing so may change your budget unexpectedly since money in it may vanish."] }) }) })), _jsxs(View, { style: {
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                    }, children: [_jsx(Button, { style: {
                                                marginRight: 10,
                                                height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                            }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { type: "submit", variant: "primary", style: {
                                                height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                            }, children: _jsx(Trans, { children: "Close Account" }) })] })] })] })] })) }));
}
