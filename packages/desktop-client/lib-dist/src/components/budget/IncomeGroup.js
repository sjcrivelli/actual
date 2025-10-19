import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { RenderMonths } from './RenderMonths';
import { SidebarGroup } from './SidebarGroup';
import { Row } from '@desktop-client/components/table';
export function IncomeGroup({ group, editingCell, collapsed, MonthComponent, onEditName, onSave, onToggleCollapse, onShowNewCategory, }) {
    return (_jsxs(Row, { collapsed: true, style: {
            fontWeight: 600,
            backgroundColor: theme.tableRowHeaderBackground,
        }, children: [_jsx(SidebarGroup, { group: group, collapsed: collapsed, editing: editingCell &&
                    editingCell.cell === 'name' &&
                    editingCell.id === group.id, onEdit: onEditName, onSave: onSave, onToggleCollapse: onToggleCollapse, onShowNewCategory: onShowNewCategory }), _jsx(RenderMonths, { component: MonthComponent, args: { group } })] }));
}
