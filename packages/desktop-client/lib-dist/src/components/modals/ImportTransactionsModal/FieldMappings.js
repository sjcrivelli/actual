import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Stack } from '@actual-app/components/stack';
import { View } from '@actual-app/components/view';
import { SelectField } from './SelectField';
import { SubLabel } from './SubLabel';
import { stripCsvImportTransaction, } from './utils';
import { SectionLabel } from '@desktop-client/components/forms';
export function FieldMappings({ transactions, mappings = {
    date: null,
    amount: null,
    payee: null,
    notes: null,
    inOut: null,
    category: null,
    outflow: null,
    inflow: null,
}, onChange, splitMode, inOutMode, hasHeaderRow, }) {
    const { t } = useTranslation();
    if (transactions.length === 0) {
        return null;
    }
    const trans = stripCsvImportTransaction(transactions[0]);
    const options = Object.keys(trans);
    return (_jsxs(View, { children: [_jsx(SectionLabel, { title: t('CSV FIELDS') }), _jsxs(Stack, { direction: "row", align: "flex-start", spacing: 1, style: { marginTop: 5 }, children: [_jsxs(View, { style: { flex: 1, marginRight: 10 }, children: [_jsx(SubLabel, { title: t('Date') }), _jsx(SelectField, { options: options, value: mappings.date, onChange: name => onChange('date', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] }), _jsxs(View, { style: { flex: 1, marginRight: 10 }, children: [_jsx(SubLabel, { title: t('Payee') }), _jsx(SelectField, { options: options, value: mappings.payee, onChange: name => onChange('payee', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] }), _jsxs(View, { style: { flex: 1, marginRight: 10 }, children: [_jsx(SubLabel, { title: t('Notes') }), _jsx(SelectField, { options: options, value: mappings.notes, onChange: name => onChange('notes', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] }), _jsxs(View, { style: { flex: 1, marginRight: 10 }, children: [_jsx(SubLabel, { title: t('Category') }), _jsx(SelectField, { options: options, value: mappings.category, onChange: name => onChange('category', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] }), splitMode && !inOutMode ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: { flex: 0.5 }, children: [_jsx(SubLabel, { title: t('Outflow') }), _jsx(SelectField, { options: options, value: mappings.outflow, onChange: name => onChange('outflow', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] }), _jsxs(View, { style: { flex: 0.5 }, children: [_jsx(SubLabel, { title: t('Inflow') }), _jsx(SelectField, { options: options, value: mappings.inflow, onChange: name => onChange('inflow', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] })] })) : (_jsxs(_Fragment, { children: [inOutMode && (_jsxs(View, { style: { flex: 1 }, children: [_jsx(SubLabel, { title: t('In/Out') }), _jsx(SelectField, { options: options, value: mappings.inOut, onChange: name => onChange('inOut', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] })), _jsxs(View, { style: { flex: 1 }, children: [_jsx(SubLabel, { title: t('Amount') }), _jsx(SelectField, { options: options, value: mappings.amount, onChange: name => onChange('amount', name), hasHeaderRow: hasHeaderRow, firstTransaction: transactions[0] })] })] }))] })] }));
}
