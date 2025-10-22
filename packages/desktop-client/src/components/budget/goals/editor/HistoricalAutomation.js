"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalAutomation = void 0;
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var actions_1 = require("@desktop-client/components/budget/goals/actions");
var forms_1 = require("@desktop-client/components/forms");
var GenericInput_1 = require("@desktop-client/components/util/GenericInput");
var HistoricalAutomation = function (_a) {
    var template = _a.template, dispatch = _a.dispatch;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<stack_1.Stack direction="row" align="center" spacing={10} style={{ marginTop: 10 }}>
      <forms_1.FormField style={{ flex: 1 }}>
        <forms_1.FormLabel title={t('Mode')} htmlFor="mode-field"/>
        <select_1.Select id="mode-field" key="mode-picker" options={[
            ['copy', t('Copy a previous month')],
            ['average', t('Average of previous months')],
        ]} value={template.type} onChange={function (type) { return dispatch((0, actions_1.updateTemplate)({ type: type })); }}/>
      </forms_1.FormField>
      <forms_1.FormField style={{ flex: 1 }}>
        <forms_1.FormLabel title={t('Number of months back')} htmlFor="look-back-field"/>
        {/* @ts-expect-error should be auto-patched once GenericInput is converted to TS */}
        <GenericInput_1.GenericInput key="look-back-input" type="number" value={template.type === 'average' ? template.numMonths : template.lookBack} onChange={function (value) {
            return dispatch((0, actions_1.updateTemplate)(template.type === 'average'
                ? { type: 'average', numMonths: value }
                : { type: 'copy', lookBack: value }));
        }}/>
      </forms_1.FormField>
    </stack_1.Stack>);
};
exports.HistoricalAutomation = HistoricalAutomation;
