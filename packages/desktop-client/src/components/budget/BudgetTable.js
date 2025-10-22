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
exports.BudgetTable = BudgetTable;
var react_1 = require("react");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var query_1 = require("loot-core/shared/query");
var BudgetCategories_1 = require("./BudgetCategories");
var BudgetSummaries_1 = require("./BudgetSummaries");
var BudgetTotals_1 = require("./BudgetTotals");
var MonthsContext_1 = require("./MonthsContext");
var util_1 = require("./util");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
function BudgetTable(props) {
    var type = props.type, prewarmStartMonth = props.prewarmStartMonth, startMonth = props.startMonth, numMonths = props.numMonths, monthBounds = props.monthBounds, dataComponents = props.dataComponents, onSaveCategory = props.onSaveCategory, onDeleteCategory = props.onDeleteCategory, onSaveGroup = props.onSaveGroup, onDeleteGroup = props.onDeleteGroup, onApplyBudgetTemplatesInGroup = props.onApplyBudgetTemplatesInGroup, onReorderCategory = props.onReorderCategory, onReorderGroup = props.onReorderGroup, onShowActivity = props.onShowActivity, onBudgetAction = props.onBudgetAction;
    var _a = (0, useCategories_1.useCategories)().grouped, categoryGroups = _a === void 0 ? [] : _a;
    var _b = (0, useLocalPref_1.useLocalPref)('budget.collapsed'), _c = _b[0], collapsedGroupIds = _c === void 0 ? [] : _c, setCollapsedGroupIdsPref = _b[1];
    var _d = (0, useLocalPref_1.useLocalPref)('budget.showHiddenCategories'), showHiddenCategories = _d[0], setShowHiddenCategoriesPef = _d[1];
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var _e = (0, react_1.useState)(null), editing = _e[0], setEditing = _e[1];
    var onEditMonth = function (id, month) {
        setEditing(id ? { id: id, cell: month } : null);
    };
    var onEditName = function (id) {
        setEditing(id ? { id: id, cell: 'name' } : null);
    };
    var _onReorderCategory = function (id, dropPos, targetId) {
        var _a;
        var isGroup = !!categoryGroups.find(function (g) { return g.id === targetId; });
        if (isGroup) {
            var groupId_1 = (0, util_1.findSortUp)(categoryGroups, dropPos, targetId).targetId;
            var group = categoryGroups.find(function (g) { return g.id === groupId_1; });
            if (group) {
                var _b = group.categories, categories = _b === void 0 ? [] : _b;
                onReorderCategory({
                    id: id,
                    groupId: group.id,
                    targetId: categories.length === 0 || dropPos === 'top'
                        ? null
                        : categories[0].id,
                });
            }
        }
        else {
            var targetGroup = void 0;
            for (var _i = 0, categoryGroups_1 = categoryGroups; _i < categoryGroups_1.length; _i++) {
                var group = categoryGroups_1[_i];
                if ((_a = group.categories) === null || _a === void 0 ? void 0 : _a.find(function (cat) { return cat.id === targetId; })) {
                    targetGroup = group;
                    break;
                }
            }
            onReorderCategory(__assign({ id: id, groupId: targetGroup === null || targetGroup === void 0 ? void 0 : targetGroup.id }, (0, util_1.findSortDown)((targetGroup === null || targetGroup === void 0 ? void 0 : targetGroup.categories) || [], dropPos, targetId)));
        }
    };
    var _onReorderGroup = function (id, dropPos, targetId) {
        var expenseGroups = (0, util_1.separateGroups)(categoryGroups)[0]; // exclude Income group from sortable groups to fix off-by-one error
        onReorderGroup(__assign({ id: id }, (0, util_1.findSortDown)(expenseGroups, dropPos, targetId)));
    };
    var moveVertically = function (dir) {
        var flattened = categoryGroups.reduce(function (all, group) {
            if (collapsedGroupIds.includes(group.id)) {
                return all.concat({ id: group.id, isGroup: true });
            }
            return all.concat(__spreadArray([
                { id: group.id, isGroup: true }
            ], ((group === null || group === void 0 ? void 0 : group.categories) || []), true));
        }, []);
        if (editing) {
            var idx = flattened.findIndex(function (item) { return item.id === editing.id; });
            var nextIdx = idx + dir;
            while (nextIdx >= 0 && nextIdx < flattened.length) {
                var next = flattened[nextIdx];
                if ('isGroup' in next && next.isGroup) {
                    nextIdx += dir;
                    continue;
                }
                else if (type === 'tracking' ||
                    ('is_income' in next && !next.is_income)) {
                    onEditMonth(next.id, editing.cell);
                    return;
                }
                else {
                    break;
                }
            }
        }
    };
    var onKeyDown = function (e) {
        if (!editing) {
            return null;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            moveVertically(e.shiftKey ? -1 : 1);
        }
    };
    var onCollapse = function (collapsedIds) {
        setCollapsedGroupIdsPref(collapsedIds);
    };
    var onToggleHiddenCategories = function () {
        setShowHiddenCategoriesPef(!showHiddenCategories);
    };
    var toggleHiddenCategories = function () {
        onToggleHiddenCategories();
    };
    var expandAllCategories = function () {
        onCollapse([]);
    };
    var collapseAllCategories = function () {
        onCollapse(categoryGroups.map(function (g) { return g.id; }));
    };
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []);
    return (<view_1.View data-testid="budget-table" style={__assign({ flex: 1 }, (styles_1.styles.lightScrollbar && {
            '& ::-webkit-scrollbar': {
                backgroundColor: 'transparent',
            },
            '& ::-webkit-scrollbar-thumb:vertical': {
                backgroundColor: theme_1.theme.tableHeaderBackground,
            },
        }))}>
      <view_1.View style={{
            flexDirection: 'row',
            overflow: 'hidden',
            flexShrink: 0,
            // This is necessary to align with the table because the
            // table has this padding to allow the shadow to show
            paddingLeft: 5,
            paddingRight: 5 + (0, util_1.getScrollbarWidth)(),
        }}>
        <view_1.View style={{ width: 200 + 100 * categoryExpandedState }}/>
        <MonthsContext_1.MonthsProvider startMonth={prewarmStartMonth} numMonths={numMonths} monthBounds={monthBounds} type={type}>
          <BudgetSummaries_1.BudgetSummaries SummaryComponent={dataComponents.SummaryComponent}/>
        </MonthsContext_1.MonthsProvider>
      </view_1.View>

      <MonthsContext_1.MonthsProvider startMonth={startMonth} numMonths={numMonths} monthBounds={monthBounds} type={type}>
        <BudgetTotals_1.BudgetTotals MonthComponent={dataComponents.BudgetTotalsComponent} toggleHiddenCategories={toggleHiddenCategories} expandAllCategories={expandAllCategories} collapseAllCategories={collapseAllCategories}/>
        <view_1.View style={{
            overflowY: 'scroll',
            overflowAnchor: 'none',
            flex: 1,
            paddingLeft: 5,
            paddingRight: 5,
        }}>
          <view_1.View style={{
            flexShrink: 0,
        }} onKeyDown={onKeyDown}>
            <useCachedSchedules_1.SchedulesProvider query={schedulesQuery}>
              <BudgetCategories_1.BudgetCategories 
    // @ts-expect-error Fix when migrating BudgetCategories to ts
    categoryGroups={categoryGroups} editingCell={editing} dataComponents={dataComponents} onEditMonth={onEditMonth} onEditName={onEditName} onSaveCategory={onSaveCategory} onSaveGroup={onSaveGroup} onDeleteCategory={onDeleteCategory} onDeleteGroup={onDeleteGroup} onReorderCategory={_onReorderCategory} onReorderGroup={_onReorderGroup} onBudgetAction={onBudgetAction} onShowActivity={onShowActivity} onApplyBudgetTemplatesInGroup={onApplyBudgetTemplatesInGroup}/>
            </useCachedSchedules_1.SchedulesProvider>
          </view_1.View>
        </view_1.View>
      </MonthsContext_1.MonthsProvider>
    </view_1.View>);
}
BudgetTable.displayName = 'BudgetTable';
