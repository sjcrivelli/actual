"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetAutomationEditor = BudgetAutomationEditor;
var react_i18next_1 = require("react-i18next");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var actions_1 = require("./actions");
var constants_1 = require("./constants");
var HistoricalAutomation_1 = require("./editor/HistoricalAutomation");
var PercentageAutomation_1 = require("./editor/PercentageAutomation");
var ScheduleAutomation_1 = require("./editor/ScheduleAutomation");
var SimpleAutomation_1 = require("./editor/SimpleAutomation");
var WeekAutomation_1 = require("./editor/WeekAutomation");
var forms_1 = require("@desktop-client/components/forms");
var displayTypeToDescription = {
    simple: <react_i18next_1.Trans>Add a fixed amount to this category each month.</react_i18next_1.Trans>,
    week: (<react_i18next_1.Trans>
      Add a fixed amount to this category for each week in the month. For
      example, $100 per week would be $400 per month in a 4-week month.
    </react_i18next_1.Trans>),
    schedule: (<react_i18next_1.Trans>
      Add enough to this category to cover the selected schedule. If the
      schedule occurs multiple times in a month, an amount will be added for
      each occurrence. You can choose to save up for the next occurrence over
      time (e.g. save $100 each month for a $300 quarterly bill) or cover each
      occurrence when it occurs (e.g. only add the $300 when the bill is due).
    </react_i18next_1.Trans>),
    percentage: (<react_i18next_1.Trans>
      Add a fixed percentage of your income to this category each month. You can
      choose to take the percentage from the current month or the previous
      month.
    </react_i18next_1.Trans>),
    historical: (<react_i18next_1.Trans>
      Add an amount to this category each month based on the values from
      previous months. For example, you can copy the amount from a year ago to
      budget for an annual expense, or budget the average of the last 3 months
      to account for seasonal changes.
    </react_i18next_1.Trans>),
};
function BudgetAutomationEditor(_a) {
    var _b;
    var inline = _a.inline, state = _a.state, dispatch = _a.dispatch, schedules = _a.schedules, categories = _a.categories;
    var t = (0, react_i18next_1.useTranslation)().t;
    var automationEditor;
    switch (state.displayType) {
        case 'simple':
            automationEditor = (<SimpleAutomation_1.SimpleAutomation template={state.template} dispatch={dispatch}/>);
            break;
        case 'week':
            automationEditor = (<WeekAutomation_1.WeekAutomation template={state.template} dispatch={dispatch}/>);
            break;
        case 'schedule':
            automationEditor = (<ScheduleAutomation_1.ScheduleAutomation schedules={schedules} template={state.template} dispatch={dispatch}/>);
            break;
        case 'percentage':
            automationEditor = (<PercentageAutomation_1.PercentageAutomation dispatch={dispatch} template={state.template} categories={categories}/>);
            break;
        case 'historical':
            automationEditor = (<HistoricalAutomation_1.HistoricalAutomation template={state.template} dispatch={dispatch}/>);
            break;
        default:
            automationEditor = (<text_1.Text>
          <react_i18next_1.Trans>Unrecognized automation type.</react_i18next_1.Trans>
        </text_1.Text>);
    }
    return (<stack_1.Stack direction="column" spacing={2} style={__assign(__assign(__assign(__assign({ flex: 1 }, styles_1.styles.editorPill), { backgroundColor: theme_1.theme.pillBackgroundLight }), (inline ? { borderRadius: 0 } : {})), { padding: 30, minHeight: 'fit-content' })}>
      <stack_1.Stack direction="row" align="flex-start" spacing={4}>
        <forms_1.FormField style={{ flexShrink: 0 }}>
          <forms_1.FormLabel title={t('Type')} htmlFor="type-field"/>
          <initial_focus_1.InitialFocus>
            <select_1.Select id="type-field" options={constants_1.displayTemplateTypes} defaultLabel={t('Select an option')} value={state.displayType} onChange={function (type) { return type && dispatch((0, actions_1.setType)(type)); }} style={{ width: 172 }}/>
          </initial_focus_1.InitialFocus>
        </forms_1.FormField>
        <forms_1.FormField style={{ flex: 1 }}>
          <forms_1.FormTextLabel title={t('Description')}/>
          <text_1.Text>
            {(_b = displayTypeToDescription[state.displayType]) !== null && _b !== void 0 ? _b : (<react_i18next_1.Trans>No description available</react_i18next_1.Trans>)}
          </text_1.Text>
        </forms_1.FormField>
      </stack_1.Stack>
      {automationEditor}
    </stack_1.Stack>);
}
