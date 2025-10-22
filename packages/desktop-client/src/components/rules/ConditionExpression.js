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
exports.ConditionExpression = ConditionExpression;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var rules_1 = require("loot-core/shared/rules");
var Value_1 = require("./Value");
var valueStyle = {
    color: theme_1.theme.pillTextHighlighted,
};
function ConditionExpression(_a) {
    var field = _a.field, op = _a.op, value = _a.value, options = _a.options, prefix = _a.prefix, style = _a.style, inline = _a.inline;
    return (<view_1.View style={__assign({ display: 'block', maxWidth: '100%', color: theme_1.theme.pillText, backgroundColor: theme_1.theme.pillBackgroundLight, borderRadius: 4, padding: '3px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, style)}>
      {prefix && <text_1.Text>{prefix} </text_1.Text>}
      <text_1.Text style={valueStyle}>{(0, rules_1.mapField)(field, options)}</text_1.Text>{' '}
      <text_1.Text>{(0, rules_1.friendlyOp)(op)}</text_1.Text>{' '}
      {!['onbudget', 'offbudget'].includes(op === null || op === void 0 ? void 0 : op.toLocaleLowerCase()) && (<Value_1.Value style={valueStyle} value={value} field={field} inline={inline}/>)}
    </view_1.View>);
}
