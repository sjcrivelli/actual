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
exports.numberFormats = void 0;
exports.last = last;
exports.getChangedValues = getChangedValues;
exports.hasFieldsChanged = hasFieldsChanged;
exports.applyChanges = applyChanges;
exports.partitionByField = partitionByField;
exports.groupBy = groupBy;
exports.diffItems = diffItems;
exports.groupById = groupById;
exports.setIn = setIn;
exports.getIn = getIn;
exports.fastSetMerge = fastSetMerge;
exports.titleFirst = titleFirst;
exports.safeNumber = safeNumber;
exports.parseNumberFormat = parseNumberFormat;
exports.setNumberFormat = setNumberFormat;
exports.getNumberFormat = getNumberFormat;
exports.currencyToAmount = currencyToAmount;
exports.currencyToInteger = currencyToInteger;
exports.amountToInteger = amountToInteger;
exports.integerToAmount = integerToAmount;
exports.amountToCurrency = amountToCurrency;
exports.tsToRelativeTime = tsToRelativeTime;
// @ts-strict
var date_fns_1 = require("date-fns");
// --------------------------------------------------------
// Generic Helpers
// --------------------------------------------------------
function last(arr) {
    return arr[arr.length - 1];
}
function getChangedValues(obj1, obj2) {
    var diff = {};
    var keys = Object.keys(obj2);
    var hasChanged = false;
    if (obj1.id) {
        diff.id = obj1.id;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var v1 = obj1[key];
        var v2 = obj2[key];
        if (v1 !== v2) {
            diff[key] = v2;
            hasChanged = true;
        }
    }
    return hasChanged ? diff : null;
}
function hasFieldsChanged(obj1, obj2, fields) {
    return fields.some(function (field) { return obj1[field] !== obj2[field]; });
}
function applyChanges(changes, items) {
    var updatedItems = __spreadArray([], items, true);
    if (changes.added)
        updatedItems.push.apply(updatedItems, changes.added);
    if (changes.updated) {
        var _loop_1 = function (_b) {
            var id = _b.id, fields = __rest(_b, ["id"]);
            var idx = updatedItems.findIndex(function (t) { return t.id === id; });
            if (idx !== -1) {
                updatedItems[idx] = __assign(__assign({}, updatedItems[idx]), fields);
            }
        };
        for (var _i = 0, _a = changes.updated; _i < _a.length; _i++) {
            var _b = _a[_i];
            _loop_1(_b);
        }
    }
    if (changes.deleted) {
        updatedItems = updatedItems.filter(function (item) { return !changes.deleted.some(function (d) { return d.id === item.id; }); });
    }
    return updatedItems;
}
function partitionByField(data, field) {
    var res = new Map();
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        var key = item[field];
        var group = res.get(key) || [];
        group.push(item);
        res.set(key, group);
    }
    return res;
}
function groupBy(data, field) {
    return partitionByField(data, field);
}
function _groupById(data) {
    var res = new Map();
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var item = data_2[_i];
        res.set(item.id, item);
    }
    return res;
}
function diffItems(items, newItems) {
    var grouped = _groupById(items);
    var newGrouped = _groupById(newItems);
    var added = [];
    var updated = [];
    var deleted = [];
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (!newGrouped.has(item.id)) {
            deleted.push({ id: item.id });
        }
    }
    for (var _a = 0, newItems_1 = newItems; _a < newItems_1.length; _a++) {
        var newItem = newItems_1[_a];
        var existing = grouped.get(newItem.id);
        if (!existing) {
            added.push(newItem);
        }
        else {
            var diff = getChangedValues(existing, newItem);
            if (diff)
                updated.push(diff);
        }
    }
    return { added: added, updated: updated, deleted: deleted };
}
function groupById(data) {
    if (!data)
        return {};
    return Object.fromEntries(data.map(function (item) { return [item.id, item]; }));
}
// --------------------------------------------------------
// Map & Nested Structures
// --------------------------------------------------------
function setIn(map, keys, item) {
    var current = map;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (i === keys.length - 1) {
            current.set(key, item);
        }
        else {
            if (!current.has(key)) {
                current.set(key, new Map());
            }
            current = current.get(key);
        }
    }
}
function getIn(map, keys) {
    var current = map;
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        if (current instanceof Map) {
            current = current.get(key);
        }
        else {
            return undefined;
        }
        if (current == null)
            return current;
    }
    return current;
}
function fastSetMerge(set1, set2) {
    var result = new Set(set1);
    for (var _i = 0, set2_1 = set2; _i < set2_1.length; _i++) {
        var v = set2_1[_i];
        result.add(v);
    }
    return result;
}
function titleFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
var MAX_SAFE_NUMBER = Math.pow(2, 51) - 1;
var MIN_SAFE_NUMBER = -MAX_SAFE_NUMBER;
function safeNumber(value) {
    if (!Number.isInteger(value))
        throw new Error("safeNumber: number is not an integer: ".concat(value));
    if (value > MAX_SAFE_NUMBER || value < MIN_SAFE_NUMBER)
        throw new Error("safeNumber: unsafe number: ".concat(value));
    return value;
}
// --------------------------------------------------------
// Number Formatting Utilities
// --------------------------------------------------------
var NUMBER_FORMATS = [
    'comma-dot',
    'dot-comma',
    'space-comma',
    'apostrophe-dot',
    'comma-dot-in',
];
exports.numberFormats = [
    { value: 'comma-dot', label: '1,000.33', labelNoFraction: '1,000' },
    { value: 'dot-comma', label: '1.000,33', labelNoFraction: '1.000' },
    {
        value: 'space-comma',
        label: '1 000,33',
        labelNoFraction: '1 000',
    },
    { value: 'apostrophe-dot', label: "1’000.33", labelNoFraction: "1’000" },
    { value: 'comma-dot-in', label: '1,00,000.33', labelNoFraction: '1,00,000' },
];
var numberFormatConfig = {
    format: 'comma-dot',
    hideFraction: false,
};
function isNumberFormat(input) {
    if (input === void 0) { input = ''; }
    return NUMBER_FORMATS.includes(input);
}
function parseNumberFormat(_a) {
    var format = _a.format, hideFraction = _a.hideFraction;
    return {
        format: isNumberFormat(format) ? format : 'comma-dot',
        hideFraction: String(hideFraction) === 'true',
    };
}
function setNumberFormat(config) {
    numberFormatConfig = config;
}
function getNumberFormat(_a) {
    var _b = _a === void 0 ? numberFormatConfig : _a, _c = _b.format, format = _c === void 0 ? numberFormatConfig.format : _c, _d = _b.hideFraction, hideFraction = _d === void 0 ? numberFormatConfig.hideFraction : _d, decimalPlaces = _b.decimalPlaces;
    var locale;
    var thousandsSeparator;
    var decimalSeparator;
    switch (format) {
        case 'space-comma':
            locale = 'fr-FR';
            thousandsSeparator = '\u202F';
            decimalSeparator = ',';
            break;
        case 'dot-comma':
            locale = 'de-DE';
            thousandsSeparator = '.';
            decimalSeparator = ',';
            break;
        case 'apostrophe-dot':
            locale = 'de-CH';
            thousandsSeparator = '’';
            decimalSeparator = '.';
            break;
        case 'comma-dot-in':
            locale = 'en-IN';
            thousandsSeparator = ',';
            decimalSeparator = '.';
            break;
        case 'comma-dot':
        default:
            locale = 'en-US';
            thousandsSeparator = ',';
            decimalSeparator = '.';
    }
    var fractionDigitsOptions = typeof decimalPlaces === 'number'
        ? {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        }
        : {
            minimumFractionDigits: hideFraction ? 0 : 2,
            maximumFractionDigits: hideFraction ? 0 : 2,
        };
    return {
        value: format,
        thousandsSeparator: thousandsSeparator,
        decimalSeparator: decimalSeparator,
        formatter: new Intl.NumberFormat(locale, fractionDigitsOptions),
    };
}
function currencyToAmount(currencyAmount) {
    var trimmed = currencyAmount.trim();
    if (!trimmed)
        return null;
    var match = trimmed.match(/[,.](?=[^.,]*$)/);
    var integerPart = '';
    var fractionPart = '';
    var thousandsSeparator = getNumberFormat().thousandsSeparator;
    if (!match ||
        (match[0] === thousandsSeparator &&
            typeof match.index === 'number' &&
            match.index + 4 <= trimmed.length)) {
        integerPart = trimmed.replace(/[^\d-]/g, '');
    }
    else if (typeof match.index === 'number') {
        integerPart = trimmed.slice(0, match.index).replace(/[^\d-]/g, '');
        fractionPart = trimmed.slice(match.index + 1).replace(/[^\d]/g, '');
    }
    var normalized = "".concat(integerPart, ".").concat(fractionPart);
    var parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}
function currencyToInteger(currencyAmount) {
    var amount = currencyToAmount(currencyAmount);
    return amount == null ? null : amountToInteger(amount);
}
function amountToInteger(amount, decimalPlaces) {
    if (decimalPlaces === void 0) { decimalPlaces = 2; }
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(amount * multiplier);
}
function integerToAmount(integerAmount, decimalPlaces) {
    if (decimalPlaces === void 0) { decimalPlaces = 2; }
    return integerAmount / Math.pow(10, decimalPlaces);
}
function amountToCurrency(amount) {
    return getNumberFormat().formatter.format(amount);
}
// --------------------------------------------------------
// Date utilities
// --------------------------------------------------------
function tsToRelativeTime(ts, locale, options) {
    if (options === void 0) { options = { capitalize: false }; }
    if (!ts)
        return 'Unknown';
    var parsed = new Date(parseInt(ts, 10));
    var distance = (0, date_fns_1.formatDistanceToNow)(parsed, { addSuffix: true, locale: locale });
    if (options.capitalize) {
        distance = distance.charAt(0).toUpperCase() + distance.slice(1);
    }
    return distance;
}
