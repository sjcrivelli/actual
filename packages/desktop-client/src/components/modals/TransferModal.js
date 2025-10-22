"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModal = TransferModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var util_1 = require("@desktop-client/components/budget/util");
var Modal_1 = require("@desktop-client/components/common/Modal");
var MobileForms_1 = require("@desktop-client/components/mobile/MobileForms");
var AmountInput_1 = require("@desktop-client/components/util/AmountInput");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function TransferModal(_a) {
    var title = _a.title, categoryId = _a.categoryId, month = _a.month, initialAmount = _a.amount, showToBeBudgeted = _a.showToBeBudgeted, onSubmit = _a.onSubmit;
    var t = (0, react_i18next_1.useTranslation)().t;
    var originalCategoryGroups = (0, useCategories_1.useCategories)().grouped;
    var _b = (0, react_1.useMemo)(function () {
        var expenseGroups = originalCategoryGroups.filter(function (g) { return !g.is_income; });
        var categoryGroups = showToBeBudgeted
            ? (0, util_1.addToBeBudgetedGroup)(expenseGroups)
            : expenseGroups;
        var filteredCategoryGroups = categoryId
            ? (0, util_1.removeCategoriesFromGroups)(categoryGroups, categoryId)
            : categoryGroups;
        var filteredCategories = filteredCategoryGroups.flatMap(function (g) { return g.categories || []; });
        return [filteredCategoryGroups, filteredCategories];
    }, [categoryId, originalCategoryGroups, showToBeBudgeted]), categoryGroups = _b[0], categories = _b[1];
    var _c = (0, react_1.useState)(initialAmount), amount = _c[0], setAmount = _c[1];
    var _d = (0, react_1.useState)(null), toCategoryId = _d[0], setToCategoryId = _d[1];
    var dispatch = (0, redux_1.useDispatch)();
    var openCategoryModal = function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'category-autocomplete',
                options: {
                    categoryGroups: categoryGroups,
                    month: month,
                    showHiddenCategories: true,
                    onSelect: function (categoryId) {
                        setToCategoryId(categoryId);
                    },
                },
            },
        }));
    };
    var _onSubmit = function (newAmount, categoryId) {
        if (newAmount && categoryId) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(newAmount, categoryId);
        }
    };
    var toCategory = categories.find(function (c) { return c.id === toCategoryId; });
    return (<Modal_1.Modal name="transfer">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={title} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <view_1.View>
              <MobileForms_1.FieldLabel title={t('Transfer this amount:')}/>
              <initial_focus_1.InitialFocus>
                <AmountInput_1.AmountInput value={initialAmount} autoDecimals={true} style={{
                    marginLeft: styles_1.styles.mobileEditingPadding,
                    marginRight: styles_1.styles.mobileEditingPadding,
                }} inputStyle={{
                    height: styles_1.styles.mobileMinHeight,
                }} onUpdate={setAmount} onEnter={function () {
                    if (!toCategoryId) {
                        openCategoryModal();
                    }
                }}/>
              </initial_focus_1.InitialFocus>
            </view_1.View>

            <MobileForms_1.FieldLabel title="To:"/>
            <MobileForms_1.TapField value={toCategory === null || toCategory === void 0 ? void 0 : toCategory.name} onPress={openCategoryModal}/>

            <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                }}>
              <button_1.Button variant="primary" style={{
                    height: styles_1.styles.mobileMinHeight,
                    marginLeft: styles_1.styles.mobileEditingPadding,
                    marginRight: styles_1.styles.mobileEditingPadding,
                }} onPress={function () {
                    _onSubmit(amount, toCategoryId);
                    close();
                }}>
                <react_i18next_1.Trans>Transfer</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
