"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverMenu = CoverMenu;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var view_1 = require("@actual-app/components/view");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var util_1 = require("@desktop-client/components/budget/util");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
function CoverMenu(_a) {
    var _b = _a.showToBeBudgeted, showToBeBudgeted = _b === void 0 ? true : _b, categoryId = _a.categoryId, onSubmit = _a.onSubmit, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var originalCategoryGroups = (0, useCategories_1.useCategories)().grouped;
    var _c = (0, react_1.useState)(null), fromCategoryId = _c[0], setFromCategoryId = _c[1];
    var filteredCategoryGroups = (0, react_1.useMemo)(function () {
        var expenseGroups = originalCategoryGroups.filter(function (g) { return !g.is_income; });
        var categoryGroups = showToBeBudgeted
            ? (0, util_1.addToBeBudgetedGroup)(expenseGroups)
            : expenseGroups;
        return categoryId
            ? (0, util_1.removeCategoriesFromGroups)(categoryGroups, categoryId)
            : categoryGroups;
    }, [categoryId, showToBeBudgeted, originalCategoryGroups]);
    function _onSubmit() {
        if (fromCategoryId) {
            onSubmit(fromCategoryId);
        }
        onClose();
    }
    return (<react_aria_components_1.Form onSubmit={function (e) {
            e.preventDefault();
            _onSubmit();
        }}>
      <view_1.View style={{ padding: 10 }}>
        <view_1.View style={{ marginBottom: 5 }}>
          <react_i18next_1.Trans>Cover from a category:</react_i18next_1.Trans>
        </view_1.View>

        <initial_focus_1.InitialFocus>
          {function (node) { return (<CategoryAutocomplete_1.CategoryAutocomplete categoryGroups={filteredCategoryGroups} value={null} openOnFocus={true} onSelect={function (id) {
                return setFromCategoryId(id || null);
            }} inputProps={{
                ref: node,
                placeholder: t('(none)'),
            }} showHiddenCategories={false}/>); }}
        </initial_focus_1.InitialFocus>

        <view_1.View style={{
            alignItems: 'flex-end',
            marginTop: 10,
        }}>
          <button_1.Button type="submit" variant="primary" style={{
            fontSize: 12,
            paddingTop: 3,
        }}>
            <react_i18next_1.Trans>Transfer</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </view_1.View>
    </react_aria_components_1.Form>);
}
