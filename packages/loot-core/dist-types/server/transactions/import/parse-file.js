"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFile = parseFile;
// @ts-strict-ignore
const sync_1 = require("csv-parse/sync");
const fs = __importStar(require("../../../platform/server/fs"));
const log_1 = require("../../../platform/server/log");
const util_1 = require("../../../shared/util");
const ofx2json_1 = require("./ofx2json");
const qif2json_1 = require("./qif2json");
const xmlcamt2json_1 = require("./xmlcamt2json");
/**
 * Parse OFX amount strings to numbers.
 * Handles various OFX amount formats including currency symbols, parentheses, and multiple decimal places.
 * Returns null for invalid amounts instead of NaN.
 */
function parseOfxAmount(amount) {
    if (!amount || typeof amount !== 'string') {
        return null;
    }
    // Handle parentheses for negative amounts (e.g., "(30.00)" -> "-30.00")
    let cleaned = amount.trim();
    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
        cleaned = '-' + cleaned.slice(1, -1);
    }
    // Remove currency symbols and other non-numeric characters except decimal point and minus sign
    cleaned = cleaned.replace(/[^\d.-]/g, '');
    // Handle multiple decimal points by keeping only the first one
    const decimalIndex = cleaned.indexOf('.');
    if (decimalIndex !== -1) {
        const beforeDecimal = cleaned.slice(0, decimalIndex);
        const afterDecimal = cleaned.slice(decimalIndex + 1).replace(/\./g, '');
        cleaned = beforeDecimal + '.' + afterDecimal;
    }
    // Ensure we have a valid number format
    if (!cleaned || cleaned === '-' || cleaned === '.') {
        return null;
    }
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
}
async function parseFile(filepath, options = {}) {
    const errors = Array();
    const m = filepath.match(/\.[^.]*$/);
    if (m) {
        const ext = m[0];
        switch (ext.toLowerCase()) {
            case '.qif':
                return parseQIF(filepath, options);
            case '.csv':
            case '.tsv':
                return parseCSV(filepath, options);
            case '.ofx':
            case '.qfx':
                return parseOFX(filepath, options);
            case '.xml':
                return parseCAMT(filepath, options);
            default:
        }
    }
    errors.push({
        message: 'Invalid file type',
        internal: '',
    });
    return { errors, transactions: [] };
}
async function parseCSV(filepath, options) {
    const errors = Array();
    let contents = await fs.readFile(filepath);
    if (options.skipLines > 0) {
        const lines = contents.split(/\r?\n/);
        contents = lines.slice(options.skipLines).join('\r\n');
    }
    let data;
    try {
        data = (0, sync_1.parse)(contents, {
            columns: options?.hasHeaderRow,
            bom: true,
            delimiter: options?.delimiter || ',',
            // eslint-disable-next-line actual/typography
            quote: '"',
            trim: true,
            relax_column_count: true,
            skip_empty_lines: true,
        });
    }
    catch (err) {
        errors.push({
            message: 'Failed parsing: ' + err.message,
            internal: err.message,
        });
        return { errors, transactions: [] };
    }
    return { errors, transactions: data };
}
async function parseQIF(filepath, options = {}) {
    const errors = Array();
    const contents = await fs.readFile(filepath);
    let data;
    try {
        data = (0, qif2json_1.qif2json)(contents);
    }
    catch (err) {
        errors.push({
            message: 'Failed parsing: doesn’t look like a valid QIF file.',
            internal: err.stack,
        });
        return { errors, transactions: [] };
    }
    return {
        errors: [],
        transactions: data.transactions
            .map(trans => ({
            amount: trans.amount != null ? (0, util_1.looselyParseAmount)(trans.amount) : null,
            date: trans.date,
            payee_name: trans.payee,
            imported_payee: trans.payee,
            notes: options.importNotes ? trans.memo || null : null,
        }))
            .filter(trans => trans.date != null && trans.amount != null),
    };
}
async function parseOFX(filepath, options) {
    const errors = Array();
    const contents = await fs.readFile(filepath);
    let data;
    try {
        data = await (0, ofx2json_1.ofx2json)(contents);
    }
    catch (err) {
        errors.push({
            message: 'Failed importing file',
            internal: err.stack,
        });
        return { errors };
    }
    // Banks don't always implement the OFX standard properly
    // If no payee is available try and fallback to memo
    const useMemoFallback = options.fallbackMissingPayeeToMemo;
    return {
        errors,
        transactions: data.transactions.map(trans => {
            const parsedAmount = parseOfxAmount(trans.amount);
            if (parsedAmount === null) {
                errors.push({
                    message: `Invalid amount format: ${trans.amount}`,
                    internal: `Failed to parse amount: ${trans.amount}`,
                });
            }
            return {
                amount: parsedAmount || 0,
                imported_id: trans.fitId,
                date: trans.date,
                payee_name: trans.name || (useMemoFallback ? trans.memo : null),
                imported_payee: trans.name || (useMemoFallback ? trans.memo : null),
                notes: options.importNotes ? trans.memo || null : null, //memo used for payee
            };
        }),
    };
}
async function parseCAMT(filepath, options = {}) {
    const errors = Array();
    const contents = await fs.readFile(filepath);
    let data;
    try {
        data = await (0, xmlcamt2json_1.xmlCAMT2json)(contents);
    }
    catch (err) {
        log_1.logger.error(err);
        errors.push({
            message: 'Failed importing file',
            internal: err.stack,
        });
        return { errors };
    }
    return {
        errors,
        transactions: data.map(trans => ({
            ...trans,
            notes: options.importNotes ? trans.notes : null,
        })),
    };
}
//# sourceMappingURL=parse-file.js.map