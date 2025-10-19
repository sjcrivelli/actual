import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo } from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { PossibleRoles } from 'loot-core/shared/user';
import { Checkbox } from '@desktop-client/components/forms';
import { SelectCell, Row, Cell } from '@desktop-client/components/table';
import { useSelectedDispatch } from '@desktop-client/hooks/useSelected';
export const UserDirectoryRow = memo(({ user, hovered, selected, onHover, onEditUser }) => {
    const dispatchSelected = useSelectedDispatch();
    const borderColor = selected ? theme.tableBorderSelected : 'none';
    const backgroundFocus = hovered;
    return (_jsxs(Row, { height: "auto", style: {
            fontSize: 13,
            zIndex: selected ? 101 : 'auto',
            borderColor,
            backgroundColor: selected
                ? theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme.tableRowBackgroundHover
                    : theme.tableBackground,
        }, collapsed: true, onMouseEnter: () => onHover && onHover(user.id), onMouseLeave: () => onHover && onHover(null), children: [!user.owner && (_jsx(SelectCell, { exposed: hovered || selected, focused: true, onSelect: e => {
                    dispatchSelected({
                        type: 'select',
                        id: user.id,
                        isRangeSelect: e.shiftKey,
                    });
                }, selected: selected })), user.owner && (_jsx(Cell, { width: 20, style: { alignItems: 'center', userSelect: 'none' } })), _jsx(Cell, { name: "userName", width: "flex", plain: true, style: { color: theme.tableText }, children: _jsx(View, { style: {
                        alignSelf: 'flex-start',
                        padding: '3px 5px',
                    }, children: _jsx("span", { children: user.userName }) }) }), _jsx(Cell, { name: "displayName", width: 250, plain: true, style: { color: theme.tableText }, children: _jsx(View, { style: {
                        alignSelf: 'flex-start',
                        padding: '3px 5px',
                    }, children: _jsx("span", { children: user.displayName }) }) }), _jsx(Cell, { name: "role", width: 100, plain: true, style: { padding: '0 15px', paddingLeft: 5 }, children: _jsx(View, { children: PossibleRoles[user.role] }) }), _jsx(Cell, { name: "enabled", width: 100, plain: true, style: { padding: '0 15px', paddingLeft: 5 }, children: _jsx(Checkbox, { checked: user.enabled, disabled: true }) }), _jsx(Cell, { name: "owner", width: 100, plain: true, style: { padding: '0 15px', paddingLeft: 5 }, children: _jsx(Checkbox, { checked: user.owner, disabled: true }) }), _jsx(Cell, { name: "edit", width: 80, plain: true, style: { padding: 0, paddingLeft: 5 }, children: _jsx(Button, { style: { margin: 4, fontSize: 14, color: theme.pageTextLink }, variant: "bare", onPress: () => onEditUser?.(user), children: _jsx(Trans, { children: "Edit" }) }) })] }));
});
UserDirectoryRow.displayName = 'UserRow';
