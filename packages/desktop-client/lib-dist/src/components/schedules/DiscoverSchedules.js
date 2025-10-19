import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Stack } from '@actual-app/components/stack';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { q } from 'loot-core/shared/query';
import { getRecurringDescription } from 'loot-core/shared/schedules';
import { ScheduleAmountCell } from './SchedulesTable';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Table, TableHeader, Row, Field, SelectCell, } from '@desktop-client/components/table';
import { DisplayId } from '@desktop-client/components/util/DisplayId';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useSelected, useSelectedDispatch, useSelectedItems, SelectedProvider, } from '@desktop-client/hooks/useSelected';
import { useSendPlatformRequest } from '@desktop-client/hooks/useSendPlatformRequest';
import { aqlQuery } from '@desktop-client/queries/aqlQuery';
const ROW_HEIGHT = 43;
function DiscoverSchedulesTable({ schedules, loading, }) {
    const { t } = useTranslation();
    const selectedItems = useSelectedItems();
    const dispatchSelected = useSelectedDispatch();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const locale = useLocale();
    function renderItem({ item }) {
        const selected = selectedItems.has(item.id);
        const amountOp = item._conditions.find(c => c.field === 'amount').op;
        const recurDescription = getRecurringDescription(item.date, dateFormat, locale);
        return (_jsxs(Row, { height: ROW_HEIGHT, inset: 15, onClick: e => {
                dispatchSelected({
                    type: 'select',
                    id: item.id,
                    isRangeSelect: e.shiftKey,
                });
            }, style: {
                borderColor: selected ? theme.tableBorderSelected : theme.tableBorder,
                cursor: 'pointer',
                color: selected
                    ? theme.tableRowBackgroundHighlightText
                    : theme.tableText,
                backgroundColor: selected
                    ? theme.tableRowBackgroundHighlight
                    : theme.tableBackground,
                ':hover': {
                    backgroundColor: theme.tableRowBackgroundHover,
                    color: theme.tableText,
                },
            }, children: [_jsx(SelectCell, { exposed: true, focused: false, selected: selected, onSelect: e => {
                        dispatchSelected({
                            type: 'select',
                            id: item.id,
                            isRangeSelect: e.shiftKey,
                        });
                    } }), _jsx(Field, { width: "flex", children: _jsx(DisplayId, { type: "payees", id: item.payee }) }), _jsx(Field, { width: "flex", children: _jsx(DisplayId, { type: "accounts", id: item.account }) }), _jsx(Field, { width: "auto", title: recurDescription, style: { flex: 1.5 }, children: recurDescription }), _jsx(ScheduleAmountCell, { amount: item.amount, op: amountOp })] }));
    }
    return (_jsxs(View, { style: { flex: 1 }, children: [_jsxs(TableHeader, { height: ROW_HEIGHT, inset: 15, children: [_jsx(SelectCell, { exposed: !loading, focused: false, selected: selectedItems.size > 0, onSelect: e => dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey }) }), _jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Payee" }) }), _jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Account" }) }), _jsx(Field, { width: "auto", style: { flex: 1.5 }, children: _jsx(Trans, { children: "When" }) }), _jsx(Field, { width: 100, style: { textAlign: 'right' }, children: _jsx(Trans, { children: "Amount" }) })] }), _jsx(Table, { rowHeight: ROW_HEIGHT, style: {
                    flex: 1,
                    backgroundColor: 'transparent',
                }, items: schedules, loading: loading, isSelected: id => selectedItems.has(String(id)), renderItem: renderItem, renderEmpty: t('No schedules found') })] }));
}
export function DiscoverSchedules() {
    const { t } = useTranslation();
    const { data, isLoading } = useSendPlatformRequest('schedule/discover');
    const schedules = data || [];
    const [creating, setCreating] = useState(false);
    const selectedInst = useSelected('discover-schedules', schedules, []);
    async function onCreate() {
        const selected = schedules.filter(s => selectedInst.items.has(s.id));
        setCreating(true);
        for (const schedule of selected) {
            const scheduleId = await send('schedule/create', {
                conditions: schedule._conditions,
                schedule: {},
            });
            // Now query for matching transactions and link them automatically
            const { filters } = await send('make-filters-from-conditions', {
                conditions: schedule._conditions,
            });
            if (filters.length > 0) {
                const { data: transactions } = await aqlQuery(q('transactions').filter({ $and: filters }).select('id'));
                await send('transactions-batch-update', {
                    updated: transactions.map(t => ({
                        id: t.id,
                        schedule: scheduleId,
                    })),
                });
            }
        }
        setCreating(false);
    }
    return (_jsx(Modal, { name: "schedules-discover", containerProps: { style: { width: 850, height: 650 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Found Schedules'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "We found some possible schedules in your current transactions. Select the ones you want to create." }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "If you expected a schedule here and don\u2019t see it, it might be because the payees of the transactions don\u2019t match. Make sure you rename payees on all transactions for a schedule to be the same payee." }) }), _jsx(SelectedProvider, { instance: selectedInst, children: _jsx(DiscoverSchedulesTable, { loading: isLoading, schedules: schedules }) }), _jsx(Stack, { direction: "row", align: "center", justify: "flex-end", style: {
                        paddingTop: 20,
                        paddingBottom: 0,
                    }, children: _jsx(ButtonWithLoading, { variant: "primary", isLoading: creating, isDisabled: selectedInst.items.size === 0, onPress: () => {
                            onCreate();
                            close();
                        }, children: _jsx(Trans, { children: "Create schedules" }) }) })] })) }));
}
