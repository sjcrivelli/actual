import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheckCircle1 } from '@actual-app/components/icons/v2';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { format as formatDate } from 'date-fns';
import { t } from 'i18next';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import { tsToRelativeTime, amountToInteger } from 'loot-core/shared/util';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import * as bindings from '@desktop-client/spreadsheet/bindings';
export function ReconcilingMessage({ balanceQuery, targetBalance, onDone, onCreateTransaction, }) {
    const cleared = useSheetValue({
        name: (balanceQuery.name +
            '-cleared'),
        value: 0,
        query: balanceQuery.query.filter({ cleared: true }),
    }) ?? 0;
    const format = useFormat();
    const targetDiff = targetBalance - cleared;
    const clearedBalance = format(cleared, 'financial');
    const bankBalance = format(targetBalance, 'financial');
    const difference = (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
    return (_jsx(View, { style: {
            flexDirection: 'row',
            alignSelf: 'center',
            backgroundColor: theme.tableBackground,
            ...styles.shadow,
            borderRadius: 4,
            marginTop: 5,
            marginBottom: 15,
            padding: 10,
        }, children: _jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [targetDiff === 0 ? (_jsxs(View, { style: {
                        color: theme.noticeTextLight,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, children: [_jsx(SvgCheckCircle1, { style: {
                                width: 13,
                                height: 13,
                                color: 'inherit',
                                marginRight: 3,
                            } }), _jsx(Trans, { children: "All reconciled!" })] })) : (_jsx(View, { style: { color: theme.tableText }, children: _jsx(Text, { style: { fontStyle: 'italic', textAlign: 'center' }, children: _jsxs(Trans, { children: ["Your cleared balance", ' ', _jsx("strong", { children: { clearedBalance } }), ' ', "needs ", _jsx("strong", { children: { difference } }), " to match", _jsx("br", {}), " your bank's balance of", ' ', _jsx(Text, { style: { fontWeight: 700 }, children: { bankBalance } })] }) }) })), _jsx(View, { style: { marginLeft: 15 }, children: _jsx(Button, { variant: "primary", onPress: onDone, children: _jsx(Trans, { children: "Done reconciling" }) }) }), targetDiff !== 0 && (_jsx(View, { style: { marginLeft: 15 }, children: _jsx(Button, { onPress: () => onCreateTransaction(targetDiff), children: _jsx(Trans, { children: "Create reconciliation transaction" }) }) }))] }) }));
}
export function ReconcileMenu({ account, onReconcile, onClose, }) {
    const balanceQuery = bindings.accountBalance(account.id);
    const clearedBalance = useSheetValue({
        name: (balanceQuery.name + '-cleared'),
        value: null,
        query: balanceQuery.query.filter({ cleared: true }),
    });
    const lastSyncedBalance = account.balance_current;
    const format = useFormat();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const locale = useLocale();
    const [inputValue, setInputValue] = useState();
    // useEffect is needed here. clearedBalance does not work as a default value for inputValue and
    // to use a button to update inputValue we can't use defaultValue in the input form below
    useEffect(() => {
        if (clearedBalance != null) {
            setInputValue(format(clearedBalance, 'financial'));
        }
    }, [clearedBalance, format]);
    function onSubmit(e) {
        e.preventDefault();
        if (inputValue === '') {
            return;
        }
        const evaluatedAmount = inputValue != null ? evalArithmetic(inputValue) : null;
        const amount = evaluatedAmount != null
            ? amountToInteger(evaluatedAmount)
            : clearedBalance;
        onReconcile(amount);
        onClose();
    }
    return (_jsx(Form, { onSubmit: onSubmit, children: _jsxs(View, { style: { padding: '5px 8px' }, children: [_jsx(Text, { children: _jsx(Trans, { children: "Enter the current balance of your bank account that you want to reconcile with:" }) }), inputValue != null && (_jsx(InitialFocus, { children: _jsx(Input, { value: inputValue, onChangeValue: setInputValue, style: { margin: '7px 0' } }) })), lastSyncedBalance != null && (_jsxs(View, { children: [_jsxs(Text, { children: [_jsx(Trans, { children: "Last Balance from Bank: " }), format(lastSyncedBalance, 'financial')] }), _jsx(Button, { onPress: () => setInputValue(format(lastSyncedBalance, 'financial')), style: { marginBottom: 7 }, children: _jsx(Trans, { children: "Use last synced total" }) })] })), _jsx(Text, { style: { color: theme.pageTextSubdued, paddingBottom: 6 }, children: account?.last_reconciled
                        ? t('Reconciled {{ relativeTimeAgo }} ({{ absoluteDate }})', {
                            relativeTimeAgo: tsToRelativeTime(account.last_reconciled, locale),
                            absoluteDate: formatDate(new Date(parseInt(account.last_reconciled ?? '0', 10)), dateFormat, { locale }),
                        })
                        : t('Not yet reconciled') }), _jsx(Button, { type: "submit", variant: "primary", children: _jsx(Trans, { children: "Reconcile" }) })] }) }));
}
