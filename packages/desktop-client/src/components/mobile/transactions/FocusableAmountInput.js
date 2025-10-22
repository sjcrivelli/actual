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
exports.FocusableAmountInput = void 0;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var util_1 = require("loot-core/shared/util");
var util_2 = require("@desktop-client/components/budget/util");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var AmountInput = (0, react_1.memo)(function AmountInput(_a) {
    var focused = _a.focused, style = _a.style, textStyle = _a.textStyle, props = __rest(_a, ["focused", "style", "textStyle"]);
    var _b = (0, react_1.useState)(false), editing = _b[0], setEditing = _b[1];
    var _c = (0, react_1.useState)(''), text = _c[0], setText = _c[1];
    var _d = (0, react_1.useState)(0), value = _d[0], setValue = _d[1];
    var inputRef = (0, react_1.useRef)(null);
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var mergedInputRef = (0, useMergedRefs_1.useMergedRefs)(props.inputRef, inputRef);
    var initialValue = Math.abs(props.value);
    (0, react_1.useEffect)(function () {
        var _a;
        if (focused) {
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [focused]);
    (0, react_1.useEffect)(function () {
        setEditing(false);
        setText('');
        setValue(initialValue);
    }, [initialValue]);
    var onKeyUp = function (e) {
        var _a;
        if (e.key === 'Backspace' && text === '') {
            setEditing(true);
        }
        else if (e.key === 'Enter') {
            (_a = props.onEnter) === null || _a === void 0 ? void 0 : _a.call(props, e);
            if (!e.defaultPrevented) {
                onUpdate(e.currentTarget.value);
            }
        }
    };
    var applyText = function () {
        var parsed = (0, util_1.currencyToAmount)(text) || 0;
        var newValue = editing ? parsed : value;
        setValue(Math.abs(newValue));
        setEditing(false);
        setText('');
        return newValue;
    };
    var onFocus = function (e) {
        var _a;
        (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    var onUpdate = function (value) {
        var _a, _b;
        var originalAmount = Math.abs(props.value);
        var amount = applyText();
        if (amount !== originalAmount) {
            (_a = props.onUpdate) === null || _a === void 0 ? void 0 : _a.call(props, value);
            (_b = props.onUpdateAmount) === null || _b === void 0 ? void 0 : _b.call(props, amount);
        }
    };
    var onBlur = function (e) {
        var _a;
        (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        if (!e.defaultPrevented) {
            onUpdate(e.target.value);
        }
    };
    var onChangeText = function (text) {
        var _a;
        text = (0, util_1.reapplyThousandSeparators)(text);
        text = (0, util_1.appendDecimals)(text, String(hideFraction) === 'true');
        setEditing(true);
        setText(text);
        (_a = props.onChangeValue) === null || _a === void 0 ? void 0 : _a.call(props, text);
    };
    var input = (<input type="text" ref={mergedInputRef} value={text} inputMode="decimal" autoCapitalize="none" onChange={function (e) { return onChangeText(e.target.value); }} onFocus={onFocus} onBlur={onBlur} onKeyUp={onKeyUp} data-testid="amount-input" style={{ flex: 1, textAlign: 'center', position: 'absolute' }}/>);
    return (<view_1.View style={__assign({ justifyContent: 'center', borderWidth: 1, borderColor: theme_1.theme.pillBorderSelected, borderRadius: 4, padding: 5, backgroundColor: theme_1.theme.tableBackground, maxWidth: 'calc(100% - 40px)' }, style)}>
      <view_1.View style={{ overflowY: 'auto', overflowX: 'hidden' }}>{input}</view_1.View>
      <text_1.Text style={__assign({ pointerEvents: 'none' }, textStyle)} data-testid="amount-input-text">
        {editing ? text : (0, util_1.amountToCurrency)(value)}
      </text_1.Text>
    </view_1.View>);
});
exports.FocusableAmountInput = (0, react_1.memo)(function FocusableAmountInput(_a) {
    var value = _a.value, sign = _a.sign, zeroSign = _a.zeroSign, focused = _a.focused, disabled = _a.disabled, textStyle = _a.textStyle, style = _a.style, focusedStyle = _a.focusedStyle, buttonProps = _a.buttonProps, onFocus = _a.onFocus, onBlur = _a.onBlur, props = __rest(_a, ["value", "sign", "zeroSign", "focused", "disabled", "textStyle", "style", "focusedStyle", "buttonProps", "onFocus", "onBlur"]);
    var _b = (0, react_1.useState)(true), isNegative = _b[0], setIsNegative = _b[1];
    var maybeApplyNegative = function (amount, negative) {
        var absValue = Math.abs(amount);
        return negative ? -absValue : absValue;
    };
    var onUpdateAmount = function (amount, negative) {
        var _a;
        (_a = props.onUpdateAmount) === null || _a === void 0 ? void 0 : _a.call(props, maybeApplyNegative(amount, negative));
    };
    (0, react_1.useEffect)(function () {
        if (sign) {
            setIsNegative(sign === '-');
        }
        else if (value > 0 || (zeroSign !== '-' && value === 0)) {
            setIsNegative(false);
        }
    }, [sign, value, zeroSign]);
    var toggleIsNegative = function () {
        if (disabled) {
            return;
        }
        onUpdateAmount(value, !isNegative);
        setIsNegative(!isNegative);
    };
    return (<view_1.View>
      <AmountInput {...props} value={value} onFocus={onFocus} onBlur={onBlur} onUpdateAmount={function (amount) { return onUpdateAmount(amount, isNegative); }} focused={focused && !disabled} style={__assign(__assign(__assign(__assign(__assign({}, (0, util_2.makeAmountFullStyle)(value, {
            zeroColor: isNegative ? theme_1.theme.errorText : theme_1.theme.noticeText,
        })), { width: 80, justifyContent: 'center' }), style), focusedStyle), (!focused && {
            display: 'none',
        }))} textStyle={__assign({ fontSize: 15, textAlign: 'right' }, textStyle)}/>

      <view_1.View>
        {!focused && (<button_1.Button style={{
                position: 'absolute',
                right: 'calc(100% + 5px)',
                top: '8px',
            }} onPress={toggleIsNegative}>
            {isNegative ? '-' : '+'}
          </button_1.Button>)}
        <button_1.Button onPress={onFocus} 
    // Defines how far touch can start away from the button
    // hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    {...buttonProps} className={(0, css_1.css)(__assign(__assign(__assign({}, (buttonProps && buttonProps.style)), (focused && { display: 'none' })), { '&[data-pressed]': {
                backgroundColor: 'transparent',
            } }))} variant="bare">
          <view_1.View style={__assign({ borderBottomWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center' }, style)}>
            <text_1.Text style={__assign(__assign(__assign({}, (0, util_2.makeAmountFullStyle)(value)), { fontSize: 15, userSelect: 'none' }), textStyle)}>
              {(0, util_1.amountToCurrency)(Math.abs(value))}
            </text_1.Text>
          </view_1.View>
        </button_1.Button>
      </view_1.View>
    </view_1.View>);
});
