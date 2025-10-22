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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringSchedulePicker = RecurringSchedulePicker;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v0_1 = require("@actual-app/components/icons/v0");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var select_1 = require("@actual-app/components/select");
var space_between_1 = require("@actual-app/components/space-between");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var schedules_1 = require("loot-core/shared/schedules");
var DateSelect_1 = require("./DateSelect");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
// ex: There is no 6th Friday of the Month
var MAX_DAY_OF_WEEK_INTERVAL = 5;
function useFrequencyOptions() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var FREQUENCY_OPTIONS = [
        { id: 'daily', name: t('Days') },
        { id: 'weekly', name: t('Weeks') },
        { id: 'monthly', name: t('Months') },
        { id: 'yearly', name: t('Years') },
    ];
    return { FREQUENCY_OPTIONS: FREQUENCY_OPTIONS };
}
var DAY_OF_MONTH_OPTIONS = __spreadArray([], Array(31).keys(), true).map(function (day) { return day + 1; });
function useDayOfWeekOptions() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var DAY_OF_WEEK_OPTIONS = [
        { id: 'SU', name: t('Sunday') },
        { id: 'MO', name: t('Monday') },
        { id: 'TU', name: t('Tuesday') },
        { id: 'WE', name: t('Wednesday') },
        { id: 'TH', name: t('Thursday') },
        { id: 'FR', name: t('Friday') },
        { id: 'SA', name: t('Saturday') },
    ];
    return { DAY_OF_WEEK_OPTIONS: DAY_OF_WEEK_OPTIONS };
}
function parsePatternValue(value) {
    if (value === 'last') {
        return -1;
    }
    return Number(value);
}
function parseConfig(config) {
    return __assign({ start: monthUtils.currentDay(), interval: 1, frequency: 'monthly', patterns: [createMonthlyRecurrence(monthUtils.currentDay())], skipWeekend: false, weekendSolveMode: 'before', endMode: 'never', endOccurrences: 1, endDate: monthUtils.currentDay() }, config);
}
function unparseConfig(parsed) {
    return __assign(__assign({}, parsed), { interval: validInterval(parsed.interval), endOccurrences: validInterval(parsed.endOccurrences) });
}
function createMonthlyRecurrence(startDate) {
    return {
        value: parseInt(monthUtils.format(startDate, 'd')),
        type: 'day',
    };
}
function boundedRecurrence(_a) {
    var _b, _c;
    var field = _a.field, value = _a.value, recurrence = _a.recurrence;
    if ((field === 'value' &&
        recurrence.type !== 'day' &&
        value > MAX_DAY_OF_WEEK_INTERVAL) ||
        (field === 'type' &&
            value !== 'day' &&
            recurrence.value > MAX_DAY_OF_WEEK_INTERVAL)) {
        return _b = {}, _b[field] = value, _b.value = MAX_DAY_OF_WEEK_INTERVAL, _b;
    }
    return _c = {}, _c[field] = value, _c;
}
function reducer(state, action) {
    var _a;
    switch (action.type) {
        case 'replace-config':
            return __assign(__assign({}, state), { config: action.config });
        case 'change-field':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), (_a = {}, _a[action.field] = action.value, _a.patterns = state.config.frequency !== 'monthly' ? [] : state.config.patterns, _a)) });
        case 'update-recurrence':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { patterns: state.config.patterns.map(function (p) {
                        return p === action.recurrence
                            ? __assign(__assign({}, action.recurrence), boundedRecurrence(action)) : p;
                    }) }) });
        case 'add-recurrence':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { patterns: __spreadArray(__spreadArray([], (state.config.patterns || []), true), [
                        createMonthlyRecurrence(state.config.start),
                    ], false) }) });
        case 'remove-recurrence':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { patterns: state.config.patterns.filter(function (p) { return p !== action.recurrence; }) }) });
        case 'set-skip-weekend':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { skipWeekend: action.skipWeekend }) });
        case 'set-weekend-solve':
            return __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { weekendSolveMode: action.value }) });
        default:
            return state;
    }
}
function SchedulePreview(_a) {
    var previewDates = _a.previewDates;
    var locale = (0, useLocale_1.useLocale)();
    var dateFormat = ((0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy')
        .replace('MM', 'M')
        .replace('dd', 'd');
    if (!previewDates) {
        return null;
    }
    var content = null;
    if (typeof previewDates === 'string') {
        content = <text_1.Text>{previewDates}</text_1.Text>;
    }
    else {
        content = (<view_1.View>
        <text_1.Text style={{ fontWeight: 600 }}>
          <react_i18next_1.Trans>Upcoming dates</react_i18next_1.Trans>
        </text_1.Text>
        <stack_1.Stack direction="row" spacing={4} style={{ marginTop: 10 }}>
          {previewDates.map(function (d, idx) { return (<view_1.View key={idx}>
              <text_1.Text>{monthUtils.format(d, dateFormat, locale)}</text_1.Text>
              <text_1.Text>{monthUtils.format(d, 'EEEE', locale)}</text_1.Text>
            </view_1.View>); })}
        </stack_1.Stack>
      </view_1.View>);
    }
    return (<stack_1.Stack direction="column" spacing={1} style={{ marginTop: 15, color: theme_1.theme.tableText }}>
      {content}
    </stack_1.Stack>);
}
function validInterval(interval) {
    var intInterval = Number(interval);
    return Number.isInteger(intInterval) && intInterval > 0 ? intInterval : 1;
}
function MonthlyPatterns(_a) {
    var config = _a.config, dispatch = _a.dispatch;
    var t = (0, react_i18next_1.useTranslation)().t;
    var DAY_OF_WEEK_OPTIONS = useDayOfWeekOptions().DAY_OF_WEEK_OPTIONS;
    return (<stack_1.Stack spacing={2} style={{ marginTop: 10 }}>
      {config.patterns.map(function (recurrence, idx) { return (<view_1.View key={idx} style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
          <select_1.Select options={__spreadArray([
                [-1, t('Last')],
                menu_1.Menu.line
            ], DAY_OF_MONTH_OPTIONS.map(function (opt) { return [opt, String(opt)]; }), true)} value={recurrence.value} onChange={function (value) {
                return dispatch({
                    type: 'update-recurrence',
                    recurrence: recurrence,
                    field: 'value',
                    value: parsePatternValue(value),
                });
            }} style={{ flex: 1, marginRight: 10 }}/>
          <select_1.Select options={__spreadArray([
                ['day', t('Day')],
                menu_1.Menu.line
            ], DAY_OF_WEEK_OPTIONS.map(function (opt) { return [opt.id, opt.name]; }), true)} value={recurrence.type} onChange={function (value) {
                dispatch({
                    type: 'update-recurrence',
                    recurrence: recurrence,
                    field: 'type',
                    value: value,
                });
            }} style={{ flex: 1, marginRight: 10 }}/>
          <button_1.Button variant="bare" aria-label={t('Remove recurrence')} style={{ padding: 7 }} onPress={function () {
                return dispatch({
                    type: 'remove-recurrence',
                    recurrence: recurrence,
                });
            }}>
            <v0_1.SvgSubtract style={{ width: 8, height: 8 }}/>
          </button_1.Button>
          <button_1.Button variant="bare" aria-label={t('Add recurrence')} style={{ padding: 7, marginLeft: 5 }} onPress={function () { return dispatch({ type: 'add-recurrence' }); }}>
            <v0_1.SvgAdd style={{ width: 10, height: 10 }}/>
          </button_1.Button>
        </view_1.View>); })}
    </stack_1.Stack>);
}
function RecurringScheduleTooltip(_a) {
    var currentConfig = _a.config, onClose = _a.onClose, onSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(null), previewDates = _b[0], setPreviewDates = _b[1];
    var FREQUENCY_OPTIONS = useFrequencyOptions().FREQUENCY_OPTIONS;
    var _c = (0, react_1.useReducer)(reducer, {
        config: parseConfig(currentConfig),
    }), state = _c[0], dispatch = _c[1];
    var skipWeekend = state.config.hasOwnProperty('skipWeekend')
        ? state.config.skipWeekend
        : false;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    (0, react_1.useEffect)(function () {
        dispatch({
            type: 'replace-config',
            config: parseConfig(currentConfig),
        });
    }, [currentConfig]);
    var config = state.config;
    var updateField = function (field, value) { return dispatch({ type: 'change-field', field: field, value: value }); };
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.sendCatch)('schedule/get-upcoming-dates', {
                                config: unparseConfig(config),
                                count: 4,
                            })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            setPreviewDates(error ? t('Invalid rule') : data);
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [config, t]);
    if (previewDates == null) {
        return null;
    }
    return (<>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <label htmlFor="start">
          <react_i18next_1.Trans>From</react_i18next_1.Trans>
        </label>
        <initial_focus_1.InitialFocus>
          <DateSelect_1.DateSelect id="start" inputProps={{ placeholder: t('Start Date') }} value={config.start} onSelect={function (value) { return updateField('start', value); }} containerProps={{ style: { width: 100 } }} dateFormat={dateFormat}/>
        </initial_focus_1.InitialFocus>
        <select_1.Select id="repeat_end_dropdown" options={[
            ['never', t('indefinitely')],
            ['after_n_occurrences', t('for')],
            ['on_date', t('until')],
        ]} value={config.endMode} onChange={function (value) { return updateField('endMode', value); }}/>
        {config.endMode === 'after_n_occurrences' && (<>
            <input_1.Input id="end_occurrences" style={{ width: 40 }} type="number" min={1} onChangeValue={function (value) { return updateField('endOccurrences', value); }} defaultValue={config.endOccurrences || 1}/>
            {config.endOccurrences === '1' ? (<react_i18next_1.Trans>occurrence</react_i18next_1.Trans>) : (<react_i18next_1.Trans>occurrences</react_i18next_1.Trans>)}
          </>)}
        {config.endMode === 'on_date' && (<DateSelect_1.DateSelect id="end_date" inputProps={{ placeholder: t('End Date') }} value={config.endDate} onSelect={function (value) { return updateField('endDate', value); }} containerProps={{ style: { width: 100 } }} dateFormat={dateFormat}/>)}
      </div>
      <space_between_1.SpaceBetween direction="horizontal" style={{ marginTop: 10 }} gap={5}>
        <text_1.Text style={{ whiteSpace: 'nowrap' }}>
          <react_i18next_1.Trans>Repeat every</react_i18next_1.Trans>
        </text_1.Text>
        <input_1.Input id="interval" style={{
            minWidth: '7ch',
            width: "".concat(String(config.interval || 1).length + 4, "ch"),
            maxWidth: '12ch',
        }} type="number" min={1} onChangeValue={function (value) { return updateField('interval', value); }} defaultValue={config.interval || 1}/>
        <select_1.Select options={FREQUENCY_OPTIONS.map(function (opt) { return [opt.id, opt.name]; })} value={config.frequency} onChange={function (value) { return updateField('frequency', value); }}/>
        {config.frequency === 'monthly' &&
            (config.patterns == null || config.patterns.length === 0) ? (<button_1.Button style={{
                backgroundColor: theme_1.theme.tableBackground,
            }} onPress={function () { return dispatch({ type: 'add-recurrence' }); }}>
            <react_i18next_1.Trans>Add specific days</react_i18next_1.Trans>
          </button_1.Button>) : null}
      </space_between_1.SpaceBetween>
      {config.frequency === 'monthly' &&
            config.patterns &&
            config.patterns.length > 0 && (<MonthlyPatterns config={config} dispatch={dispatch}/>)}
      <stack_1.Stack direction="column" style={{ marginTop: 5 }}>
        <view_1.View style={{
            marginTop: 5,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
        }}>
          <forms_1.Checkbox id="form_skipwe" checked={skipWeekend} onChange={function (e) {
            dispatch({
                type: 'set-skip-weekend',
                skipWeekend: e.target.checked,
            });
        }}/>
          <react_i18next_1.Trans>
            <label htmlFor="form_skipwe" style={{
            userSelect: 'none',
            marginRight: 5,
        }}>
              Move schedule{' '}
            </label>
            <select_1.Select id="solve_dropdown" options={[
            ['before', t('before')],
            ['after', t('after')],
        ]} value={state.config.weekendSolveMode} onChange={function (value) { return dispatch({ type: 'set-weekend-solve', value: value }); }} disabled={!skipWeekend}/>
            <label htmlFor="solve_dropdown" style={{ userSelect: 'none', marginLeft: 5 }}>
              {' '}
              {{ beforeOrAfter: '' }} weekend
            </label>
          </react_i18next_1.Trans>
        </view_1.View>
      </stack_1.Stack>
      <SchedulePreview previewDates={previewDates}/>
      <div style={{ display: 'flex', marginTop: 15, justifyContent: 'flex-end' }}>
        <button_1.Button onPress={onClose}>
          <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
        </button_1.Button>
        <button_1.Button variant="primary" onPress={function () { return onSave(unparseConfig(config)); }} style={{ marginLeft: 10 }}>
          <react_i18next_1.Trans>Apply</react_i18next_1.Trans>
        </button_1.Button>
      </div>
    </>);
}
function RecurringSchedulePicker(_a) {
    var value = _a.value, buttonStyle = _a.buttonStyle, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var locale = (0, useLocale_1.useLocale)();
    function onSave(config) {
        onChange(config);
        setIsOpen(false);
    }
    var recurringDescription = (0, react_1.useMemo)(function () { return (0, schedules_1.getRecurringDescription)(value, dateFormat, locale); }, [locale, value, dateFormat]);
    var tooltip = (<RecurringScheduleTooltip config={value} onClose={function () { return setIsOpen(false); }} onSave={onSave}/>);
    return (<view_1.View>
      <button_1.Button ref={triggerRef} style={__assign({ textAlign: 'left' }, buttonStyle)} onPress={function () { return setIsOpen(true); }}>
        {value ? recurringDescription : t('No recurring date')}
      </button_1.Button>

      {isNarrowWidth ? (<Modal_1.Modal name="recurring-schedule-picker" isOpen={isOpen} onClose={function () { return setIsOpen(false); }}>
          {tooltip}
        </Modal_1.Modal>) : (<popover_1.Popover triggerRef={triggerRef} style={{
                padding: 10,
                minWidth: 380,
                width: 'auto',
                maxWidth: '100%',
            }} placement="bottom start" isOpen={isOpen} onOpenChange={function () { return setIsOpen(false); }}>
          {tooltip}
        </popover_1.Popover>)}
    </view_1.View>);
}
