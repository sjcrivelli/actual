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
exports.IncomeGroup = IncomeGroup;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var card_1 = require("@actual-app/components/card");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var label_1 = require("@actual-app/components/label");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var auto_text_size_1 = require("auto-text-size");
var monthUtils = require("loot-core/shared/months");
var BudgetTable_1 = require("./BudgetTable");
var IncomeCategoryList_1 = require("./IncomeCategoryList");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function IncomeGroup(_a) {
    var categoryGroup = _a.categoryGroup, month = _a.month, showHiddenCategories = _a.showHiddenCategories, onEditCategoryGroup = _a.onEditCategoryGroup, onEditCategory = _a.onEditCategory, onBudgetAction = _a.onBudgetAction, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse;
    var t = (0, react_i18next_1.useTranslation)().t;
    var columnWidth = (0, BudgetTable_1.getColumnWidth)();
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var categories = (0, react_1.useMemo)(function () {
        var _a, _b;
        return isCollapsed(categoryGroup.id)
            ? []
            : ((_b = (_a = categoryGroup.categories) === null || _a === void 0 ? void 0 : _a.filter(function (category) { return !category.hidden || showHiddenCategories; })) !== null && _b !== void 0 ? _b : []);
    }, [
        categoryGroup.categories,
        categoryGroup.id,
        isCollapsed,
        showHiddenCategories,
    ]);
    return (<view_1.View>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 50,
            marginBottom: 5,
            marginRight: 15,
        }}>
        {budgetType === 'tracking' && (<label_1.Label title={t('Budgeted')} style={{ width: columnWidth }}/>)}
        <label_1.Label title={t('Received')} style={{ width: columnWidth }}/>
      </view_1.View>

      <card_1.Card style={{ marginTop: 0 }}>
        <IncomeGroupHeader group={categoryGroup} month={month} onEdit={onEditCategoryGroup} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}/>
        <IncomeCategoryList_1.IncomeCategoryList categories={categories} month={month} onEditCategory={onEditCategory} onBudgetAction={onBudgetAction}/>
      </card_1.Card>
    </view_1.View>);
}
function IncomeGroupHeader(_a) {
    var group = _a.group, month = _a.month, onEdit = _a.onEdit, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse, style = _a.style;
    return (<view_1.View style={__assign({ height: BudgetTable_1.ROW_HEIGHT, borderBottomWidth: 1, borderColor: theme_1.theme.tableBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 5, paddingRight: 5, opacity: !!group.hidden ? 0.5 : undefined, backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetHeaderCurrentMonth
                : theme_1.theme.budgetHeaderOtherMonth }, style)} data-testid="category-group-row">
      <IncomeGroupName group={group} onEdit={onEdit} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}/>
      <IncomeGroupCells group={group}/>
    </view_1.View>);
}
function IncomeGroupName(_a) {
    var group = _a.group, onEdit = _a.onEdit, isCollapsed = _a.isCollapsed, onToggleCollapse = _a.onToggleCollapse;
    var sidebarColumnWidth = (0, BudgetTable_1.getColumnWidth)({
        isSidebar: true,
        offset: -13.5,
    });
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: sidebarColumnWidth,
        }}>
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
        }} onPress={function () { return onEdit(group.id); }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }}>
          <text_1.Text style={__assign(__assign(__assign({}, styles_1.styles.lineClamp(2)), { width: sidebarColumnWidth, textAlign: 'left' }), styles_1.styles.smallText)} data-testid="category-group-name">
            {group.name}
          </text_1.Text>
          <v1_1.SvgCheveronRight style={{ flexShrink: 0, color: theme_1.theme.tableTextSubdued }} width={14} height={14}/>
        </view_1.View>
      </button_1.Button>
    </view_1.View>);
}
function IncomeGroupCells(_a) {
    var group = _a.group;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var format = (0, useFormat_1.useFormat)();
    var budgeted = budgetType === 'tracking' ? bindings_1.trackingBudget.groupBudgeted(group.id) : null;
    var balance = budgetType === 'tracking'
        ? bindings_1.trackingBudget.groupSumAmount(group.id)
        : bindings_1.envelopeBudget.groupSumAmount(group.id);
    var columnWidth = (0, BudgetTable_1.getColumnWidth)();
    return (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 5,
        }}>
      {budgeted && (<CellValue_1.CellValue binding={budgeted} type="financial">
          {function (_a) {
                var type = _a.type, value = _a.value;
                return (<view_1.View>
              <PrivacyFilter_1.PrivacyFilter>
                <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={{
                        width: columnWidth,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingLeft: 5,
                        textAlign: 'right',
                        fontSize: 12,
                        fontWeight: '500',
                    }}>
                  {format(value, type)}
                </auto_text_size_1.AutoTextSize>
              </PrivacyFilter_1.PrivacyFilter>
            </view_1.View>);
            }}
        </CellValue_1.CellValue>)}
      <CellValue_1.CellValue binding={balance} type="financial">
        {function (_a) {
            var type = _a.type, value = _a.value;
            return (<view_1.View>
            <PrivacyFilter_1.PrivacyFilter>
              <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={{
                    width: columnWidth,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingLeft: 5,
                    textAlign: 'right',
                    fontSize: 12,
                    fontWeight: '500',
                }}>
                {format(value, type)}
              </auto_text_size_1.AutoTextSize>
            </PrivacyFilter_1.PrivacyFilter>
          </view_1.View>);
        }}
      </CellValue_1.CellValue>
    </view_1.View>);
}
