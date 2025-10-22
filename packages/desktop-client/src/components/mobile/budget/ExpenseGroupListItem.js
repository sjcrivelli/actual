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
exports.ExpenseGroupListItem = ExpenseGroupListItem;
exports.ExpenseGroupHeader = ExpenseGroupHeader;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var button_1 = require("@actual-app/components/button");
var card_1 = require("@actual-app/components/card");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var auto_text_size_1 = require("auto-text-size");
var monthUtils = require("loot-core/shared/months");
var BudgetTable_1 = require("./BudgetTable");
var ExpenseCategoryList_1 = require("./ExpenseCategoryList");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ExpenseGroupListItem(_a) {
    var onEditCategoryGroup = _a.onEditCategoryGroup, onEditCategory = _a.onEditCategory, month = _a.month, onBudgetAction = _a.onBudgetAction, showBudgetedColumn = _a.showBudgetedColumn, show3Columns = _a.show3Columns, showHiddenCategories = _a.showHiddenCategories, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse, isHidden = _a.isHidden, props = __rest(_a, ["onEditCategoryGroup", "onEditCategory", "month", "onBudgetAction", "showBudgetedColumn", "show3Columns", "showHiddenCategories", "isCollapsed", "onToggleCollapse", "isHidden"]);
    var categoryGroup = props.value;
    var categories = (0, react_1.useMemo)(function () {
        var _a, _b;
        return !categoryGroup || isCollapsed(categoryGroup.id)
            ? []
            : ((_b = (_a = categoryGroup.categories) === null || _a === void 0 ? void 0 : _a.filter(function (category) { return !category.hidden || showHiddenCategories; })) !== null && _b !== void 0 ? _b : []);
    }, [categoryGroup, isCollapsed, showHiddenCategories]);
    var shouldHideCategory = (0, react_1.useCallback)(function (category) {
        return !!(category.hidden || (categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden));
    }, [categoryGroup === null || categoryGroup === void 0 ? void 0 : categoryGroup.hidden]);
    if (!categoryGroup) {
        return null;
    }
    return (<react_aria_components_1.GridListItem textValue={categoryGroup.name} {...props}>
      <card_1.Card style={{
            marginTop: 4,
            marginBottom: 4,
        }}>
        <ExpenseGroupHeader categoryGroup={categoryGroup} month={month} showBudgetedColumn={showBudgetedColumn} show3Columns={show3Columns} onEditCategoryGroup={onEditCategoryGroup} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} isHidden={isHidden}/>

        <ExpenseCategoryList_1.ExpenseCategoryList categoryGroup={categoryGroup} categories={categories} month={month} onEditCategory={onEditCategory} onBudgetAction={onBudgetAction} shouldHideCategory={shouldHideCategory} show3Columns={show3Columns} showBudgetedColumn={showBudgetedColumn}/>
      </card_1.Card>
    </react_aria_components_1.GridListItem>);
}
function ExpenseGroupHeader(_a) {
    var categoryGroup = _a.categoryGroup, month = _a.month, onEditCategoryGroup = _a.onEditCategoryGroup, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse, isHidden = _a.isHidden;
    return (<view_1.View style={{
            height: BudgetTable_1.ROW_HEIGHT,
            borderBottomWidth: 1,
            borderColor: theme_1.theme.tableBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 5,
            paddingRight: 5,
            opacity: isHidden ? 0.5 : undefined,
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetHeaderCurrentMonth
                : theme_1.theme.budgetHeaderOtherMonth,
        }} data-testid="category-group-row">
      <ExpenseGroupName group={categoryGroup} onEditCategoryGroup={onEditCategoryGroup} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} show3Columns={show3Columns}/>
      <ExpenseGroupCells group={categoryGroup} show3Columns={show3Columns} showBudgetedColumn={showBudgetedColumn}/>
    </view_1.View>);
}
function ExpenseGroupName(_a) {
    var group = _a.group, onEditCategoryGroup = _a.onEditCategoryGroup, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse, show3Columns = _a.show3Columns;
    var sidebarColumnWidth = (0, BudgetTable_1.getColumnWidth)({
        show3Columns: show3Columns,
        isSidebar: true,
        offset: -3.5,
    });
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: sidebarColumnWidth,
        }}>
      {/* Hidden drag button */}
      <button_1.Button slot="drag" style={{
            opacity: 0,
            width: 1,
            height: 1,
            position: 'absolute',
            overflow: 'hidden',
        }}/>
      <button_1.Button variant="bare" className={(0, css_1.css)({
            flexShrink: 0,
            color: theme_1.theme.pageTextSubdued,
            '&[data-pressed]': {
                backgroundColor: 'transparent',
            },
            marginLeft: -5,
        })} onPress={function () { return onToggleCollapse(group.id); }}>
        <v0_1.SvgExpandArrow width={8} height={8} style={{
            flexShrink: 0,
            transition: 'transform .1s',
            transform: isCollapsed(group.id) ? 'rotate(-90deg)' : '',
        }}/>
      </button_1.Button>
      <button_1.Button variant="bare" style={{
            maxWidth: sidebarColumnWidth,
        }} onPress={function () { return onEditCategoryGroup(group.id); }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }}>
          <text_1.Text style={__assign(__assign(__assign(__assign({}, styles_1.styles.lineClamp(2)), { width: sidebarColumnWidth, textAlign: 'left' }), styles_1.styles.smallText), { fontWeight: '500' })} data-testid="category-group-name">
            {group.name}
          </text_1.Text>
          <v1_1.SvgCheveronRight style={{ flexShrink: 0, color: theme_1.theme.tableTextSubdued }} width={14} height={14}/>
        </view_1.View>
      </button_1.Button>
    </view_1.View>);
}
function ExpenseGroupCells(_a) {
    var group = _a.group, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var format = (0, useFormat_1.useFormat)();
    var columnWidth = (0, BudgetTable_1.getColumnWidth)({ show3Columns: show3Columns });
    var amountStyle = {
        width: columnWidth,
        fontSize: 12,
        fontWeight: '500',
        paddingLeft: 5,
        textAlign: 'right',
    };
    var budgeted = budgetType === 'tracking'
        ? bindings_1.trackingBudget.groupBudgeted(group.id)
        : bindings_1.envelopeBudget.groupBudgeted(group.id);
    var spent = budgetType === 'tracking'
        ? bindings_1.trackingBudget.groupSumAmount(group.id)
        : bindings_1.envelopeBudget.groupSumAmount(group.id);
    var balance = budgetType === 'tracking'
        ? bindings_1.trackingBudget.groupBalance(group.id)
        : bindings_1.envelopeBudget.groupBalance(group.id);
    return (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 5,
        }}>
      <view_1.View style={__assign({}, (!show3Columns && !showBudgetedColumn && { display: 'none' }))}>
        <CellValue_1.CellValue binding={budgeted} type="financial">
          {function (_a) {
            var type = _a.type, value = _a.value;
            return (<view_1.View>
              <PrivacyFilter_1.PrivacyFilter>
                <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={amountStyle}>
                  {format(value, type)}
                </auto_text_size_1.AutoTextSize>
              </PrivacyFilter_1.PrivacyFilter>
            </view_1.View>);
        }}
        </CellValue_1.CellValue>
      </view_1.View>
      <view_1.View style={__assign({}, (!show3Columns && showBudgetedColumn && { display: 'none' }))}>
        <CellValue_1.CellValue binding={spent} type="financial">
          {function (_a) {
            var type = _a.type, value = _a.value;
            return (<view_1.View>
              <PrivacyFilter_1.PrivacyFilter>
                <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={amountStyle}>
                  {format(value, type)}
                </auto_text_size_1.AutoTextSize>
              </PrivacyFilter_1.PrivacyFilter>
            </view_1.View>);
        }}
        </CellValue_1.CellValue>
      </view_1.View>
      <CellValue_1.CellValue binding={balance} type="financial">
        {function (_a) {
            var type = _a.type, value = _a.value;
            return (<view_1.View>
            <PrivacyFilter_1.PrivacyFilter>
              <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={amountStyle}>
                {format(value, type)}
              </auto_text_size_1.AutoTextSize>
            </PrivacyFilter_1.PrivacyFilter>
          </view_1.View>);
        }}
      </CellValue_1.CellValue>
    </view_1.View>);
}
