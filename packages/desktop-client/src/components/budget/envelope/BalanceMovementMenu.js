"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceMovementMenu = BalanceMovementMenu;
var react_1 = require("react");
var BalanceMenu_1 = require("./BalanceMenu");
var CoverMenu_1 = require("./CoverMenu");
var EnvelopeBudgetComponents_1 = require("./EnvelopeBudgetComponents");
var TransferMenu_1 = require("./TransferMenu");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function BalanceMovementMenu(_a) {
    var _b;
    var categoryId = _a.categoryId, month = _a.month, onBudgetAction = _a.onBudgetAction, _c = _a.onClose, onClose = _c === void 0 ? function () { } : _c;
    var catBalance = (_b = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catBalance(categoryId))) !== null && _b !== void 0 ? _b : 0;
    var _d = (0, react_1.useState)('menu'), menu = _d[0], _setMenu = _d[1];
    var ref = (0, react_1.useRef)(null);
    // Keep focus inside the popover on menu change
    var setMenu = (0, react_1.useCallback)(function (menu) {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        _setMenu(menu);
    }, [ref]);
    return (<span tabIndex={-1} ref={ref}>
      {menu === 'menu' && (<BalanceMenu_1.BalanceMenu categoryId={categoryId} onCarryover={function (carryover) {
                onBudgetAction(month, 'carryover', {
                    category: categoryId,
                    flag: carryover,
                });
                onClose();
            }} onTransfer={function () { return setMenu('transfer'); }} onCover={function () { return setMenu('cover'); }}/>)}

      {menu === 'transfer' && (<TransferMenu_1.TransferMenu categoryId={categoryId} initialAmount={catBalance} showToBeBudgeted={true} onClose={onClose} onSubmit={function (amount, toCategoryId) {
                onBudgetAction(month, 'transfer-category', {
                    amount: amount,
                    from: categoryId,
                    to: toCategoryId,
                });
            }}/>)}

      {menu === 'cover' && (<CoverMenu_1.CoverMenu categoryId={categoryId} onClose={onClose} onSubmit={function (fromCategoryId) {
                onBudgetAction(month, 'cover-overspending', {
                    to: categoryId,
                    from: fromCategoryId,
                });
            }}/>)}
    </span>);
}
