import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { RenderMonths } from './RenderMonths';
import { SidebarGroup } from './SidebarGroup';
import { useDraggable, useDroppable, DropHighlight, } from '@desktop-client/components/sort';
import { Row, ROW_HEIGHT } from '@desktop-client/components/table';
import { useDragRef } from '@desktop-client/hooks/useDragRef';
export function ExpenseGroup({ group, collapsed, editingCell, dragState, MonthComponent, onEditName, onSave, onDelete, onApplyBudgetTemplatesInGroup, onDragChange, onReorderGroup, onReorderCategory, onToggleCollapse, onShowNewCategory, }) {
    const dragging = dragState && dragState.item === group;
    const { dragRef } = useDraggable({
        type: 'group',
        onDragChange,
        item: group,
        canDrag: editingCell === null,
    });
    const handleDragRef = useDragRef(dragRef);
    const { dropRef, dropPos } = useDroppable({
        types: 'group',
        id: group.id,
        onDrop: onReorderGroup,
    });
    const { dropRef: catDropRef, dropPos: catDropPos } = useDroppable({
        types: 'category',
        id: group.id,
        onDrop: onReorderCategory,
        onLongHover: () => {
            if (collapsed) {
                onToggleCollapse(group.id);
            }
        },
    });
    return (_jsxs(Row, { collapsed: true, style: {
            fontWeight: 600,
            opacity: group.hidden ? 0.33 : undefined,
            backgroundColor: theme.tableRowHeaderBackground,
        }, children: [dragState && !dragState.preview && dragState.type === 'group' && (_jsx(View, { innerRef: dropRef, style: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: collapsed
                        ? ROW_HEIGHT - 1
                        : (1 + group.categories.length) * (ROW_HEIGHT - 1) + 1,
                    zIndex: 10000,
                }, children: _jsx(DropHighlight, { pos: dropPos, offset: { top: 1 } }) })), _jsx(DropHighlight, { pos: catDropPos, offset: { top: 1 } }), _jsxs(View, { innerRef: catDropRef, style: {
                    flex: 1,
                    flexDirection: 'row',
                    opacity: dragging && !dragState.preview ? 0.3 : 1,
                }, children: [_jsx(SidebarGroup, { innerRef: handleDragRef, group: group, editing: editingCell &&
                            editingCell.cell === 'name' &&
                            editingCell.id === group.id, dragPreview: dragging && dragState.preview, collapsed: collapsed, onToggleCollapse: onToggleCollapse, onEdit: onEditName, onSave: onSave, onDelete: onDelete, onApplyBudgetTemplatesInGroup: onApplyBudgetTemplatesInGroup, onShowNewCategory: onShowNewCategory }), _jsx(RenderMonths, { component: MonthComponent, args: { group } })] })] }));
}
