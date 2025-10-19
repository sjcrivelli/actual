import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { forwardRef, useCallback, useLayoutEffect, useState, } from 'react';
import { View } from '@actual-app/components/view';
import { PayeeTableRow } from './PayeeTableRow';
import { useTableNavigator, Table } from '@desktop-client/components/table';
import { useSelectedItems } from '@desktop-client/hooks/useSelected';
export const PayeeTable = forwardRef(({ payees, ruleCounts, onUpdate, onDelete, onViewRules, onCreateRule }, ref) => {
    const [hovered, setHovered] = useState(null);
    const selectedItems = useSelectedItems();
    useLayoutEffect(() => {
        const firstSelected = [...selectedItems][0];
        if (typeof ref !== 'function') {
            ref.current.scrollTo(firstSelected, 'center');
        }
    }, []);
    const onHover = useCallback(id => {
        setHovered(id);
    }, []);
    const tableNavigator = useTableNavigator(payees, item => item.transfer_acct == null
        ? ['select', 'name', 'rule-count']
        : ['rule-count']);
    return (_jsx(View, { style: { flex: 1 }, onMouseLeave: () => setHovered(null), children: _jsx(Table, { navigator: tableNavigator, ref: ref, items: payees, renderItem: ({ item, editing, focusedField, onEdit }) => {
                return (_jsx(PayeeTableRow, { payee: item, ruleCount: ruleCounts.get(item.id) || 0, selected: selectedItems.has(item.id), editing: editing, focusedField: focusedField, hovered: hovered === item.id, onHover: onHover, onEdit: onEdit, onUpdate: onUpdate, onDelete: onDelete, onViewRules: onViewRules, onCreateRule: onCreateRule }));
            } }) }));
});
PayeeTable.displayName = 'PayeeTable';
