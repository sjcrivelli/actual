import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@actual-app/components/label';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { TransactionList } from './TransactionList';
import { Search } from '@desktop-client/components/common/Search';
import { PullToRefresh } from '@desktop-client/components/mobile/PullToRefresh';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { SelectedProvider, useSelected, } from '@desktop-client/hooks/useSelected';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
function TransactionSearchInput({ placeholder, onSearch, }) {
    const [text, setText] = useState('');
    return (_jsx(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.mobilePageBackground,
            padding: 10,
            width: '100%',
        }, children: _jsx(Search, { value: text, onChange: text => {
                setText(text);
                onSearch(text);
            }, placeholder: placeholder, width: "100%", height: styles.mobileMinHeight, style: {
                backgroundColor: theme.tableBackground,
                borderColor: theme.formInputBorder,
            } }) }));
}
export function TransactionListWithBalances({ isLoading, transactions, balance, balanceCleared, balanceUncleared, searchPlaceholder = 'Search...', onSearch, isLoadingMore, onLoadMore, onOpenTransaction, onRefresh, showMakeTransfer = false, }) {
    const selectedInst = useSelected('transactions', [...transactions], []);
    return (_jsx(SelectedProvider, { instance: selectedInst, children: _jsxs(_Fragment, { children: [_jsxs(View, { style: {
                        flexShrink: 0,
                        marginTop: 10,
                    }, children: [_jsx(View, { style: {
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }, children: balanceCleared && balanceUncleared ? (_jsx(BalanceWithCleared, { balance: balance, balanceCleared: balanceCleared, balanceUncleared: balanceUncleared })) : (_jsx(Balance, { balance: balance })) }), _jsx(TransactionSearchInput, { placeholder: searchPlaceholder, onSearch: onSearch })] }), _jsx(PullToRefresh, { isPullable: !isLoading && !!onRefresh, onRefresh: async () => onRefresh?.(), children: _jsx(TransactionList, { isLoading: isLoading, transactions: transactions, isLoadingMore: isLoadingMore, onLoadMore: onLoadMore, onOpenTransaction: onOpenTransaction, showMakeTransfer: showMakeTransfer }) })] }) }));
}
const TransactionListBalanceCellValue = (props) => {
    return _jsx(CellValue, { ...props });
};
function BalanceWithCleared({ balanceUncleared, balanceCleared, balance, }) {
    const { t } = useTranslation();
    const unclearedAmount = useSheetValue(balanceUncleared);
    return (_jsxs(_Fragment, { children: [_jsxs(View, { style: {
                    display: !unclearedAmount ? 'none' : undefined,
                    flexBasis: '33%',
                }, children: [_jsx(Label, { title: t('Cleared'), style: { textAlign: 'center', fontSize: 12 } }), _jsx(TransactionListBalanceCellValue, { binding: balanceCleared, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: {
                                fontSize: 12,
                                textAlign: 'center',
                                fontWeight: '500',
                            }, "data-testid": "transactions-balance-cleared" })) })] }), _jsx(Balance, { balance: balance }), _jsxs(View, { style: {
                    display: !unclearedAmount ? 'none' : undefined,
                    flexBasis: '33%',
                }, children: [_jsx(Label, { title: t('Uncleared'), style: { textAlign: 'center', fontSize: 12 } }), _jsx(TransactionListBalanceCellValue, { binding: balanceUncleared, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: {
                                fontSize: 12,
                                textAlign: 'center',
                                fontWeight: '500',
                            }, "data-testid": "transactions-balance-uncleared" })) })] })] }));
}
function Balance({ balance }) {
    const { t } = useTranslation();
    return (_jsxs(View, { style: { flexBasis: '33%' }, children: [_jsx(Label, { title: t('Balance'), style: { textAlign: 'center' } }), _jsx(TransactionListBalanceCellValue, { binding: balance, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: {
                        fontSize: 18,
                        textAlign: 'center',
                        fontWeight: '500',
                        color: props.value < 0 ? theme.errorText : theme.pillTextHighlighted,
                    }, "data-testid": "transactions-balance" })) })] }));
}
