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
exports.ToBudgetMenu = ToBudgetMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ToBudgetMenu(_a) {
    var _b, _c, _d, _e;
    var onTransfer = _a.onTransfer, onCover = _a.onCover, onHoldBuffer = _a.onHoldBuffer, onResetHoldBuffer = _a.onResetHoldBuffer, onBudgetAction = _a.onBudgetAction, month = _a.month, props = __rest(_a, ["onTransfer", "onCover", "onHoldBuffer", "onResetHoldBuffer", "onBudgetAction", "month"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var toBudget = (_b = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.toBudget)) !== null && _b !== void 0 ? _b : 0;
    var forNextMonth = (_c = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.forNextMonth)) !== null && _c !== void 0 ? _c : 0;
    var manualBuffered = (_d = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.manualBuffered)) !== null && _d !== void 0 ? _d : 0;
    var autoBuffered = (_e = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.autoBuffered)) !== null && _e !== void 0 ? _e : 0;
    var items = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (toBudget > 0
        ? [
            {
                name: 'transfer',
                text: t('Move to a category'),
            },
        ]
        : []), true), (autoBuffered === 0 && toBudget > 0
        ? [
            {
                name: 'buffer',
                text: t('Hold for next month'),
            },
        ]
        : []), true), (toBudget < 0
        ? [
            {
                name: 'cover',
                text: t('Cover from a category'),
            },
        ]
        : []), true), (forNextMonth > 0 && manualBuffered === 0
        ? [
            {
                name: 'disable-auto-buffer',
                text: t('Disable current auto hold'),
            },
        ]
        : []), true), (forNextMonth > 0 && manualBuffered !== 0
        ? [
            {
                name: 'reset-buffer',
                text: t('Reset next month’s buffer'),
            },
        ]
        : []), true);
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'transfer':
                    onTransfer === null || onTransfer === void 0 ? void 0 : onTransfer();
                    break;
                case 'cover':
                    onCover === null || onCover === void 0 ? void 0 : onCover();
                    break;
                case 'buffer':
                    onHoldBuffer === null || onHoldBuffer === void 0 ? void 0 : onHoldBuffer();
                    onBudgetAction === null || onBudgetAction === void 0 ? void 0 : onBudgetAction(month, 'reset-income-carryover', {});
                    break;
                case 'reset-buffer':
                    onResetHoldBuffer === null || onResetHoldBuffer === void 0 ? void 0 : onResetHoldBuffer();
                    break;
                case 'disable-auto-buffer':
                    onBudgetAction === null || onBudgetAction === void 0 ? void 0 : onBudgetAction(month, 'reset-income-carryover', {});
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }} items={items.length > 0
            ? items
            : [
                {
                    name: 'none',
                    text: t('No actions available'),
                    disabled: true,
                },
            ]}/>);
}
