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
exports.TrackingBalanceMenuModal = TrackingBalanceMenuModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var BalanceWithCarryover_1 = require("@desktop-client/components/budget/BalanceWithCarryover");
var BalanceMenu_1 = require("@desktop-client/components/budget/tracking/BalanceMenu");
var Modal_1 = require("@desktop-client/components/common/Modal");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function TrackingBalanceMenuModal(_a) {
    var categoryId = _a.categoryId, onCarryover = _a.onCarryover;
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    var category = (0, useCategory_1.useCategory)(categoryId);
    if (!category) {
        return null;
    }
    return (<Modal_1.Modal name="tracking-balance-menu">
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
            <BalanceWithCarryover_1.BalanceWithCarryover isDisabled carryover={bindings_1.trackingBudget.catCarryover(categoryId)} balance={bindings_1.trackingBudget.catBalance(categoryId)} goal={bindings_1.trackingBudget.catGoal(categoryId)} budgeted={bindings_1.trackingBudget.catBudgeted(categoryId)} longGoal={bindings_1.trackingBudget.catLongGoal(categoryId)} CarryoverIndicator={function (_a) {
                    var style = _a.style;
                    return (<BalanceWithCarryover_1.CarryoverIndicator style={__assign({ width: 15, height: 15, display: 'inline-flex', position: 'relative' }, style)}/>);
                }}>
              {function (props) { return (<CellValue_1.CellValueText {...props} style={__assign({ textAlign: 'center' }, styles_1.styles.veryLargeText)}/>); }}
            </BalanceWithCarryover_1.BalanceWithCarryover>
          </view_1.View>
          <BalanceMenu_1.BalanceMenu categoryId={categoryId} getItemStyle={function () { return defaultMenuItemStyle; }} onCarryover={onCarryover}/>
        </>);
        }}
    </Modal_1.Modal>);
}
