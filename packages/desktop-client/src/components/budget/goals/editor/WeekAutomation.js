"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekAutomation = void 0;
var react_i18next_1 = require("react-i18next");
var util_1 = require("loot-core/shared/util");
var actions_1 = require("@desktop-client/components/budget/goals/actions");
var forms_1 = require("@desktop-client/components/forms");
var AmountInput_1 = require("@desktop-client/components/util/AmountInput");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var WeekAutomation = function (_a) {
    var _b;
    var template = _a.template, dispatch = _a.dispatch;
    var t = (0, react_i18next_1.useTranslation)().t;
    var currency = (0, useFormat_1.useFormat)().currency;
    return (<forms_1.FormField style={{ flex: 1 }}>
      <forms_1.FormLabel title={t('Amount')} htmlFor="amount-field"/>
      <AmountInput_1.AmountInput id="amount-field" key="amount-input" value={(0, util_1.amountToInteger)((_b = template.amount) !== null && _b !== void 0 ? _b : 0, currency.decimalPlaces)} zeroSign="+" onUpdate={function (value) {
            return dispatch((0, actions_1.updateTemplate)({
                type: 'periodic',
                amount: (0, util_1.integerToAmount)(value, currency.decimalPlaces),
            }));
        }}/>
    </forms_1.FormField>);
};
exports.WeekAutomation = WeekAutomation;
