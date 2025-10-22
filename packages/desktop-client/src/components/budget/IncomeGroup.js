"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeGroup = IncomeGroup;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var RenderMonths_1 = require("./RenderMonths");
var SidebarGroup_1 = require("./SidebarGroup");
var table_1 = require("@desktop-client/components/table");
function IncomeGroup(_a) {
    var group = _a.group, editingCell = _a.editingCell, collapsed = _a.collapsed, MonthComponent = _a.MonthComponent, onEditName = _a.onEditName, onSave = _a.onSave, onToggleCollapse = _a.onToggleCollapse, onShowNewCategory = _a.onShowNewCategory;
    return (<table_1.Row collapsed={true} style={{
            fontWeight: 600,
            backgroundColor: theme_1.theme.tableRowHeaderBackground,
        }}>
      <SidebarGroup_1.SidebarGroup group={group} collapsed={collapsed} editing={editingCell &&
            editingCell.cell === 'name' &&
            editingCell.id === group.id} onEdit={onEditName} onSave={onSave} onToggleCollapse={onToggleCollapse} onShowNewCategory={onShowNewCategory}/>
      <RenderMonths_1.RenderMonths component={MonthComponent} args={{ group: group }}/>
    </table_1.Row>);
}
