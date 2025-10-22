"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceMenu = BalanceMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var EnvelopeBudgetComponents_1 = require("./EnvelopeBudgetComponents");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function BalanceMenu(_a) {
    var _b;
    var categoryId = _a.categoryId, onTransfer = _a.onTransfer, onCarryover = _a.onCarryover, onCover = _a.onCover, props = __rest(_a, ["categoryId", "onTransfer", "onCarryover", "onCover"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var carryover = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catCarryover(categoryId));
    var balance = (_b = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.catBalance(categoryId))) !== null && _b !== void 0 ? _b : 0;
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'transfer':
                    onTransfer === null || onTransfer === void 0 ? void 0 : onTransfer();
                    break;
                case 'carryover':
                    onCarryover === null || onCarryover === void 0 ? void 0 : onCarryover(!carryover);
                    break;
                case 'cover':
                    onCover === null || onCover === void 0 ? void 0 : onCover();
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }} items={__spreadArray(__spreadArray(__spreadArray([], (balance > 0
            ? [
                {
                    name: 'transfer',
                    text: t('Transfer to another category'),
                },
            ]
            : []), true), (balance < 0
            ? [
                {
                    name: 'cover',
                    text: t('Cover overspending'),
                },
            ]
            : []), true), [
            {
                name: 'carryover',
                text: carryover
                    ? t('Remove overspending rollover')
                    : t('Rollover overspending'),
            },
        ], false)}/>);
}
