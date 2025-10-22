"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekAutomationReadOnly = void 0;
var react_i18next_1 = require("react-i18next");
var util_1 = require("loot-core/shared/util");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var WeekAutomationReadOnly = function (_a) {
    var template = _a.template;
    var format = (0, useFormat_1.useFormat)();
    return (<react_i18next_1.Trans>
      Budget{' '}
      {{
            amount: format((0, util_1.amountToInteger)(template.amount, format.currency.decimalPlaces), 'financial'),
        }}{' '}
      each week
    </react_i18next_1.Trans>);
};
exports.WeekAutomationReadOnly = WeekAutomationReadOnly;
