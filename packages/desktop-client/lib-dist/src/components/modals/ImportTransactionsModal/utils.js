import * as d from 'date-fns';
import { format as formatDate_ } from 'loot-core/shared/months';
import { looselyParseAmount } from 'loot-core/shared/util';
export const dateFormats = [
    { format: 'yyyy mm dd', label: 'YYYY MM DD' },
    { format: 'yy mm dd', label: 'YY MM DD' },
    { format: 'mm dd yyyy', label: 'MM DD YYYY' },
    { format: 'mm dd yy', label: 'MM DD YY' },
    { format: 'dd mm yyyy', label: 'DD MM YYYY' },
    { format: 'dd mm yy', label: 'DD MM YY' },
];
export function isDateFormat(format) {
    return dateFormats.some(f => f.format === format);
}
export function parseDate(str, order) {
    if (typeof str !== 'string') {
        return null;
    }
    function pad(v) {
        return v && v.length === 1 ? '0' + v : v;
    }
    const dateGroups = (a, b) => (str) => {
        const parts = str
            .replace(/\bjan(\.|uary)?\b/i, '01')
            .replace(/\bfeb(\.|ruary)?\b/i, '02')
            .replace(/\bmar(\.|ch)?\b/i, '03')
            .replace(/\bapr(\.|il)?\b/i, '04')
            .replace(/\bmay\.?\b/i, '05')
            .replace(/\bjun(\.|e)?\b/i, '06')
            .replace(/\bjul(\.|y)?\b/i, '07')
            .replace(/\baug(\.|ust)?\b/i, '08')
            .replace(/\bsep(\.|tember)?\b/i, '09')
            .replace(/\boct(\.|ober)?\b/i, '10')
            .replace(/\bnov(\.|ember)?\b/i, '11')
            .replace(/\bdec(\.|ember)?\b/i, '12')
            .replace(/^[^\d]+/, '')
            .replace(/[^\d]+$/, '')
            .split(/[^\d]+/);
        if (parts.length >= 3) {
            return parts.slice(0, 3);
        }
        const digits = str.replace(/[^\d]/g, '');
        return [digits.slice(0, a), digits.slice(a, a + b), digits.slice(a + b)];
    };
    const yearFirst = dateGroups(4, 2);
    const twoDig = dateGroups(2, 2);
    let parts, year, month, day;
    switch (order) {
        case 'dd mm yyyy':
            parts = twoDig(str);
            year = parts[2];
            month = parts[1];
            day = parts[0];
            break;
        case 'dd mm yy':
            parts = twoDig(str);
            year = `20${parts[2]}`;
            month = parts[1];
            day = parts[0];
            break;
        case 'yyyy mm dd':
            parts = yearFirst(str);
            year = parts[0];
            month = parts[1];
            day = parts[2];
            break;
        case 'yy mm dd':
            parts = twoDig(str);
            year = `20${parts[0]}`;
            month = parts[1];
            day = parts[2];
            break;
        case 'mm dd yy':
            parts = twoDig(str);
            year = `20${parts[2]}`;
            month = parts[0];
            day = parts[1];
            break;
        default:
        case 'mm dd yyyy':
            parts = twoDig(str);
            year = parts[2];
            month = parts[0];
            day = parts[1];
    }
    const parsed = `${year}-${pad(month)}-${pad(day)}`;
    if (!d.isValid(d.parseISO(parsed))) {
        return null;
    }
    return parsed;
}
export function formatDate(date, format) {
    if (!date) {
        return null;
    }
    try {
        return formatDate_(date, format);
    }
    catch (e) { }
    return null;
}
export function applyFieldMappings(transaction, mappings) {
    const result = {};
    for (const [originalField, target] of Object.entries(mappings)) {
        const field = originalField === 'payee' ? 'payee_name' : originalField;
        result[field] = transaction[target || field];
    }
    // Keep preview fields on the mapped transactions
    result.trx_id = transaction.trx_id;
    result.existing = transaction.existing;
    result.ignored = transaction.ignored;
    result.selected = transaction.selected;
    result.selected_merge = transaction.selected_merge;
    result.tombstone = transaction.tombstone;
    return result;
}
function parseAmount(amount, mapper) {
    if (amount == null) {
        return null;
    }
    const parsed = typeof amount === 'string' ? looselyParseAmount(amount) : amount;
    if (parsed === null) {
        return null;
    }
    return mapper(parsed);
}
export function parseAmountFields(trans, splitMode, inOutMode, outValue, flipAmount, multiplierAmount) {
    const multiplier = parseFloat(multiplierAmount) || 1.0;
    /** Keep track of the transaction amount as inflow and outflow.
     *
     * Inflow/outflow is taken from a positive/negative transaction amount
     * respectively, or the inflow/outflow fields if split mode is enabled.
     */
    const value = {
        outflow: 0,
        inflow: 0,
    };
    // Determine the base value of the transaction from the amount or inflow/outflow fields
    if (splitMode && !inOutMode) {
        // Split mode is a little weird; first we look for an outflow and
        // if that has a value, we never want to show a number in the
        // inflow. Same for `amount`; we choose outflow first and then inflow
        value.outflow = parseAmount(trans.outflow, n => -Math.abs(n)) || 0;
        value.inflow = value.outflow
            ? 0
            : parseAmount(trans.inflow, n => Math.abs(n)) || 0;
    }
    else {
        const amount = parseAmount(trans.amount, n => n) || 0;
        if (amount >= 0)
            value.inflow = amount;
        else
            value.outflow = amount;
    }
    // Apply in/out
    if (inOutMode) {
        // The 'In/Out' field of a transaction will tell us
        // whether the transaction value is inflow or outflow.
        const transactionValue = value.outflow || value.inflow;
        if (trans.inOut === outValue) {
            value.outflow = -Math.abs(transactionValue);
            value.inflow = 0;
        }
        else {
            value.inflow = Math.abs(transactionValue);
            value.outflow = 0;
        }
    }
    // Apply flip
    if (flipAmount) {
        const oldInflow = value.inflow;
        value.inflow = Math.abs(value.outflow);
        value.outflow = -Math.abs(oldInflow);
    }
    // Apply multiplier
    value.inflow *= multiplier;
    value.outflow *= multiplier;
    if (splitMode) {
        return {
            amount: value.outflow || value.inflow,
            outflow: value.outflow,
            inflow: value.inflow,
        };
    }
    else {
        return {
            amount: value.outflow || value.inflow,
            outflow: null,
            inflow: null,
        };
    }
}
export function stripCsvImportTransaction(transaction) {
    const { existing, ignored, selected, selected_merge, trx_id, tombstone, ...trans } = transaction;
    return trans;
}
