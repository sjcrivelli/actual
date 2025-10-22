"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleAutomation = void 0;
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var actions_1 = require("@desktop-client/components/budget/goals/actions");
var Link_1 = require("@desktop-client/components/common/Link");
var forms_1 = require("@desktop-client/components/forms");
var ScheduleAutomation = function (_a) {
    var schedules = _a.schedules, template = _a.template, dispatch = _a.dispatch;
    var t = (0, react_i18next_1.useTranslation)().t;
    return schedules.length ? (<stack_1.Stack direction="row" align="center" spacing={10} style={{ marginTop: 10 }}>
      <forms_1.FormField style={{ flex: 1 }}>
        <forms_1.FormLabel title={t('Schedule')} htmlFor="schedule-field"/>
        <select_1.Select id="schedule-field" key="schedule-picker" defaultLabel={t('Select a schedule')} value={template.name} onChange={function (schedule) {
            return dispatch((0, actions_1.updateTemplate)({
                type: 'schedule',
                name: schedule,
            }));
        }} options={schedules.flatMap(function (schedule) {
            return schedule.name ? [[schedule.name, schedule.name]] : [];
        })}/>
      </forms_1.FormField>
      <forms_1.FormField style={{ flex: 1 }}>
        <forms_1.FormLabel title={t('Savings mode')} htmlFor="schedule-full-field"/>
        <select_1.Select id="schedule-full-field" key="schedule-full" options={[
            ['false', t('Save up for the next occurrence')],
            ['true', t('Cover each occurrence when it occurs')],
        ]} value={String(!!template.full)} onChange={function (full) {
            return dispatch((0, actions_1.updateTemplate)({
                type: 'schedule',
                full: full === 'true',
            }));
        }}/>
      </forms_1.FormField>
    </stack_1.Stack>) : (<text_1.Text style={{ marginTop: 10 }}>
      <react_i18next_1.Trans>
        No schedules found, create one in the{' '}
        <Link_1.Link variant="internal" to="/schedules">
          schedules
        </Link_1.Link>{' '}
        page.
      </react_i18next_1.Trans>
    </text_1.Text>);
};
exports.ScheduleAutomation = ScheduleAutomation;
