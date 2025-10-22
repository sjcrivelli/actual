"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetAutomationReadOnly = BudgetAutomationReadOnly;
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var HistoricalAutomationReadOnly_1 = require("./editor/HistoricalAutomationReadOnly");
var PercentageAutomationReadOnly_1 = require("./editor/PercentageAutomationReadOnly");
var ScheduleAutomationReadOnly_1 = require("./editor/ScheduleAutomationReadOnly");
var SimpleAutomationReadOnly_1 = require("./editor/SimpleAutomationReadOnly");
var WeekAutomationReadOnly_1 = require("./editor/WeekAutomationReadOnly");
function BudgetAutomationReadOnly(_a) {
    var state = _a.state, categoryNameMap = _a.categoryNameMap, isEditing = _a.isEditing, setIsEditing = _a.setIsEditing, onDelete = _a.onDelete, style = _a.style, inline = _a.inline;
    var t = (0, react_i18next_1.useTranslation)().t;
    var automationReadOnly;
    switch (state.displayType) {
        case 'simple':
            automationReadOnly = (<SimpleAutomationReadOnly_1.SimpleAutomationReadOnly template={state.template}/>);
            break;
        case 'week':
            automationReadOnly = <WeekAutomationReadOnly_1.WeekAutomationReadOnly template={state.template}/>;
            break;
        case 'schedule':
            automationReadOnly = (<ScheduleAutomationReadOnly_1.ScheduleAutomationReadOnly template={state.template}/>);
            break;
        case 'percentage':
            automationReadOnly = (<PercentageAutomationReadOnly_1.PercentageAutomationReadOnly template={state.template} categoryNameMap={categoryNameMap}/>);
            break;
        case 'historical':
            automationReadOnly = (<HistoricalAutomationReadOnly_1.HistoricalAutomationReadOnly template={state.template}/>);
            break;
        default:
            automationReadOnly = (<text_1.Text>
          <react_i18next_1.Trans>Unrecognized automation type.</react_i18next_1.Trans>
        </text_1.Text>);
            break;
    }
    return (<stack_1.Stack direction="row" align="center" spacing={2} style={style}>
      {inline && (<view_1.View style={{
                borderLeft: "1px solid ".concat(theme_1.theme.tableBorder),
                height: 'calc(100% - 4px)',
            }}/>)}
      <text_1.Text style={{ color: theme_1.theme.tableText, fontSize: 13 }}>
        {automationReadOnly}
      </text_1.Text>
      <view_1.View style={{ flex: 1 }}/>
      <button_1.Button variant="bare" onPress={function () { return setIsEditing(function (prev) { return !prev; }); }} style={{ padding: 2 }} aria-label={t('Edit template')}>
        {isEditing ? (<v1_1.SvgCheveronUp style={{ width: 16, height: 16, color: 'inherit' }}/>) : (<v1_1.SvgCheveronDown style={{ width: 16, height: 16, color: 'inherit' }}/>)}
      </button_1.Button>
      <button_1.Button variant="bare" onPress={onDelete} style={{ padding: 5 }} aria-label={t('Delete template')}>
        <v0_1.SvgDelete style={{ width: 8, height: 8, color: 'inherit' }}/>
      </button_1.Button>
    </stack_1.Stack>);
}
