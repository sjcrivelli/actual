"use strict";
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
exports.ExpenseCategoryList = ExpenseCategoryList;
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var ExpenseCategoryListItem_1 = require("./ExpenseCategoryListItem");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var redux_1 = require("@desktop-client/redux");
function ExpenseCategoryList(_a) {
    var categoryGroup = _a.categoryGroup, categories = _a.categories, month = _a.month, onEditCategory = _a.onEditCategory, onBudgetAction = _a.onBudgetAction, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn, shouldHideCategory = _a.shouldHideCategory;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var dragAndDropHooks = (0, react_aria_components_1.useDragAndDrop)({
        getItems: function (keys) {
            return __spreadArray([], keys, true).map(function (key) {
                return ({
                    'text/plain': key,
                });
            });
        },
        renderDropIndicator: function (target) {
            return (<react_aria_components_1.DropIndicator target={target} className={(0, css_1.css)({
                    '&[data-drop-target]': {
                        height: 4,
                        backgroundColor: theme_1.theme.tableBorderSeparator,
                        opacity: 1,
                        borderRadius: 4,
                    },
                })}/>);
        },
        onReorder: function (e) {
            var key = e.keys[0];
            var categoryIdToMove = key;
            var categoryToMove = categories.find(function (c) { return c.id === categoryIdToMove; });
            if (!categoryToMove) {
                throw new Error("Internal error: category with ID ".concat(categoryIdToMove, " not found."));
            }
            if (!categoryToMove.group) {
                throw new Error("Internal error: category ".concat(categoryIdToMove, " is not in a group and cannot be moved."));
            }
            var targetCategoryId = e.target.key;
            if (e.target.dropPosition === 'before') {
                dispatch((0, budgetSlice_1.moveCategory)({
                    id: categoryToMove.id,
                    groupId: categoryToMove.group,
                    targetId: targetCategoryId,
                }));
            }
            else if (e.target.dropPosition === 'after') {
                var targetCategoryIndex = categories.findIndex(function (c) { return c.id === targetCategoryId; });
                if (targetCategoryIndex === -1) {
                    throw new Error("Internal error: category with ID ".concat(targetCategoryId, " not found."));
                }
                var nextToTargetCategory = categories[targetCategoryIndex + 1];
                dispatch((0, budgetSlice_1.moveCategory)({
                    id: categoryToMove.id,
                    groupId: categoryToMove.group,
                    // Due to the way `moveCategory` works, we use the category next to the
                    // actual target category here because `moveCategory` always shoves the
                    // category *before* the target category.
                    // On the other hand, using `null` as `targetId` moves the category
                    // to the end of the list.
                    targetId: (nextToTargetCategory === null || nextToTargetCategory === void 0 ? void 0 : nextToTargetCategory.id) || null,
                }));
            }
        },
    }).dragAndDropHooks;
    return (<react_aria_components_1.GridList aria-label={t('{{categoryGroupName}} expense group categories', {
            categoryGroupName: categoryGroup.name,
        })} items={categories} dragAndDropHooks={dragAndDropHooks} dependencies={[
            month,
            onEditCategory,
            onBudgetAction,
            shouldHideCategory,
            show3Columns,
            showBudgetedColumn,
        ]}>
      {function (category) { return (<ExpenseCategoryListItem_1.ExpenseCategoryListItem key={category.id} value={category} month={month} onEditCategory={onEditCategory} onBudgetAction={onBudgetAction} isHidden={shouldHideCategory(category)} show3Columns={show3Columns} showBudgetedColumn={showBudgetedColumn}/>); }}
    </react_aria_components_1.GridList>);
}
