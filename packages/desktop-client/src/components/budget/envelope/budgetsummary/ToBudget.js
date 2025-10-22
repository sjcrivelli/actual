"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBudget = ToBudget;
var react_1 = require("react");
var popover_1 = require("@actual-app/components/popover");
var view_1 = require("@actual-app/components/view");
var ToBudgetAmount_1 = require("./ToBudgetAmount");
var ToBudgetMenu_1 = require("./ToBudgetMenu");
var CoverMenu_1 = require("@desktop-client/components/budget/envelope/CoverMenu");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var HoldMenu_1 = require("@desktop-client/components/budget/envelope/HoldMenu");
var TransferMenu_1 = require("@desktop-client/components/budget/envelope/TransferMenu");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ToBudget(_a) {
    var month = _a.month, prevMonthName = _a.prevMonthName, onBudgetAction = _a.onBudgetAction, style = _a.style, amountStyle = _a.amountStyle, _b = _a.isCollapsed, isCollapsed = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)('actions'), menuStep = _c[0], _setMenuStep = _c[1];
    var triggerRef = (0, react_1.useRef)(null);
    var ref = (0, react_1.useRef)(null);
    var setMenuStep = (0, react_1.useCallback)(function (menu) {
        var _a;
        if (menu)
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        _setMenuStep(menu);
    }, [ref, _setMenuStep]);
    var availableValue = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)({
        name: bindings_1.envelopeBudget.toBudget,
        value: 0,
    });
    if (typeof availableValue !== 'number' && availableValue !== null) {
        throw new Error('Expected availableValue to be a number but got ' + availableValue);
    }
    var _d = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _d.setMenuOpen, menuOpen = _d.menuOpen, handleContextMenu = _d.handleContextMenu, resetPosition = _d.resetPosition, position = _d.position, asContextMenu = _d.asContextMenu;
    return (<>
      <view_1.View ref={triggerRef}>
        <ToBudgetAmount_1.ToBudgetAmount onClick={function () {
            resetPosition();
            setMenuOpen(true);
        }} prevMonthName={prevMonthName} style={style} amountStyle={amountStyle} isTotalsListTooltipDisabled={!isCollapsed || menuOpen} onContextMenu={handleContextMenu}/>
      </view_1.View>

      <popover_1.Popover triggerRef={triggerRef} placement={asContextMenu ? 'bottom start' : 'bottom'} isOpen={menuOpen} onOpenChange={function () {
            setMenuStep('actions');
            setMenuOpen(false);
        }} style={{ width: 200, margin: 1 }} isNonModal {...position}>
        <span tabIndex={-1} ref={ref}>
          {menuStep === 'actions' && (<ToBudgetMenu_1.ToBudgetMenu onTransfer={function () { return setMenuStep('transfer'); }} onCover={function () { return setMenuStep('cover'); }} onHoldBuffer={function () { return setMenuStep('buffer'); }} onResetHoldBuffer={function () {
                onBudgetAction(month, 'reset-hold');
                setMenuOpen(false);
            }} month={month} onBudgetAction={onBudgetAction}/>)}
          {menuStep === 'buffer' && (<HoldMenu_1.HoldMenu onClose={function () { return setMenuOpen(false); }} onSubmit={function (amount) {
                onBudgetAction(month, 'hold', { amount: amount });
            }}/>)}
          {menuStep === 'transfer' && (<TransferMenu_1.TransferMenu initialAmount={availableValue !== null && availableValue !== void 0 ? availableValue : undefined} onClose={function () { return setMenuOpen(false); }} onSubmit={function (amount, categoryId) {
                onBudgetAction(month, 'transfer-available', {
                    amount: amount,
                    category: categoryId,
                });
            }}/>)}
          {menuStep === 'cover' && (<CoverMenu_1.CoverMenu showToBeBudgeted={false} onClose={function () { return setMenuOpen(false); }} onSubmit={function (categoryId) {
                onBudgetAction(month, 'cover-overbudgeted', {
                    category: categoryId,
                });
            }}/>)}
        </span>
      </popover_1.Popover>
    </>);
}
