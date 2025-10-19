import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useCallback, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { amountToInteger } from 'loot-core/shared/util';
import { CheckboxOption } from './CheckboxOption';
import { DateFormatSelect } from './DateFormatSelect';
import { FieldMappings } from './FieldMappings';
import { InOutOption } from './InOutOption';
import { MultiplierOption } from './MultiplierOption';
import { applyFieldMappings, dateFormats, isDateFormat, parseAmountFields, parseDate, stripCsvImportTransaction, } from './utils';
import { importPreviewTransactions, importTransactions, } from '@desktop-client/accounts/accountsSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { SectionLabel } from '@desktop-client/components/forms';
import { TableHeader, TableWithNavigator, } from '@desktop-client/components/table';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useSyncedPrefs } from '@desktop-client/hooks/useSyncedPrefs';
import { reloadPayees } from '@desktop-client/payees/payeesSlice';
import { useDispatch } from '@desktop-client/redux';
function getFileType(filepath) {
    const m = filepath.match(/\.([^.]*)$/);
    if (!m)
        return 'ofx';
    const rawType = m[1].toLowerCase();
    if (rawType === 'tsv')
        return 'csv';
    return rawType;
}
function getInitialDateFormat(transactions, mappings) {
    if (transactions.length === 0 || mappings.date == null) {
        return 'yyyy mm dd';
    }
    const transaction = transactions[0];
    const date = transaction[mappings.date];
    const found = date == null
        ? null
        : dateFormats.find(f => parseDate(date, f.format) != null);
    return found ? found.format : 'mm dd yyyy';
}
function getInitialMappings(transactions) {
    if (transactions.length === 0) {
        return {};
    }
    const transaction = stripCsvImportTransaction(transactions[0]);
    const fields = Object.entries(transaction);
    function key(entry) {
        return entry ? entry[0] : null;
    }
    const dateField = key(fields.find(([name]) => name.toLowerCase().includes('date')) ||
        fields.find(([, value]) => String(value)?.match(/^\d+[-/]\d+[-/]\d+$/)));
    const amountField = key(fields.find(([name]) => name.toLowerCase().includes('amount')) ||
        fields.find(([, value]) => String(value)?.match(/^-?[.,\d]+$/)));
    const categoryField = key(fields.find(([name]) => name.toLowerCase().includes('category')));
    const payeeField = key(fields.find(([name]) => name.toLowerCase().includes('payee')) ||
        fields.find(([name]) => name !== dateField && name !== amountField && name !== categoryField));
    const notesField = key(fields.find(([name]) => name.toLowerCase().includes('notes')) ||
        fields.find(([name]) => name !== dateField &&
            name !== amountField &&
            name !== categoryField &&
            name !== payeeField));
    const inOutField = key(fields.find(([name]) => name !== dateField &&
        name !== amountField &&
        name !== payeeField &&
        name !== notesField));
    return {
        date: dateField,
        amount: amountField,
        payee: payeeField,
        notes: notesField,
        inOut: inOutField,
        category: categoryField,
    };
}
function parseCategoryFields(trans, categories) {
    let match = null;
    categories.forEach(category => {
        if (category.id === trans.category) {
            return null;
        }
        if (category.name === trans.category) {
            match = category.id;
        }
    });
    return match;
}
export function ImportTransactionsModal({ filename: originalFileName, accountId, onImported, }) {
    const { t } = useTranslation();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const [prefs, savePrefs] = useSyncedPrefs();
    const dispatch = useDispatch();
    const categories = useCategories();
    const [multiplierAmount, setMultiplierAmount] = useState('');
    const [loadingState, setLoadingState] = useState('parsing');
    const [error, setError] = useState(null);
    const [filename, setFilename] = useState(originalFileName);
    const [transactions, setTransactions] = useState([]);
    const [parsedTransactions, setParsedTransactions] = useState([]);
    const [filetype, setFileType] = useState('unknown');
    const [fieldMappings, setFieldMappings] = useState(null);
    const [splitMode, setSplitMode] = useState(false);
    const [flipAmount, setFlipAmount] = useState(false);
    const [multiplierEnabled, setMultiplierEnabled] = useState(false);
    const [reconcile, setReconcile] = useState(true);
    const [importNotes, setImportNotes] = useState(true);
    // This cannot be set after parsing the file, because changing it
    // requires re-parsing the file. This is different from the other
    // options which are simple post-processing. That means if you
    // parsed different files without closing the modal, it wouldn't
    // re-read this.
    const [delimiter, setDelimiter] = useState(prefs[`csv-delimiter-${accountId}`] ||
        (filename.endsWith('.tsv') ? '\t' : ','));
    const [skipLines, setSkipLines] = useState(parseInt(prefs[`csv-skip-lines-${accountId}`], 10) || 0);
    const [inOutMode, setInOutMode] = useState(String(prefs[`csv-in-out-mode-${accountId}`]) === 'true');
    const [outValue, setOutValue] = useState(prefs[`csv-out-value-${accountId}`] ?? '');
    const [hasHeaderRow, setHasHeaderRow] = useState(String(prefs[`csv-has-header-${accountId}`]) !== 'false');
    const [fallbackMissingPayeeToMemo, setFallbackMissingPayeeToMemo] = useState(String(prefs[`ofx-fallback-missing-payee-${accountId}`]) !== 'false');
    const [parseDateFormat, setParseDateFormat] = useState(null);
    const [clearOnImport, setClearOnImport] = useState(true);
    const getImportPreview = useCallback(async (transactions, filetype, flipAmount, fieldMappings, splitMode, parseDateFormat, inOutMode, outValue, multiplierAmount) => {
        const previewTransactions = [];
        const inOutModeEnabled = isOfxFile(filetype) ? false : inOutMode;
        for (let trans of transactions) {
            if (trans.isMatchedTransaction) {
                // skip transactions that are matched transaction (existing transaction added to show update changes)
                continue;
            }
            trans = fieldMappings
                ? applyFieldMappings(trans, fieldMappings)
                : trans;
            const date = isOfxFile(filetype)
                ? trans.date
                : parseDate(trans.date, parseDateFormat);
            if (date == null) {
                console.log(`Unable to parse date ${trans.date || '(empty)'} with given date format`);
                break;
            }
            if (trans.payee_name == null || typeof trans.payee_name !== 'string') {
                console.log(`Unable·to·parse·payee·${trans.payee_name || '(empty)'}`);
                break;
            }
            const { amount } = parseAmountFields(trans, splitMode, inOutModeEnabled, outValue, flipAmount, multiplierAmount);
            if (amount == null) {
                console.log(`Transaction on ${trans.date} has no amount`);
                break;
            }
            const category_id = parseCategoryFields(trans, categories.list);
            if (category_id != null) {
                trans.category = category_id;
            }
            const { inflow, outflow, inOut, existing, ignored, selected, selected_merge, tombstone, ...finalTransaction } = trans;
            previewTransactions.push({
                ...finalTransaction,
                date,
                amount: amountToInteger(amount),
                cleared: clearOnImport,
            });
        }
        // Retreive the transactions that would be updated (along with the existing trx)
        const previewTrx = await dispatch(importPreviewTransactions({
            accountId,
            transactions: previewTransactions,
        })).unwrap();
        const matchedUpdateMap = previewTrx.reduce((map, entry) => {
            // @ts-expect-error - entry.transaction might not have trx_id property
            map[entry.transaction.trx_id] = entry;
            return map;
        }, {});
        return transactions
            .filter(trans => !trans.isMatchedTransaction)
            .reduce((previous, current_trx) => {
            let next = previous;
            const entry = matchedUpdateMap[current_trx.trx_id];
            const existing_trx = entry?.existing;
            // if the transaction is matched with an existing one for update
            current_trx.existing = !!existing_trx;
            // if the transaction is an update that will be ignored
            // (reconciled transactions or no change detected)
            current_trx.ignored = entry?.ignored || false;
            current_trx.tombstone = entry?.tombstone || false;
            current_trx.selected = !current_trx.ignored;
            current_trx.selected_merge = current_trx.existing;
            next = next.concat({ ...current_trx });
            if (existing_trx) {
                // add the updated existing transaction in the list, with the
                // isMatchedTransaction flag to identify it in display and not send it again
                existing_trx.isMatchedTransaction = true;
                existing_trx.category = categories.list.find(cat => cat.id === existing_trx.category)?.name;
                // add parent transaction attribute to mimic behaviour
                existing_trx.trx_id = current_trx.trx_id;
                existing_trx.existing = current_trx.existing;
                existing_trx.selected = current_trx.selected;
                existing_trx.selected_merge = current_trx.selected_merge;
                next = next.concat({ ...existing_trx });
            }
            return next;
        }, []);
    }, [accountId, categories.list, clearOnImport, dispatch]);
    const parse = useCallback(async (filename, options) => {
        setLoadingState('parsing');
        const filetype = getFileType(filename);
        setFilename(filename);
        setFileType(filetype);
        const { errors, transactions: parsedTransactions = [] } = await send('transactions-parse-file', {
            filepath: filename,
            options,
        });
        let index = 0;
        const transactions = parsedTransactions.map(trans => {
            // Add a transient transaction id to match preview with imported transactions
            // @ts-expect-error - trans is unknown type, adding properties dynamically
            trans.trx_id = String(index++);
            // Select all parsed transactions before first preview run
            // @ts-expect-error - trans is unknown type, adding properties dynamically
            trans.selected = true;
            return trans;
        });
        setLoadingState(null);
        setError(null);
        /// Do fine grained reporting between the old and new OFX importers.
        if (errors.length > 0) {
            setError({
                parsed: true,
                message: errors[0].message || 'Internal error',
            });
        }
        else {
            let flipAmount = false;
            let fieldMappings = null;
            let splitMode = false;
            let parseDateFormat = null;
            if (filetype === 'csv' || filetype === 'qif') {
                flipAmount =
                    String(prefs[`flip-amount-${accountId}-${filetype}`]) === 'true';
                setFlipAmount(flipAmount);
            }
            if (filetype === 'csv') {
                let mappings = prefs[`csv-mappings-${accountId}`];
                mappings = mappings
                    ? JSON.parse(mappings)
                    : getInitialMappings(transactions);
                fieldMappings = mappings;
                // @ts-expect-error - mappings might not have outflow/inflow properties
                setFieldMappings(mappings);
                // Set initial split mode based on any saved mapping
                // @ts-expect-error - mappings might not have outflow/inflow properties
                splitMode = !!(mappings.outflow || mappings.inflow);
                setSplitMode(splitMode);
                parseDateFormat =
                    prefs[`parse-date-${accountId}-${filetype}`] ||
                        getInitialDateFormat(transactions, mappings);
                setParseDateFormat(isDateFormat(parseDateFormat) ? parseDateFormat : null);
            }
            else if (filetype === 'qif') {
                parseDateFormat =
                    prefs[`parse-date-${accountId}-${filetype}`] ||
                        getInitialDateFormat(transactions, { date: 'date' });
                setParseDateFormat(isDateFormat(parseDateFormat) ? parseDateFormat : null);
            }
            else {
                setFieldMappings(null);
                setParseDateFormat(null);
            }
            // Reverse the transactions because it's very common for them to
            // be ordered ascending, but we show transactions descending by
            // date. This is purely cosmetic.
            const reversedTransactions = transactions.reverse();
            setParsedTransactions(reversedTransactions);
            const transactionPreview = await getImportPreview(reversedTransactions, filetype, flipAmount, fieldMappings, splitMode, isDateFormat(parseDateFormat) ? parseDateFormat : null, inOutMode, outValue, multiplierAmount);
            setTransactions(transactionPreview);
        }
    }, 
    // We use some state variables from the component, but do not want to re-parse when they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountId, getImportPreview, prefs]);
    function onMultiplierChange(e) {
        const amt = e;
        if (!amt || amt.match(/^\d{1,}(\.\d{0,4})?$/)) {
            setMultiplierAmount(amt);
        }
    }
    useEffect(() => {
        const fileType = getFileType(originalFileName);
        const parseOptions = getParseOptions(fileType, {
            delimiter,
            hasHeaderRow,
            skipLines,
            fallbackMissingPayeeToMemo,
            importNotes,
        });
        parse(originalFileName, parseOptions);
    }, [
        originalFileName,
        delimiter,
        hasHeaderRow,
        skipLines,
        fallbackMissingPayeeToMemo,
        importNotes,
        parse,
    ]);
    function onSplitMode() {
        if (fieldMappings == null) {
            return;
        }
        const isSplit = !splitMode;
        setSplitMode(isSplit);
        // Run auto-detection on the fields to try to detect the fields
        // automatically
        const mappings = getInitialMappings(transactions);
        const newFieldMappings = isSplit
            ? {
                amount: null,
                outflow: mappings.amount,
                inflow: null,
            }
            : {
                amount: mappings.amount,
                outflow: null,
                inflow: null,
            };
        setFieldMappings({ ...fieldMappings, ...newFieldMappings });
    }
    async function onNewFile() {
        const res = await window.Actual.openFileDialog({
            filters: [
                {
                    name: 'Financial Files',
                    extensions: ['qif', 'ofx', 'qfx', 'csv', 'tsv', 'xml'],
                },
            ],
        });
        const fileType = getFileType(res[0]);
        const parseOptions = getParseOptions(fileType, {
            delimiter,
            hasHeaderRow,
            skipLines,
            fallbackMissingPayeeToMemo,
            importNotes,
        });
        parse(res[0], parseOptions);
    }
    function onUpdateFields(field, name) {
        const newFieldMappings = {
            ...fieldMappings,
            [field]: name === '' ? null : name,
        };
        setFieldMappings(newFieldMappings);
    }
    function onCheckTransaction(trx_id) {
        const newTransactions = transactions.map(trans => {
            if (trans.trx_id === trx_id) {
                if (trans.existing) {
                    // 3-states management for transactions with existing (merged transactions)
                    // flow of states:
                    // (selected true && selected_merge true)
                    //   => (selected true && selected_merge false)
                    //     => (selected false)
                    //       => back to (selected true && selected_merge true)
                    if (!trans.selected) {
                        return {
                            ...trans,
                            selected: true,
                            selected_merge: true,
                        };
                    }
                    else if (trans.selected_merge) {
                        return {
                            ...trans,
                            selected: true,
                            selected_merge: false,
                        };
                    }
                    else {
                        return {
                            ...trans,
                            selected: false,
                            selected_merge: false,
                        };
                    }
                }
                else {
                    return {
                        ...trans,
                        selected: !trans.selected,
                    };
                }
            }
            return trans;
        });
        setTransactions(newTransactions);
    }
    async function onImport(close) {
        setLoadingState('importing');
        const finalTransactions = [];
        let errorMessage;
        for (let trans of transactions) {
            if (trans.isMatchedTransaction ||
                (reconcile && !trans.selected && !trans.ignored)) {
                // skip transactions that are
                // - matched transaction (existing transaction added to show update changes)
                // - unselected transactions that are not ignored by the reconcilation algorithm (only when reconcilation is enabled)
                continue;
            }
            trans = fieldMappings ? applyFieldMappings(trans, fieldMappings) : trans;
            const date = isOfxFile(filetype) || isCamtFile(filetype)
                ? trans.date
                : parseDate(trans.date, parseDateFormat);
            if (date == null) {
                errorMessage = t('Unable to parse date {{date}} with given date format', { date: trans.date || t('(empty)') });
                break;
            }
            const { amount } = parseAmountFields(trans, splitMode, isOfxFile(filetype) ? false : inOutMode, outValue, flipAmount, multiplierAmount);
            if (amount == null) {
                errorMessage = t('Transaction on {{date}} has no amount', {
                    date: trans.date,
                });
                break;
            }
            const category_id = parseCategoryFields(trans, categories.list);
            trans.category = category_id;
            const { inflow, outflow, inOut, existing, ignored, selected, selected_merge, trx_id, ...finalTransaction } = trans;
            if (reconcile &&
                ((trans.ignored && trans.selected) ||
                    (trans.existing && trans.selected && !trans.selected_merge))) {
                // in reconcile mode, force transaction add for
                // - ignored transactions (aleardy existing) that are checked
                // - transactions with existing (merged transactions) that are not selected_merge
                finalTransaction.forceAddTransaction = true;
            }
            finalTransactions.push({
                ...finalTransaction,
                date,
                amount: amountToInteger(amount),
                cleared: clearOnImport,
                notes: importNotes ? finalTransaction.notes : null,
            });
        }
        if (errorMessage) {
            setLoadingState(null);
            setError({ parsed: false, message: errorMessage });
            return;
        }
        if (!isOfxFile(filetype) && !isCamtFile(filetype)) {
            const key = `parse-date-${accountId}-${filetype}`;
            savePrefs({ [key]: parseDateFormat });
        }
        if (isOfxFile(filetype)) {
            savePrefs({
                [`ofx-fallback-missing-payee-${accountId}`]: String(fallbackMissingPayeeToMemo),
            });
        }
        if (filetype === 'csv') {
            savePrefs({
                [`csv-mappings-${accountId}`]: JSON.stringify(fieldMappings),
            });
            savePrefs({ [`csv-delimiter-${accountId}`]: delimiter });
            savePrefs({ [`csv-has-header-${accountId}`]: String(hasHeaderRow) });
            savePrefs({ [`csv-skip-lines-${accountId}`]: String(skipLines) });
            savePrefs({ [`csv-in-out-mode-${accountId}`]: String(inOutMode) });
            savePrefs({ [`csv-out-value-${accountId}`]: String(outValue) });
        }
        if (filetype === 'csv' || filetype === 'qif') {
            savePrefs({
                [`flip-amount-${accountId}-${filetype}`]: String(flipAmount),
                [`import-notes-${accountId}-${filetype}`]: String(importNotes),
            });
        }
        const didChange = await dispatch(importTransactions({
            accountId,
            transactions: finalTransactions,
            reconcile,
        })).unwrap();
        if (didChange) {
            await dispatch(reloadPayees());
        }
        if (onImported) {
            onImported(didChange);
        }
        close();
    }
    const runImportPreview = useCallback(async () => {
        // preserve user's selection choices before re-running preview
        const selectionMap = new Map();
        transactions.forEach(trans => {
            if (!trans.isMatchedTransaction) {
                selectionMap.set(trans.trx_id, {
                    selected: trans.selected,
                    selected_merge: trans.selected_merge,
                });
            }
        });
        // always start from the original parsed transactions, not the previewed ones to ensure rules run
        const transactionPreview = await getImportPreview(parsedTransactions, filetype, flipAmount, fieldMappings, splitMode, parseDateFormat, inOutMode, outValue, multiplierAmount);
        // restore selections to the new preview results
        const transactionPreviewWithSelections = transactionPreview.map(trans => {
            if (!trans.isMatchedTransaction && selectionMap.has(trans.trx_id)) {
                const saved = selectionMap.get(trans.trx_id);
                return {
                    ...trans,
                    selected: saved.selected,
                    selected_merge: saved.selected_merge,
                };
            }
            return trans;
        });
        setTransactions(transactionPreviewWithSelections);
        // intentionally exclude transactions from dependencies to avoid infinite rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        getImportPreview,
        parsedTransactions,
        filetype,
        flipAmount,
        fieldMappings,
        splitMode,
        parseDateFormat,
        inOutMode,
        outValue,
        multiplierAmount,
    ]);
    useEffect(() => {
        if (parsedTransactions.length === 0 || loadingState === 'parsing') {
            return;
        }
        if (filetype === 'csv' || filetype === 'qif') {
            runImportPreview();
        }
        // intentionally exclude runImportPreview from dependencies to avoid infinite rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filetype,
        flipAmount,
        fieldMappings,
        splitMode,
        parseDateFormat,
        inOutMode,
        outValue,
        multiplierAmount,
        loadingState,
        parsedTransactions.length,
    ]);
    const headers = [
        { name: t('Date'), width: 200 },
        { name: t('Payee'), width: 'flex' },
        { name: t('Notes'), width: 'flex' },
        { name: t('Category'), width: 'flex' },
    ];
    if (reconcile) {
        headers.unshift({ name: ' ', width: 31 });
    }
    if (inOutMode) {
        headers.push({
            name: t('In/Out'),
            width: 90,
            style: { textAlign: 'left' },
        });
    }
    if (splitMode) {
        headers.push({
            name: t('Outflow'),
            width: 90,
            style: { textAlign: 'right' },
        });
        headers.push({
            name: t('Inflow'),
            width: 90,
            style: { textAlign: 'right' },
        });
    }
    else {
        headers.push({
            name: t('Amount'),
            width: 90,
            style: { textAlign: 'right' },
        });
    }
    return (_jsx(Modal, { name: "import-transactions", isLoading: loadingState === 'parsing', containerProps: { style: { width: 800 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Import transactions') +
                        (filetype ? ` (${filetype.toUpperCase()})` : ''), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), error && !error.parsed && (_jsx(View, { style: { alignItems: 'center', marginBottom: 15 }, children: _jsxs(Text, { style: { marginRight: 10, color: theme.errorText }, children: [_jsx("strong", { children: _jsx(Trans, { children: "Error:" }) }), ' ', error.message] }) })), (!error || !error.parsed) && (_jsxs(View, { style: {
                        flex: 'unset',
                        height: 300,
                        border: '1px solid ' + theme.tableBorder,
                    }, children: [_jsx(TableHeader, { headers: headers }), _jsx(TableWithNavigator, { items: transactions.filter(trans => !trans.isMatchedTransaction ||
                                (trans.isMatchedTransaction && reconcile)), fields: ['payee', 'category', 'amount'], style: { backgroundColor: theme.tableHeaderBackground }, getItemKey: index => String(index), renderEmpty: () => {
                                return (_jsx(View, { style: {
                                        textAlign: 'center',
                                        marginTop: 25,
                                        color: theme.tableHeaderText,
                                        fontStyle: 'italic',
                                    }, children: _jsx(Trans, { children: "No transactions found" }) }));
                            }, renderItem: ({ item }) => (_jsx(View, { children: _jsx(Transaction, { transaction: item, showParsed: filetype === 'csv' || filetype === 'qif', parseDateFormat: parseDateFormat, dateFormat: dateFormat, fieldMappings: fieldMappings, splitMode: splitMode, inOutMode: inOutMode, outValue: outValue, flipAmount: flipAmount, multiplierAmount: multiplierAmount, categories: categories.list, onCheckTransaction: onCheckTransaction, reconcile: reconcile }) })) })] })), error && error.parsed && (_jsxs(View, { style: {
                        color: theme.errorText,
                        alignItems: 'center',
                        marginTop: 10,
                    }, children: [_jsxs(Text, { style: { maxWidth: 450, marginBottom: 15 }, children: [_jsx("strong", { children: "Error:" }), " ", error.message] }), error.parsed && (_jsx(Button, { onPress: () => onNewFile(), children: _jsx(Trans, { children: "Select new file..." }) }))] })), filetype === 'csv' && (_jsx(View, { style: { marginTop: 10 }, children: _jsx(FieldMappings, { transactions: transactions, onChange: onUpdateFields, mappings: fieldMappings || undefined, splitMode: splitMode, inOutMode: inOutMode, hasHeaderRow: hasHeaderRow }) })), isOfxFile(filetype) && (_jsx(CheckboxOption, { id: "form_fallback_missing_payee", checked: fallbackMissingPayeeToMemo, onChange: () => {
                        setFallbackMissingPayeeToMemo(state => !state);
                        parse(filename, getParseOptions('ofx', {
                            fallbackMissingPayeeToMemo: !fallbackMissingPayeeToMemo,
                            importNotes,
                        }));
                    }, children: _jsx(Trans, { children: "Use Memo as a fallback for empty Payees" }) })), filetype !== 'csv' && (_jsx(CheckboxOption, { id: "import_notes", checked: importNotes, onChange: () => {
                        setImportNotes(!importNotes);
                        parse(filename, getParseOptions(filetype, {
                            delimiter,
                            hasHeaderRow,
                            skipLines,
                            fallbackMissingPayeeToMemo,
                            importNotes: !importNotes,
                        }));
                    }, children: _jsx(Trans, { children: "Import notes from file" }) })), (isOfxFile(filetype) || isCamtFile(filetype)) && (_jsx(CheckboxOption, { id: "form_dont_reconcile", checked: reconcile, onChange: () => {
                        setReconcile(!reconcile);
                    }, children: _jsx(Trans, { children: "Merge with existing transactions" }) })), (filetype === 'qif' || filetype === 'csv') && (_jsx(View, { style: { marginTop: 10 }, children: _jsxs(Stack, { direction: "row", align: "flex-start", spacing: 1, style: { marginTop: 5 }, children: [_jsx(View, { children: (filetype === 'qif' || filetype === 'csv') && (_jsx(DateFormatSelect, { transactions: transactions, fieldMappings: fieldMappings || undefined, parseDateFormat: parseDateFormat || undefined, onChange: value => {
                                        setParseDateFormat(isDateFormat(value) ? value : null);
                                    } })) }), filetype === 'csv' && (_jsxs(View, { style: { marginLeft: 10, gap: 5 }, children: [_jsx(SectionLabel, { title: t('CSV OPTIONS') }), _jsxs("label", { style: {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 5,
                                            alignItems: 'baseline',
                                        }, children: [_jsx(Trans, { children: "Delimiter:" }), _jsx(Select, { options: [
                                                    [',', ','],
                                                    [';', ';'],
                                                    ['|', '|'],
                                                    ['\t', 'tab'],
                                                ], value: delimiter, onChange: value => {
                                                    setDelimiter(value);
                                                    parse(filename, getParseOptions('csv', {
                                                        delimiter: value,
                                                        hasHeaderRow,
                                                        skipLines,
                                                        importNotes,
                                                    }));
                                                }, style: { width: 50 } })] }), _jsxs("label", { style: {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 5,
                                            alignItems: 'baseline',
                                        }, children: [_jsx(Trans, { children: "Skip lines:" }), _jsx(Input, { type: "number", value: skipLines, min: "0", onChangeValue: value => {
                                                    setSkipLines(+value);
                                                    parse(filename, getParseOptions('csv', {
                                                        delimiter,
                                                        hasHeaderRow,
                                                        skipLines: +value,
                                                        importNotes,
                                                    }));
                                                }, style: { width: 50 } })] }), _jsx(CheckboxOption, { id: "form_has_header", checked: hasHeaderRow, onChange: () => {
                                            setHasHeaderRow(!hasHeaderRow);
                                            parse(filename, getParseOptions('csv', {
                                                delimiter,
                                                hasHeaderRow: !hasHeaderRow,
                                                skipLines,
                                                importNotes,
                                            }));
                                        }, children: _jsx(Trans, { children: "File has header row" }) }), _jsx(CheckboxOption, { id: "clear_on_import", checked: clearOnImport, onChange: () => {
                                            setClearOnImport(!clearOnImport);
                                        }, children: _jsx(Trans, { children: "Clear transactions on import" }) }), _jsx(CheckboxOption, { id: "form_dont_reconcile", checked: reconcile, onChange: () => {
                                            setReconcile(!reconcile);
                                        }, children: _jsx(Trans, { children: "Merge with existing transactions" }) })] })), _jsx(View, { style: { flex: 1 } }), _jsxs(View, { style: { marginRight: 10, gap: 5 }, children: [_jsx(SectionLabel, { title: t('AMOUNT OPTIONS') }), _jsx(CheckboxOption, { id: "form_flip", checked: flipAmount, onChange: () => {
                                            setFlipAmount(!flipAmount);
                                        }, children: _jsx(Trans, { children: "Flip amount" }) }), _jsx(MultiplierOption, { multiplierEnabled: multiplierEnabled, multiplierAmount: multiplierAmount, onToggle: () => {
                                            setMultiplierEnabled(!multiplierEnabled);
                                            setMultiplierAmount('');
                                        }, onChangeAmount: onMultiplierChange }), filetype === 'csv' && (_jsxs(_Fragment, { children: [_jsx(CheckboxOption, { id: "form_split", checked: splitMode, onChange: () => {
                                                    onSplitMode();
                                                }, children: _jsx(Trans, { children: "Split amount into separate inflow/outflow columns" }) }), _jsx(InOutOption, { inOutMode: inOutMode, outValue: outValue, onToggle: () => {
                                                    setInOutMode(!inOutMode);
                                                }, onChangeText: setOutValue })] }))] })] }) })), _jsx(View, { style: { flexDirection: 'row', marginTop: 5 }, children: _jsx(View, { style: {
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '1em',
                        }, children: (() => {
                            const count = transactions?.filter(trans => !trans.isMatchedTransaction &&
                                trans.selected &&
                                !trans.tombstone).length;
                            return (_jsx(ButtonWithLoading, { variant: "primary", autoFocus: true, isDisabled: count === 0, isLoading: loadingState === 'importing', onPress: () => {
                                    onImport(close);
                                }, children: _jsxs(Trans, { count: count, children: ["Import ", { count }, " transactions"] }) }));
                        })() }) })] })) }));
}
function getParseOptions(fileType, options = {}) {
    if (fileType === 'csv') {
        const { delimiter, hasHeaderRow, skipLines } = options;
        return { delimiter, hasHeaderRow, skipLines };
    }
    if (isOfxFile(fileType)) {
        const { fallbackMissingPayeeToMemo, importNotes } = options;
        return { fallbackMissingPayeeToMemo, importNotes };
    }
    if (isCamtFile(fileType)) {
        const { importNotes } = options;
        return { importNotes };
    }
    const { importNotes } = options;
    return { importNotes };
}
function isOfxFile(fileType) {
    return fileType === 'ofx' || fileType === 'qfx';
}
function isCamtFile(fileType) {
    return fileType === 'xml';
}
