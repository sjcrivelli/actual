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
exports.BudgetSummary = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var monthUtils = require("loot-core/shared/months");
var BudgetMonthMenu_1 = require("./BudgetMonthMenu");
var ToBudget_1 = require("./ToBudget");
var TotalsList_1 = require("./TotalsList");
var EnvelopeBudgetContext_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetContext");
var NotesButton_1 = require("@desktop-client/components/NotesButton");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
exports.BudgetSummary = (0, react_1.memo)(function (_a) {
    var month = _a.month;
    var locale = (0, useLocale_1.useLocale)();
    var _b = (0, EnvelopeBudgetContext_1.useEnvelopeBudget)(), currentMonth = _b.currentMonth, collapsed = _b.summaryCollapsed, onBudgetAction = _b.onBudgetAction, onToggleSummaryCollapse = _b.onToggleSummaryCollapse;
    var _c = (0, react_1.useState)(false), menuOpen = _c[0], setMenuOpen = _c[1];
    var triggerRef = (0, react_1.useRef)(null);
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    function onMenuOpen() {
        setMenuOpen(true);
    }
    function onMenuClose() {
        setMenuOpen(false);
    }
    var prevMonthName = monthUtils.format(monthUtils.prevMonth(month), 'MMM', locale);
    var ExpandOrCollapseIcon = collapsed
        ? v2_1.SvgArrowButtonDown1
        : v2_1.SvgArrowButtonUp1;
    var displayMonth = monthUtils.format(month, 'MMMM ‘yy', locale);
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View data-testid="budget-summary" style={{
            backgroundColor: month === currentMonth
                ? theme_1.theme.budgetCurrentMonth
                : theme_1.theme.budgetOtherMonth,
            boxShadow: styles_1.styles.cardShadow,
            borderRadius: 6,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 5,
            flex: 1,
            cursor: 'default',
            marginBottom: 5,
            overflow: 'hidden',
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }}>
      <useSheetName_1.SheetNameProvider name={monthUtils.sheetForMonth(month)}>
        <view_1.View style={__assign({ padding: '0 13px' }, (collapsed ? { margin: '10px 0' } : { marginTop: 16 }))}>
          <view_1.View style={{
            position: 'absolute',
            left: 10,
            top: 0,
        }}>
            <button_1.Button variant="bare" aria-label={collapsed
            ? t('Expand month summary')
            : t('Collapse month summary')} className="hover-visible" onPress={onToggleSummaryCollapse}>
              <ExpandOrCollapseIcon width={13} height={13} 
    // The margin is to make it the exact same size as the dots button
    style={{ color: theme_1.theme.tableTextLight, margin: 1 }}/>
            </button_1.Button>
          </view_1.View>

          <div className={(0, css_1.css)([
            {
                textAlign: 'center',
                marginTop: 3,
                fontSize: 18,
                fontWeight: 500,
                textDecorationSkip: 'ink',
            },
            currentMonth === month && { fontWeight: 'bold' },
        ])}>
            {monthUtils.format(month, 'MMMM', locale)}
          </div>

          <view_1.View style={{
            position: 'absolute',
            right: 10,
            top: 0,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <view_1.View>
              <NotesButton_1.NotesButton id={"budget-".concat(month)} width={15} height={15} tooltipPosition="bottom right" defaultColor={theme_1.theme.tableTextLight}/>
            </view_1.View>
            <view_1.View style={{ userSelect: 'none', marginLeft: 2 }}>
              <button_1.Button ref={triggerRef} variant="bare" aria-label={t('Menu')} onPress={onMenuOpen}>
                <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ color: theme_1.theme.pageTextLight }}/>
              </button_1.Button>

              <popover_1.Popover triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={onMenuClose}>
                <BudgetMonthMenu_1.BudgetMonthMenu onCopyLastMonthBudget={function () {
            onBudgetAction(month, 'copy-last');
            onMenuClose();
            showUndoNotification({
                message: t('{{displayMonth}} budgets have all been set to last month’s budgeted amounts.', { displayMonth: displayMonth }),
            });
        }} onSetBudgetsToZero={function () {
            onBudgetAction(month, 'set-zero');
            onMenuClose();
            showUndoNotification({
                message: t('{{displayMonth}} budgets have all been set to zero.', { displayMonth: displayMonth }),
            });
        }} onSetMonthsAverage={function (numberOfMonths) {
            onBudgetAction(month, "set-".concat(numberOfMonths, "-avg"));
            onMenuClose();
            showUndoNotification({
                message: numberOfMonths === 12
                    ? t("".concat(displayMonth, " budgets have all been set to yearly average."))
                    : t("".concat(displayMonth, " budgets have all been set to ").concat(numberOfMonths, " month average.")),
            });
        }} onCheckTemplates={function () {
            onBudgetAction(month, 'check-templates');
            onMenuClose();
        }} onApplyBudgetTemplates={function () {
            onBudgetAction(month, 'apply-goal-template');
            onMenuClose();
            showUndoNotification({
                message: t('{{displayMonth}} budget templates have been applied.', { displayMonth: displayMonth }),
            });
        }} onOverwriteWithBudgetTemplates={function () {
            onBudgetAction(month, 'overwrite-goal-template');
            onMenuClose();
            showUndoNotification({
                message: t('{{displayMonth}} budget templates have been overwritten.', { displayMonth: displayMonth }),
            });
        }} onEndOfMonthCleanup={function () {
            onBudgetAction(month, 'cleanup-goal-template');
            onMenuClose();
            showUndoNotification({
                message: t('{{displayMonth}} end-of-month cleanup templates have been applied.', { displayMonth: displayMonth }),
            });
        }}/>
              </popover_1.Popover>
            </view_1.View>
          </view_1.View>
        </view_1.View>

        {collapsed ? (<view_1.View style={{
                alignItems: 'center',
                padding: '10px 20px',
                justifyContent: 'space-between',
                backgroundColor: theme_1.theme.tableBackground,
                borderTop: '1px solid ' + theme_1.theme.tableBorder,
            }}>
            <ToBudget_1.ToBudget prevMonthName={prevMonthName} month={month} onBudgetAction={onBudgetAction} isCollapsed/>
          </view_1.View>) : (<>
            <TotalsList_1.TotalsList prevMonthName={prevMonthName} style={{
                padding: '5px 0',
                marginTop: 17,
                backgroundColor: theme_1.theme.tableRowHeaderBackground,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: theme_1.theme.tableBorder,
            }}/>
            <view_1.View style={{ margin: '23px 0' }}>
              <ToBudget_1.ToBudget prevMonthName={prevMonthName} month={month} onBudgetAction={onBudgetAction}/>
            </view_1.View>
          </>)}
      </useSheetName_1.SheetNameProvider>
    </view_1.View>);
});
exports.BudgetSummary.displayName = 'EnvelopeBudgetSummary';
