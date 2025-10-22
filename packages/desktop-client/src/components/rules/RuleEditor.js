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
exports.FieldSelect = FieldSelect;
exports.OpSelect = OpSelect;
exports.RuleEditor = RuleEditor;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var select_1 = require("@actual-app/components/select");
var space_between_1 = require("@actual-app/components/space-between");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var uuid_1 = require("uuid");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var rules_1 = require("loot-core/shared/rules");
var StatusBadge_1 = require("@desktop-client/components/schedules/StatusBadge");
var SimpleTransactionsTable_1 = require("@desktop-client/components/transactions/SimpleTransactionsTable");
var AmountInput_1 = require("@desktop-client/components/util/AmountInput");
var DisplayId_1 = require("@desktop-client/components/util/DisplayId");
var GenericInput_1 = require("@desktop-client/components/util/GenericInput");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
var redux_1 = require("@desktop-client/redux");
var undo_1 = require("@desktop-client/undo");
function updateValue(array, value, update) {
    return array.map(function (v) { return (v === value ? update() : v); });
}
function applyErrors(array, errorsArray) {
    return array.map(function (item, i) {
        return __assign(__assign({}, item), { error: errorsArray[i] });
    });
}
function getTransactionFields(conditions, actions) {
    var fields = ['date'];
    if (conditions.find(function (c) { return c.field === 'imported_payee'; })) {
        fields.push('imported_payee');
    }
    fields.push('payee');
    if (actions.find(function (a) { return a.field === 'category'; })) {
        fields.push('category');
    }
    else if (actions.length > 0 &&
        !['payee', 'date', 'amount'].includes(actions[0].field)) {
        fields.push(actions[0].field);
    }
    fields.push('amount');
    return fields;
}
function FieldSelect(_a) {
    var fields = _a.fields, style = _a.style, value = _a.value, onChange = _a.onChange;
    return (<view_1.View style={style} data-testid="field-select">
      <select_1.Select bare options={fields} value={value} onChange={onChange} className={(0, css_1.css)({
            color: theme_1.theme.pageTextPositive,
            '&[data-hovered]': { color: theme_1.theme.pageTextPositive },
        })}/>
    </view_1.View>);
}
function OpSelect(_a) {
    var ops = _a.ops, type = _a.type, style = _a.style, value = _a.value, _b = _a.formatOp, formatOp = _b === void 0 ? rules_1.friendlyOp : _b, onChange = _a.onChange;
    var opOptions = (0, react_1.useMemo)(function () {
        var options = ops
            // We don't support the `contains`, `doesNotContain`, `matches` operators
            // for the id type rules yet
            // TODO: Add matches op support for payees, accounts, categories.
            .filter(function (op) {
            return type === 'id'
                ? !['contains', 'matches', 'doesNotContain', 'hasTags'].includes(op)
                : true;
        })
            .map(function (op) { return [op, formatOp(op, type)]; });
        if (type === 'string' || type === 'id') {
            // @ts-expect-error fix this
            options.splice(Math.ceil(options.length / 2), 0, menu_1.Menu.line);
        }
        return options;
    }, [formatOp, ops, type]);
    return (<view_1.View data-testid="op-select">
      <select_1.Select bare 
    // @ts-expect-error fix this
    options={opOptions} value={value} onChange={function (value) { return onChange('op', value); }} style={style}/>
    </view_1.View>);
}
function SplitAmountMethodSelect(_a) {
    var options = _a.options, style = _a.style, value = _a.value, onChange = _a.onChange;
    return (<view_1.View style={__assign({ color: theme_1.theme.pageTextPositive }, style)} data-testid="field-select">
      <select_1.Select bare options={options} value={value} onChange={function (value) { return onChange('method', value); }}/>
    </view_1.View>);
}
function EditorButtons(_a) {
    var onAdd = _a.onAdd, onDelete = _a.onDelete;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<>
      {onDelete && (<button_1.Button variant="bare" onPress={onDelete} style={{ padding: 7 }} aria-label={t('Delete entry')}>
          <v0_1.SvgSubtract style={{ width: 8, height: 8, color: 'inherit' }}/>
        </button_1.Button>)}
      {onAdd && (<button_1.Button variant="bare" onPress={onAdd} style={{ padding: 7 }} aria-label={t('Add entry')}>
          <v0_1.SvgAdd style={{ width: 10, height: 10, color: 'inherit' }}/>
        </button_1.Button>)}
    </>);
}
function FieldError(_a) {
    var type = _a.type;
    return (<text_1.Text style={{
            fontSize: 12,
            textAlign: 'center',
            color: theme_1.theme.errorText,
            marginBottom: 5,
        }}>
      {(0, rules_1.getFieldError)(type)}
    </text_1.Text>);
}
function Editor(_a) {
    var error = _a.error, style = _a.style, children = _a.children;
    return (<view_1.View style={style} data-testid="editor-row">
      <stack_1.Stack direction="row" align="center" spacing={1}>
        {children}
      </stack_1.Stack>
      {error && <FieldError type={error}/>}
    </view_1.View>);
}
function ConditionEditor(_a) {
    var ops = _a.ops, condition = _a.condition, editorStyle = _a.editorStyle, isSchedule = _a.isSchedule, onChange = _a.onChange, onDelete = _a.onDelete, onAdd = _a.onAdd;
    var originalField = condition.field, op = condition.op, value = condition.value, type = condition.type, options = condition.options, error = condition.error, inputKey = condition.inputKey;
    var translatedConditions = (0, react_1.useMemo)(function () {
        var retValue = __spreadArray([], conditionFields, true);
        if (retValue && retValue.length > 0) {
            retValue.forEach(function (field) {
                field[1] = (0, rules_1.mapField)(field[0]);
            });
        }
        return retValue;
    }, []);
    var field = originalField;
    if (field === 'amount' && options) {
        if (options.inflow) {
            field = 'amount-inflow';
        }
        else if (options.outflow) {
            field = 'amount-outflow';
        }
    }
    var valueEditor;
    if (type === 'number' && op === 'isbetween') {
        valueEditor = (<AmountInput_1.BetweenAmountInput key={inputKey} defaultValue={value} onChange={function (v) { return onChange('value', v); }}/>);
    }
    else {
        valueEditor = (
        // @ts-expect-error fix this
        <GenericInput_1.GenericInput key={inputKey} field={field} type={type} value={value} op={op} multi={op === 'oneOf' || op === 'notOneOf'} onChange={function (v) { return onChange('value', v); }} numberFormatType="currency"/>);
    }
    return (<Editor style={editorStyle} error={error}>
      <FieldSelect 
    // @ts-expect-error fix this
    fields={translatedConditions} value={field} onChange={function (value) { return onChange('field', value); }}/>
      <OpSelect ops={ops} value={op} type={type} onChange={onChange}/>

      <view_1.View style={{ flex: 1, minWidth: 80 }}>{valueEditor}</view_1.View>

      <stack_1.Stack direction="row">
        <EditorButtons onAdd={onAdd} onDelete={isSchedule && field === 'date' ? null : onDelete}/>
      </stack_1.Stack>
    </Editor>);
}
function formatAmount(amount, format) {
    if (!amount) {
        return format(0, 'financial');
    }
    else if (typeof amount === 'number') {
        return format(amount, 'financial');
    }
    else {
        return "".concat(format(amount.num1, 'financial'), " to ").concat(format(amount.num2, 'financial'));
    }
}
function ScheduleDescription(_a) {
    var id = _a.id;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var format = (0, useFormat_1.useFormat)();
    var scheduleQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').filter({ id: id }).select('*'); }, [id]);
    var _b = (0, useSchedules_1.useSchedules)({ query: scheduleQuery }), schedules = _b.schedules, statusLabels = _b.statusLabels, isSchedulesLoading = _b.isLoading;
    if (isSchedulesLoading) {
        return null;
    }
    var schedule = schedules[0];
    if (schedule && schedules.length === 0) {
        return <view_1.View style={{ flex: 1 }}>{id}</view_1.View>;
    }
    var status = statusLabels.get(schedule.id);
    return (<view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
      <space_between_1.SpaceBetween gap={5} style={{
            marginRight: 15,
        }}>
        <space_between_1.SpaceBetween gap={5} style={{ flexWrap: 'nowrap' }}>
          <react_i18next_1.Trans>Payee:</react_i18next_1.Trans>
          <DisplayId_1.DisplayId type="payees" id={schedule._payee} noneColor={theme_1.theme.pageTextLight}/>
        </space_between_1.SpaceBetween>

        <text_1.Text style={{ flexShrink: 0 }}>
          <text_1.Text> — </text_1.Text>
          <react_i18next_1.Trans>Amount:</react_i18next_1.Trans> {formatAmount(schedule._amount, format)}
        </text_1.Text>

        <text_1.Text style={{ flexShrink: 0 }}>
          <text_1.Text> — </text_1.Text>
          <react_i18next_1.Trans>
            Next: {{ month: monthUtils.format(schedule.next_date, dateFormat) }}
          </react_i18next_1.Trans>
        </text_1.Text>
      </space_between_1.SpaceBetween>
      {!isNarrowWidth && <StatusBadge_1.StatusBadge status={status}/>}
    </view_1.View>);
}
function getActionFields() {
    return [
        'category',
        'payee',
        'payee_name',
        'notes',
        'cleared',
        'account',
        'date',
        'amount',
    ].map(function (field) { return [field, (0, rules_1.mapField)(field)]; });
}
var parentOnlyFields = ['amount', 'cleared', 'account', 'date'];
function getSplitActionFields() {
    return getActionFields().filter(function (_a) {
        var field = _a[0];
        return !parentOnlyFields.includes(field);
    });
}
function getAllocationMethodOptions() {
    return Object.entries((0, rules_1.getAllocationMethods)());
}
function ActionEditor(_a) {
    var _b;
    var action = _a.action, editorStyle = _a.editorStyle, onChange = _a.onChange, onDelete = _a.onDelete, onAdd = _a.onAdd;
    var t = (0, react_i18next_1.useTranslation)().t;
    var field = action.field, op = action.op, value = action.value, type = action.type, error = action.error, _c = action.inputKey, inputKey = _c === void 0 ? 'initial' : _c, 
    // @ts-expect-error fix this
    options = action.options;
    var templated = (options === null || options === void 0 ? void 0 : options.template) !== undefined;
    // Even if the feature flag is disabled, we still want to be able to turn off templating
    var actionTemplating = (0, useFeatureFlag_1.useFeatureFlag)('actionTemplating');
    var isTemplatingEnabled = actionTemplating || templated;
    var fields = ((options === null || options === void 0 ? void 0 : options.splitIndex) ? getSplitActionFields() : getActionFields()).filter(function (_a) {
        var s = _a[0];
        return actionTemplating || !s.includes('_name') || field === s;
    });
    return (<Editor style={editorStyle} error={error}>
      {op === 'set' ? (<>
          <OpSelect ops={['set', 'prepend-notes', 'append-notes', 'delete-transaction']} value={op} onChange={onChange}/>

          <FieldSelect 
        // @ts-expect-error fix this
        fields={fields} value={field} onChange={function (value) { return onChange('field', value); }}/>

          <view_1.View style={{ flex: 1 }}>
            {/* @ts-expect-error fix this */}
            <GenericInput_1.GenericInput key={inputKey} field={field} type={templated ? 'string' : type} op={op} value={(_b = options === null || options === void 0 ? void 0 : options.template) !== null && _b !== void 0 ? _b : value} onChange={function (v) { return onChange('value', v); }} numberFormatType="currency"/>
          </view_1.View>
          {/*Due to that these fields have id's as value it is not helpful to have templating here*/}
          {isTemplatingEnabled &&
                ['payee', 'category', 'account'].indexOf(field) === -1 && (<button_1.Button variant="bare" style={{
                    padding: 5,
                }} aria-label={templated ? t('Disable templating') : t('Enable templating')} onPress={function () { return onChange('template', !templated); }}>
                {templated ? (<v1_1.SvgCode style={{ width: 12, height: 12, color: 'inherit' }}/>) : (<v1_1.SvgAlignLeft style={{ width: 12, height: 12, color: 'inherit' }}/>)}
              </button_1.Button>)}
        </>) : op === 'set-split-amount' ? (<>
          <view_1.View style={{
                padding: '5px 10px',
                lineHeight: '1em',
                flexShrink: 0,
            }}>
            {t('allocate')}
          </view_1.View>

          <SplitAmountMethodSelect options={getAllocationMethodOptions()} value={options.method} onChange={onChange}/>

          <view_1.View style={{
                flex: 1,
                minWidth: options.method === 'fixed-percent' ? 45 : 70,
            }}>
            {options.method !== 'remainder' && (
            // @ts-expect-error fix this
            <GenericInput_1.GenericInput key={inputKey} field={field} op={op} type="number" numberFormatType={options.method === 'fixed-percent' ? 'percentage' : 'currency'} value={value} onChange={function (v) { return onChange('value', v); }}/>)}
          </view_1.View>
        </>) : op === 'link-schedule' ? (<>
          <view_1.View style={{
                padding: '5px 10px',
                color: theme_1.theme.pageTextPositive,
            }}>
            {(0, rules_1.friendlyOp)(op)}
          </view_1.View>
          <ScheduleDescription id={value || null}/>
        </>) : op === 'prepend-notes' || op === 'append-notes' ? (<>
          <OpSelect ops={['set', 'prepend-notes', 'append-notes', 'delete-transaction']} value={op} onChange={onChange}/>

          <view_1.View style={{ flex: 1 }}>
            {/* @ts-expect-error fix this */}
            <GenericInput_1.GenericInput key={inputKey} field={field} type="string" op={op} value={value} onChange={function (v) { return onChange('value', v); }}/>
          </view_1.View>
        </>) : op === 'delete-transaction' ? (<OpSelect ops={['set', 'prepend-notes', 'append-notes', 'delete-transaction']} value={op} onChange={onChange}/>) : null}

      {op !== 'delete-transaction' && (<stack_1.Stack direction="row" style={{ flexShrink: 0 }}>
          <EditorButtons onAdd={onAdd} onDelete={(op === 'set' ||
                op === 'prepend-notes' ||
                op === 'append-notes') &&
                onDelete}/>
        </stack_1.Stack>)}
    </Editor>);
}
function StageInfo() {
    return (<view_1.View style={{ position: 'relative', marginLeft: 5 }}>
      <tooltip_1.Tooltip content={<react_i18next_1.Trans>
            The stage of a rule allows you to force a specific order. Pre rules
            always run first, and post rules always run last. Within each stage
            rules are automatically ordered from least to most specific.
          </react_i18next_1.Trans>} placement="bottom start" style={__assign(__assign({}, styles_1.styles.tooltip), { padding: 10, color: theme_1.theme.pageTextLight, maxWidth: 450, lineHeight: 1.5 })}>
        <v1_1.SvgInformationOutline style={{ width: 11, height: 11, color: theme_1.theme.pageTextLight }}/>
      </tooltip_1.Tooltip>
    </view_1.View>);
}
function StageButton(_a) {
    var selected = _a.selected, children = _a.children, style = _a.style, onSelect = _a.onSelect;
    return (<button_1.Button variant="bare" style={__assign(__assign({ fontSize: 'inherit' }, (selected && {
            backgroundColor: theme_1.theme.pillBackgroundSelected,
            ':hover': { backgroundColor: theme_1.theme.pillBackgroundSelected },
        })), style)} onPress={onSelect}>
      {children}
    </button_1.Button>);
}
function newInput(item) {
    return __assign(__assign({}, item), { inputKey: (0, uuid_1.v4)() });
}
function ConditionsList(_a) {
    var conditionsOp = _a.conditionsOp, conditions = _a.conditions, editorStyle = _a.editorStyle, isSchedule = _a.isSchedule, onChangeConditions = _a.onChangeConditions;
    function addCondition(index) {
        if (conditionFields && conditionFields.length > 0) {
            conditionFields.forEach(function (field) {
                field[1] = (0, rules_1.mapField)(field[0]);
            });
        }
        // (remove the inflow and outflow pseudo-fields since they’d be a pain to get right)
        var fields = conditionFields
            .map(function (f) { return f[0]; })
            .filter(function (f) { return f !== 'amount-inflow' && f !== 'amount-outflow'; });
        // suggest a sensible next field: the same if 'or' or different if 'and'
        if (conditions.length && conditionsOp === 'or') {
            fields = [conditions[0].field];
        }
        else {
            fields = fields.filter(function (f) { return !conditions.some(function (c) { return c.field.includes(f) || f.includes(c.field); }); });
        }
        var field = fields[0] || 'payee';
        var copy = __spreadArray([], conditions, true);
        copy.splice(index + 1, 0, {
            type: rules_1.FIELD_TYPES.get(field),
            field: field,
            op: 'is',
            value: null,
            inputKey: (0, uuid_1.v4)(),
        });
        onChangeConditions(copy);
    }
    function addInitialCondition() {
        addCondition(-1);
    }
    function removeCondition(cond) {
        onChangeConditions(conditions.filter(function (c) { return c !== cond; }));
    }
    function updateCondition(cond, field, value) {
        onChangeConditions(updateValue(conditions, cond, function () {
            if (field === 'field') {
                var newCond = { field: value };
                if (value === 'amount-inflow') {
                    newCond.field = 'amount';
                    // @ts-expect-error fix this
                    newCond.options = { inflow: true };
                }
                else if (value === 'amount-outflow') {
                    newCond.field = 'amount';
                    // @ts-expect-error fix this
                    newCond.options = { outflow: true };
                }
                // @ts-expect-error fix this
                newCond.type = rules_1.FIELD_TYPES.get(newCond.field);
                var prevType = rules_1.FIELD_TYPES.get(cond.field);
                if ((prevType === 'string' || prevType === 'number') &&
                    // @ts-expect-error fix this
                    prevType === newCond.type &&
                    cond.op !== 'isbetween' &&
                    (0, rules_1.isValidOp)(newCond.field, cond.op)) {
                    // Don't clear the value & op if the type is string/number and
                    // the type hasn't changed
                    // @ts-expect-error fix this
                    newCond.op = cond.op;
                    return newInput((0, rules_1.makeValue)(cond.value, newCond));
                }
                else {
                    // @ts-expect-error fix this
                    newCond.op = (0, rules_1.getValidOps)(newCond.field)[0];
                    return newInput((0, rules_1.makeValue)(null, newCond));
                }
            }
            else if (field === 'op') {
                var op = value;
                // Switching between oneOf and other operators is a
                // special-case. It changes the input type, so we need to
                // clear the value
                if (cond.op !== 'oneOf' &&
                    cond.op !== 'notOneOf' &&
                    (op === 'oneOf' || op === 'notOneOf')) {
                    return newInput((0, rules_1.makeValue)(cond.value != null ? [cond.value] : [], __assign(__assign({}, cond), { op: value })));
                }
                else if ((cond.op === 'oneOf' || cond.op === 'notOneOf') &&
                    op !== 'oneOf' &&
                    op !== 'notOneOf') {
                    return newInput((0, rules_1.makeValue)(cond.value.length > 0 ? cond.value[0] : null, __assign(__assign({}, cond), { op: value })));
                }
                else if (cond.op !== 'isbetween' && op === 'isbetween') {
                    // TODO: I don't think we need `makeValue` anymore. It
                    // tries to parse the value as a float and we had to
                    // special-case isbetween. I don't know why we need that
                    // behavior and we can probably get rid of `makeValue`
                    return (0, rules_1.makeValue)({
                        num1: cond.value,
                        num2: cond.value,
                    }, __assign(__assign({}, cond), { op: value }));
                }
                else if (cond.op === 'isbetween' && op !== 'isbetween') {
                    return (0, rules_1.makeValue)(cond.value.num1 || 0, __assign(__assign({}, cond), { op: value }));
                }
                else {
                    return __assign(__assign({}, cond), { op: value });
                }
            }
            else if (field === 'value') {
                return (0, rules_1.makeValue)(value, cond);
            }
            return cond;
        }));
    }
    return conditions.length === 0 ? (<button_1.Button style={{ alignSelf: 'flex-start' }} onPress={addInitialCondition}>
      <react_i18next_1.Trans>Add condition</react_i18next_1.Trans>
    </button_1.Button>) : (<stack_1.Stack spacing={2} data-testid="condition-list">
      {conditions.map(function (cond, i) {
            var ops = (0, rules_1.getValidOps)(cond.field);
            // Hack for now, these ops should be the only ones available
            // for recurring dates
            if (cond.type === 'date' && cond.value && cond.value.frequency) {
                ops = ['is', 'isapprox'];
            }
            else if (cond.options &&
                (cond.options.inflow || cond.options.outflow)) {
                ops = ops.filter(function (op) { return op !== 'isbetween'; });
            }
            return (<view_1.View key={i}>
            <ConditionEditor editorStyle={editorStyle} ops={ops} condition={cond} isSchedule={isSchedule} onChange={function (name, value) {
                    updateCondition(cond, name, value);
                }} onDelete={function () { return removeCondition(cond); }} onAdd={function () { return addCondition(i); }}/>
          </view_1.View>);
        })}
    </stack_1.Stack>);
}
var getActions = function (splits) { return splits.flatMap(function (s) { return s.actions; }); };
var getUnparsedActions = function (splits) { return getActions(splits).map(rules_1.unparse); };
// TODO:
// * Dont touch child transactions?
var conditionFields = [
    'imported_payee',
    'account',
    'category',
    'date',
    'payee',
    'notes',
    'amount',
]
    .map(function (field) { return [field, (0, rules_1.mapField)(field)]; })
    .concat([
    ['amount-inflow', (0, rules_1.mapField)('amount', { inflow: true })],
    ['amount-outflow', (0, rules_1.mapField)('amount', { outflow: true })],
]);
function RuleEditor(_a) {
    var defaultRule = _a.rule, _b = _a.onSave, originalOnSave = _b === void 0 ? undefined : _b, onDelete = _a.onDelete, onCancel = _a.onCancel, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _c = (0, react_1.useState)(defaultRule.conditions.map(rules_1.parse).map(function (c) { return (__assign(__assign({}, c), { inputKey: (0, uuid_1.v4)() })); })), conditions = _c[0], setConditions = _c[1];
    var _d = (0, react_1.useState)(function () {
        var parsedActions = defaultRule.actions.map(rules_1.parse);
        return parsedActions.reduce(function (acc, action) {
            var _a, _b, _c;
            var splitIndex = (_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0;
            acc[splitIndex] = (_c = acc[splitIndex]) !== null && _c !== void 0 ? _c : { id: (0, uuid_1.v4)(), actions: [] };
            acc[splitIndex].actions.push(__assign(__assign({}, action), { inputKey: (0, uuid_1.v4)() }));
            return acc;
        }, 
        // The pre-split group is always there
        [{ id: (0, uuid_1.v4)(), actions: [] }]);
    }), actionSplits = _d[0], setActionSplits = _d[1];
    var _e = (0, react_1.useState)(defaultRule.stage), stage = _e[0], setStage = _e[1];
    var _f = (0, react_1.useState)(defaultRule.conditionsOp), conditionsOp = _f[0], setConditionsOp = _f[1];
    var _g = (0, react_1.useState)([]), transactions = _g[0], setTransactions = _g[1];
    var dispatch = (0, redux_1.useDispatch)();
    var scrollableEl = (0, react_1.useRef)(undefined);
    var isSchedule = getActions(actionSplits).some(function (action) { return action.op === 'link-schedule'; });
    (0, react_1.useEffect)(function () {
        dispatch((0, payeesSlice_1.getPayees)());
        // Disable undo while this modal is open
        (0, undo_1.disableUndo)();
        return function () { return (0, undo_1.enableUndo)(); };
    }, [dispatch]);
    (0, react_1.useEffect)(function () {
        // Flash the scrollbar
        if (scrollableEl.current) {
            var el = scrollableEl.current;
            var top_1 = el.scrollTop;
            el.scrollTop = top_1 + 1;
            el.scrollTop = top_1;
        }
        // Run it here
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var filters, conditionsOpKey, parentOnlyCondition, transactions_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                                conditions: conditions.map(rules_1.unparse),
                            })];
                        case 1:
                            filters = (_b.sent()).filters;
                            if (!(filters.length > 0)) return [3 /*break*/, 3];
                            conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                            parentOnlyCondition = actionSplits.length > 1 ? { is_child: false } : {};
                            return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                    .filter(__assign((_a = {}, _a[conditionsOpKey] = filters, _a), parentOnlyCondition))
                                    .select('*'))];
                        case 2:
                            transactions_1 = (_b.sent()).data;
                            setTransactions(transactions_1);
                            return [3 /*break*/, 4];
                        case 3:
                            setTransactions([]);
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [actionSplits, conditions, conditionsOp]);
    var selectedInst = (0, useSelected_1.useSelected)('transactions', transactions, []);
    function addInitialAction() {
        addActionToSplitAfterIndex(0, -1);
    }
    function addActionToSplitAfterIndex(splitIndex, actionIndex) {
        var _a, _b;
        var newAction;
        if (splitIndex && !((_b = (_a = actionSplits[splitIndex]) === null || _a === void 0 ? void 0 : _a.actions) === null || _b === void 0 ? void 0 : _b.length)) {
            actionSplits[splitIndex] = { id: (0, uuid_1.v4)(), actions: [] };
            newAction = {
                op: 'set-split-amount',
                options: { method: 'remainder', splitIndex: splitIndex },
                value: null,
                inputKey: (0, uuid_1.v4)(),
            };
        }
        else {
            var fieldsArray = splitIndex === 0 ? getActionFields() : getSplitActionFields();
            var fields = fieldsArray.map(function (f) { return f[0]; });
            var _loop_1 = function (action) {
                fields = fields.filter(function (f) { return f !== action.field; });
            };
            for (var _i = 0, _c = actionSplits[splitIndex].actions; _i < _c.length; _i++) {
                var action = _c[_i];
                _loop_1(action);
            }
            var field = fields[0] || 'category';
            newAction = {
                type: rules_1.FIELD_TYPES.get(field),
                field: field,
                op: 'set',
                value: null,
                options: { splitIndex: splitIndex },
                inputKey: (0, uuid_1.v4)(),
            };
        }
        var actionsCopy = __spreadArray([], actionSplits[splitIndex].actions, true);
        actionsCopy.splice(actionIndex + 1, 0, newAction);
        var copy = __spreadArray([], actionSplits, true);
        copy[splitIndex] = __assign(__assign({}, actionSplits[splitIndex]), { actions: actionsCopy });
        setActionSplits(copy);
    }
    function onChangeAction(action, field, value) {
        setActionSplits(actionSplits.map(function (_a) {
            var id = _a.id, actions = _a.actions;
            return ({
                id: id,
                actions: updateValue(actions, action, function () {
                    var _a;
                    var a = __assign({}, action);
                    if (field === 'method') {
                        a.options = __assign(__assign({}, a.options), { method: value });
                    }
                    else if (field === 'template') {
                        if (value) {
                            a.options = __assign(__assign({}, a.options), { template: a.value });
                        }
                        else {
                            a.options = __assign(__assign({}, a.options), { template: undefined });
                            if (a.type !== 'string')
                                a.value = null;
                        }
                    }
                    else {
                        a[field] = value;
                        if (((_a = a.options) === null || _a === void 0 ? void 0 : _a.template) !== undefined) {
                            a.options = __assign(__assign({}, a.options), { template: value });
                        }
                        if (field === 'field') {
                            a.type = rules_1.FIELD_TYPES.get(a.field);
                            a.value = null;
                            a.options = __assign(__assign({}, a.options), { template: undefined });
                            return newInput(a);
                        }
                        else if (field === 'op') {
                            a.value = null;
                            a.inputKey = '' + Math.random();
                            a.options = __assign(__assign({}, a.options), { template: undefined });
                            return newInput(a);
                        }
                    }
                    return a;
                }),
            });
        }));
    }
    function onChangeStage(stage) {
        setStage(stage);
    }
    function onChangeConditionsOp(value) {
        setConditionsOp(value);
    }
    function onRemoveAction(action) {
        setActionSplits(function (splits) {
            return splits.map(function (_a) {
                var id = _a.id, actions = _a.actions;
                return ({
                    id: id,
                    actions: actions.filter(function (a) { return a !== action; }),
                });
            });
        });
    }
    function onRemoveSplit(splitIndexToRemove) {
        setActionSplits(function (splits) {
            var copy = [];
            splits.forEach(function (_a, index) {
                var id = _a.id;
                if (index === splitIndexToRemove) {
                    return;
                }
                copy.push({ id: id, actions: [] });
            });
            getActions(splits).forEach(function (action) {
                var _a, _b;
                var currentSplitIndex = (_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0;
                if (currentSplitIndex === splitIndexToRemove) {
                    return;
                }
                var newSplitIndex = currentSplitIndex > splitIndexToRemove
                    ? currentSplitIndex - 1
                    : currentSplitIndex;
                copy[newSplitIndex].actions.push(__assign(__assign({}, action), { options: __assign(__assign({}, action.options), { splitIndex: newSplitIndex }) }));
            });
            return copy;
        });
    }
    function onApply() {
        var selectedTransactions = transactions.filter(function (_a) {
            var id = _a.id;
            return selectedInst.items.has(id);
        });
        (0, fetch_1.send)('rule-apply-actions', {
            transactions: selectedTransactions,
            actions: getUnparsedActions(actionSplits),
        }).then(function () {
            // This makes it refetch the transactions
            setActionSplits(__spreadArray([], actionSplits, true));
        });
    }
    function onSave() {
        return __awaiter(this, void 0, void 0, function () {
            var rule, method, _a, error, newId, usedErrorIdx_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rule = __assign(__assign({}, defaultRule), { stage: stage, conditionsOp: conditionsOp, conditions: conditions.map(rules_1.unparse), actions: getUnparsedActions(actionSplits) });
                        method = rule.id ? 'rule-update' : 'rule-add';
                        return [4 /*yield*/, (0, fetch_1.send)(method, rule)];
                    case 1:
                        _a = _b.sent(), error = _a.error, newId = _a.id;
                        if (error) {
                            // @ts-expect-error fix this
                            if (error.conditionErrors) {
                                // @ts-expect-error fix this
                                setConditions(applyErrors(conditions, error.conditionErrors));
                            }
                            // @ts-expect-error fix this
                            if (error.actionErrors) {
                                usedErrorIdx_1 = 0;
                                setActionSplits(actionSplits.map(function (item) { return (__assign(__assign({}, item), { actions: item.actions.map(function (action) {
                                        var _a;
                                        return (__assign(__assign({}, action), { 
                                            // @ts-expect-error fix this
                                            error: (_a = error.actionErrors[usedErrorIdx_1++]) !== null && _a !== void 0 ? _a : null }));
                                    }) })); }));
                            }
                        }
                        else {
                            // If adding a rule, we got back an id
                            if (newId) {
                                // @ts-expect-error fix this
                                rule.id = newId;
                            }
                            // @ts-expect-error fix this
                            originalOnSave === null || originalOnSave === void 0 ? void 0 : originalOnSave(rule);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    // Enable editing existing split rules even if the feature has since been disabled.
    var showSplitButton = actionSplits.length > 0;
    return (<view_1.View style={style}>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            padding: '0 20px',
        }}>
        <text_1.Text style={{ marginRight: 15 }}>
          <react_i18next_1.Trans>Stage of rule:</react_i18next_1.Trans>
        </text_1.Text>

        <stack_1.Stack direction="row" align="center" spacing={1}>
          <StageButton selected={stage === 'pre'} onSelect={function () { return onChangeStage('pre'); }}>
            <react_i18next_1.Trans>Pre</react_i18next_1.Trans>
          </StageButton>
          <StageButton selected={stage === null} onSelect={function () { return onChangeStage(null); }}>
            <react_i18next_1.Trans>Default</react_i18next_1.Trans>
          </StageButton>
          <StageButton selected={stage === 'post'} onSelect={function () { return onChangeStage('post'); }}>
            <react_i18next_1.Trans>Post</react_i18next_1.Trans>
          </StageButton>

          <StageInfo />
        </stack_1.Stack>
      </view_1.View>

      <view_1.View innerRef={scrollableEl} style={{
            borderBottom: '1px solid ' + theme_1.theme.tableBorder,
            padding: '0 20px 20px 20px',
            overflow: 'auto',
            maxHeight: 'calc(100% - 300px)',
            minHeight: 100,
        }}>
        <view_1.View style={{ flexShrink: 0 }}>
          <view_1.View style={{ marginBottom: 30 }}>
            <text_1.Text style={{ marginBottom: 15 }}>
              <react_i18next_1.Trans>
                If{' '}
                <FieldSelect data-testid="conditions-op" style={{ display: 'inline-flex' }} fields={[
            ['and', t('all')],
            ['or', t('any')],
        ]} value={conditionsOp} onChange={onChangeConditionsOp}/>
                {{ allOrAny: '' }} of these conditions match:
              </react_i18next_1.Trans>
            </text_1.Text>

            <ConditionsList conditionsOp={conditionsOp} conditions={conditions} editorStyle={styles_1.styles.editorPill} isSchedule={isSchedule} onChangeConditions={function (conds) { return setConditions(conds); }}/>
          </view_1.View>

          <text_1.Text style={{ marginBottom: 15 }}>
            <react_i18next_1.Trans>Then apply these actions:</react_i18next_1.Trans>
          </text_1.Text>
          <view_1.View style={{ flex: 1 }}>
            {actionSplits.length === 0 && (<button_1.Button style={{ alignSelf: 'flex-start' }} onPress={addInitialAction}>
                <react_i18next_1.Trans>Add action</react_i18next_1.Trans>
              </button_1.Button>)}
            <stack_1.Stack spacing={2} data-testid="action-split-list">
              {actionSplits.map(function (_a, splitIndex) {
            var id = _a.id, actions = _a.actions;
            return (<view_1.View key={id} nativeStyle={actionSplits.length > 1
                    ? {
                        borderColor: theme_1.theme.tableBorder,
                        borderWidth: '1px',
                        borderRadius: '5px',
                        padding: '5px',
                    }
                    : {}}>
                  {actionSplits.length > 1 && (<stack_1.Stack direction="row" justify="space-between" spacing={1}>
                      <text_1.Text style={__assign(__assign({}, styles_1.styles.smallText), { marginBottom: '10px' })}>
                        {splitIndex === 0
                        ? t('Apply to all')
                        : "".concat(t('Split'), " ").concat(splitIndex)}
                      </text_1.Text>
                      {splitIndex && (<button_1.Button variant="bare" onPress={function () { return onRemoveSplit(splitIndex); }} style={{
                            width: 20,
                            height: 20,
                        }} aria-label={t('Delete split')}>
                          <v0_1.SvgDelete style={{
                            width: 8,
                            height: 8,
                            color: 'inherit',
                        }}/>
                        </button_1.Button>)}
                    </stack_1.Stack>)}
                  <stack_1.Stack spacing={2} data-testid="action-list">
                    {actions.map(function (action, actionIndex) { return (<view_1.View key={actionIndex}>
                        <ActionEditor action={action} editorStyle={styles_1.styles.editorPill} onChange={function (name, value) {
                        onChangeAction(action, name, value);
                    }} onDelete={function () { return onRemoveAction(action); }} onAdd={function () {
                        return addActionToSplitAfterIndex(splitIndex, actionIndex);
                    }}/>
                      </view_1.View>); })}
                  </stack_1.Stack>

                  {actions.length === 0 && (<button_1.Button style={{ alignSelf: 'flex-start', marginTop: 5 }} onPress={function () { return addActionToSplitAfterIndex(splitIndex, -1); }}>
                      <react_i18next_1.Trans>Add action</react_i18next_1.Trans>
                    </button_1.Button>)}
                </view_1.View>);
        })}
            </stack_1.Stack>
            {showSplitButton && (<button_1.Button style={{ alignSelf: 'flex-start', marginTop: 15 }} onPress={function () {
                addActionToSplitAfterIndex(actionSplits.length, -1);
            }} data-testid="add-split-transactions">
                {actionSplits.length > 1
                ? t('Add another split')
                : t('Split into multiple transactions')}
              </button_1.Button>)}
          </view_1.View>
        </view_1.View>
      </view_1.View>

      <useSelected_1.SelectedProvider instance={selectedInst}>
        <view_1.View style={{ padding: '20px', flex: 1 }}>
          <space_between_1.SpaceBetween direction="horizontal" gap={5} style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            marginBottom: 12,
        }}>
            <text_1.Text style={{ color: theme_1.theme.pageTextLight, marginBottom: 0 }}>
              <react_i18next_1.Trans>This rule applies to these transactions:</react_i18next_1.Trans>
            </text_1.Text>

            <button_1.Button isDisabled={selectedInst.items.size === 0} onPress={onApply}>
              <react_i18next_1.Trans>Apply actions</react_i18next_1.Trans> ({selectedInst.items.size})
            </button_1.Button>
          </space_between_1.SpaceBetween>

          {/* @ts-expect-error fix this */}
          <SimpleTransactionsTable_1.SimpleTransactionsTable transactions={transactions} fields={getTransactionFields(conditions, getActions(actionSplits))} style={{
            border: '1px solid ' + theme_1.theme.tableBorder,
            borderRadius: '6px 6px 0 0',
        }}/>

          <space_between_1.SpaceBetween style={{
            marginTop: 20,
            justifyContent: onDelete ? 'space-between' : 'flex-end',
        }}>
            {onDelete && (<button_1.Button onPress={onDelete}>
                <react_i18next_1.Trans>Delete</react_i18next_1.Trans>
              </button_1.Button>)}

            <space_between_1.SpaceBetween>
              <button_1.Button onPress={onCancel}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              <button_1.Button variant="primary" onPress={onSave}>
                <react_i18next_1.Trans>Save</react_i18next_1.Trans>
              </button_1.Button>
            </space_between_1.SpaceBetween>
          </space_between_1.SpaceBetween>
        </view_1.View>
      </useSelected_1.SelectedProvider>
    </view_1.View>);
}
