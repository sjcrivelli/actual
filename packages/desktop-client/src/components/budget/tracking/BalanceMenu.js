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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceMenu = BalanceMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var TrackingBudgetComponents_1 = require("./TrackingBudgetComponents");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function BalanceMenu(_a) {
    var categoryId = _a.categoryId, onCarryover = _a.onCarryover, props = __rest(_a, ["categoryId", "onCarryover"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var carryover = (0, TrackingBudgetComponents_1.useTrackingSheetValue)(bindings_1.trackingBudget.catCarryover(categoryId));
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'carryover':
                    onCarryover === null || onCarryover === void 0 ? void 0 : onCarryover(!carryover);
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
        }} items={[
            {
                name: 'carryover',
                text: carryover
                    ? t('Remove overspending rollover')
                    : t('Rollover overspending'),
            },
        ]}/>);
}
