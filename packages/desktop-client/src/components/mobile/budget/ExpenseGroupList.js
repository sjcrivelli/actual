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
exports.ExpenseGroupList = ExpenseGroupList;
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var ExpenseGroupListItem_1 = require("./ExpenseGroupListItem");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var redux_1 = require("@desktop-client/redux");
function ExpenseGroupList(_a) {
    var categoryGroups = _a.categoryGroups, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn, month = _a.month, onEditCategoryGroup = _a.onEditCategoryGroup, onEditCategory = _a.onEditCategory, onBudgetAction = _a.onBudgetAction, showHiddenCategories = _a.showHiddenCategories, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse;
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
        renderDragPreview: function (items) {
            var draggedGroupId = items[0]['text/plain'];
            var group = categoryGroups.find(function (c) { return c.id === draggedGroupId; });
            if (!group) {
                throw new Error("Internal error: category group with ID ".concat(draggedGroupId, " not found."));
            }
            return (<ExpenseGroupListItem_1.ExpenseGroupHeader categoryGroup={group} month={month} showBudgetedColumn={showBudgetedColumn} show3Columns={show3Columns} onEditCategoryGroup={function () { }} isCollapsed={function () { return true; }} onToggleCollapse={function () { }} isHidden={false}/>);
        },
        onReorder: function (e) {
            var key = e.keys[0];
            var groupIdToMove = key;
            var groupToMove = categoryGroups.find(function (c) { return c.id === groupIdToMove; });
            if (!groupToMove) {
                throw new Error("Internal error: category group with ID ".concat(groupIdToMove, " not found."));
            }
            var targetGroupId = e.target.key;
            if (e.target.dropPosition === 'before') {
                dispatch((0, budgetSlice_1.moveCategoryGroup)({
                    id: groupToMove.id,
                    targetId: targetGroupId,
                }));
            }
            else if (e.target.dropPosition === 'after') {
                var targetGroupIndex = categoryGroups.findIndex(function (c) { return c.id === targetGroupId; });
                if (targetGroupIndex === -1) {
                    throw new Error("Internal error: category group with ID ".concat(targetGroupId, " not found."));
                }
                var nextToTargetCategory = categoryGroups[targetGroupIndex + 1];
                dispatch((0, budgetSlice_1.moveCategoryGroup)({
                    id: groupToMove.id,
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
    return (<react_aria_components_1.GridList aria-label={t('Expense category groups')} items={categoryGroups} dependencies={[
            month,
            onEditCategoryGroup,
            onEditCategory,
            onBudgetAction,
            show3Columns,
            showBudgetedColumn,
            showHiddenCategories,
            isCollapsed,
            onToggleCollapse,
        ]} dragAndDropHooks={dragAndDropHooks}>
      {function (categoryGroup) { return (<ExpenseGroupListItem_1.ExpenseGroupListItem key={categoryGroup.id} value={categoryGroup} month={month} onEditCategoryGroup={onEditCategoryGroup} onEditCategory={onEditCategory} onBudgetAction={onBudgetAction} showBudgetedColumn={showBudgetedColumn} show3Columns={show3Columns} showHiddenCategories={showHiddenCategories} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} isHidden={!!categoryGroup.hidden}/>); }}
    </react_aria_components_1.GridList>);
}
