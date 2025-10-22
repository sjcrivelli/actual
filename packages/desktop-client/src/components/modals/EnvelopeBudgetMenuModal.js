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
exports.EnvelopeBudgetMenuModal = EnvelopeBudgetMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Platform = require("loot-core/shared/platform");
var util_1 = require("loot-core/shared/util");
var BudgetMenu_1 = require("@desktop-client/components/budget/envelope/BudgetMenu");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var Modal_1 = require("@desktop-client/components/common/Modal");
var FocusableAmountInput_1 = require("@desktop-client/components/mobile/transactions/FocusableAmountInput");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function EnvelopeBudgetMenuModal(_a) {
    var categoryId = _a.categoryId, onUpdateBudget = _a.onUpdateBudget, onCopyLastMonthAverage = _a.onCopyLastMonthAverage, onSetMonthsAverage = _a.onSetMonthsAverage, onApplyBudgetTemplate = _a.onApplyBudgetTemplate;
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    var budgeted = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catBudgeted(categoryId));
    var category = (0, useCategory_1.useCategory)(categoryId);
    var _b = (0, react_1.useState)(false), amountFocused = _b[0], setAmountFocused = _b[1];
    var _onUpdateBudget = function (amount) {
        onUpdateBudget === null || onUpdateBudget === void 0 ? void 0 : onUpdateBudget((0, util_1.amountToInteger)(amount));
    };
    (0, react_1.useEffect)(function () {
        // iOS does not support automatically opening up the keyboard for the
        // total amount field. Hence we should not focus on it on page render.
        if (!Platform.isIOSAgent) {
            setAmountFocused(true);
        }
    }, []);
    if (!category) {
        return null;
    }
    return (<Modal_1.Modal name="envelope-budget-menu">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={<Modal_1.ModalTitle title={category.name} shrinkOnOverflow/>} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
            <text_1.Text style={{
                    fontSize: 17,
                    fontWeight: 400,
                }}>
              <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
            </text_1.Text>
            <FocusableAmountInput_1.FocusableAmountInput value={(0, util_1.integerToAmount)(budgeted || 0)} focused={amountFocused} onFocus={function () { return setAmountFocused(true); }} onBlur={function () { return setAmountFocused(false); }} onEnter={close} zeroSign="+" focusedStyle={{
                    width: 'auto',
                    padding: '5px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    minWidth: '100%',
                }} textStyle={__assign(__assign({}, styles_1.styles.veryLargeText), { textAlign: 'center' })} onUpdateAmount={_onUpdateBudget} data-testid="budget-amount"/>
          </view_1.View>
          <BudgetMenu_1.BudgetMenu getItemStyle={function () { return defaultMenuItemStyle; }} onCopyLastMonthAverage={onCopyLastMonthAverage} onSetMonthsAverage={onSetMonthsAverage} onApplyBudgetTemplate={onApplyBudgetTemplate}/>
        </>);
        }}
    </Modal_1.Modal>);
}
