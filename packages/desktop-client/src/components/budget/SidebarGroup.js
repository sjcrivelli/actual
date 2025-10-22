"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarGroup = SidebarGroup;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var NotesButton_1 = require("@desktop-client/components/NotesButton");
var table_1 = require("@desktop-client/components/table");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
function SidebarGroup(_a) {
    var group = _a.group, editing = _a.editing, collapsed = _a.collapsed, dragPreview = _a.dragPreview, innerRef = _a.innerRef, style = _a.style, onEdit = _a.onEdit, onSave = _a.onSave, onDelete = _a.onDelete, onApplyBudgetTemplatesInGroup = _a.onApplyBudgetTemplatesInGroup, onShowNewCategory = _a.onShowNewCategory, onHideNewGroup = _a.onHideNewGroup, onToggleCollapse = _a.onToggleCollapse;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var temporary = group.id === 'new';
    var _b = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _b.setMenuOpen, menuOpen = _b.menuOpen, handleContextMenu = _b.handleContextMenu, resetPosition = _b.resetPosition, position = _b.position;
    var triggerRef = (0, react_1.useRef)(null);
    var displayed = (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            height: 20,
        }} ref={triggerRef} onClick={function () {
            onToggleCollapse(group.id);
        }} onContextMenu={handleContextMenu}>
      {!dragPreview && (<v0_1.SvgExpandArrow width={8} height={8} style={{
                marginRight: 5,
                marginLeft: 5,
                flexShrink: 0,
                transition: 'transform .1s',
                transform: collapsed ? 'rotate(-90deg)' : '',
            }}/>)}
      <div style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            minWidth: 0,
        }}>
        {dragPreview && <text_1.Text style={{ fontWeight: 500 }}>Group: </text_1.Text>}
        {group.name}
      </div>
      {!dragPreview && (<>
          <view_1.View style={{ marginLeft: 5, flexShrink: 0 }}>
            <button_1.Button variant="bare" className="hover-visible" onPress={function () {
                resetPosition();
                setMenuOpen(true);
            }} style={{ padding: 3 }}>
              <v1_1.SvgCheveronDown width={14} height={14}/>
            </button_1.Button>

            <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 200, margin: 1 }} isNonModal {...position}>
              <menu_1.Menu onMenuSelect={function (type) {
                if (type === 'rename') {
                    onEdit(group.id);
                }
                else if (type === 'add-category') {
                    onShowNewCategory(group.id);
                }
                else if (type === 'delete') {
                    onDelete(group.id);
                }
                else if (type === 'toggle-visibility') {
                    onSave(__assign(__assign({}, group), { hidden: !group.hidden }));
                }
                else if (type === 'apply-multiple-category-template') {
                    onApplyBudgetTemplatesInGroup === null || onApplyBudgetTemplatesInGroup === void 0 ? void 0 : onApplyBudgetTemplatesInGroup(group.categories.filter(function (c) { return !c.hidden; }).map(function (c) { return c.id; }));
                }
                setMenuOpen(false);
            }} items={__spreadArray([
                { name: 'add-category', text: t('Add category') },
                { name: 'rename', text: t('Rename') },
                !group.is_income && {
                    name: 'toggle-visibility',
                    text: group.hidden ? t('Show') : t('Hide'),
                },
                onDelete && { name: 'delete', text: t('Delete') }
            ], (isGoalTemplatesEnabled
                ? [
                    {
                        name: 'apply-multiple-category-template',
                        text: t('Apply budget templates'),
                    },
                ]
                : []), true)}/>
            </popover_1.Popover>
          </view_1.View>
          <view_1.View style={{ flex: 1 }}/>
          <view_1.View style={{ flexShrink: 0 }}>
            <NotesButton_1.NotesButton id={group.id} style={dragPreview && { color: 'currentColor' }} defaultColor={theme_1.theme.pageTextLight}/>
          </view_1.View>
        </>)}
    </view_1.View>);
    return (<view_1.View innerRef={innerRef} style={__assign(__assign(__assign(__assign({}, style), { width: 200 + 100 * categoryExpandedState, backgroundColor: theme_1.theme.tableRowHeaderBackground, overflow: 'hidden', '& .hover-visible': {
                display: 'none',
            } }), (!dragPreview && {
            '&:hover .hover-visible': {
                display: 'flex',
            },
        })), (dragPreview && {
            paddingLeft: 10,
            zIndex: 10000,
            borderRadius: 6,
            overflow: 'hidden',
        }))} onKeyDown={function (e) {
            if (e.key === 'Enter') {
                onEdit(null);
                e.stopPropagation();
            }
        }}>
      <table_1.InputCell value={group.name} formatter={function () { return displayed; }} width="flex" exposed={editing} onUpdate={function (value) {
            if (temporary) {
                if (value === '') {
                    onHideNewGroup();
                }
                else if (value !== '') {
                    onSave({ id: group.id, name: value });
                }
            }
            else {
                onSave({ id: group.id, name: value });
            }
        }} onBlur={function () { return onEdit(null); }} style={{ fontWeight: 600 }} inputProps={{
            style: { marginLeft: 20 },
            placeholder: temporary ? t('New group name') : '',
        }}/>
    </view_1.View>);
}
