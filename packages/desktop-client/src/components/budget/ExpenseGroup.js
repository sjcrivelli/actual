"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseGroup = ExpenseGroup;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RenderMonths_1 = require("./RenderMonths");
var SidebarGroup_1 = require("./SidebarGroup");
var sort_1 = require("@desktop-client/components/sort");
var table_1 = require("@desktop-client/components/table");
var useDragRef_1 = require("@desktop-client/hooks/useDragRef");
function ExpenseGroup(_a) {
    var group = _a.group, collapsed = _a.collapsed, editingCell = _a.editingCell, dragState = _a.dragState, MonthComponent = _a.MonthComponent, onEditName = _a.onEditName, onSave = _a.onSave, onDelete = _a.onDelete, onApplyBudgetTemplatesInGroup = _a.onApplyBudgetTemplatesInGroup, onDragChange = _a.onDragChange, onReorderGroup = _a.onReorderGroup, onReorderCategory = _a.onReorderCategory, onToggleCollapse = _a.onToggleCollapse, onShowNewCategory = _a.onShowNewCategory;
    var dragging = dragState && dragState.item === group;
    var dragRef = (0, sort_1.useDraggable)({
        type: 'group',
        onDragChange: onDragChange,
        item: group,
        canDrag: editingCell === null,
    }).dragRef;
    var handleDragRef = (0, useDragRef_1.useDragRef)(dragRef);
    var _b = (0, sort_1.useDroppable)({
        types: 'group',
        id: group.id,
        onDrop: onReorderGroup,
    }), dropRef = _b.dropRef, dropPos = _b.dropPos;
    var _c = (0, sort_1.useDroppable)({
        types: 'category',
        id: group.id,
        onDrop: onReorderCategory,
        onLongHover: function () {
            if (collapsed) {
                onToggleCollapse(group.id);
            }
        },
    }), catDropRef = _c.dropRef, catDropPos = _c.dropPos;
    return (<table_1.Row collapsed={true} style={{
            fontWeight: 600,
            opacity: group.hidden ? 0.33 : undefined,
            backgroundColor: theme_1.theme.tableRowHeaderBackground,
        }}>
      {dragState && !dragState.preview && dragState.type === 'group' && (<view_1.View innerRef={dropRef} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: collapsed
                    ? table_1.ROW_HEIGHT - 1
                    : (1 + group.categories.length) * (table_1.ROW_HEIGHT - 1) + 1,
                zIndex: 10000,
            }}>
          <sort_1.DropHighlight pos={dropPos} offset={{ top: 1 }}/>
        </view_1.View>)}

      <sort_1.DropHighlight pos={catDropPos} offset={{ top: 1 }}/>

      <view_1.View innerRef={catDropRef} style={{
            flex: 1,
            flexDirection: 'row',
            opacity: dragging && !dragState.preview ? 0.3 : 1,
        }}>
        <SidebarGroup_1.SidebarGroup innerRef={handleDragRef} group={group} editing={editingCell &&
            editingCell.cell === 'name' &&
            editingCell.id === group.id} dragPreview={dragging && dragState.preview} collapsed={collapsed} onToggleCollapse={onToggleCollapse} onEdit={onEditName} onSave={onSave} onDelete={onDelete} onApplyBudgetTemplatesInGroup={onApplyBudgetTemplatesInGroup} onShowNewCategory={onShowNewCategory}/>
        <RenderMonths_1.RenderMonths component={MonthComponent} args={{ group: group }}/>
      </view_1.View>
    </table_1.Row>);
}
