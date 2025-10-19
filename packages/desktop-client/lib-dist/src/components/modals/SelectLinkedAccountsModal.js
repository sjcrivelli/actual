import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { linkAccount, linkAccountPluggyAi, linkAccountSimpleFin, unlinkAccount, } from '@desktop-client/accounts/accountsSlice';
import { Autocomplete, } from '@desktop-client/components/autocomplete/Autocomplete';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { TableHeader, Table, Row, Field, Cell, } from '@desktop-client/components/table';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { closeModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
function useAddBudgetAccountOptions() {
    const { t } = useTranslation();
    const addOnBudgetAccountOption = {
        id: 'new-on',
        name: t('Create new account'),
    };
    const addOffBudgetAccountOption = {
        id: 'new-off',
        name: t('Create new account (off budget)'),
    };
    return { addOnBudgetAccountOption, addOffBudgetAccountOption };
}
export function SelectLinkedAccountsModal({ requisitionId = undefined, externalAccounts, syncSource, }) {
    const propsWithSortedExternalAccounts = useMemo(() => {
        const toSort = externalAccounts ? [...externalAccounts] : [];
        toSort.sort((a, b) => getInstitutionName(a)?.localeCompare(getInstitutionName(b)) ||
            a.name.localeCompare(b.name));
        switch (syncSource) {
            case 'simpleFin':
                return {
                    syncSource: 'simpleFin',
                    externalAccounts: toSort,
                };
            case 'pluggyai':
                return {
                    syncSource: 'pluggyai',
                    externalAccounts: toSort,
                };
            case 'goCardless':
                return {
                    syncSource: 'goCardless',
                    requisitionId: requisitionId,
                    externalAccounts: toSort,
                };
        }
    }, [externalAccounts, syncSource, requisitionId]);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const localAccounts = useAccounts().filter(a => a.closed === 0);
    const [chosenAccounts, setChosenAccounts] = useState(() => {
        return Object.fromEntries(localAccounts
            .filter(acc => acc.account_id)
            .map(acc => [acc.account_id, acc.id]));
    });
    const { addOnBudgetAccountOption, addOffBudgetAccountOption } = useAddBudgetAccountOptions();
    async function onNext() {
        const chosenLocalAccountIds = Object.values(chosenAccounts);
        // Unlink accounts that were previously linked, but the user
        // chose to remove the bank-sync
        localAccounts
            .filter(acc => acc.account_id)
            .filter(acc => !chosenLocalAccountIds.includes(acc.id))
            .forEach(acc => dispatch(unlinkAccount({ id: acc.id })));
        // Link new accounts
        Object.entries(chosenAccounts).forEach(([chosenExternalAccountId, chosenLocalAccountId]) => {
            const externalAccountIndex = propsWithSortedExternalAccounts.externalAccounts.findIndex(account => account.account_id === chosenExternalAccountId);
            const offBudget = chosenLocalAccountId === addOffBudgetAccountOption.id;
            // Skip linking accounts that were previously linked with
            // a different bank.
            if (externalAccountIndex === -1) {
                return;
            }
            // Finally link the matched account
            if (propsWithSortedExternalAccounts.syncSource === 'simpleFin') {
                dispatch(linkAccountSimpleFin({
                    externalAccount: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                    upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                        chosenLocalAccountId !== addOffBudgetAccountOption.id
                        ? chosenLocalAccountId
                        : undefined,
                    offBudget,
                }));
            }
            else if (propsWithSortedExternalAccounts.syncSource === 'pluggyai') {
                dispatch(linkAccountPluggyAi({
                    externalAccount: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                    upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                        chosenLocalAccountId !== addOffBudgetAccountOption.id
                        ? chosenLocalAccountId
                        : undefined,
                    offBudget,
                }));
            }
            else {
                dispatch(linkAccount({
                    requisitionId: propsWithSortedExternalAccounts.requisitionId,
                    account: propsWithSortedExternalAccounts.externalAccounts[externalAccountIndex],
                    upgradingId: chosenLocalAccountId !== addOnBudgetAccountOption.id &&
                        chosenLocalAccountId !== addOffBudgetAccountOption.id
                        ? chosenLocalAccountId
                        : undefined,
                    offBudget,
                }));
            }
        });
        dispatch(closeModal());
    }
    const unlinkedAccounts = localAccounts.filter(account => !Object.values(chosenAccounts).includes(account.id));
    function onSetLinkedAccount(externalAccount, localAccountId) {
        setChosenAccounts(accounts => {
            const updatedAccounts = { ...accounts };
            if (localAccountId) {
                updatedAccounts[externalAccount.account_id] = localAccountId;
            }
            else {
                delete updatedAccounts[externalAccount.account_id];
            }
            return updatedAccounts;
        });
    }
    return (_jsx(Modal, { name: "select-linked-accounts", containerProps: { style: { width: 1000 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Link Accounts'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Text, { style: { marginBottom: 10 }, children: _jsx(Trans, { children: "We found the following accounts. Select which ones you want to add:" }) }), _jsxs(View, { style: {
                        flex: 'unset',
                        height: 300,
                        border: '1px solid ' + theme.tableBorder,
                    }, children: [_jsxs(TableHeader, { children: [_jsx(Cell, { name: t('Institution to Sync'), width: 175 }), _jsx(Cell, { name: t('Bank Account To Sync'), width: 175 }), _jsx(Cell, { name: t('Balance'), width: 80 }), _jsx(Cell, { name: t('Account in Actual'), width: "flex" }), _jsx(Cell, { name: t('Actions'), width: 150 })] }), _jsx(Table, { items: propsWithSortedExternalAccounts.externalAccounts.map(account => ({
                                ...account,
                                id: account.account_id,
                            })), style: { backgroundColor: theme.tableHeaderBackground }, getItemKey: String, renderItem: ({ item }) => (_jsx(View, { children: _jsx(TableRow, { externalAccount: item, chosenAccount: chosenAccounts[item.account_id] ===
                                        addOnBudgetAccountOption.id
                                        ? addOnBudgetAccountOption
                                        : chosenAccounts[item.account_id] ===
                                            addOffBudgetAccountOption.id
                                            ? addOffBudgetAccountOption
                                            : localAccounts.find(acc => chosenAccounts[item.account_id] === acc.id), unlinkedAccounts: unlinkedAccounts, onSetLinkedAccount: onSetLinkedAccount }) }, item.id)) })] }), _jsx(View, { style: {
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 10,
                    }, children: _jsx(Button, { variant: "primary", onPress: onNext, isDisabled: !Object.keys(chosenAccounts).length, children: _jsx(Trans, { children: "Link accounts" }) }) })] })) }));
}
function getInstitutionName(externalAccount) {
    if (typeof externalAccount?.institution === 'string') {
        return externalAccount?.institution ?? '';
    }
    else if (typeof externalAccount.institution?.name === 'string') {
        return externalAccount?.institution?.name ?? '';
    }
    return '';
}
function TableRow({ externalAccount, chosenAccount, unlinkedAccounts, onSetLinkedAccount, }) {
    const [focusedField, setFocusedField] = useState(null);
    const { addOnBudgetAccountOption, addOffBudgetAccountOption } = useAddBudgetAccountOptions();
    const availableAccountOptions = [...unlinkedAccounts];
    if (chosenAccount && chosenAccount.id !== addOnBudgetAccountOption.id) {
        availableAccountOptions.push(chosenAccount);
    }
    availableAccountOptions.push(addOnBudgetAccountOption, addOffBudgetAccountOption);
    return (_jsxs(Row, { style: { backgroundColor: theme.tableBackground }, children: [_jsx(Field, { width: 175, children: _jsx(Tooltip, { content: getInstitutionName(externalAccount), children: _jsx(View, { style: {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }, children: getInstitutionName(externalAccount) }) }) }), _jsx(Field, { width: 175, children: _jsx(Tooltip, { content: externalAccount.name, children: _jsx(View, { style: {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            display: 'block',
                        }, children: externalAccount.name }) }) }), _jsx(Field, { width: 80, children: _jsx(PrivacyFilter, { children: externalAccount.balance }) }), _jsx(Field, { width: "flex", truncate: focusedField !== 'account', onClick: () => setFocusedField('account'), children: focusedField === 'account' ? (_jsx(Autocomplete, { focused: true, strict: true, highlightFirst: true, suggestions: availableAccountOptions, onSelect: value => {
                        onSetLinkedAccount(externalAccount, value);
                    }, inputProps: {
                        onBlur: () => setFocusedField(null),
                    }, value: chosenAccount?.id })) : (chosenAccount?.name) }), _jsx(Field, { width: 150, children: chosenAccount ? (_jsx(Button, { onPress: () => {
                        onSetLinkedAccount(externalAccount, null);
                    }, style: { float: 'right' }, children: _jsx(Trans, { children: "Remove bank sync" }) })) : (_jsx(Button, { variant: "primary", onPress: () => {
                        setFocusedField('account');
                    }, style: { float: 'right' }, children: _jsx(Trans, { children: "Set up bank sync" }) })) })] }));
}
