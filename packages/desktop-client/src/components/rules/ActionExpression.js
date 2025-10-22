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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExpression = ActionExpression;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var rules_1 = require("loot-core/shared/rules");
var ScheduleValue_1 = require("./ScheduleValue");
var Value_1 = require("./Value");
var valueStyle = {
    color: theme_1.theme.pillTextHighlighted,
};
function ActionExpression(_a) {
    var style = _a.style, props = __rest(_a, ["style"]);
    return (<view_1.View style={__assign({ display: 'block', maxWidth: '100%', color: theme_1.theme.pillText, backgroundColor: theme_1.theme.pillBackgroundLight, borderRadius: 4, padding: '3px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, style)}>
      {props.op === 'set' ? (<SetActionExpression {...props}/>) : props.op === 'set-split-amount' ? (<SetSplitAmountActionExpression {...props}/>) : props.op === 'link-schedule' ? (<LinkScheduleActionExpression {...props}/>) : props.op === 'prepend-notes' ? (<PrependNoteActionExpression {...props}/>) : props.op === 'append-notes' ? (<AppendNoteActionExpression {...props}/>) : props.op === 'delete-transaction' ? (<DeleteTransactionActionExpression {...props}/>) : null}
    </view_1.View>);
}
function SetActionExpression(_a) {
    var op = _a.op, field = _a.field, value = _a.value, options = _a.options;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<>
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>{' '}
      <text_1.Text style={valueStyle}>{(0, rules_1.mapField)(field, options)}</text_1.Text>{' '}
      <text_1.Text>{t('to ')}</text_1.Text>
      {(options === null || options === void 0 ? void 0 : options.template) ? (<>
          <text_1.Text>{t('template ')}</text_1.Text>
          <text_1.Text style={valueStyle}>{options.template}</text_1.Text>
        </>) : (<Value_1.Value style={valueStyle} value={value} field={field}/>)}
    </>);
}
function SetSplitAmountActionExpression(_a) {
    var op = _a.op, value = _a.value, options = _a.options;
    var method = options === null || options === void 0 ? void 0 : options.method;
    if (!method) {
        return null;
    }
    return (<>
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>{' '}
      <text_1.Text style={valueStyle}>{(0, rules_1.getAllocationMethods)()[method]}</text_1.Text>
      {method !== 'remainder' && ': '}
      {method === 'fixed-amount' && (<Value_1.Value style={valueStyle} value={value} field="amount"/>)}
      {method === 'fixed-percent' && <text_1.Text style={valueStyle}>{value}%</text_1.Text>}
    </>);
}
function LinkScheduleActionExpression(_a) {
    var op = _a.op, value = _a.value;
    return (<>
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text> <ScheduleValue_1.ScheduleValue value={value}/>
    </>);
}
function PrependNoteActionExpression(_a) {
    var op = _a.op, value = _a.value;
    return (<>
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>{' '}
      <Value_1.Value style={valueStyle} value={value} field="notes"/>
    </>);
}
function AppendNoteActionExpression(_a) {
    var op = _a.op, value = _a.value;
    return (<>
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>{' '}
      <Value_1.Value style={valueStyle} value={value} field="notes"/>
    </>);
}
function DeleteTransactionActionExpression(_a) {
    var op = _a.op;
    return <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>;
}
