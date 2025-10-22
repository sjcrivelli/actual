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
exports.PercentInput = PercentInput;
var react_1 = require("react");
var input_1 = require("@actual-app/components/input");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var clampToPercent = function (value) { return Math.max(Math.min(value, 100), 0); };
function PercentInput(_a) {
    var id = _a.id, inputRef = _a.inputRef, _b = _a.value, initialValue = _b === void 0 ? 0 : _b, onFocus = _a.onFocus, onBlur = _a.onBlur, onChangeValue = _a.onChangeValue, onUpdatePercent = _a.onUpdatePercent, style = _a.style, focused = _a.focused, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    var format = (0, useFormat_1.useFormat)();
    var _d = (0, react_1.useState)(function () {
        return format(clampToPercent(initialValue), 'percentage');
    }), value = _d[0], setValue = _d[1];
    (0, react_1.useEffect)(function () {
        var clampedInitialValue = clampToPercent(initialValue);
        if (clampedInitialValue !== initialValue) {
            setValue(format(clampedInitialValue, 'percentage'));
            onUpdatePercent === null || onUpdatePercent === void 0 ? void 0 : onUpdatePercent(clampedInitialValue);
        }
    }, [initialValue, onUpdatePercent, format]);
    var ref = (0, react_1.useRef)(null);
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(inputRef, ref);
    (0, react_1.useEffect)(function () {
        var _a;
        if (focused) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [focused]);
    function onSelectionChange() {
        if (!ref.current) {
            return;
        }
        var selectionStart = ref.current.selectionStart;
        var selectionEnd = ref.current.selectionEnd;
        if (selectionStart === selectionEnd &&
            selectionStart !== null &&
            selectionStart >= ref.current.value.length) {
            ref.current.setSelectionRange(ref.current.value.length - 1, ref.current.value.length - 1);
        }
    }
    function onInputTextChange(val) {
        var number = val.replace(/[^0-9.]/g, '');
        setValue(number ? format(number, 'percentage') : '');
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(number);
    }
    function fireUpdate() {
        var _a;
        var clampedValue = clampToPercent((_a = (0, arithmetic_1.evalArithmetic)(value.replace('%', ''), 0)) !== null && _a !== void 0 ? _a : 0);
        onUpdatePercent === null || onUpdatePercent === void 0 ? void 0 : onUpdatePercent(clampedValue);
        onInputTextChange(String(clampedValue));
    }
    function onInputAmountBlur(e) {
        var _a;
        if (!((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))) {
            fireUpdate();
        }
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    }
    return (<input_1.Input id={id} ref={mergedRef} inputMode="decimal" value={value} disabled={disabled} style={__assign({ flex: 1, alignItems: 'stretch' }, style)} onEnter={fireUpdate} onChangeValue={onInputTextChange} onBlur={onInputAmountBlur} onFocus={onFocus} onSelect={onSelectionChange}/>);
}
