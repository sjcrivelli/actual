import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgQuestion } from '@actual-app/components/icons/v1';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { defaultMappings, mappingsFromString, mappingsToString, } from 'loot-core/server/util/custom-sync-mapping';
import { q } from 'loot-core/shared/query';
import { FieldMapping } from './FieldMapping';
import { unlinkAccount } from '@desktop-client/accounts/accountsSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { CheckboxOption } from '@desktop-client/components/modals/ImportTransactionsModal/CheckboxOption';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useTransactions } from '@desktop-client/hooks/useTransactions';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
const mappableFields = [
    {
        actualField: 'date',
        syncFields: [
            'date',
            'bookingDate',
            'valueDate',
            'postedDate',
            'transactedDate',
        ],
    },
    {
        actualField: 'payee',
        syncFields: [
            'payeeName',
            'creditorName',
            'debtorName',
            'remittanceInformationUnstructured',
            'remittanceInformationUnstructuredArrayString',
            'remittanceInformationStructured',
            'remittanceInformationStructuredArrayString',
            'additionalInformation',
            'paymentData.payer.accountNumber',
            'paymentData.payer.documentNumber.value',
            'paymentData.payer.name',
            'paymentData.receiver.accountNumber',
            'paymentData.receiver.documentNumber.value',
            'paymentData.receiver.name',
            'merchant.name',
            'merchant.businessName',
            'merchant.cnpj',
        ],
    },
    {
        actualField: 'notes',
        syncFields: [
            'notes',
            'remittanceInformationUnstructured',
            'remittanceInformationUnstructuredArrayString',
            'remittanceInformationStructured',
            'remittanceInformationStructuredArrayString',
            'additionalInformation',
            'category',
            'paymentData.payer.accountNumber',
            'paymentData.payer.documentNumber.value',
            'paymentData.payer.name',
            'paymentData.receiver.accountNumber',
            'paymentData.receiver.documentNumber.value',
            'paymentData.receiver.name',
            'merchant.name',
            'merchant.businessName',
            'merchant.cnpj',
        ],
    },
];
const getFields = (transaction) => mappableFields.map(field => ({
    actualField: field.actualField,
    syncFields: field.syncFields
        .filter(syncField => transaction[syncField])
        .map(syncField => ({
        field: syncField,
        example: transaction[syncField],
    })),
}));
export function EditSyncAccount({ account }) {
    const { t } = useTranslation();
    const [savedMappings = mappingsToString(defaultMappings), setSavedMappings] = useSyncedPref(`custom-sync-mappings-${account.id}`);
    const [savedImportNotes = true, setSavedImportNotes] = useSyncedPref(`sync-import-notes-${account.id}`);
    const [savedImportPending = true, setSavedImportPending] = useSyncedPref(`sync-import-pending-${account.id}`);
    const [savedReimportDeleted = true, setSavedReimportDeleted] = useSyncedPref(`sync-reimport-deleted-${account.id}`);
    const [savedImportTransactions = true, setSavedImportTransactions] = useSyncedPref(`sync-import-transactions-${account.id}`);
    const [transactionDirection, setTransactionDirection] = useState('payment');
    const [importPending, setImportPending] = useState(String(savedImportPending) === 'true');
    const [importNotes, setImportNotes] = useState(String(savedImportNotes) === 'true');
    const [reimportDeleted, setReimportDeleted] = useState(String(savedReimportDeleted) === 'true');
    const [mappings, setMappings] = useState(mappingsFromString(savedMappings));
    const [importTransactions, setImportTransactions] = useState(String(savedImportTransactions) === 'true');
    const transactionQuery = useMemo(() => q('transactions')
        .filter({
        account: account.id,
        amount: transactionDirection === 'payment' ? { $lte: 0 } : { $gt: 0 },
        raw_synced_data: { $ne: null },
    })
        .options({ splits: 'none' })
        .select('*'), [account.id, transactionDirection]);
    const { transactions } = useTransactions({
        query: transactionQuery,
    });
    const exampleTransaction = useMemo(() => {
        const data = transactions?.[0]?.raw_synced_data;
        if (!data)
            return undefined;
        try {
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Failed to parse transaction data:', error);
            return undefined;
        }
    }, [transactions]);
    const onSave = async (close) => {
        const mappingsStr = mappingsToString(mappings);
        setSavedMappings(mappingsStr);
        setSavedImportPending(String(importPending));
        setSavedImportNotes(String(importNotes));
        setSavedReimportDeleted(String(reimportDeleted));
        setSavedImportTransactions(String(importTransactions));
        close();
    };
    const dispatch = useDispatch();
    const onUnlink = async (close) => {
        dispatch(pushModal({
            modal: {
                name: 'confirm-unlink-account',
                options: {
                    accountName: account.name,
                    isViewBankSyncSettings: true,
                    onUnlink: () => {
                        dispatch(unlinkAccount({ id: account.id }));
                        close();
                    },
                },
            },
        }));
    };
    const setMapping = (field, value) => {
        setMappings(prev => {
            const updated = new Map(prev);
            updated?.get(transactionDirection)?.set(field, value);
            return updated;
        });
    };
    const potentiallyTruncatedAccountName = account.name.length > 30 ? account.name.slice(0, 30) + '...' : account.name;
    const fields = exampleTransaction ? getFields(exampleTransaction) : [];
    const mapping = mappings.get(transactionDirection);
    return (_jsx(Modal, { name: "synced-account-edit", containerProps: { style: { width: 800 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('{{accountName}} bank sync settings', {
                        accountName: potentiallyTruncatedAccountName,
                    }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Text, { style: { fontSize: 15 }, children: _jsx(Trans, { children: "Field mapping" }) }), _jsx(FieldMapping, { transactionDirection: transactionDirection, setTransactionDirection: setTransactionDirection, fields: fields, mapping: mapping, setMapping: setMapping }), _jsx(Text, { style: { fontSize: 15, margin: '1em 0 .5em 0' }, children: _jsx(Trans, { children: "Options" }) }), _jsx(CheckboxOption, { id: "form_pending", checked: importPending && importTransactions, onChange: () => setImportPending(!importPending), disabled: !importTransactions, children: _jsx(Trans, { children: "Import pending transactions" }) }), _jsx(CheckboxOption, { id: "form_notes", checked: importNotes && importTransactions, onChange: () => setImportNotes(!importNotes), disabled: !importTransactions, children: _jsx(Trans, { children: "Import transaction notes" }) }), _jsx(CheckboxOption, { id: "form_reimport_deleted", checked: reimportDeleted && importTransactions, onChange: () => setReimportDeleted(!reimportDeleted), disabled: !importTransactions, children: _jsx(Tooltip, { content: t('By default imported transactions that you delete will be re-imported with the next bank sync operation. To disable this behaviour - untick this box.'), children: _jsxs(View, { style: {
                                display: 'flex',
                                flexWrap: 'nowrap',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }, children: [_jsx(Trans, { children: "Reimport deleted transactions" }), _jsx(SvgQuestion, { height: 12, width: 12, cursor: "pointer" })] }) }) }), _jsx(CheckboxOption, { id: "form_import_transactions", checked: !importTransactions, onChange: () => setImportTransactions(!importTransactions), children: _jsx(Tooltip, { content: t(`Selecting this option will disable importing transactions and only import the account balance for use in reconciliation`), children: _jsxs(View, { style: {
                                display: 'flex',
                                flexWrap: 'nowrap',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                            }, children: [_jsx(Trans, { children: "Investment Account" }), _jsx(SvgQuestion, { height: 12, width: 12, cursor: "pointer" })] }) }) }), _jsxs(View, { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 20,
                    }, children: [_jsx(Button, { style: { color: theme.errorText }, onPress: () => {
                                onUnlink(close);
                            }, children: _jsx(Trans, { children: "Unlink account" }) }), _jsxs(Stack, { direction: "row", children: [_jsx(Button, { style: { marginRight: 10 }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: () => {
                                        onSave(close);
                                    }, children: _jsx(Trans, { children: "Save" }) })] })] })] })) }));
}
