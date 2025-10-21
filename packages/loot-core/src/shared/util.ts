// @ts-strict
import { type Locale, formatDistanceToNow } from 'date-fns';


// --------------------------------------------------------
// Generic Helpers
// --------------------------------------------------------

export function last<T>(arr: Array<T>): T | undefined {
  return arr[arr.length - 1];
}

export function getChangedValues<T extends { id?: string }>(obj1: T, obj2: T) {
  const diff: Partial<T> = {} as Partial<T>;
  const keys = Object.keys(obj2);
  let hasChanged = false;

  if (obj1.id) {
    diff.id = obj1.id;
  }

  for (const key of keys) {
    const v1 = (obj1 as Record<string, unknown>)[key];
    const v2 = (obj2 as Record<string, unknown>)[key];
    if (v1 !== v2) {
  (diff as Record<string, unknown>)[key] = v2;
      hasChanged = true;
    }
  }

  return hasChanged ? diff : null;
}

export function hasFieldsChanged<T extends object>(
  obj1: T,
  obj2: T,
  fields: Array<keyof T>,
) {
  return fields.some(field => obj1[field] !== obj2[field]);
}

export type Diff<T extends { id: string }> = {
  added: T[];
  updated: Partial<T>[];
  deleted: Pick<T, 'id'>[];
};

export function applyChanges<T extends { id: string }>(
  changes: Diff<T>,
  items: T[],
) {
  let updatedItems = [...items];

  if (changes.added) updatedItems.push(...changes.added);

  if (changes.updated) {
    for (const { id, ...fields } of changes.updated) {
      const idx = updatedItems.findIndex(t => t.id === id);
      if (idx !== -1) {
        updatedItems[idx] = { ...updatedItems[idx], ...fields };
      }
    }
  }

  if (changes.deleted) {
    updatedItems = updatedItems.filter(
      item => !changes.deleted.some(d => d.id === item.id),
    );
  }

  return updatedItems;
}

export function partitionByField<T, K extends keyof T>(
  data: T[],
  field: K,
): Map<T[K], T[]> {
  const res = new Map<T[K], T[]>();
  for (const item of data) {
    const key = item[field];
    const group = res.get(key) || [];
    group.push(item);
    res.set(key, group);
  }
  return res;
}

export function groupBy<T, K extends keyof T>(data: T[], field: K) {
  return partitionByField(data, field);
}

function _groupById<T extends { id: string }>(data: T[]) {
  const res = new Map<string, T>();
  for (const item of data) {
    res.set(item.id, item);
  }
  return res;
}

export function diffItems<T extends { id: string }>(
  items: T[],
  newItems: T[],
): Diff<T> {
  const grouped = _groupById(items);
  const newGrouped = _groupById(newItems);
  const added: T[] = [];
  const updated: Partial<T>[] = [];
  const deleted: Pick<T, 'id'>[] = [];

  for (const item of items) {
    if (!newGrouped.has(item.id)) {
      deleted.push({ id: item.id });
    }
  }

  for (const newItem of newItems) {
    const existing = grouped.get(newItem.id);
    if (!existing) {
      added.push(newItem);
    } else {
      const diff = getChangedValues(existing, newItem);
      if (diff) updated.push(diff);
    }
  }

  return { added, updated, deleted };
}

export function groupById<T extends { id: string }>(
  data: T[] | null | undefined,
): Record<string, T> {
  if (!data) return {};
  return Object.fromEntries(data.map(item => [item.id, item]));
}

// --------------------------------------------------------
// Map & Nested Structures
// --------------------------------------------------------

export function setIn(
  map: Map<string, unknown>,
  keys: string[],
  item: unknown,
): void {
  let current = map;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current.set(key, item);
    } else {
      if (!current.has(key)) {
        current.set(key, new Map<string, unknown>());
      }
      current = current.get(key) as Map<string, unknown>;
    }
  }
}

export function getIn(map: Map<string, unknown>, keys: string[]): unknown {
  let current: unknown = map;
  for (const key of keys) {
    if (current instanceof Map) {
      current = current.get(key);
    } else {
      return undefined;
    }
    if (current == null) return current;
  }
  return current;
}

export function fastSetMerge<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set(set1);
  for (const v of set2) result.add(v);
  return result;
}

export function titleFirst(str: string | null | undefined) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// --------------------------------------------------------
// Number & Currency Handling
// --------------------------------------------------------

export type Amount = number;
export type CurrencyAmount = string;
export type IntegerAmount = number;

const MAX_SAFE_NUMBER = 2 ** 51 - 1;
const MIN_SAFE_NUMBER = -MAX_SAFE_NUMBER;

export function safeNumber(value: number) {
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
] as const;

export type NumberFormats = (typeof NUMBER_FORMATS)[number];

export const numberFormats: Array<{
  value: NumberFormats;
  label: string;
  labelNoFraction: string;
}> = [
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

let numberFormatConfig: {
  format: NumberFormats;
  hideFraction: boolean;
} = {
  format: 'comma-dot',
  hideFraction: false,
};

function isNumberFormat(input: string = ''): input is NumberFormats {
  return (NUMBER_FORMATS as readonly string[]).includes(input);
}

export function parseNumberFormat({
  format,
  hideFraction,
}: {
  format?: string;
  hideFraction?: string | boolean;
}) {
  return {
    format: isNumberFormat(format) ? format : 'comma-dot',
    hideFraction: String(hideFraction) === 'true',
  };
}

export function setNumberFormat(config: typeof numberFormatConfig) {
  numberFormatConfig = config;
}

export function getNumberFormat({
  format = numberFormatConfig.format,
  hideFraction = numberFormatConfig.hideFraction,
  decimalPlaces,
}: {
  format?: NumberFormats;
  hideFraction?: boolean;
  decimalPlaces?: number;
} = numberFormatConfig) {
  let locale: string;
  let thousandsSeparator: string;
  let decimalSeparator: string;

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

  const fractionDigitsOptions =
    typeof decimalPlaces === 'number'
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

export function currencyToAmount(currencyAmount: string): number | null {
  const trimmed = currencyAmount.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/[,.](?=[^.,]*$)/);
  let integerPart = '';
  let fractionPart = '';

  const { thousandsSeparator } = getNumberFormat();

  if (
    !match ||
    (match[0] === thousandsSeparator &&
      typeof match.index === 'number' &&
      match.index + 4 <= trimmed.length)
  ) {
    integerPart = trimmed.replace(/[^\d-]/g, '');
  } else if (typeof match.index === 'number') {
    integerPart = trimmed.slice(0, match.index).replace(/[^\d-]/g, '');
    fractionPart = trimmed.slice(match.index + 1).replace(/[^\d]/g, '');
  }

  const normalized = `${integerPart}.${fractionPart}`;
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

export function currencyToInteger(
  currencyAmount: CurrencyAmount,
): IntegerAmount | null {
  const amount = currencyToAmount(currencyAmount);
  return amount == null ? null : amountToInteger(amount);
}

export function amountToInteger(
  amount: Amount,
  decimalPlaces = 2,
): IntegerAmount {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(amount * multiplier);
}

export function integerToAmount(
  integerAmount: IntegerAmount,
  decimalPlaces = 2,
): Amount {
  return integerAmount / Math.pow(10, decimalPlaces);
}

export function amountToCurrency(amount: Amount): CurrencyAmount {
  return getNumberFormat().formatter.format(amount);
}

// --------------------------------------------------------
// Date utilities
// --------------------------------------------------------

export function tsToRelativeTime(
  ts: string | null,
  locale: Locale,
  options: { capitalize: boolean } = { capitalize: false },
): string {
  if (!ts) return 'Unknown';
  const parsed = new Date(parseInt(ts, 10));
  let distance = formatDistanceToNow(parsed, { addSuffix: true, locale });
  if (options.capitalize) {
    distance = distance.charAt(0).toUpperCase() + distance.slice(1);
  }
  return distance;
}
