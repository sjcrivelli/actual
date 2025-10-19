import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { SvgRightArrow2 } from '@actual-app/components/icons/v0';
import { SvgEquals } from '@actual-app/components/icons/v1';
import { Select } from '@actual-app/components/select';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Row, Cell, TableHeader } from '@desktop-client/components/table';
const useTransactionDirectionOptions = () => {
    const { t } = useTranslation();
    const transactionDirectionOptions = [
        {
            value: 'payment',
            label: t('Payment'),
        },
        {
            value: 'deposit',
            label: t('Deposit'),
        },
    ];
    return { transactionDirectionOptions };
};
export function FieldMapping({ transactionDirection, setTransactionDirection, fields, mapping, setMapping, }) {
    const { t } = useTranslation();
    const { transactionDirectionOptions } = useTransactionDirectionOptions();
    return (_jsxs(_Fragment, { children: [_jsx(Select, { "aria-label": t('Transaction direction'), options: transactionDirectionOptions.map(x => [x.value, x.label]), value: transactionDirection, onChange: newValue => setTransactionDirection(newValue), style: {
                    width: '25%',
                    margin: '1em 0',
                } }), fields.length === 0 ? (_jsx(Text, { style: { margin: '1em 0 .5em 0' }, children: _jsx(Trans, { children: "No transactions found with mappable fields, accounts must have been synced at least once for this function to be available." }) })) : (_jsxs(_Fragment, { children: [_jsxs(TableHeader, { children: [_jsx(Cell, { value: t('Actual field'), width: 100, style: { paddingLeft: '10px' } }), _jsx(Cell, { value: t('Bank field'), width: 330, style: { paddingLeft: '10px' } }), _jsx(Cell, { value: t('Example'), width: "flex", style: { paddingLeft: '10px' } })] }), fields.map(field => {
                        return (_jsxs(Row, { style: {
                                fontSize: 13,
                                backgroundColor: theme.tableRowBackgroundHover,
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid var(--color-tableBorder)',
                                minHeight: '40px',
                            }, collapsed: true, children: [_jsx(Cell, { value: field.actualField, width: 75, style: { paddingLeft: '10px', height: '100%', border: 0 } }), _jsx(Text, { children: _jsx(SvgRightArrow2, { style: {
                                            width: 15,
                                            height: 15,
                                            color: theme.tableText,
                                            marginRight: '20px',
                                        } }) }), _jsx(Select, { "aria-label": t('Synced field to map to {{field}}', {
                                        field: field.actualField,
                                    }), options: field.syncFields.map(({ field }) => [field, field]), value: mapping.get(field.actualField), style: {
                                        width: 290,
                                    }, onChange: newValue => {
                                        if (newValue)
                                            setMapping(field.actualField, newValue);
                                    } }), _jsx(Text, { children: _jsx(SvgEquals, { style: {
                                            width: 12,
                                            height: 12,
                                            color: theme.tableText,
                                            marginLeft: '20px',
                                        } }) }), _jsx(Cell, { value: field.syncFields.find(f => f.field === mapping.get(field.actualField))?.example, width: "flex", style: { paddingLeft: '10px', height: '100%', border: 0 } })] }, field.actualField));
                    })] }))] }));
}
