"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMenu = TransferMenu;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var view_1 = require("@actual-app/components/view");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var util_1 = require("loot-core/shared/util");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var util_2 = require("@desktop-client/components/budget/util");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
function TransferMenu(_a) {
    var categoryId = _a.categoryId, _b = _a.initialAmount, initialAmount = _b === void 0 ? 0 : _b, showToBeBudgeted = _a.showToBeBudgeted, onSubmit = _a.onSubmit, onClose = _a.onClose;
    var originalCategoryGroups = (0, useCategories_1.useCategories)().grouped;
    var filteredCategoryGroups = (0, react_1.useMemo)(function () {
        var expenseCategoryGroups = originalCategoryGroups.filter(function (g) { return !g.is_income; });
        var categoryGroups = showToBeBudgeted
            ? (0, util_2.addToBeBudgetedGroup)(expenseCategoryGroups)
            : expenseCategoryGroups;
        return categoryId
            ? (0, util_2.removeCategoriesFromGroups)(categoryGroups, categoryId)
            : categoryGroups;
    }, [originalCategoryGroups, categoryId, showToBeBudgeted]);
    var _initialAmount = (0, util_1.integerToCurrency)(Math.max(initialAmount, 0));
    var _c = (0, react_1.useState)(null), amount = _c[0], setAmount = _c[1];
    var _d = (0, react_1.useState)(null), toCategoryId = _d[0], setToCategoryId = _d[1];
    var _onSubmit = function (newAmount, categoryId) {
        var parsedAmount = (0, arithmetic_1.evalArithmetic)(newAmount || '');
        if (parsedAmount && categoryId) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit((0, util_1.amountToInteger)(parsedAmount), categoryId);
        }
        onClose();
    };
    return (<react_aria_components_1.Form onSubmit={function (e) {
            e.preventDefault();
            _onSubmit(amount, toCategoryId);
        }}>
      <view_1.View style={{ padding: 10 }}>
        <view_1.View style={{ marginBottom: 5 }}>
          <react_i18next_1.Trans>Transfer this amount:</react_i18next_1.Trans>
        </view_1.View>
        <view_1.View>
          <initial_focus_1.InitialFocus>
            <input_1.Input defaultValue={_initialAmount} onUpdate={setAmount}/>
          </initial_focus_1.InitialFocus>
        </view_1.View>
        <view_1.View style={{ margin: '10px 0 5px 0' }}>To:</view_1.View>

        <CategoryAutocomplete_1.CategoryAutocomplete categoryGroups={filteredCategoryGroups} value={null} openOnFocus={true} onSelect={function (id) { return setToCategoryId(id || null); }} inputProps={{
            placeholder: '(none)',
        }} showHiddenCategories={true}/>

        <view_1.View style={{
            alignItems: 'flex-end',
            marginTop: 10,
        }}>
          <button_1.Button type="submit" variant="primary" style={{
            fontSize: 12,
            paddingTop: 3,
            paddingBottom: 3,
        }}>
            <react_i18next_1.Trans>Transfer</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </view_1.View>
    </react_aria_components_1.Form>);
}
