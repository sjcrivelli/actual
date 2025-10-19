import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgArrowButtonRight1 } from '@actual-app/components/icons/v2';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useHover } from 'usehooks-ts';
import { q } from 'loot-core/shared/query';
import { getScheduledAmount } from 'loot-core/shared/schedules';
import { isPreviewId } from 'loot-core/shared/transactions';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { useCachedSchedules } from '@desktop-client/hooks/useCachedSchedules';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSelectedItems } from '@desktop-client/hooks/useSelected';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
function DetailedBalance({ name, balance, isExactBalance = true, }) {
    const format = useFormat();
    return (_jsxs(Text, { style: {
            borderRadius: 4,
            padding: '4px 6px',
            color: theme.pillText,
            backgroundColor: theme.pillBackground,
        }, children: [name, ' ', _jsx(PrivacyFilter, { children: _jsxs(Text, { style: { fontWeight: 600 }, children: [!isExactBalance && '~ ', format(balance, 'financial')] }) })] }));
}
function SelectedBalance({ selectedItems, account }) {
    const { t } = useTranslation();
    const name = `selected-balance-${[...selectedItems].join('-')}`;
    const rows = useSheetValue({
        name: name,
        query: q('transactions')
            .filter({
            id: { $oneof: [...selectedItems] },
            parent_id: { $oneof: [...selectedItems] },
        })
            .select('id'),
    });
    const ids = new Set((rows || []).map((r) => r.id));
    const finalIds = [...selectedItems].filter(id => !ids.has(id));
    let balance = useSheetValue({
        name: (name + '-sum'),
        query: q('transactions')
            .filter({ id: { $oneof: finalIds } })
            .options({ splits: 'all' })
            .calculate({ $sum: '$amount' }),
    });
    let scheduleBalance = 0;
    const { isLoading, schedules = [] } = useCachedSchedules();
    if (isLoading) {
        return null;
    }
    const previewIds = [...selectedItems]
        .filter(id => isPreviewId(id))
        .map(id => id.slice(8));
    let isExactBalance = true;
    for (const s of schedules) {
        if (previewIds.includes(s.id)) {
            // If a schedule is `between X and Y` then we calculate the average
            if (s._amountOp === 'isbetween') {
                isExactBalance = false;
            }
            if (!account || account.id === s._account) {
                scheduleBalance += getScheduledAmount(s._amount);
            }
            else {
                scheduleBalance -= getScheduledAmount(s._amount);
            }
        }
    }
    if (!balance && !scheduleBalance) {
        return null;
    }
    else {
        balance = (balance ?? 0) + scheduleBalance;
    }
    return (_jsx(DetailedBalance, { name: t('Selected balance:'), balance: balance, isExactBalance: isExactBalance }));
}
function FilteredBalance({ filteredAmount }) {
    const { t } = useTranslation();
    return (_jsx(DetailedBalance, { name: t('Filtered balance:'), balance: filteredAmount ?? 0, isExactBalance: true }));
}
function MoreBalances({ balanceQuery }) {
    const { t } = useTranslation();
    const cleared = useSheetValue({
        name: (balanceQuery.name + '-cleared'),
        query: balanceQuery.query.filter({ cleared: true }),
    });
    const uncleared = useSheetValue({
        name: (balanceQuery.name +
            '-uncleared'),
        query: balanceQuery.query.filter({ cleared: false }),
    });
    return (_jsxs(_Fragment, { children: [_jsx(DetailedBalance, { name: t('Cleared total:'), balance: cleared ?? 0 }), _jsx(DetailedBalance, { name: t('Uncleared total:'), balance: uncleared ?? 0 })] }));
}
export function Balances({ balanceQuery, showExtraBalances, onToggleExtraBalances, account, isFiltered, filteredAmount, }) {
    const selectedItems = useSelectedItems();
    const buttonRef = useRef(null);
    const isButtonHovered = useHover(buttonRef);
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: -5,
            marginLeft: -5,
            gap: 10,
        }, children: [_jsxs(Button, { ref: buttonRef, "data-testid": "account-balance", variant: "bare", onPress: onToggleExtraBalances, style: {
                    paddingTop: 1,
                    paddingBottom: 1,
                }, children: [_jsx(CellValue, { binding: { ...balanceQuery, value: 0 }, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: {
                                fontSize: 22,
                                fontWeight: 400,
                                color: props.value < 0
                                    ? theme.errorText
                                    : props.value > 0
                                        ? theme.noticeTextLight
                                        : theme.pageTextSubdued,
                            } })) }), _jsx(SvgArrowButtonRight1, { style: {
                            width: 10,
                            height: 10,
                            marginLeft: 10,
                            color: theme.pillText,
                            transform: showExtraBalances ? 'rotateZ(180deg)' : 'rotateZ(0)',
                            opacity: isButtonHovered || selectedItems.size > 0 || showExtraBalances
                                ? 1
                                : 0,
                        } })] }), showExtraBalances && _jsx(MoreBalances, { balanceQuery: balanceQuery }), selectedItems.size > 0 && (_jsx(SelectedBalance, { selectedItems: selectedItems, account: account })), isFiltered && _jsx(FilteredBalance, { filteredAmount: filteredAmount })] }));
}
