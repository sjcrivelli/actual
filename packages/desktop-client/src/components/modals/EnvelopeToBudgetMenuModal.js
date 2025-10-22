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
exports.EnvelopeToBudgetMenuModal = EnvelopeToBudgetMenuModal;
var react_1 = require("react");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var ToBudgetMenu_1 = require("@desktop-client/components/budget/envelope/budgetsummary/ToBudgetMenu");
var Modal_1 = require("@desktop-client/components/common/Modal");
function EnvelopeToBudgetMenuModal(_a) {
    var onTransfer = _a.onTransfer, onCover = _a.onCover, onHoldBuffer = _a.onHoldBuffer, onResetHoldBuffer = _a.onResetHoldBuffer, onBudgetAction = _a.onBudgetAction, month = _a.month;
    var defaultMenuItemStyle = __assign(__assign({}, styles_1.styles.mobileMenuItem), { color: theme_1.theme.menuItemText, borderRadius: 0, borderTop: "1px solid ".concat(theme_1.theme.pillBorder) });
    return (<Modal_1.Modal name="envelope-summary-to-budget-menu">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader showLogo rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <ToBudgetMenu_1.ToBudgetMenu getItemStyle={function () { return defaultMenuItemStyle; }} onTransfer={onTransfer} onCover={onCover} onHoldBuffer={onHoldBuffer} onResetHoldBuffer={onResetHoldBuffer} onBudgetAction={onBudgetAction} month={month}/>
        </>);
        }}
    </Modal_1.Modal>);
}
