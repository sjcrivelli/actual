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
exports.AmountInput = AmountInput;
exports.BetweenAmountInput = BetweenAmountInput;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var input_1 = require("@actual-app/components/input");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
function AmountInput(_a) {
    var id = _a.id, inputRef = _a.inputRef, initialValue = _a.value, _b = _a.zeroSign, zeroSign = _b === void 0 ? '-' : _b, // + or -
    sign = _a.sign, onFocus = _a.onFocus, onBlur = _a.onBlur, onChangeValue = _a.onChangeValue, onUpdate = _a.onUpdate, onEnter = _a.onEnter, style = _a.style, inputStyle = _a.inputStyle, inputClassName = _a.inputClassName, focused = _a.focused, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.autoDecimals, autoDecimals = _d === void 0 ? false : _d;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _e = (0, react_1.useState)(function () {
        if (sign)
            return sign;
        return initialValue === 0 ? zeroSign : initialValue > 0 ? '+' : '-';
    }), symbol = _e[0], setSymbol = _e[1];
    var _f = (0, react_1.useState)(focused !== null && focused !== void 0 ? focused : false), isFocused = _f[0], setIsFocused = _f[1];
    var getDisplayValue = (0, react_1.useCallback)(function (value, isEditing) {
        var absoluteValue = Math.abs(value || 0);
        return isEditing
            ? format.forEdit(absoluteValue)
            : format(absoluteValue, 'financial');
    }, [format]);
    var _g = (0, react_1.useState)(getDisplayValue(initialValue, false)), value = _g[0], setValue = _g[1];
    (0, react_1.useEffect)(function () { return setValue(getDisplayValue(initialValue, isFocused)); }, [initialValue, isFocused, getDisplayValue]);
    var buttonRef = (0, react_1.useRef)(null);
    var ref = (0, react_1.useRef)(null);
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(inputRef, ref);
    (0, react_1.useEffect)(function () {
        var _a;
        if (focused) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [focused]);
    (0, react_1.useEffect)(function () {
        if (sign) {
            setSymbol(sign);
        }
    }, [sign]);
    var getAmount = (0, react_1.useCallback)(function () {
        var signedValued = symbol === '-' ? symbol + value : value;
        return format.fromEdit(signedValued, 0);
    }, [symbol, value, format]);
    (0, react_1.useEffect)(function () {
        if (ref.current) {
            ref.current.getCurrentAmount = function () { return getAmount(); };
        }
    }, [getAmount]);
    function onSwitch() {
        if (sign) {
            return;
        }
        var amount = getAmount();
        if (amount === 0) {
            setSymbol(symbol === '+' ? '-' : '+');
        }
        fireUpdate(amount * -1);
    }
    function onInputTextChange(val) {
        var newText = val;
        if (autoDecimals) {
            var digits = val.replace(/\D/g, '');
            if (digits === '') {
                newText = '';
            }
            else {
                var intValue = parseInt(digits, 10);
                newText = format.forEdit(intValue);
            }
        }
        setValue(newText || '');
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(newText);
    }
    function fireUpdate(amount) {
        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(amount);
        if (sign) {
            setSymbol(sign);
        }
        else {
            if (amount > 0) {
                setSymbol('+');
            }
            else if (amount < 0) {
                setSymbol('-');
            }
        }
        setValue(format(Math.abs(amount), 'financial'));
    }
    function onInputAmountBlur(e) {
        var _a;
        if (!((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(e.relatedTarget))) {
            var amount = getAmount();
            fireUpdate(amount);
        }
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    }
    return (<view_1.View style={__assign(__assign(__assign(__assign({}, input_1.baseInputStyle), { padding: 0, flexDirection: 'row', flex: 1, alignItems: 'stretch' }), style), (isFocused && {
            boxShadow: '0 0 0 1px ' + theme_1.theme.formInputShadowSelected,
        }))}>
      <button_1.Button variant="bare" isDisabled={disabled || !!sign} aria-label={symbol === '-' ? t('Make positive') : t('Make negative')} style={{ padding: '0 7px' }} onPress={onSwitch} ref={buttonRef}>
        {symbol === '-' && (<v1_1.SvgSubtract style={{ width: 8, height: 8, color: 'inherit' }}/>)}
        {symbol === '+' && (<v1_1.SvgAdd style={{ width: 8, height: 8, color: 'inherit' }}/>)}
      </button_1.Button>

      <input_1.Input id={id} ref={mergedRef} inputMode="decimal" value={value} disabled={disabled} style={inputStyle} className={(0, css_1.cx)((0, css_1.css)({
            width: '100%',
            flex: 1,
            '&, &[data-focused], &[data-hovered]': {
                border: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                color: 'inherit',
            },
        }), inputClassName)} onFocus={function (e) {
            setIsFocused(true);
            setValue(format.forEdit(Math.abs(initialValue !== null && initialValue !== void 0 ? initialValue : 0)));
            onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
        }} onBlur={function (e) {
            setIsFocused(false);
            onInputAmountBlur(e);
        }} onEnter={function (_, e) {
            var amount = getAmount();
            fireUpdate(amount);
            onEnter === null || onEnter === void 0 ? void 0 : onEnter(e, amount);
        }} onChangeValue={onInputTextChange}/>
    </view_1.View>);
}
function BetweenAmountInput(_a) {
    var defaultValue = _a.defaultValue, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(defaultValue.num1), num1 = _b[0], setNum1 = _b[1];
    var _c = (0, react_1.useState)(defaultValue.num2), num2 = _c[0], setNum2 = _c[1];
    return (<view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <AmountInput value={num1} onUpdate={function (value) {
            setNum1(value);
            onChange({ num1: value, num2: num2 });
        }} style={{ color: theme_1.theme.formInputText }}/>
      <view_1.View style={{ margin: '0 5px' }}>{t('and')}</view_1.View>
      <AmountInput value={num2} onUpdate={function (value) {
            setNum2(value);
            onChange({ num1: num1, num2: value });
        }} style={{ color: theme_1.theme.formInputText }}/>
    </view_1.View>);
}
