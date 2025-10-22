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
exports.IncomeCategoryListItem = IncomeCategoryListItem;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var BalanceCell_1 = require("./BalanceCell");
var BudgetCell_1 = require("./BudgetCell");
var BudgetTable_1 = require("./BudgetTable");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function IncomeCategoryName(_a) {
    var category = _a.category, onEdit = _a.onEdit;
    var sidebarColumnWidth = (0, BudgetTable_1.getColumnWidth)({
        isSidebar: true,
        offset: -10,
    });
    return (<view_1.View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
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
      <button_1.Button variant="bare" style={{
            maxWidth: sidebarColumnWidth,
        }} onPress={function () { return onEdit === null || onEdit === void 0 ? void 0 : onEdit(category.id); }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }}>
          <text_1.Text style={__assign(__assign(__assign({}, styles_1.styles.lineClamp(2)), { width: sidebarColumnWidth, textAlign: 'left' }), styles_1.styles.smallText)} data-testid="category-name">
            {category.name}
          </text_1.Text>
          <v1_1.SvgCheveronRight style={{ flexShrink: 0, color: theme_1.theme.tableTextSubdued }} width={14} height={14}/>
        </view_1.View>
      </button_1.Button>
    </view_1.View>);
}
function IncomeCategoryCells(_a) {
    var category = _a.category, month = _a.month, onBudgetAction = _a.onBudgetAction, onPress = _a.onPress;
    var t = (0, react_i18next_1.useTranslation)().t;
    var columnWidth = (0, BudgetTable_1.getColumnWidth)();
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var budgeted = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catBudgeted(category.id)
        : bindings_1.envelopeBudget.catBudgeted(category.id);
    var balance = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catSumAmount(category.id)
        : bindings_1.envelopeBudget.catSumAmount(category.id);
    return (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
      {budgetType === 'tracking' && (<view_1.View style={{
                width: columnWidth,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}>
          <BudgetCell_1.BudgetCell binding={budgeted} type="financial" category={category} month={month} onBudgetAction={onBudgetAction}/>
        </view_1.View>)}

      <view_1.View style={{
            width: columnWidth,
            justifyContent: 'center',
            alignItems: 'flex-end',
        }}>
        <BalanceCell_1.BalanceCell binding={balance} category={category} onPress={onPress} aria-label={budgetType === 'envelope'
            ? t('Open balance menu for {{categoryName}} category', {
                categoryName: category.name,
            })
            : t('Show transactions for {{categoryName}} category', {
                categoryName: category.name,
            })}/>
      </view_1.View>
    </view_1.View>);
}
function IncomeCategoryListItem(_a) {
    var month = _a.month, onEdit = _a.onEdit, onBudgetAction = _a.onBudgetAction, props = __rest(_a, ["month", "onEdit", "onBudgetAction"]);
    var category = props.value;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var balanceMenuModalName = "envelope-income-balance-menu";
    var onShowActivity = (0, react_1.useCallback)(function () {
        if (!category) {
            return null;
        }
        navigate("/categories/".concat(category.id, "?month=").concat(month));
    }, [category, month, navigate]);
    var onCarryover = (0, react_1.useCallback)(function (carryover) {
        if (!category) {
            return;
        }
        onBudgetAction(month, 'carryover', {
            category: category.id,
            flag: carryover,
        });
        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: balanceMenuModalName }));
    }, [category, onBudgetAction, month, dispatch, balanceMenuModalName]);
    var onOpenBalanceMenu = (0, react_1.useCallback)(function () {
        if (!category) {
            return;
        }
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: balanceMenuModalName,
                options: {
                    month: month,
                    categoryId: category.id,
                    onCarryover: onCarryover,
                    onShowActivity: onShowActivity,
                },
            },
        }));
    }, [
        category,
        balanceMenuModalName,
        dispatch,
        month,
        onShowActivity,
        onCarryover,
    ]);
    if (!category) {
        return null;
    }
    return (<react_aria_components_1.GridListItem textValue={category.name} data-testid="category-row" {...props}>
      <view_1.View style={{
            height: BudgetTable_1.ROW_HEIGHT,
            borderColor: theme_1.theme.tableBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 5,
            paddingRight: 5,
            borderBottomWidth: 1,
            opacity: !!category.hidden ? 0.5 : undefined,
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetCurrentMonth
                : theme_1.theme.budgetOtherMonth,
        }}>
        <IncomeCategoryName category={category} onEdit={onEdit}/>
        <IncomeCategoryCells key={"".concat(category.id)} category={category} month={month} onBudgetAction={onBudgetAction} onPress={budgetType === 'envelope' ? onOpenBalanceMenu : onShowActivity}/>
      </view_1.View>
    </react_aria_components_1.GridListItem>);
}
