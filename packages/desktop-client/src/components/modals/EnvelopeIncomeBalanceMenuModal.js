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
exports.EnvelopeIncomeBalanceMenuModal = EnvelopeIncomeBalanceMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var BalanceWithCarryover_1 = require("@desktop-client/components/budget/BalanceWithCarryover");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var Modal_1 = require("@desktop-client/components/common/Modal");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function EnvelopeIncomeBalanceMenuModal(_a) {
    var categoryId = _a.categoryId, onCarryover = _a.onCarryover, onShowActivity = _a.onShowActivity;
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    var t = (0, react_i18next_1.useTranslation)().t;
    var category = (0, useCategory_1.useCategory)(categoryId);
    var carryover = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catCarryover(categoryId));
    if (!category) {
        return null;
    }
    return (<Modal_1.Modal name="envelope-income-balance-menu">
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
              <react_i18next_1.Trans>Balance</react_i18next_1.Trans>
            </text_1.Text>
            <BalanceWithCarryover_1.BalanceWithCarryover isDisabled shouldInlineGoalStatus carryover={bindings_1.envelopeBudget.catCarryover(categoryId)} balance={bindings_1.envelopeBudget.catSumAmount(categoryId)} goal={bindings_1.envelopeBudget.catGoal(categoryId)} budgeted={bindings_1.envelopeBudget.catBudgeted(categoryId)} longGoal={bindings_1.envelopeBudget.catLongGoal(categoryId)} CarryoverIndicator={function (_a) {
                    var style = _a.style;
                    return (<BalanceWithCarryover_1.CarryoverIndicator style={__assign({ width: 15, height: 15, display: 'inline-flex', position: 'relative' }, style)}/>);
                }}>
              {function (props) { return (<CellValue_1.CellValueText {...props} style={__assign({ textAlign: 'center' }, styles_1.styles.veryLargeText)}/>); }}
            </BalanceWithCarryover_1.BalanceWithCarryover>
          </view_1.View>
          <menu_1.Menu getItemStyle={function () { return defaultMenuItemStyle; }} onMenuSelect={function (name) {
                    switch (name) {
                        case 'carryover':
                            onCarryover === null || onCarryover === void 0 ? void 0 : onCarryover(!carryover);
                            break;
                        case 'view':
                            onShowActivity === null || onShowActivity === void 0 ? void 0 : onShowActivity();
                            break;
                        default:
                            throw new Error("Unrecognized menu option: ".concat(name));
                    }
                }} items={[
                    {
                        name: 'carryover',
                        text: carryover
                            ? t('Disable auto hold')
                            : t('Enable auto hold'),
                    },
                    {
                        name: 'view',
                        text: t('View transactions'),
                    },
                ]}/>
        </>);
        }}
    </Modal_1.Modal>);
}
