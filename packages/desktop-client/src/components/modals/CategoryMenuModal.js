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
exports.CategoryMenuModal = CategoryMenuModal;
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
var Modal_1 = require("@desktop-client/components/common/Modal");
var Notes_1 = require("@desktop-client/components/Notes");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var useCategoryGroup_1 = require("@desktop-client/hooks/useCategoryGroup");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
function CategoryMenuModal(_a) {
    var categoryId = _a.categoryId, onSave = _a.onSave, onEditNotes = _a.onEditNotes, onDelete = _a.onDelete, onToggleVisibility = _a.onToggleVisibility, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var category = (0, useCategory_1.useCategory)(categoryId);
    var categoryGroup = (0, useCategoryGroup_1.useCategoryGroup)(category === null || category === void 0 ? void 0 : category.group);
    var originalNotes = (0, useNotes_1.useNotes)(category.id);
    var onRename = function (newName) {
        if (newName && newName !== category.name) {
            onSave === null || onSave === void 0 ? void 0 : onSave(__assign(__assign({}, category), { name: newName }));
        }
    };
    var _onToggleVisibility = function () {
        onToggleVisibility === null || onToggleVisibility === void 0 ? void 0 : onToggleVisibility(category.id);
    };
    var _onEditNotes = function () {
        onEditNotes === null || onEditNotes === void 0 ? void 0 : onEditNotes(category.id);
    };
    var _onDelete = function () {
        onDelete === null || onDelete === void 0 ? void 0 : onDelete(category.id);
    };
    var buttonStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.formLabelText, 
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%' });
    return (<Modal_1.Modal name="category-menu" onClose={onClose} containerProps={{
            style: { height: '45vh' },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader leftContent={<AdditionalCategoryMenu category={category} categoryGroup={categoryGroup} onDelete={_onDelete} onToggleVisibility={_onToggleVisibility}/>} title={<Modal_1.ModalTitle isEditable title={category.name} onTitleUpdate={onRename}/>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
            <view_1.View style={{
                    overflowY: 'auto',
                    flex: 1,
                }}>
              <Notes_1.Notes notes={(originalNotes === null || originalNotes === void 0 ? void 0 : originalNotes.length) > 0 ? originalNotes : t('No notes')} editable={false} focused={false} getStyle={function () { return (__assign({ borderRadius: 6 }, ((!originalNotes || originalNotes.length === 0) && {
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
              <button_1.Button style={buttonStyle} onPress={_onEditNotes}>
                <v2_1.SvgNotesPaper width={20} height={20} style={{ paddingRight: 5 }}/>
                <react_i18next_1.Trans>Edit notes</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
function AdditionalCategoryMenu(_a) {
    var category = _a.category, categoryGroup = _a.categoryGroup, onDelete = _a.onDelete, onToggleVisibility = _a.onToggleVisibility;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var itemStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight });
    var getItemStyle = function (item) { return (__assign(__assign({}, itemStyle), (item.name === 'delete' && { color: theme_1.theme.errorTextMenu }))); };
    return (<view_1.View>
      <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={function () {
            setMenuOpen(true);
        }}>
        <v1_1.SvgDotsHorizontalTriple width={17} height={17} style={{ color: 'currentColor' }}/>
        <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} placement="bottom start" onOpenChange={function () { return setMenuOpen(false); }}>
          <menu_1.Menu getItemStyle={getItemStyle} items={[
            !(categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden) && {
                name: 'toggleVisibility',
                text: category.hidden ? t('Show') : t('Hide'),
                icon: category.hidden ? v2_1.SvgViewShow : v2_1.SvgViewHide,
                iconSize: 16,
            },
            !(categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden) && menu_1.Menu.line,
            {
                name: 'delete',
                text: t('Delete'),
                icon: v1_1.SvgTrash,
                iconSize: 15,
            },
        ]} onMenuSelect={function (itemName) {
            setMenuOpen(false);
            if (itemName === 'delete') {
                onDelete();
            }
            else if (itemName === 'toggleVisibility') {
                onToggleVisibility();
            }
        }}/>
        </popover_1.Popover>
      </button_1.Button>
    </view_1.View>);
}
