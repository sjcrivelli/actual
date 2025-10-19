import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RenderMonths } from './RenderMonths';
import { SidebarCategory } from './SidebarCategory';
import { useDraggable, useDroppable, DropHighlight, } from '@desktop-client/components/sort';
import { Row } from '@desktop-client/components/table';
import { useDragRef } from '@desktop-client/hooks/useDragRef';
export function IncomeCategory({ cat, isLast, editingCell, MonthComponent, onEditName, onEditMonth, onSave, onDelete, onDragChange, onBudgetAction, onReorder, onShowActivity, }) {
    const { dragRef } = useDraggable({
        type: 'income-category',
        onDragChange,
        item: cat,
        canDrag: editingCell === null,
    });
    const handleDragRef = useDragRef(dragRef);
    const { dropRef, dropPos } = useDroppable({
        types: 'income-category',
        id: cat.id,
        onDrop: onReorder,
    });
    return (_jsxs(Row, { innerRef: dropRef, collapsed: true, style: {
            opacity: cat.hidden ? 0.5 : undefined,
        }, children: [_jsx(DropHighlight, { pos: dropPos, offset: { top: 1 } }), _jsx(SidebarCategory, { innerRef: handleDragRef, category: cat, isLast: isLast, editing: editingCell &&
                    editingCell.cell === 'name' &&
                    editingCell.id === cat.id, onEditName: onEditName, onSave: onSave, onDelete: onDelete }), _jsx(RenderMonths, { component: MonthComponent, editingMonth: editingCell && editingCell.id === cat.id && editingCell.cell, args: {
                    category: cat,
                    onEdit: onEditMonth,
                    isLast,
                    onShowActivity,
                    onBudgetAction,
                } })] }));
}
