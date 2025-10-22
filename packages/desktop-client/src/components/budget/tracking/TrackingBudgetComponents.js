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
exports.IncomeCategoryMonth = exports.IncomeGroupMonth = exports.ExpenseCategoryMonth = exports.ExpenseGroupMonth = exports.BudgetSummary = exports.CategoryMonth = exports.GroupMonth = exports.BudgetTotalsMonth = exports.useTrackingSheetValue = void 0;
exports.IncomeHeaderMonth = IncomeHeaderMonth;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var monthUtils = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var BalanceMenu_1 = require("./BalanceMenu");
var BudgetMenu_1 = require("./BudgetMenu");
var BalanceWithCarryover_1 = require("@desktop-client/components/budget/BalanceWithCarryover");
var util_2 = require("@desktop-client/components/budget/util");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var table_1 = require("@desktop-client/components/table");
var useCategoryScheduleGoalTemplateIndicator_1 = require("@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
var useTrackingSheetValue = function (binding) {
    return (0, useSheetValue_1.useSheetValue)(binding);
};
exports.useTrackingSheetValue = useTrackingSheetValue;
var TrackingCellValue = function (props) {
    return <CellValue_1.CellValue {...props}/>;
};
var TrackingSheetCell = function (props) {
    return <table_1.SheetCell {...props}/>;
};
var headerLabelStyle = {
    flex: 1,
    padding: '0 5px',
    textAlign: 'right',
};
var cellStyle = {
    color: theme_1.theme.pageTextLight,
    fontWeight: 600,
};
exports.BudgetTotalsMonth = (0, react_1.memo)(function BudgetTotalsMonth() {
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            marginRight: styles_1.styles.monthRightPadding,
            paddingTop: 10,
            paddingBottom: 10,
        }}>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
        </text_1.Text>
        <TrackingCellValue binding={bindings_1.trackingBudget.totalBudgetedExpense} type="financial">
          {function (props) { return <CellValue_1.CellValueText {...props} style={cellStyle}/>; }}
        </TrackingCellValue>
      </view_1.View>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Spent</react_i18next_1.Trans>
        </text_1.Text>
        <TrackingCellValue binding={bindings_1.trackingBudget.totalSpent} type="financial">
          {function (props) { return <CellValue_1.CellValueText {...props} style={cellStyle}/>; }}
        </TrackingCellValue>
      </view_1.View>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Balance</react_i18next_1.Trans>
        </text_1.Text>
        <TrackingCellValue binding={bindings_1.trackingBudget.totalLeftover} type="financial">
          {function (props) { return <CellValue_1.CellValueText {...props} style={cellStyle}/>; }}
        </TrackingCellValue>
      </view_1.View>
    </view_1.View>);
});
function IncomeHeaderMonth() {
    return (<view_1.View style={{
            flexDirection: 'row',
            marginRight: styles_1.styles.monthRightPadding,
            paddingBottom: 5,
        }}>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Received</react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
    </view_1.View>);
}
exports.GroupMonth = (0, react_1.memo)(function GroupMonth(_a) {
    var month = _a.month, group = _a.group;
    var id = group.id;
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetHeaderCurrentMonth
                : theme_1.theme.budgetHeaderOtherMonth,
        }}>
      <TrackingSheetCell name="budgeted" width="flex" textAlign="right" style={__assign({ fontWeight: 600 }, styles_1.styles.tnum)} valueProps={{
            binding: bindings_1.trackingBudget.groupBudgeted(id),
            type: 'financial',
        }}/>
      <TrackingSheetCell name="spent" width="flex" textAlign="right" style={__assign({ fontWeight: 600 }, styles_1.styles.tnum)} valueProps={{
            binding: bindings_1.trackingBudget.groupSumAmount(id),
            type: 'financial',
        }}/>
      {!group.is_income && (<TrackingSheetCell name="balance" width="flex" textAlign="right" style={__assign({ fontWeight: 600, paddingRight: styles_1.styles.monthRightPadding }, styles_1.styles.tnum)} valueProps={{
                binding: bindings_1.trackingBudget.groupBalance(id),
                type: 'financial',
            }}/>)}
    </view_1.View>);
});
exports.CategoryMonth = (0, react_1.memo)(function CategoryMonth(_a) {
    var month = _a.month, category = _a.category, editing = _a.editing, onEdit = _a.onEdit, onBudgetAction = _a.onBudgetAction, onShowActivity = _a.onShowActivity;
    var _b = (0, react_1.useState)(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)(false), balanceMenuOpen = _c[0], setBalanceMenuOpen = _c[1];
    var triggerBalanceMenuRef = (0, react_1.useRef)(null);
    var onMenuAction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        onBudgetAction.apply(void 0, args);
        setBalanceMenuOpen(false);
        setMenuOpen(false);
    };
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var navigate = (0, useNavigate_1.useNavigate)();
    var _d = (0, useCategoryScheduleGoalTemplateIndicator_1.useCategoryScheduleGoalTemplateIndicator)({
        category: category,
        month: month,
    }), schedule = _d.schedule, scheduleStatus = _d.scheduleStatus, isScheduleRecurring = _d.isScheduleRecurring, description = _d.description;
    var showScheduleIndicator = schedule && scheduleStatus;
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetCurrentMonth
                : theme_1.theme.budgetOtherMonth,
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }}>
      <view_1.View style={{
            flex: 1,
            flexDirection: 'row',
        }}>
        {!editing && (<view_1.View style={{
                flexDirection: 'row',
                flexShrink: 0,
                paddingLeft: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme_1.theme.tableBorder,
            }}>
            <button_1.Button ref={triggerRef} variant="bare" onPress={function () { return setMenuOpen(true); }} style={{
                padding: 3,
            }}>
              <v1_1.SvgCheveronDown width={14} height={14} className="hover-visible" style={menuOpen && { opacity: 1 }}/>
            </button_1.Button>

            <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} placement="bottom start">
              <BudgetMenu_1.BudgetMenu onCopyLastMonthAverage={function () {
                onMenuAction(month, 'copy-single-last', {
                    category: category.id,
                });
                showUndoNotification({
                    message: "Budget set to last month\u2019s budget.",
                });
            }} onSetMonthsAverage={function (numberOfMonths) {
                if (numberOfMonths !== 3 &&
                    numberOfMonths !== 6 &&
                    numberOfMonths !== 12) {
                    return;
                }
                onMenuAction(month, "set-single-".concat(numberOfMonths, "-avg"), {
                    category: category.id,
                });
                showUndoNotification({
                    message: "Budget set to ".concat(numberOfMonths, "-month average."),
                });
            }} onApplyBudgetTemplate={function () {
                onMenuAction(month, 'apply-single-category-template', {
                    category: category.id,
                });
                showUndoNotification({
                    message: "Budget template applied.",
                });
            }}/>
            </popover_1.Popover>
          </view_1.View>)}
        <TrackingSheetCell name="budget" exposed={editing} focused={editing} width="flex" onExpose={function () { return onEdit(category.id, month); }} style={__assign(__assign({}, (editing && { zIndex: 100 })), styles_1.styles.tnum)} textAlign="right" valueStyle={{
            cursor: 'default',
            margin: 1,
            padding: '0 4px',
            borderRadius: 4,
            ':hover': {
                boxShadow: 'inset 0 0 0 1px ' + theme_1.theme.mobileAccountShadow,
                backgroundColor: theme_1.theme.tableBackground,
            },
        }} valueProps={{
            binding: bindings_1.trackingBudget.catBudgeted(category.id),
            type: 'financial',
            getValueStyle: util_2.makeAmountGrey,
            formatExpr: function (expr) {
                return (0, util_1.integerToCurrency)(expr);
            },
            unformatExpr: function (expr) {
                return (0, util_1.amountToInteger)((0, arithmetic_1.evalArithmetic)(expr, 0));
            },
        }} inputProps={{
            onBlur: function () {
                onEdit(null);
            },
            style: {
                backgroundColor: theme_1.theme.tableBackground,
            },
        }} onSave={function (amount) {
            onBudgetAction(month, 'budget-amount', {
                category: category.id,
                amount: amount,
            });
        }}/>
      </view_1.View>
      <table_1.Field name="spent" width="flex" style={{ textAlign: 'right' }}>
        <view_1.View data-testid="category-month-spent" onClick={function () { return onShowActivity(category.id, month); }} style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: showScheduleIndicator
                ? 'space-between'
                : 'flex-end',
            gap: 2,
        }}>
          {showScheduleIndicator && (<view_1.View title={description}>
              <button_1.Button variant="bare" style={{
                color: scheduleStatus === 'missed'
                    ? theme_1.theme.errorText
                    : scheduleStatus === 'due'
                        ? theme_1.theme.warningText
                        : theme_1.theme.upcomingText,
            }} onPress={function () {
                return schedule._account
                    ? navigate("/accounts/".concat(schedule._account))
                    : navigate('/accounts');
            }}>
                {isScheduleRecurring ? (<v2_1.SvgArrowsSynchronize style={{ width: 12, height: 12 }}/>) : (<v2_1.SvgCalendar3 style={{ width: 12, height: 12 }}/>)}
              </button_1.Button>
            </view_1.View>)}
          <TrackingCellValue binding={bindings_1.trackingBudget.catSumAmount(category.id)} type="financial">
            {function (props) { return (<CellValue_1.CellValueText {...props} className={(0, css_1.css)(__assign({ cursor: 'pointer', ':hover': {
                    textDecoration: 'underline',
                } }, (0, util_2.makeAmountGrey)(props.value)))}/>); }}
          </TrackingCellValue>
        </view_1.View>
      </table_1.Field>

      {!category.is_income && (<table_1.Field name="balance" width="flex" style={{ paddingRight: styles_1.styles.monthRightPadding, textAlign: 'right' }}>
          <span ref={triggerBalanceMenuRef} onClick={function () { return !category.is_income && setBalanceMenuOpen(true); }}>
            <BalanceWithCarryover_1.BalanceWithCarryover isDisabled={category.is_income} carryover={bindings_1.trackingBudget.catCarryover(category.id)} balance={bindings_1.trackingBudget.catBalance(category.id)} goal={bindings_1.trackingBudget.catGoal(category.id)} budgeted={bindings_1.trackingBudget.catBudgeted(category.id)} longGoal={bindings_1.trackingBudget.catLongGoal(category.id)}/>
          </span>

          <popover_1.Popover triggerRef={triggerBalanceMenuRef} isOpen={balanceMenuOpen} onOpenChange={function () { return setBalanceMenuOpen(false); }} placement="bottom end">
            <BalanceMenu_1.BalanceMenu categoryId={category.id} onCarryover={function (carryover) {
                onMenuAction(month, 'carryover', {
                    category: category.id,
                    flag: carryover,
                });
            }}/>
          </popover_1.Popover>
        </table_1.Field>)}
    </view_1.View>);
});
var BudgetSummary_1 = require("./budgetsummary/BudgetSummary");
Object.defineProperty(exports, "BudgetSummary", { enumerable: true, get: function () { return BudgetSummary_1.BudgetSummary; } });
exports.ExpenseGroupMonth = exports.GroupMonth;
exports.ExpenseCategoryMonth = exports.CategoryMonth;
exports.IncomeGroupMonth = exports.GroupMonth;
exports.IncomeCategoryMonth = exports.CategoryMonth;
