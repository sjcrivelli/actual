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
exports.CategoryGroupMenuModal = CategoryGroupMenuModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Modal_1 = require("@desktop-client/components/common/Modal");
var CategoryGroupActionMenu_1 = require("@desktop-client/components/mobile/budget/CategoryGroupActionMenu");
var Notes_1 = require("@desktop-client/components/Notes");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
function CategoryGroupMenuModal(_a) {
    var groupId = _a.groupId, onSave = _a.onSave, onAddCategory = _a.onAddCategory, onEditNotes = _a.onEditNotes, onDelete = _a.onDelete, onToggleVisibility = _a.onToggleVisibility, onClose = _a.onClose, onApplyBudgetTemplatesInGroup = _a.onApplyBudgetTemplatesInGroup;
    var _b = (0, react_1.useState)(false), showMore = _b[0], setShowMore = _b[1];
    var categoryGroups = (0, useCategories_1.useCategories)().grouped;
    var group = categoryGroups.find(function (g) { return g.id === groupId; });
    var notes = (0, useNotes_1.useNotes)(group.id);
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var t = (0, react_i18next_1.useTranslation)().t;
    var onRename = function (newName) {
        if (newName && newName !== group.name) {
            onSave === null || onSave === void 0 ? void 0 : onSave(__assign(__assign({}, group), { name: newName }));
        }
    };
    var onShowMore = function () {
        setShowMore(!showMore);
    };
    var _onAddCategory = function () {
        onAddCategory === null || onAddCategory === void 0 ? void 0 : onAddCategory(group.id, group.is_income);
    };
    var _onEditNotes = function () {
        onEditNotes === null || onEditNotes === void 0 ? void 0 : onEditNotes(group.id);
    };
    var _onDelete = function () {
        onDelete === null || onDelete === void 0 ? void 0 : onDelete(group.id);
    };
    var _onToggleVisibility = function () {
        onToggleVisibility === null || onToggleVisibility === void 0 ? void 0 : onToggleVisibility(group.id);
    };
    var _onApplyBudgetTemplatesInGroup = function () {
        onApplyBudgetTemplatesInGroup === null || onApplyBudgetTemplatesInGroup === void 0 ? void 0 : onApplyBudgetTemplatesInGroup(group.categories.filter(function (c) { return !c.hidden; }).map(function (c) { return c.id; }));
    };
    var buttonStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.formLabelText, 
        // Adjust based on desired number of buttons per row.
        flexBasis: '48%', marginLeft: '1%', marginRight: '1%' });
    var actionButtonStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.formLabelText, 
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%' });
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    return (<Modal_1.Modal name="category-group-menu" onClose={onClose} containerProps={{
            style: {
                height: '45vh',
            },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader leftContent={<AdditionalCategoryGroupMenu group={group} onDelete={_onDelete} onToggleVisibility={_onToggleVisibility}/>} title={<Modal_1.ModalTitle isEditable title={group.name} onTitleUpdate={onRename}/>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
            <view_1.View style={{
                    overflowY: 'auto',
                    flex: 1,
                }}>
              <Notes_1.Notes notes={(notes === null || notes === void 0 ? void 0 : notes.length) > 0 ? notes : t('No notes')} editable={false} focused={false} getStyle={function () { return (__assign(__assign(__assign({}, styles_1.styles.mediumText), { borderRadius: 6 }), ((!notes || notes.length === 0) && {
                    justifySelf: 'center',
                    alignSelf: 'center',
                    color: theme_1.theme.pageTextSubdued,
                }))); }}/>
            </view_1.View>
            <view_1.View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignContent: 'space-between',
                    paddingTop: 10,
                }}>
              <button_1.Button style={buttonStyle} onPress={_onAddCategory}>
                <v1_1.SvgAdd width={17} height={17} style={{ paddingRight: 5 }}/>
                <react_i18next_1.Trans>Add category</react_i18next_1.Trans>
              </button_1.Button>
              <button_1.Button style={buttonStyle} onPress={_onEditNotes}>
                <v2_1.SvgNotesPaper width={20} height={20} style={{ paddingRight: 5 }}/>
                <react_i18next_1.Trans>Edit notes</react_i18next_1.Trans>
              </button_1.Button>
              {isGoalTemplatesEnabled && (<button_1.Button variant="bare" className={(0, css_1.css)([
                        actionButtonStyle,
                        {
                            '&[data-pressed], &[data-hovered]': {
                                backgroundColor: 'transparent',
                                color: buttonStyle.color,
                            },
                        },
                    ])} onPress={onShowMore}>
                  {!showMore ? (<v1_1.SvgCheveronUp width={30} height={30} style={{ paddingRight: 5 }}/>) : (<v1_1.SvgCheveronDown width={30} height={30} style={{ paddingRight: 5 }}/>)}
                  <react_i18next_1.Trans>Actions</react_i18next_1.Trans>
                </button_1.Button>)}
            </view_1.View>
            {showMore && (<CategoryGroupActionMenu_1.CategoryGroupActionMenu style={{ overflowY: 'auto', paddingTop: 10 }} getItemStyle={function () { return defaultMenuItemStyle; }} onApplyBudgetTemplatesInGroup={function () {
                        _onApplyBudgetTemplatesInGroup();
                        close();
                        showUndoNotification({
                            message: t('budget templates have been applied.'),
                        });
                    }}/>)}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
function AdditionalCategoryGroupMenu(_a) {
    var group = _a.group, onDelete = _a.onDelete, onToggleVisibility = _a.onToggleVisibility;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var itemStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight });
    var getItemStyle = function (item) { return (__assign(__assign({}, itemStyle), (item.name === 'delete' && { color: theme_1.theme.errorTextMenu }))); };
    return (<view_1.View>
      {!group.is_income && (<button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () {
                setMenuOpen(true);
            }}>
          <v1_1.SvgDotsHorizontalTriple width={17} height={17} style={{ color: 'currentColor' }}/>
          <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} placement="bottom start" onOpenChange={function () { return setMenuOpen(false); }}>
            <menu_1.Menu style={__assign(__assign({}, styles_1.styles.mediumText), { color: theme_1.theme.formLabelText })} getItemStyle={getItemStyle} items={__spreadArray([
                {
                    name: 'toggleVisibility',
                    text: group.hidden ? t('Show') : t('Hide'),
                    icon: group.hidden ? v2_1.SvgViewShow : v2_1.SvgViewHide,
                    iconSize: 16,
                }
            ], (!group.is_income && [
                menu_1.Menu.line,
                {
                    name: 'delete',
                    text: t('Delete'),
                    icon: v1_1.SvgTrash,
                    iconSize: 15,
                },
            ]), true).filter(function (i) { return i != null; })} onMenuSelect={function (itemName) {
                setMenuOpen(false);
                if (itemName === 'delete') {
                    onDelete();
                }
                else if (itemName === 'toggleVisibility') {
                    onToggleVisibility();
                }
            }}/>
          </popover_1.Popover>
        </button_1.Button>)}
    </view_1.View>);
}
