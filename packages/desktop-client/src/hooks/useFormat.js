"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormat = useFormat;
var react_1 = require("react");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var currencies_1 = require("loot-core/shared/currencies");
var util_1 = require("loot-core/shared/util");
var useSyncedPref_1 = require("./useSyncedPref");
function format(value, type, formatter, decimalPlaces) {
    switch (type) {
        case 'string': {
            var val = JSON.stringify(value);
            // eslint-disable-next-line actual/typography
            if (val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') {
                return { formattedString: val.slice(1, -1) };
            }
            return { formattedString: val };
        }
        case 'number':
            if (typeof value !== 'number') {
                throw new Error('Value is not a number (' + typeof value + '): ' + value);
            }
            return { numericValue: value, formattedString: formatter.format(value) };
        case 'percentage':
            return { formattedString: value + '%' };
        case 'financial-with-sign':
        case 'financial-no-decimals':
        case 'financial': {
            var localValue = value;
            if (localValue == null || localValue === '') {
                localValue = 0;
            }
            else if (typeof localValue === 'string') {
                // This case is generally flawed, but we need to support it for
                // backwards compatibility for now.
                // For example, it is not clear how the string might look like
                // The Budget sends 12300, if the user inputs 123.00, but
                // there might be other components that send 123 with the same user input.
                // Ideally the string case will be removed in the future. We should always
                // use the IntegerAmount.
                // The parseInt with the replace is a workaround for the case and looks like
                // the "least wrong" solution.
                var integerString = localValue.replace(/[^\d-]/g, '');
                var parsed = parseInt(integerString, 10);
                if (isNaN(parsed)) {
                    throw new Error("Invalid numeric value: ".concat(localValue));
                }
                localValue = parsed;
            }
            if (typeof localValue !== 'number') {
                throw new Error('Value is not a number (' + typeof localValue + '): ' + localValue);
            }
            return {
                numericValue: localValue,
                formattedString: (0, util_1.amountToCurrency)(localValue, formatter, decimalPlaces),
            };
        }
        default:
            throw new Error('Unknown format type: ' + type);
    }
}
function useFormat() {
    var numberFormatPref = (0, useSyncedPref_1.useSyncedPref)('numberFormat')[0];
    var hideFractionPref = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var defaultCurrencyCodePref = (0, useSyncedPref_1.useSyncedPref)('defaultCurrencyCode')[0];
    var symbolPositionPref = (0, useSyncedPref_1.useSyncedPref)('currencySymbolPosition')[0];
    var spaceEnabledPref = (0, useSyncedPref_1.useSyncedPref)('currencySpaceBetweenAmountAndSymbol')[0];
    var activeCurrency = (0, react_1.useMemo)(function () {
        return (0, currencies_1.getCurrency)(defaultCurrencyCodePref || '');
    }, [defaultCurrencyCodePref]);
    var numberFormatConfig = (0, react_1.useMemo)(function () {
        return (0, util_1.parseNumberFormat)({
            format: numberFormatPref,
            hideFraction: hideFractionPref === 'true',
        });
    }, [numberFormatPref, hideFractionPref]);
    // Hack: keep the global number format in sync - update the settings when
    // the underlying configuration changes.
    // This should be patched by moving all number-formatting utilities away from
    // the global `getNumberFormat()` and to using the reactive `useFormat` hook.
    (0, react_1.useEffect)(function () {
        (0, util_1.setNumberFormat)(numberFormatConfig);
    }, [numberFormatConfig]);
    var applyCurrencyStyling = (0, react_1.useCallback)(function (formattedNumericValue, currencySymbol) {
        if (!currencySymbol) {
            return formattedNumericValue;
        }
        var sign = '';
        var valueWithoutSign = formattedNumericValue;
        if (formattedNumericValue.startsWith('-')) {
            sign = '-';
            valueWithoutSign = formattedNumericValue.slice(1);
        }
        var space = spaceEnabledPref === 'true' ? '\u202F' : '';
        var position = symbolPositionPref || 'before';
        var styledAmount = position === 'after'
            ? "".concat(valueWithoutSign).concat(space).concat(currencySymbol)
            : "\u202A".concat(currencySymbol, "\u202C").concat(space).concat(valueWithoutSign);
        return sign + styledAmount;
    }, [symbolPositionPref, spaceEnabledPref]);
    var formatDisplay = (0, react_1.useCallback)(function (value, type) {
        if (type === void 0) { type = 'string'; }
        var isFinancialType = type === 'financial' ||
            type === 'financial-with-sign' ||
            type === 'financial-no-decimals';
        var displayDecimalPlaces;
        if (isFinancialType) {
            if (type === 'financial-no-decimals' || hideFractionPref === 'true') {
                displayDecimalPlaces = 0;
            }
            else {
                displayDecimalPlaces = activeCurrency.decimalPlaces;
            }
        }
        var intlFormatter = (0, util_1.getNumberFormat)({
            format: numberFormatConfig.format,
            decimalPlaces: displayDecimalPlaces,
        }).formatter;
        var _a = format(value, type, intlFormatter, activeCurrency.decimalPlaces), numericValue = _a.numericValue, formattedString = _a.formattedString;
        var styledValue = formattedString;
        if (isFinancialType && activeCurrency && activeCurrency.code !== '') {
            styledValue = applyCurrencyStyling(formattedString, activeCurrency.symbol);
        }
        if (type === 'financial-with-sign' &&
            numericValue != null &&
            numericValue >= 0) {
            return '+' + styledValue;
        }
        return styledValue;
    }, [
        activeCurrency,
        numberFormatConfig,
        applyCurrencyStyling,
        hideFractionPref,
    ]);
    var toAmount = (0, react_1.useCallback)(function (value) { return (0, util_1.integerToAmount)(value, activeCurrency.decimalPlaces); }, [activeCurrency.decimalPlaces]);
    var fromAmount = (0, react_1.useCallback)(function (value) { return (0, util_1.amountToInteger)(value, activeCurrency.decimalPlaces); }, [activeCurrency.decimalPlaces]);
    var forEdit = (0, react_1.useCallback)(function (value) {
        var amount = toAmount(value);
        var decimalPlaces = hideFractionPref === 'true' ? 0 : activeCurrency.decimalPlaces;
        var editFormatter = (0, util_1.getNumberFormat)({
            format: numberFormatConfig.format,
            decimalPlaces: decimalPlaces,
        }).formatter;
        return editFormatter.format(amount);
    }, [
        toAmount,
        hideFractionPref,
        activeCurrency.decimalPlaces,
        numberFormatConfig.format,
    ]);
    var fromEdit = (0, react_1.useCallback)(function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (value == null) {
            return defaultValue;
        }
        var trimmed = value.trim();
        if (trimmed === '') {
            return defaultValue;
        }
        var numericValue = (0, arithmetic_1.evalArithmetic)(trimmed, null);
        if (numericValue === null || isNaN(numericValue)) {
            numericValue = (0, util_1.currencyToAmount)(trimmed);
        }
        if (numericValue !== null && !isNaN(numericValue)) {
            return fromAmount(numericValue);
        }
        return defaultValue;
    }, [fromAmount]);
    return Object.assign(formatDisplay, {
        forEdit: forEdit,
        fromEdit: fromEdit,
        currency: activeCurrency,
    });
}
