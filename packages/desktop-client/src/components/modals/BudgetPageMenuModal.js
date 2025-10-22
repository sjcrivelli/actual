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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetPageMenuModal = BudgetPageMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
function BudgetPageMenuModal(_a) {
    var onAddCategoryGroup = _a.onAddCategoryGroup, onToggleHiddenCategories = _a.onToggleHiddenCategories, onSwitchBudgetFile = _a.onSwitchBudgetFile;
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    return (<Modal_1.Modal name="budget-page-menu">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader showLogo rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <BudgetPageMenu getItemStyle={function () { return defaultMenuItemStyle; }} onAddCategoryGroup={onAddCategoryGroup} onToggleHiddenCategories={onToggleHiddenCategories} onSwitchBudgetFile={onSwitchBudgetFile}/>
        </>);
        }}
    </Modal_1.Modal>);
}
function BudgetPageMenu(_a) {
    var onAddCategoryGroup = _a.onAddCategoryGroup, onToggleHiddenCategories = _a.onToggleHiddenCategories, onSwitchBudgetFile = _a.onSwitchBudgetFile, props = __rest(_a, ["onAddCategoryGroup", "onToggleHiddenCategories", "onSwitchBudgetFile"]);
    var showHiddenCategories = (0, useLocalPref_1.useLocalPref)('budget.showHiddenCategories')[0];
    var onMenuSelect = function (name) {
        switch (name) {
            case 'add-category-group':
                onAddCategoryGroup === null || onAddCategoryGroup === void 0 ? void 0 : onAddCategoryGroup();
                break;
            // case 'edit-mode':
            //   onEditMode?.(true);
            //   break;
            case 'toggle-hidden-categories':
                onToggleHiddenCategories === null || onToggleHiddenCategories === void 0 ? void 0 : onToggleHiddenCategories();
                break;
            case 'switch-budget-file':
                onSwitchBudgetFile === null || onSwitchBudgetFile === void 0 ? void 0 : onSwitchBudgetFile();
                break;
            default:
                throw new Error("Unrecognized menu item: ".concat(name));
        }
    };
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<menu_1.Menu {...props} onMenuSelect={onMenuSelect} items={[
            {
                name: 'add-category-group',
                text: t('Add category group'),
            },
            {
                name: 'toggle-hidden-categories',
                text: "".concat(!showHiddenCategories ? t('Show hidden categories') : t('Hide hidden categories')),
            },
            {
                name: 'switch-budget-file',
                text: t('Switch budget file'),
            },
        ]}/>);
}
