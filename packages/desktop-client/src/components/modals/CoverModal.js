"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverModal = CoverModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var util_1 = require("@desktop-client/components/budget/util");
var Modal_1 = require("@desktop-client/components/common/Modal");
var MobileForms_1 = require("@desktop-client/components/mobile/MobileForms");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function CoverModal(_a) {
    var title = _a.title, categoryId = _a.categoryId, month = _a.month, _b = _a.showToBeBudgeted, showToBeBudgeted = _b === void 0 ? true : _b, onSubmit = _a.onSubmit;
    var t = (0, react_i18next_1.useTranslation)().t;
    var originalCategoryGroups = (0, useCategories_1.useCategories)().grouped;
    var _c = (0, react_1.useMemo)(function () {
        var expenseGroups = originalCategoryGroups.filter(function (g) { return !g.is_income; });
        var categoryGroups = showToBeBudgeted
            ? (0, util_1.addToBeBudgetedGroup)(expenseGroups)
            : expenseGroups;
        var filteredCategoryGroups = categoryId
            ? (0, util_1.removeCategoriesFromGroups)(categoryGroups, categoryId)
            : categoryGroups;
        var filteredCategoryies = filteredCategoryGroups.flatMap(function (g) { return g.categories || []; });
        return [filteredCategoryGroups, filteredCategoryies];
    }, [categoryId, originalCategoryGroups, showToBeBudgeted]), categoryGroups = _c[0], categories = _c[1];
    var _d = (0, react_1.useState)(null), fromCategoryId = _d[0], setFromCategoryId = _d[1];
    var dispatch = (0, redux_1.useDispatch)();
    var onCategoryClick = (0, react_1.useCallback)(function () {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'category-autocomplete',
                options: {
                    categoryGroups: categoryGroups,
                    month: month,
                    onSelect: function (categoryId) {
                        setFromCategoryId(categoryId);
                    },
                },
            },
        }));
    }, [categoryGroups, dispatch, month]);
    var _onSubmit = function (categoryId) {
        if (categoryId) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(categoryId);
        }
    };
    var fromCategory = categories.find(function (c) { return c.id === fromCategoryId; });
    return (<Modal_1.Modal name="cover">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={title} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <MobileForms_1.FieldLabel title={t('Cover from a category:')}/>
            <MobileForms_1.TapField value={fromCategory === null || fromCategory === void 0 ? void 0 : fromCategory.name} onPress={onCategoryClick}/>
          </view_1.View>

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
                    _onSubmit(fromCategoryId);
                    close();
                }}>
              <react_i18next_1.Trans>Transfer</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
