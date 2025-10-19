import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useRef, useState, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { SvgCheck } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { format as monthUtilFormat } from 'loot-core/shared/months';
import { getNormalisedString } from 'loot-core/shared/normalisation';
import { getScheduledAmount } from 'loot-core/shared/schedules';
import { StatusBadge } from './StatusBadge';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Table, TableHeader, Row, Field, Cell, } from '@desktop-client/components/table';
import { DisplayId } from '@desktop-client/components/util/DisplayId';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { usePayees } from '@desktop-client/hooks/usePayees';
export const ROW_HEIGHT = 43;
function OverflowMenu({ schedule, status, onAction, }) {
    const { t } = useTranslation();
    const getMenuItems = () => {
        const menuItems = [];
        menuItems.push({
            name: 'post-transaction',
            text: t('Post transaction'),
        }, {
            name: 'post-transaction-today',
            text: t('Post transaction today'),
        });
        if (status === 'completed') {
            menuItems.push({
                name: 'restart',
                text: t('Restart'),
            });
        }
        else {
            menuItems.push({
                name: 'skip',
                text: t('Skip next scheduled date'),
            }, {
                name: 'complete',
                text: t('Complete'),
            });
        }
        menuItems.push({ name: 'delete', text: t('Delete') });
        return menuItems;
    };
    return (_jsx(Menu, { onMenuSelect: name => {
            onAction(name, schedule.id);
        }, items: getMenuItems() }));
}
export function ScheduleAmountCell({ amount, op, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const num = getScheduledAmount(amount);
    const currencyAmount = format(Math.abs(num || 0), 'financial');
    const isApprox = op === 'isapprox' || op === 'isbetween';
    return (_jsxs(Cell, { width: 100, plain: true, style: {
            textAlign: 'right',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 5px',
        }, name: "amount", children: [isApprox && (_jsx(View, { style: {
                    textAlign: 'left',
                    color: theme.pageTextSubdued,
                    lineHeight: '1em',
                    marginRight: 10,
                }, title: isApprox
                    ? t('Approximately {{currencyAmount}}', { currencyAmount })
                    : currencyAmount, children: "~" })), _jsx(Text, { style: {
                    flex: 1,
                    color: num > 0 ? theme.noticeTextLight : theme.tableText,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }, title: isApprox
                    ? t('Approximately {{currencyAmount}}', { currencyAmount })
                    : currencyAmount, children: _jsx(PrivacyFilter, { children: num > 0 ? `+${currencyAmount}` : `${currencyAmount}` }) })] }));
}
function ScheduleRow({ schedule, onAction, onSelect, minimal, statuses, dateFormat, }) {
    const { t } = useTranslation();
    const rowRef = useRef(null);
    const buttonRef = useRef(null);
    const { setMenuOpen, menuOpen, handleContextMenu, resetPosition, position, asContextMenu, } = useContextMenu();
    return (_jsxs(Row, { ref: rowRef, height: ROW_HEIGHT, inset: 15, onClick: () => onSelect(schedule.id), style: {
            cursor: 'pointer',
            backgroundColor: theme.tableBackground,
            color: theme.tableText,
            ':hover': { backgroundColor: theme.tableRowBackgroundHover },
        }, onContextMenu: handleContextMenu, children: [!minimal && (_jsx(Popover, { triggerRef: asContextMenu ? rowRef : buttonRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), isNonModal: true, placement: "bottom start", ...position, style: { margin: 1 }, children: _jsx(OverflowMenu, { schedule: schedule, status: statuses.get(schedule.id), onAction: (action, id) => {
                        onAction(action, id);
                        resetPosition();
                        setMenuOpen(false);
                    } }) })), _jsx(Field, { width: "flex", name: "name", children: _jsx(Text, { style: schedule.name == null
                        ? { color: theme.buttonNormalDisabledText }
                        : null, title: schedule.name ? schedule.name : '', children: schedule.name ? schedule.name : t('None') }) }), _jsx(Field, { width: "flex", name: "payee", children: _jsx(DisplayId, { type: "payees", id: schedule._payee }) }), _jsx(Field, { width: "flex", name: "account", children: _jsx(DisplayId, { type: "accounts", id: schedule._account }) }), _jsx(Field, { width: 110, name: "date", children: schedule.next_date
                    ? monthUtilFormat(schedule.next_date, dateFormat)
                    : null }), _jsx(Field, { width: 120, name: "status", style: { alignItems: 'flex-start' }, children: _jsx(StatusBadge, { status: statuses.get(schedule.id) }) }), _jsx(ScheduleAmountCell, { amount: schedule._amount, op: schedule._amountOp }), !minimal && (_jsx(Field, { width: 80, style: { textAlign: 'center' }, children: schedule._date && schedule._date.frequency && (_jsx(SvgCheck, { style: { width: 13, height: 13 } })) })), !minimal && (_jsx(Field, { width: 40, name: "actions", children: _jsx(View, { children: _jsx(Button, { ref: buttonRef, variant: "bare", "aria-label": t('Menu'), onPress: () => {
                            resetPosition();
                            setMenuOpen(true);
                        }, children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }) }) }))] }));
}
export function SchedulesTable({ isLoading, schedules, statuses, filter, minimal, allowCompleted, style, onSelect, onAction, tableStyle, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const [showCompleted, setShowCompleted] = useState(false);
    const payees = usePayees();
    const accounts = useAccounts();
    const filteredSchedules = useMemo(() => {
        if (!filter) {
            return schedules;
        }
        const filterIncludes = (str) => str
            ? getNormalisedString(str).includes(getNormalisedString(filter)) ||
                getNormalisedString(filter).includes(getNormalisedString(str))
            : false;
        return schedules.filter(schedule => {
            const payee = payees.find(p => schedule._payee === p.id);
            const account = accounts.find(a => schedule._account === a.id);
            const amount = getScheduledAmount(schedule._amount);
            const amountStr = (schedule._amountOp === 'isapprox' || schedule._amountOp === 'isbetween'
                ? '~'
                : '') +
                (amount > 0 ? '+' : '') +
                format(Math.abs(amount || 0), 'financial');
            const dateStr = schedule.next_date
                ? monthUtilFormat(schedule.next_date, dateFormat)
                : null;
            return (filterIncludes(schedule.name) ||
                filterIncludes(payee && payee.name) ||
                filterIncludes(account && account.name) ||
                filterIncludes(amountStr) ||
                filterIncludes(statuses.get(schedule.id)) ||
                filterIncludes(dateStr));
        });
    }, [payees, accounts, schedules, filter, statuses]);
    const items = useMemo(() => {
        const unCompletedSchedules = filteredSchedules.filter(s => !s.completed);
        if (!allowCompleted) {
            return unCompletedSchedules;
        }
        if (showCompleted) {
            return filteredSchedules;
        }
        const hasCompletedSchedule = filteredSchedules.find(s => s.completed);
        if (!hasCompletedSchedule)
            return unCompletedSchedules;
        return [...unCompletedSchedules, { id: 'show-completed' }];
    }, [filteredSchedules, showCompleted, allowCompleted]);
    function renderItem({ item }) {
        if (item.id === 'show-completed') {
            return (_jsx(Row, { height: ROW_HEIGHT, inset: 15, style: {
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    ':hover': { backgroundColor: theme.tableRowBackgroundHover },
                }, onClick: () => setShowCompleted(true), children: _jsx(Field, { width: "flex", style: {
                        fontStyle: 'italic',
                        textAlign: 'center',
                        color: theme.tableText,
                    }, children: _jsx(Trans, { children: "Show completed schedules" }) }) }));
        }
        return (_jsx(ScheduleRow, { schedule: item, statuses, dateFormat, onSelect, onAction, minimal }));
    }
    return (_jsxs(View, { style: { flex: 1, ...tableStyle }, children: [_jsxs(TableHeader, { height: ROW_HEIGHT, inset: 15, children: [_jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Name" }) }), _jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Payee" }) }), _jsx(Field, { width: "flex", children: _jsx(Trans, { children: "Account" }) }), _jsx(Field, { width: 110, children: _jsx(Trans, { children: "Next date" }) }), _jsx(Field, { width: 120, children: _jsx(Trans, { children: "Status" }) }), _jsx(Field, { width: 100, style: { textAlign: 'right' }, children: _jsx(Trans, { children: "Amount" }) }), !minimal && (_jsx(Field, { width: 80, style: { textAlign: 'center' }, children: _jsx(Trans, { children: "Recurring" }) })), !minimal && _jsx(Field, { width: 40 })] }), _jsx(Table, { loading: isLoading, rowHeight: ROW_HEIGHT, backgroundColor: "transparent", style: { flex: 1, backgroundColor: 'transparent', ...style }, items: items, renderItem: renderItem, renderEmpty: filter ? t('No matching schedules') : t('No schedules') })] }));
}
