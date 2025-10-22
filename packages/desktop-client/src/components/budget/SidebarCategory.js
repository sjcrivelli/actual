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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarCategory = SidebarCategory;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var SidebarCategoryButtons_1 = require("./SidebarCategoryButtons");
var table_1 = require("@desktop-client/components/table");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
function SidebarCategory(_a) {
    var innerRef = _a.innerRef, category = _a.category, categoryGroup = _a.categoryGroup, dragPreview = _a.dragPreview, dragging = _a.dragging, editing = _a.editing, _b = _a.goalsShown, goalsShown = _b === void 0 ? false : _b, style = _a.style, isLast = _a.isLast, onEditName = _a.onEditName, onSave = _a.onSave, onDelete = _a.onDelete, onHideNewCategory = _a.onHideNewCategory;
    var t = (0, react_i18next_1.useTranslation)().t;
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var temporary = category.id === 'new';
    var _c = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _c.setMenuOpen, menuOpen = _c.menuOpen, handleContextMenu = _c.handleContextMenu, resetPosition = _c.resetPosition, position = _c.position;
    var triggerRef = (0, react_1.useRef)(null);
    var displayed = (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            opacity: category.hidden || (categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden) ? 0.33 : undefined,
            backgroundColor: 'transparent',
            height: 20,
        }} ref={triggerRef} onContextMenu={handleContextMenu}>
      <text_one_line_1.TextOneLine data-testid="category-name">{category.name}</text_one_line_1.TextOneLine>
      <view_1.View style={{ flexShrink: 0, marginLeft: 5 }}>
        <button_1.Button variant="bare" className="hover-visible" style={{ color: 'currentColor', padding: 3 }} onPress={function () {
            resetPosition();
            setMenuOpen(true);
        }}>
          <v1_1.SvgCheveronDown width={14} height={14} style={{ color: 'currentColor' }}/>
        </button_1.Button>

        <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} style={{ width: 200, margin: 1 }} isNonModal {...position}>
          <menu_1.Menu onMenuSelect={function (type) {
            if (type === 'rename') {
                onEditName(category.id);
            }
            else if (type === 'delete') {
                onDelete(category.id);
            }
            else if (type === 'toggle-visibility') {
                onSave(__assign(__assign({}, category), { hidden: !category.hidden }));
            }
            setMenuOpen(false);
        }} items={[
            { name: 'rename', text: t('Rename') },
            !(categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden) && {
                name: 'toggle-visibility',
                text: category.hidden ? t('Show') : t('Hide'),
            },
            { name: 'delete', text: t('Delete') },
        ]}/>
        </popover_1.Popover>
      </view_1.View>
      <SidebarCategoryButtons_1.SidebarCategoryButtons category={category} dragging={dragging} goalsShown={goalsShown}/>
    </view_1.View>);
    return (<view_1.View innerRef={innerRef} style={__assign(__assign(__assign(__assign({ width: 200 + 100 * categoryExpandedState, overflow: 'hidden', '& .hover-visible': {
                display: 'none',
            } }, (!dragging &&
            !dragPreview && {
            '&:hover .hover-visible': {
                display: 'flex',
            },
        })), (dragging && { color: theme_1.theme.formInputTextPlaceholderSelected })), (dragPreview && {
            backgroundColor: theme_1.theme.tableBackground,
            zIndex: 10000,
            borderRadius: 6,
            overflow: 'hidden',
        })), style)} onKeyDown={function (e) {
            if (e.key === 'Enter') {
                onEditName(null);
                e.stopPropagation();
            }
        }}>
      <table_1.InputCell value={category.name} formatter={function () { return displayed; }} width="flex" exposed={editing || temporary} onUpdate={function (value) {
            if (temporary) {
                if (value === '') {
                    onHideNewCategory();
                }
                else if (value !== '') {
                    onSave(__assign(__assign({}, category), { name: value }));
                }
            }
            else {
                if (value !== category.name) {
                    onSave(__assign(__assign({}, category), { name: value }));
                }
            }
        }} onBlur={function () { return onEditName(null); }} style={__assign({ paddingLeft: 13 }, (isLast && { borderBottomWidth: 0 }))} inputProps={{
            placeholder: temporary ? t('New category name') : '',
        }}/>
    </view_1.View>);
}
