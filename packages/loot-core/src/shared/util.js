// @ts-strict
import { formatDistanceToNow } from 'date-fns';
// --------------------------------------------------------
// Generic Helpers
// --------------------------------------------------------
export function last(arr) {
    return arr[arr.length - 1];
}
export function getChangedValues(obj1, obj2) {
    const diff = {};
    const keys = Object.keys(obj2);
    let hasChanged = false;
    if (obj1.id) {
        diff.id = obj1.id;
    }
    for (const key of keys) {
        const v1 = obj1[key];
        const v2 = obj2[key];
        if (v1 !== v2) {
            diff[key] = v2;
            hasChanged = true;
        }
    }
    return hasChanged ? diff : null;
}
export function hasFieldsChanged(obj1, obj2, fields) {
    return fields.some(field => obj1[field] !== obj2[field]);
}
export function applyChanges(changes, items) {
    let updatedItems = [...items];
    if (changes.added)
        updatedItems.push(...changes.added);
    if (changes.updated) {
        for (const { id, ...fields } of changes.updated) {
            const idx = updatedItems.findIndex(t => t.id === id);
            if (idx !== -1) {
                updatedItems[idx] = { ...updatedItems[idx], ...fields };
            }
        }
    }
    if (changes.deleted) {
        updatedItems = updatedItems.filter(item => !changes.deleted.some(d => d.id === item.id));
    }
    return updatedItems;
}
export function partitionByField(data, field) {
    const res = new Map();
    for (const item of data) {
        const key = item[field];
        const group = res.get(key) || [];
        group.push(item);
        res.set(key, group);
    }
    return res;
}
export function groupBy(data, field) {
    return partitionByField(data, field);
}
function _groupById(data) {
    const res = new Map();
    for (const item of data) {
        res.set(item.id, item);
    }
    return res;
}
export function diffItems(items, newItems) {
    const grouped = _groupById(items);
    const newGrouped = _groupById(newItems);
    const added = [];
    const updated = [];
    const deleted = [];
    for (const item of items) {
        if (!newGrouped.has(item.id)) {
            deleted.push({ id: item.id });
        }
    }
    for (const newItem of newItems) {
        const existing = grouped.get(newItem.id);
        if (!existing) {
            added.push(newItem);
        }
        else {
            const diff = getChangedValues(existing, newItem);
            if (diff)
                updated.push(diff);
        }
    }
    return { added, updated, deleted };
}
export function groupById(data) {
    if (!data)
        return {};
    return Object.fromEntries(data.map(item => [item.id, item]));
}
// --------------------------------------------------------
// Map & Nested Structures
// --------------------------------------------------------
export function setIn(map, keys, item) {
    let current = map;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
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
export function getIn(map, keys) {
    let current = map;
    for (const key of keys) {
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
export function fastSetMerge(set1, set2) {
    const result = new Set(set1);
    for (const v of set2)
        result.add(v);
    return result;
}
export function titleFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
const MAX_SAFE_NUMBER = 2 ** 51 - 1;
const MIN_SAFE_NUMBER = -MAX_SAFE_NUMBER;
export function safeNumber(value) {
    if (!Number.isInteger(value))
        throw new Error(`safeNumber: number is not an integer: ${value}`);
    if (value > MAX_SAFE_NUMBER || value < MIN_SAFE_NUMBER)
        throw new Error(`safeNumber: unsafe number: ${value}`);
    return value;
}
// --------------------------------------------------------
// Number Formatting Utilities
// --------------------------------------------------------
const NUMBER_FORMATS = [
    'comma-dot',
    'dot-comma',
    'space-comma',
    'apostrophe-dot',
    'comma-dot-in',
];
export const numberFormats = [
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
let numberFormatConfig = {
    format: 'comma-dot',
    hideFraction: false,
};
function isNumberFormat(input = '') {
    return NUMBER_FORMATS.includes(input);
}
export function parseNumberFormat({ format, hideFraction, }) {
    return {
        format: isNumberFormat(format) ? format : 'comma-dot',
        hideFraction: String(hideFraction) === 'true',
    };
}
export function setNumberFormat(config) {
    numberFormatConfig = config;
}
export function getNumberFormat({ format = numberFormatConfig.format, hideFraction = numberFormatConfig.hideFraction, decimalPlaces, } = numberFormatConfig) {
    let locale;
    let thousandsSeparator;
    let decimalSeparator;
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
    const fractionDigitsOptions = typeof decimalPlaces === 'number'
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
        thousandsSeparator,
        decimalSeparator,
        formatter: new Intl.NumberFormat(locale, fractionDigitsOptions),
    };
}
export function currencyToAmount(currencyAmount) {
    const trimmed = currencyAmount.trim();
    if (!trimmed)
        return null;
    const match = trimmed.match(/[,.](?=[^.,]*$)/);
    let integerPart = '';
    let fractionPart = '';
    const { thousandsSeparator } = getNumberFormat();
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
    const normalized = `${integerPart}.${fractionPart}`;
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}
export function currencyToInteger(currencyAmount) {
    const amount = currencyToAmount(currencyAmount);
    return amount == null ? null : amountToInteger(amount);
}
export function amountToInteger(amount, decimalPlaces = 2) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(amount * multiplier);
}
export function integerToAmount(integerAmount, decimalPlaces = 2) {
    return integerAmount / Math.pow(10, decimalPlaces);
}
export function amountToCurrency(amount) {
    return getNumberFormat().formatter.format(amount);
}
// --------------------------------------------------------
// Date utilities
// --------------------------------------------------------
export function tsToRelativeTime(ts, locale, options = { capitalize: false }) {
    if (!ts)
        return 'Unknown';
    const parsed = new Date(parseInt(ts, 10));
    let distance = formatDistanceToNow(parsed, { addSuffix: true, locale });
    if (options.capitalize) {
        distance = distance.charAt(0).toUpperCase() + distance.slice(1);
    }
    return distance;
}
