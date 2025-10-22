"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAutomationReadOnly = void 0;
var react_i18next_1 = require("react-i18next");
var ScheduleAutomationReadOnly = function (_a) {
    var template = _a.template;
    if (!template.name) {
        return <react_i18next_1.Trans>Budget for a schedule</react_i18next_1.Trans>;
    }
    if (template.full) {
        return (<react_i18next_1.Trans>
        Cover the occurrences of the schedule &lsquo;
        {{ name: template.name }}
        &rsquo; this month
      </react_i18next_1.Trans>);
    }
    return (<react_i18next_1.Trans>
      Save up for the schedule &lsquo;
      {{ name: template.name }}
      &rsquo;
    </react_i18next_1.Trans>);
};
exports.ScheduleAutomationReadOnly = ScheduleAutomationReadOnly;
