"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategory = ExpenseCategory;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RenderMonths_1 = require("./RenderMonths");
var SidebarCategory_1 = require("./SidebarCategory");
var sort_1 = require("@desktop-client/components/sort");
var table_1 = require("@desktop-client/components/table");
var useDragRef_1 = require("@desktop-client/hooks/useDragRef");
function ExpenseCategory(_a) {
    var cat = _a.cat, categoryGroup = _a.categoryGroup, editingCell = _a.editingCell, dragState = _a.dragState, MonthComponent = _a.MonthComponent, onEditName = _a.onEditName, onEditMonth = _a.onEditMonth, onSave = _a.onSave, onDelete = _a.onDelete, onBudgetAction = _a.onBudgetAction, onShowActivity = _a.onShowActivity, onDragChange = _a.onDragChange, onReorder = _a.onReorder;
    var dragging = dragState && dragState.item === cat;
    if (dragState && dragState.item.id === cat.group) {
        dragging = true;
    }
    var dragRef = (0, sort_1.useDraggable)({
        type: 'category',
        onDragChange: onDragChange,
        item: cat,
        canDrag: editingCell === null,
    }).dragRef;
    var handleDragRef = (0, useDragRef_1.useDragRef)(dragRef);
    var _b = (0, sort_1.useDroppable)({
        types: 'category',
        id: cat.id,
        onDrop: onReorder,
    }), dropRef = _b.dropRef, dropPos = _b.dropPos;
    return (<table_1.Row innerRef={dropRef} collapsed={true} style={{
            backgroundColor: theme_1.theme.tableBackground,
            opacity: cat.hidden || (categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden) ? 0.5 : undefined,
        }}>
      <sort_1.DropHighlight pos={dropPos} offset={{ top: 1 }}/>

      <view_1.View style={{ flex: 1, flexDirection: 'row' }}>
        <SidebarCategory_1.SidebarCategory innerRef={handleDragRef} category={cat} categoryGroup={categoryGroup} dragPreview={dragging && dragState.preview} dragging={dragging && !dragState.preview} editing={editingCell &&
            editingCell.cell === 'name' &&
            editingCell.id === cat.id} onEditName={onEditName} onSave={onSave} onDelete={onDelete}/>

        <RenderMonths_1.RenderMonths component={MonthComponent} editingMonth={editingCell && editingCell.id === cat.id && editingCell.cell} args={{
            category: cat,
            onEdit: onEditMonth,
            onBudgetAction: onBudgetAction,
            onShowActivity: onShowActivity,
        }}/>
      </view_1.View>
    </table_1.Row>);
}
