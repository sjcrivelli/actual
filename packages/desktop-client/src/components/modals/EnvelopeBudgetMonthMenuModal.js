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
exports.EnvelopeBudgetMonthMenuModal = EnvelopeBudgetMonthMenuModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var monthUtils = require("loot-core/shared/months");
var BudgetMonthMenu_1 = require("@desktop-client/components/budget/envelope/budgetsummary/BudgetMonthMenu");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Notes_1 = require("@desktop-client/components/Notes");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var useUndo_1 = require("@desktop-client/hooks/useUndo");
function EnvelopeBudgetMonthMenuModal(_a) {
    var month = _a.month, onBudgetAction = _a.onBudgetAction, onEditNotes = _a.onEditNotes;
    var locale = (0, useLocale_1.useLocale)();
    var originalNotes = (0, useNotes_1.useNotes)("budget-".concat(month));
    var showUndoNotification = (0, useUndo_1.useUndo)().showUndoNotification;
    var _onEditNotes = function () {
        onEditNotes === null || onEditNotes === void 0 ? void 0 : onEditNotes(month);
    };
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    var buttonStyle = __assign(__assign({}, styles_1.styles.mediumText), { height: styles_1.styles.mobileMinHeight, color: theme_1.theme.formLabelText, 
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%' });
    var _b = (0, react_1.useState)(false), showMore = _b[0], setShowMore = _b[1];
    var onShowMore = function () {
        setShowMore(!showMore);
    };
    var displayMonth = monthUtils.format(month, 'MMMM ‘yy', locale);
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Modal_1.Modal name="envelope-budget-month-menu" containerProps={{
            style: { height: '50vh' },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={displayMonth} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
            <view_1.View style={{
                    display: showMore ? 'none' : undefined,
                    overflowY: 'auto',
                    flex: 1,
                }}>
              <Notes_1.Notes notes={(originalNotes === null || originalNotes === void 0 ? void 0 : originalNotes.length) > 0 ? originalNotes : t('No notes')} editable={false} focused={false} getStyle={function () { return (__assign({ borderRadius: 6 }, ((!originalNotes || originalNotes.length === 0) && {
                    justifySelf: 'center',
                    alignSelf: 'center',
                    color: theme_1.theme.pageTextSubdued,
                }))); }}/>
            </view_1.View>
            <view_1.View style={{ paddingTop: 10, gap: 5 }}>
              <view_1.View style={{
                    display: showMore ? 'none' : undefined,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignContent: 'space-between',
                }}>
                <button_1.Button style={buttonStyle} onPress={_onEditNotes}>
                  <v2_1.SvgNotesPaper width={20} height={20} style={{ paddingRight: 5 }}/>
                  <react_i18next_1.Trans>Edit notes</react_i18next_1.Trans>
                </button_1.Button>
              </view_1.View>
              <view_1.View>
                <button_1.Button variant="bare" className={(0, css_1.css)([
                    buttonStyle,
                    {
                        '&[data-pressed], &[data-hovered]': {
                            backgroundColor: 'transparent',
                            color: buttonStyle.color,
                        },
                    },
                ])} onPress={onShowMore}>
                  {!showMore ? (<v1_1.SvgCheveronUp width={30} height={30} style={{ paddingRight: 5 }}/>) : (<v1_1.SvgCheveronDown width={30} height={30} style={{ paddingRight: 5 }}/>)}
                  <react_i18next_1.Trans>Actions</react_i18next_1.Trans>
                </button_1.Button>
              </view_1.View>
            </view_1.View>
            {showMore && (<BudgetMonthMenu_1.BudgetMonthMenu style={{ overflowY: 'auto', paddingTop: 10 }} getItemStyle={function () { return defaultMenuItemStyle; }} onCopyLastMonthBudget={function () {
                        onBudgetAction(month, 'copy-last');
                        close();
                        showUndoNotification({
                            message: t('{{displayMonth}} budgets have all been set to last month’s budgeted amounts.', { displayMonth: displayMonth }),
                        });
                    }} onSetBudgetsToZero={function () {
                        onBudgetAction(month, 'set-zero');
                        close();
                        showUndoNotification({
                            message: t('{{displayMonth}} budgets have all been set to zero.', { displayMonth: displayMonth }),
                        });
                    }} onSetMonthsAverage={function (numberOfMonths) {
                        onBudgetAction(month, "set-".concat(numberOfMonths, "-avg"));
                        close();
                        showUndoNotification({
                            message: "".concat(displayMonth, " budgets have all been set to ").concat(numberOfMonths === 12 ? 'yearly' : "".concat(numberOfMonths, " month"), " average."),
                        });
                    }} onCheckTemplates={function () {
                        onBudgetAction(month, 'check-templates');
                        close();
                    }} onApplyBudgetTemplates={function () {
                        onBudgetAction(month, 'apply-goal-template');
                        close();
                        showUndoNotification({
                            message: t('{{displayMonth}} budget templates have been applied.', { displayMonth: displayMonth }),
                        });
                    }} onOverwriteWithBudgetTemplates={function () {
                        onBudgetAction(month, 'overwrite-goal-template');
                        close();
                        showUndoNotification({
                            message: t('{{displayMonth}} budget templates have been overwritten.', { displayMonth: displayMonth }),
                        });
                    }} onEndOfMonthCleanup={function () {
                        onBudgetAction(month, 'cleanup-goal-template');
                        close();
                        showUndoNotification({
                            message: t('{{displayMonth}} end-of-month cleanup templates have been applied.', { displayMonth: displayMonth }),
                        });
                    }}/>)}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
