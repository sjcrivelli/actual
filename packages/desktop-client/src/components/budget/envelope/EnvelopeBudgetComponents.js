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
exports.BudgetSummary = exports.ExpenseCategoryMonth = exports.ExpenseGroupMonth = exports.BudgetTotalsMonth = exports.EnvelopeCellValue = void 0;
exports.useEnvelopeSheetName = useEnvelopeSheetName;
exports.useEnvelopeSheetValue = useEnvelopeSheetValue;
exports.IncomeHeaderMonth = IncomeHeaderMonth;
exports.IncomeGroupMonth = IncomeGroupMonth;
exports.IncomeCategoryMonth = IncomeCategoryMonth;
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
var BalanceMovementMenu_1 = require("./BalanceMovementMenu");
var BudgetMenu_1 = require("./BudgetMenu");
var IncomeMenu_1 = require("./IncomeMenu");
var BalanceWithCarryover_1 = require("@desktop-client/components/budget/BalanceWithCarryover");
var util_2 = require("@desktop-client/components/budget/util");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var table_1 = require("@desktop-client/components/table");
var useCategoryScheduleGoalTemplateIndicator_1 = require("@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function useEnvelopeSheetName(binding) {
    return (0, useSheetName_1.useSheetName)(binding);
}
function useEnvelopeSheetValue(binding) {
    return (0, useSheetValue_1.useSheetValue)(binding);
}
var EnvelopeCellValue = function (props) {
    return <CellValue_1.CellValue {...props}/>;
};
exports.EnvelopeCellValue = EnvelopeCellValue;
var EnvelopeSheetCell = function (props) {
    return <table_1.SheetCell {...props}/>;
};
var headerLabelStyle = {
    flex: 1,
    padding: '0 5px',
    textAlign: 'right',
};
var cellStyle = {
    color: theme_1.theme.tableHeaderText,
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
        <text_1.Text style={{ color: theme_1.theme.tableHeaderText }}>
          <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
        </text_1.Text>
        <exports.EnvelopeCellValue binding={bindings_1.envelopeBudget.totalBudgeted} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} value={-props.value} style={cellStyle}/>); }}
        </exports.EnvelopeCellValue>
      </view_1.View>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.tableHeaderText }}>
          <react_i18next_1.Trans>Spent</react_i18next_1.Trans>
        </text_1.Text>
        <exports.EnvelopeCellValue binding={bindings_1.envelopeBudget.totalSpent} type="financial">
          {function (props) { return <CellValue_1.CellValueText {...props} style={cellStyle}/>; }}
        </exports.EnvelopeCellValue>
      </view_1.View>
      <view_1.View style={headerLabelStyle}>
        <text_1.Text style={{ color: theme_1.theme.tableHeaderText }}>
          <react_i18next_1.Trans>Balance</react_i18next_1.Trans>
        </text_1.Text>
        <exports.EnvelopeCellValue binding={bindings_1.envelopeBudget.totalBalance} type="financial">
          {function (props) { return <CellValue_1.CellValueText {...props} style={cellStyle}/>; }}
        </exports.EnvelopeCellValue>
      </view_1.View>
    </view_1.View>);
});
function IncomeHeaderMonth() {
    return (<table_1.Row style={{
            color: theme_1.theme.tableHeaderText,
            alignItems: 'center',
            paddingRight: 10,
        }}>
      <view_1.View style={{ flex: 1, textAlign: 'right' }}>
        <react_i18next_1.Trans>Received</react_i18next_1.Trans>
      </view_1.View>
    </table_1.Row>);
}
exports.ExpenseGroupMonth = (0, react_1.memo)(function ExpenseGroupMonth(_a) {
    var month = _a.month, group = _a.group;
    var id = group.id;
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetHeaderCurrentMonth
                : theme_1.theme.budgetHeaderOtherMonth,
        }}>
      <EnvelopeSheetCell name="budgeted" width="flex" textAlign="right" style={__assign({ fontWeight: 600 }, styles_1.styles.tnum)} valueProps={{
            binding: bindings_1.envelopeBudget.groupBudgeted(id),
            type: 'financial',
        }}/>
      <EnvelopeSheetCell name="spent" width="flex" textAlign="right" style={__assign({ fontWeight: 600 }, styles_1.styles.tnum)} valueProps={{
            binding: bindings_1.envelopeBudget.groupSumAmount(id),
            type: 'financial',
        }}/>
      <EnvelopeSheetCell name="balance" width="flex" textAlign="right" style={__assign({ fontWeight: 600, paddingRight: styles_1.styles.monthRightPadding }, styles_1.styles.tnum)} valueProps={{
            binding: bindings_1.envelopeBudget.groupBalance(id),
            type: 'financial',
        }}/>
    </view_1.View>);
});
exports.ExpenseCategoryMonth = (0, react_1.memo)(function ExpenseCategoryMonth(_a) {
    var month = _a.month, category = _a.category, editing = _a.editing, onEdit = _a.onEdit, onBudgetAction = _a.onBudgetAction, onShowActivity = _a.onShowActivity;
    var t = (0, react_i18next_1.useTranslation)().t;
    var budgetMenuTriggerRef = (0, react_1.useRef)(null);
    var balanceMenuTriggerRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setBudgetMenuOpen = _b.setMenuOpen, budgetMenuOpen = _b.menuOpen, handleBudgetContextMenu = _b.handleContextMenu, resetBudgetPosition = _b.resetPosition, budgetPosition = _b.position;
    var _c = (0, useContextMenu_1.useContextMenu)(), setBalanceMenuOpen = _c.setMenuOpen, balanceMenuOpen = _c.menuOpen, handleBalanceContextMenu = _c.handleContextMenu, resetBalancePosition = _c.resetPosition, balancePosition = _c.position;
    var onMenuAction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        onBudgetAction.apply(void 0, args);
        setBudgetMenuOpen(false);
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
      <view_1.View ref={budgetMenuTriggerRef} style={{
            flex: 1,
            flexDirection: 'row',
        }} onContextMenu={function (e) {
            if (editing)
                return;
            handleBudgetContextMenu(e);
        }}>
        {!editing && (<view_1.View style={{
                flexDirection: 'row',
                flexShrink: 1,
                paddingLeft: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme_1.theme.tableBorder,
            }}>
            <button_1.Button variant="bare" onPress={function () {
                resetBudgetPosition(2, -4);
                setBudgetMenuOpen(true);
            }} style={{
                padding: 3,
            }}>
              <v1_1.SvgCheveronDown width={14} height={14} className="hover-visible" style={budgetMenuOpen ? { opacity: 1 } : {}}/>
            </button_1.Button>

            <popover_1.Popover triggerRef={budgetMenuTriggerRef} placement="bottom left" isOpen={budgetMenuOpen} onOpenChange={function () { return setBudgetMenuOpen(false); }} style={{ width: 200 }} isNonModal {...budgetPosition}>
              <BudgetMenu_1.BudgetMenu onCopyLastMonthAverage={function () {
                onMenuAction(month, 'copy-single-last', {
                    category: category.id,
                });
                showUndoNotification({
                    message: t("Budget set to last month\u2018s budget."),
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
                    message: t('Budget set to {{numberOfMonths}}-month average.', { numberOfMonths: numberOfMonths }),
                });
            }} onApplyBudgetTemplate={function () {
                onMenuAction(month, 'apply-single-category-template', {
                    category: category.id,
                });
                showUndoNotification({
                    message: t("Budget template applied."),
                });
            }}/>
            </popover_1.Popover>
          </view_1.View>)}
        <EnvelopeSheetCell name="budget" exposed={editing} focused={editing} width="flex" onExpose={function () { return onEdit(category.id, month); }} style={__assign(__assign({}, (editing && { zIndex: 100 })), styles_1.styles.tnum)} textAlign="right" valueStyle={{
            cursor: 'default',
            margin: 1,
            padding: '0 4px',
            borderRadius: 4,
            ':hover': {
                boxShadow: 'inset 0 0 0 1px ' + theme_1.theme.mobileAccountShadow,
                backgroundColor: theme_1.theme.tableBackground,
            },
        }} valueProps={{
            binding: bindings_1.envelopeBudget.catBudgeted(category.id),
            type: 'financial',
            getValueStyle: util_2.makeAmountGrey,
            formatExpr: function (expr) {
                return (0, util_1.integerToCurrency)(expr);
            },
            unformatExpr: function (expr) {
                var _a;
                return (0, util_1.amountToInteger)((_a = (0, arithmetic_1.evalArithmetic)(expr, 0)) !== null && _a !== void 0 ? _a : 0);
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
          <exports.EnvelopeCellValue binding={bindings_1.envelopeBudget.catSumAmount(category.id)} type="financial">
            {function (props) { return (<CellValue_1.CellValueText {...props} className={(0, css_1.css)(__assign({ cursor: 'pointer', ':hover': { textDecoration: 'underline' } }, (0, util_2.makeAmountGrey)(props.value)))}/>); }}
          </exports.EnvelopeCellValue>
        </view_1.View>
      </table_1.Field>
      <table_1.Field ref={balanceMenuTriggerRef} name="balance" width="flex" style={{ paddingRight: styles_1.styles.monthRightPadding, textAlign: 'right' }}>
        <span onClick={function () {
            resetBalancePosition(-6, -4);
            setBalanceMenuOpen(true);
        }} onContextMenu={function (e) {
            handleBalanceContextMenu(e);
            // We need to calculate differently from the hook due to being aligned to the right
            var rect = e.currentTarget.getBoundingClientRect();
            resetBalancePosition(e.clientX - rect.right + 200 - 8, e.clientY - rect.bottom - 8);
        }}>
          <BalanceWithCarryover_1.BalanceWithCarryover carryover={bindings_1.envelopeBudget.catCarryover(category.id)} balance={bindings_1.envelopeBudget.catBalance(category.id)} goal={bindings_1.envelopeBudget.catGoal(category.id)} budgeted={bindings_1.envelopeBudget.catBudgeted(category.id)} longGoal={bindings_1.envelopeBudget.catLongGoal(category.id)} tooltipDisabled={balanceMenuOpen}/>
        </span>

        <popover_1.Popover triggerRef={balanceMenuTriggerRef} placement="bottom end" isOpen={balanceMenuOpen} onOpenChange={function () { return setBalanceMenuOpen(false); }} style={{ margin: 1 }} isNonModal {...balancePosition}>
          <BalanceMovementMenu_1.BalanceMovementMenu categoryId={category.id} month={month} onBudgetAction={onBudgetAction} onClose={function () { return setBalanceMenuOpen(false); }}/>
        </popover_1.Popover>
      </table_1.Field>
    </view_1.View>);
});
function IncomeGroupMonth(_a) {
    var month = _a.month;
    return (<view_1.View style={{ flex: 1 }}>
      <EnvelopeSheetCell name="received" width="flex" textAlign="right" style={__assign(__assign({ fontWeight: 600, paddingRight: styles_1.styles.monthRightPadding }, styles_1.styles.tnum), { backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetHeaderCurrentMonth
                : theme_1.theme.budgetHeaderOtherMonth })} valueProps={{
            binding: bindings_1.envelopeBudget.groupIncomeReceived,
            type: 'financial',
        }}/>
    </view_1.View>);
}
function IncomeCategoryMonth(_a) {
    var category = _a.category, isLast = _a.isLast, month = _a.month, onShowActivity = _a.onShowActivity, onBudgetAction = _a.onBudgetAction;
    var incomeMenuTriggerRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setIncomeMenuOpen = _b.setMenuOpen, incomeMenuOpen = _b.menuOpen, handleIncomeContextMenu = _b.handleContextMenu, resetIncomePosition = _b.resetPosition, incomePosition = _b.position;
    return (<view_1.View style={{ flex: 1 }}>
      <table_1.Field name="received" width="flex" truncate={false} ref={incomeMenuTriggerRef} style={__assign(__assign({ textAlign: 'right' }, (isLast && { borderBottomWidth: 0 })), { backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme_1.theme.budgetCurrentMonth
                : theme_1.theme.budgetOtherMonth })}>
        <view_1.View name="received" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
        }}>
          <span onClick={function () {
            resetIncomePosition(-6, -4);
            setIncomeMenuOpen(true);
        }} onContextMenu={function (e) {
            handleIncomeContextMenu(e);
            // We need to calculate differently from the hook due to being aligned to the right
            var rect = e.currentTarget.getBoundingClientRect();
            resetIncomePosition(e.clientX - rect.right + 200 - 8, e.clientY - rect.bottom - 8);
        }} style={{ paddingRight: styles_1.styles.monthRightPadding }}>
            <BalanceWithCarryover_1.BalanceWithCarryover carryover={bindings_1.envelopeBudget.catCarryover(category.id)} balance={bindings_1.envelopeBudget.catSumAmount(category.id)} goal={bindings_1.envelopeBudget.catGoal(category.id)} budgeted={bindings_1.envelopeBudget.catBudgeted(category.id)} longGoal={bindings_1.envelopeBudget.catLongGoal(category.id)}/>
          </span>
          <popover_1.Popover triggerRef={incomeMenuTriggerRef} placement="bottom end" isOpen={incomeMenuOpen} onOpenChange={function () { return setIncomeMenuOpen(false); }} style={{ margin: 1 }} isNonModal {...incomePosition}>
            <IncomeMenu_1.IncomeMenu categoryId={category.id} month={month} onBudgetAction={onBudgetAction} onShowActivity={onShowActivity} onClose={function () { return setIncomeMenuOpen(false); }}/>
          </popover_1.Popover>
        </view_1.View>
      </table_1.Field>
    </view_1.View>);
}
var BudgetSummary_1 = require("./budgetsummary/BudgetSummary");
Object.defineProperty(exports, "BudgetSummary", { enumerable: true, get: function () { return BudgetSummary_1.BudgetSummary; } });
