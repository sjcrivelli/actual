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
exports.BudgetCell = BudgetCell;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var auto_text_size_1 = require("auto-text-size");
var util_1 = require("loot-core/shared/util");
var BudgetTable_1 = require("./BudgetTable");
var util_2 = require("@desktop-client/components/budget/util");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function BudgetCell(_a) {
    var binding = _a.binding, category = _a.category, month = _a.month, onBudgetAction = _a.onBudgetAction, style = _a.style, children = _a.children, props = __rest(_a, ["binding", "category", "month", "onBudgetAction", "style", "children"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var columnWidth = (0, BudgetTable_1.getColumnWidth)();
    var dispatch = (0, redux_1.useDispatch)();
    var format = (0, useFormat_1.useFormat)();
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var categoryNotes = (0, useNotes_1.useNotes)(category.id);
    var onOpenCategoryBudgetMenu = (0, react_1.useCallback)(function () {
        var modalBudgetType = budgetType === 'envelope' ? 'envelope' : 'tracking';
        var categoryBudgetMenuModal = "".concat(modalBudgetType, "-budget-menu");
        dispatch((0, modalsSlice_1.pushModal)({
            modal: {
                name: categoryBudgetMenuModal,
                options: {
                    categoryId: category.id,
                    month: month,
                    onUpdateBudget: function (amount) {
                        onBudgetAction(month, 'budget-amount', {
                            category: category.id,
                            amount: amount,
                        });
                        showUndoNotification({
                            message: "".concat(category.name, " budget has been updated to ").concat((0, util_1.integerToCurrency)(amount), "."),
                        });
                    },
                    onCopyLastMonthAverage: function () {
                        onBudgetAction(month, 'copy-single-last', {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: "".concat(category.name, " budget has been set last to month\u2019s budgeted amount."),
                        });
                    },
                    onSetMonthsAverage: function (numberOfMonths) {
                        if (numberOfMonths !== 3 &&
                            numberOfMonths !== 6 &&
                            numberOfMonths !== 12) {
                            return;
                        }
                        onBudgetAction(month, "set-single-".concat(numberOfMonths, "-avg"), {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: "".concat(category.name, " budget has been set to ").concat(numberOfMonths === 12 ? 'yearly' : "".concat(numberOfMonths, " month"), " average."),
                        });
                    },
                    onApplyBudgetTemplate: function () {
                        onBudgetAction(month, 'apply-single-category-template', {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: "".concat(category.name, " budget templates have been applied."),
                            pre: categoryNotes !== null && categoryNotes !== void 0 ? categoryNotes : undefined,
                        });
                    },
                },
            },
        }));
    }, [
        budgetType,
        category.id,
        category.name,
        categoryNotes,
        dispatch,
        month,
        onBudgetAction,
        showUndoNotification,
    ]);
    return (<CellValue_1.CellValue binding={binding} type="financial" aria-label={t('Budgeted amount for {{categoryName}} category', {
            categoryName: category.name,
        })} {...props}>
      {function (_a) {
            var type = _a.type, name = _a.name, value = _a.value;
            return (children === null || children === void 0 ? void 0 : children({
                type: type,
                name: name,
                value: value,
            })) || (<button_1.Button variant="bare" style={__assign(__assign(__assign({}, BudgetTable_1.PILL_STYLE), { maxWidth: columnWidth }), (0, util_2.makeAmountGrey)(value))} onPress={onOpenCategoryBudgetMenu} aria-label={t('Open budget menu for {{categoryName}} category', {
                    categoryName: category.name,
                })}>
            <PrivacyFilter_1.PrivacyFilter>
              <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" style={{
                    maxWidth: columnWidth,
                    textAlign: 'right',
                    fontSize: 12,
                }}>
                {format(value, type)}
              </auto_text_size_1.AutoTextSize>
            </PrivacyFilter_1.PrivacyFilter>
          </button_1.Button>);
        }}
    </CellValue_1.CellValue>);
}
