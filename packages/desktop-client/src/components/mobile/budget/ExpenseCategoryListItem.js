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
exports.ExpenseCategoryListItem = ExpenseCategoryListItem;
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
var util_1 = require("loot-core/shared/util");
var BalanceCell_1 = require("./BalanceCell");
var BudgetCell_1 = require("./BudgetCell");
var BudgetTable_1 = require("./BudgetTable");
var SpentCell_1 = require("./SpentCell");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ExpenseCategoryName(_a) {
    var category = _a.category, onEditCategory = _a.onEditCategory, show3Columns = _a.show3Columns;
    var sidebarColumnWidth = (0, BudgetTable_1.getColumnWidth)({
        show3Columns: show3Columns,
        isSidebar: true,
    });
    return (<view_1.View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
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
        }} onPress={function () { return onEditCategory === null || onEditCategory === void 0 ? void 0 : onEditCategory(category.id); }}>
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
function ExpenseCategoryCells(_a) {
    var category = _a.category, month = _a.month, onBudgetAction = _a.onBudgetAction, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn, onOpenBalanceMenu = _a.onOpenBalanceMenu, onShowActivity = _a.onShowActivity;
    var t = (0, react_i18next_1.useTranslation)().t;
    var columnWidth = (0, BudgetTable_1.getColumnWidth)({
        show3Columns: show3Columns,
        isSidebar: false,
    });
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var budgeted = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catBudgeted(category.id)
        : bindings_1.envelopeBudget.catBudgeted(category.id);
    var spent = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catSumAmount(category.id)
        : bindings_1.envelopeBudget.catSumAmount(category.id);
    var balance = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catBalance(category.id)
        : bindings_1.envelopeBudget.catBalance(category.id);
    return (<view_1.View style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
        }}>
      <view_1.View style={__assign(__assign({}, (!show3Columns && !showBudgetedColumn && { display: 'none' })), { width: columnWidth, justifyContent: 'center', alignItems: 'flex-end' })}>
        <BudgetCell_1.BudgetCell binding={budgeted} type="financial" category={category} month={month} onBudgetAction={onBudgetAction}/>
      </view_1.View>
      <view_1.View style={__assign(__assign({}, (!show3Columns && showBudgetedColumn && { display: 'none' })), { width: columnWidth, justifyContent: 'center', alignItems: 'flex-end' })}>
        <SpentCell_1.SpentCell binding={spent} category={category} month={month} show3Columns={show3Columns} onPress={onShowActivity}/>
      </view_1.View>
      <view_1.View style={{
            width: columnWidth,
            justifyContent: 'center',
            alignItems: 'flex-end',
        }}>
        <BalanceCell_1.BalanceCell binding={balance} category={category} show3Columns={show3Columns} onPress={onOpenBalanceMenu} aria-label={t('Open balance menu for {{categoryName}} category', {
            categoryName: category.name,
        })}/>
      </view_1.View>
    </view_1.View>);
}
function ExpenseCategoryListItem(_a) {
    var month = _a.month, isHidden = _a.isHidden, onEditCategory = _a.onEditCategory, onBudgetAction = _a.onBudgetAction, show3Columns = _a.show3Columns, showBudgetedColumn = _a.showBudgetedColumn, props = __rest(_a, ["month", "isHidden", "onEditCategory", "onBudgetAction", "show3Columns", "showBudgetedColumn"]);
    var category = props.value;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var balanceMenuModalName = "".concat(budgetType, "-balance-menu");
    var dispatch = (0, redux_1.useDispatch)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var categories = (0, useCategories_1.useCategories)().list;
    var categoriesById = (0, util_1.groupById)(categories);
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
    var catBalance = (0, useSheetValue_1.useSheetValue)(budgetType === 'envelope'
        ? bindings_1.envelopeBudget.catBalance(category === null || category === void 0 ? void 0 : category.id)
        : bindings_1.trackingBudget.catBalance(category === null || category === void 0 ? void 0 : category.id));
    var onTransfer = (0, react_1.useCallback)(function () {
        if (!category) {
            return;
        }
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'transfer',
                options: {
                    title: category.name,
                    categoryId: category.id,
                    month: month,
                    amount: catBalance || 0,
                    onSubmit: function (amount, toCategoryId) {
                        onBudgetAction(month, 'transfer-category', {
                            amount: amount,
                            from: category.id,
                            to: toCategoryId,
                        });
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: balanceMenuModalName }));
                        showUndoNotification({
                            message: "Transferred ".concat((0, util_1.integerToCurrency)(amount), " from ").concat(category.name, " to ").concat(categoriesById[toCategoryId].name, "."),
                        });
                    },
                    showToBeBudgeted: true,
                },
            },
        }));
    }, [
        category,
        dispatch,
        month,
        catBalance,
        onBudgetAction,
        balanceMenuModalName,
        showUndoNotification,
        categoriesById,
    ]);
    var onCover = (0, react_1.useCallback)(function () {
        if (!category) {
            return;
        }
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: 'cover',
                options: {
                    title: category.name,
                    month: month,
                    categoryId: category.id,
                    onSubmit: function (fromCategoryId) {
                        onBudgetAction(month, 'cover-overspending', {
                            to: category.id,
                            from: fromCategoryId,
                        });
                        dispatch((0, modalsSlice_1.collapseModals)({ rootModalName: balanceMenuModalName }));
                        showUndoNotification({
                            message: t("Covered {{toCategoryName}} overspending from {{fromCategoryName}}.", {
                                toCategoryName: category.name,
                                fromCategoryName: categoriesById[fromCategoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    }, [
        category,
        dispatch,
        month,
        onBudgetAction,
        balanceMenuModalName,
        showUndoNotification,
        t,
        categoriesById,
    ]);
    var onOpenBalanceMenu = (0, react_1.useCallback)(function () {
        if (!category) {
            return;
        }
        if (balanceMenuModalName === 'envelope-balance-menu') {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: balanceMenuModalName,
                    options: {
                        month: month,
                        categoryId: category.id,
                        onCarryover: onCarryover,
                        onTransfer: onTransfer,
                        onCover: onCover,
                    },
                },
            }));
        }
        else {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: balanceMenuModalName,
                    options: {
                        month: month,
                        categoryId: category.id,
                        onCarryover: onCarryover,
                    },
                },
            }));
        }
    }, [
        category,
        balanceMenuModalName,
        dispatch,
        month,
        onCarryover,
        onTransfer,
        onCover,
    ]);
    var navigate = (0, useNavigate_1.useNavigate)();
    var onShowActivity = (0, react_1.useCallback)(function () {
        if (!category) {
            return;
        }
        navigate("/categories/".concat(category.id, "?month=").concat(month));
    }, [category, month, navigate]);
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
            opacity: isHidden ? 0.5 : undefined,
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetCurrentMonth
                : theme_1.theme.budgetOtherMonth,
        }}>
        <ExpenseCategoryName category={category} onEditCategory={onEditCategory} show3Columns={show3Columns}/>
        <ExpenseCategoryCells key={"".concat(category.id, "-").concat(show3Columns, "-").concat(showBudgetedColumn)} category={category} month={month} onBudgetAction={onBudgetAction} show3Columns={show3Columns} showBudgetedColumn={showBudgetedColumn} onOpenBalanceMenu={onOpenBalanceMenu} onShowActivity={onShowActivity}/>
      </view_1.View>
    </react_aria_components_1.GridListItem>);
}
