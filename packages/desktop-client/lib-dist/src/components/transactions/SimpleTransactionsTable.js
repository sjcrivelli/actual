import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useCallback, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { SvgArrowsSynchronize } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { format as formatDate, isValid as isDateValid, parseISO, } from 'date-fns';
import * as monthUtils from 'loot-core/shared/months';
import { Cell, Field, Row, SelectCell, Table, } from '@desktop-client/components/table';
import { DisplayId } from '@desktop-client/components/util/DisplayId';
import { useAccount } from '@desktop-client/hooks/useAccount';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSelectedItems, useSelectedDispatch, } from '@desktop-client/hooks/useSelected';
function serializeTransaction(transaction, dateFormat) {
    let { date } = transaction;
    if (!isDateValid(parseISO(date))) {
        date = monthUtils.currentDay();
    }
    return {
        ...transaction,
        date: formatDate(parseISO(date), dateFormat),
    };
}
const TransactionRow = memo(function TransactionRow({ transaction, fields, selected, format, }) {
    const { t } = useTranslation();
    const category = useCategory(transaction.category || '');
    const account = useAccount(transaction.account);
    const dispatchSelected = useSelectedDispatch();
    return (_jsxs(Row, { style: { color: theme.tableText }, children: [_jsx(SelectCell, { exposed: true, focused: false, onSelect: e => {
                    dispatchSelected({
                        type: 'select',
                        id: transaction.id,
                        isRangeSelect: e.shiftKey,
                    });
                }, selected: selected }), fields.map((field, i) => {
                switch (field) {
                    case 'date':
                        return (_jsx(Field, { width: 100, children: transaction.date }, i));
                    case 'imported_payee':
                        return (_jsx(Field, { width: "flex", children: transaction.imported_payee }, i));
                    case 'payee':
                        return (_jsx(Cell, { width: "flex", exposed: true, style: {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }, children: () => (_jsxs(_Fragment, { children: [transaction.schedule && (_jsx(SvgArrowsSynchronize, { style: {
                                            width: 13,
                                            height: 13,
                                            margin: '0 5px',
                                        } })), transaction.payee && (_jsx(DisplayId, { type: "payees", id: transaction.payee }))] })) }, i));
                    case 'category':
                        return (_jsx(Field, { width: "flex", title: category?.name, children: category?.name || '' }, i));
                    case 'account':
                        return (_jsx(Field, { width: "flex", title: account?.name || t('No account'), children: account?.name || t('No account') }, i));
                    case 'notes':
                        return (_jsx(Field, { width: "flex", title: transaction.notes, children: transaction.notes }, i));
                    case 'amount':
                        return (_jsx(Field, { width: 75, style: { textAlign: 'right', ...styles.tnum }, children: format(transaction.amount, 'financial') }, i));
                    default:
                        return null;
                }
            })] }));
});
export function SimpleTransactionsTable({ transactions, renderEmpty, fields = ['date', 'payee', 'amount'], style, }) {
    const format = useFormat();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const selectedItems = useSelectedItems();
    const dispatchSelected = useSelectedDispatch();
    const memoFields = useMemo(() => fields, [fields]);
    const serializedTransactions = useMemo(() => {
        return transactions.map(trans => serializeTransaction(trans, dateFormat));
    }, [transactions, dateFormat]);
    const renderItem = useCallback(({ item }) => {
        return (_jsx(TransactionRow, { transaction: item, fields: memoFields, selected: selectedItems && selectedItems.has(item.id), format: format }));
    }, [memoFields, selectedItems, format]);
    return (_jsx(Table, { style: style, items: serializedTransactions, renderEmpty: renderEmpty, headers: _jsxs(_Fragment, { children: [_jsx(SelectCell, { exposed: true, focused: false, selected: selectedItems.size > 0, width: 20, onSelect: e => dispatchSelected({
                        type: 'select-all',
                        isRangeSelect: e.shiftKey,
                    }) }), fields.map((field, i) => {
                    switch (field) {
                        case 'date':
                            return (_jsx(Field, { width: 100, children: _jsx(Trans, { children: "Date" }) }, i));
                        case 'imported_payee':
                            return (_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Imported payee" }) }, i));
                        case 'payee':
                            return (_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Payee" }) }, i));
                        case 'category':
                            return (_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Category" }) }, i));
                        case 'account':
                            return (_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Account" }) }, i));
                        case 'notes':
                            return (_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Notes" }) }, i));
                        case 'amount':
                            return (_jsx(Field, { width: 75, style: { textAlign: 'right' }, children: _jsx(Trans, { children: "Amount" }) }, i));
                        default:
                            return null;
                    }
                })] }), renderItem: renderItem }));
}
