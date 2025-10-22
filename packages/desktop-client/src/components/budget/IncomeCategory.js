"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeCategory = IncomeCategory;
// @ts-strict-ignore
var react_1 = require("react");
var RenderMonths_1 = require("./RenderMonths");
var SidebarCategory_1 = require("./SidebarCategory");
var sort_1 = require("@desktop-client/components/sort");
var table_1 = require("@desktop-client/components/table");
var useDragRef_1 = require("@desktop-client/hooks/useDragRef");
function IncomeCategory(_a) {
    var cat = _a.cat, isLast = _a.isLast, editingCell = _a.editingCell, MonthComponent = _a.MonthComponent, onEditName = _a.onEditName, onEditMonth = _a.onEditMonth, onSave = _a.onSave, onDelete = _a.onDelete, onDragChange = _a.onDragChange, onBudgetAction = _a.onBudgetAction, onReorder = _a.onReorder, onShowActivity = _a.onShowActivity;
    var dragRef = (0, sort_1.useDraggable)({
        type: 'income-category',
        onDragChange: onDragChange,
        item: cat,
        canDrag: editingCell === null,
    }).dragRef;
    var handleDragRef = (0, useDragRef_1.useDragRef)(dragRef);
    var _b = (0, sort_1.useDroppable)({
        types: 'income-category',
        id: cat.id,
        onDrop: onReorder,
    }), dropRef = _b.dropRef, dropPos = _b.dropPos;
    return (<table_1.Row innerRef={dropRef} collapsed={true} style={{
            opacity: cat.hidden ? 0.5 : undefined,
        }}>
      <sort_1.DropHighlight pos={dropPos} offset={{ top: 1 }}/>

      <SidebarCategory_1.SidebarCategory innerRef={handleDragRef} category={cat} isLast={isLast} editing={editingCell &&
            editingCell.cell === 'name' &&
            editingCell.id === cat.id} onEditName={onEditName} onSave={onSave} onDelete={onDelete}/>
      <RenderMonths_1.RenderMonths component={MonthComponent} editingMonth={editingCell && editingCell.id === cat.id && editingCell.cell} args={{
            category: cat,
            onEdit: onEditMonth,
            isLast: isLast,
            onShowActivity: onShowActivity,
            onBudgetAction: onBudgetAction,
        }}/>
    </table_1.Row>);
}
