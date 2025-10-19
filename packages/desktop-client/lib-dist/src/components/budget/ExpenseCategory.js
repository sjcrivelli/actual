import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { RenderMonths } from './RenderMonths';
import { SidebarCategory } from './SidebarCategory';
import { useDraggable, useDroppable, DropHighlight, } from '@desktop-client/components/sort';
import { Row } from '@desktop-client/components/table';
import { useDragRef } from '@desktop-client/hooks/useDragRef';
export function ExpenseCategory({ cat, categoryGroup, editingCell, dragState, MonthComponent, onEditName, onEditMonth, onSave, onDelete, onBudgetAction, onShowActivity, onDragChange, onReorder, }) {
    let dragging = dragState && dragState.item === cat;
    if (dragState && dragState.item.id === cat.group) {
        dragging = true;
    }
    const { dragRef } = useDraggable({
        type: 'category',
        onDragChange,
        item: cat,
        canDrag: editingCell === null,
    });
    const handleDragRef = useDragRef(dragRef);
    const { dropRef, dropPos } = useDroppable({
        types: 'category',
        id: cat.id,
        onDrop: onReorder,
    });
    return (_jsxs(Row, { innerRef: dropRef, collapsed: true, style: {
            backgroundColor: theme.tableBackground,
            opacity: cat.hidden || categoryGroup?.hidden ? 0.5 : undefined,
        }, children: [_jsx(DropHighlight, { pos: dropPos, offset: { top: 1 } }), _jsxs(View, { style: { flex: 1, flexDirection: 'row' }, children: [_jsx(SidebarCategory, { innerRef: handleDragRef, category: cat, categoryGroup: categoryGroup, dragPreview: dragging && dragState.preview, dragging: dragging && !dragState.preview, editing: editingCell &&
                            editingCell.cell === 'name' &&
                            editingCell.id === cat.id, onEditName: onEditName, onSave: onSave, onDelete: onDelete }), _jsx(RenderMonths, { component: MonthComponent, editingMonth: editingCell && editingCell.id === cat.id && editingCell.cell, args: {
                            category: cat,
                            onEdit: onEditMonth,
                            onBudgetAction,
                            onShowActivity,
                        } })] })] }));
}
