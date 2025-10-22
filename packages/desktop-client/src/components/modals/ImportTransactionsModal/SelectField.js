"use strict";
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
exports.SelectField = SelectField;
var react_1 = require("react");
var select_1 = require("@actual-app/components/select");
function SelectField(_a) {
    var style = _a.style, options = _a.options, value = _a.value, onChange = _a.onChange, hasHeaderRow = _a.hasHeaderRow, firstTransaction = _a.firstTransaction;
    var columns = options.map(function (option) {
        return [
            option,
            hasHeaderRow
                ? option
                : "Column ".concat(parseInt(option) + 1, " (").concat(firstTransaction[option], ")"),
        ];
    });
    // If selected column does not exist in transaction sheet, ignore
    if (!columns.find(function (col) { return col[0] === value; }))
        value = null;
    return (<select_1.Select options={__spreadArray([['choose-field', 'Choose field...']], columns, true)} value={value === null ? 'choose-field' : value} onChange={onChange} style={style}/>);
}
