"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAutomationReadOnly = void 0;
var react_i18next_1 = require("react-i18next");
var util_1 = require("loot-core/shared/util");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var SimpleAutomationReadOnly = function (_a) {
    var _b;
    var template = _a.template;
    var format = (0, useFormat_1.useFormat)();
    return (<react_i18next_1.Trans>
      Budget{' '}
      {{
            monthly: format((0, util_1.amountToInteger)((_b = template.monthly) !== null && _b !== void 0 ? _b : 0, format.currency.decimalPlaces), 'financial'),
        }}{' '}
      each month
    </react_i18next_1.Trans>);
};
exports.SimpleAutomationReadOnly = SimpleAutomationReadOnly;
