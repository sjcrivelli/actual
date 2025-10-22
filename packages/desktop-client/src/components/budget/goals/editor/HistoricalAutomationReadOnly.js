"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalAutomationReadOnly = void 0;
var react_i18next_1 = require("react-i18next");
var HistoricalAutomationReadOnly = function (_a) {
    var template = _a.template;
    return template.type === 'copy' ? (<react_i18next_1.Trans>
      Budget the same amount as {{ amount: template.lookBack }} months ago
    </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
      Budget the average of the last {{ amount: template.numMonths }} months
    </react_i18next_1.Trans>);
};
exports.HistoricalAutomationReadOnly = HistoricalAutomationReadOnly;
