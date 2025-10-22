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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ImportTransactionsModal = ImportTransactionsModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var select_1 = require("@actual-app/components/select");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var util_1 = require("loot-core/shared/util");
var CheckboxOption_1 = require("./CheckboxOption");
var DateFormatSelect_1 = require("./DateFormatSelect");
var FieldMappings_1 = require("./FieldMappings");
var InOutOption_1 = require("./InOutOption");
var MultiplierOption_1 = require("./MultiplierOption");
var Transaction_1 = require("./Transaction");
var utils_1 = require("./utils");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var table_1 = require("@desktop-client/components/table");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useSyncedPrefs_1 = require("@desktop-client/hooks/useSyncedPrefs");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
function getFileType(filepath) {
    var m = filepath.match(/\.([^.]*)$/);
    if (!m)
        return 'ofx';
    var rawType = m[1].toLowerCase();
    if (rawType === 'tsv')
        return 'csv';
    return rawType;
}
function getInitialDateFormat(transactions, mappings) {
    if (transactions.length === 0 || mappings.date == null) {
        return 'yyyy mm dd';
    }
    var transaction = transactions[0];
    var date = transaction[mappings.date];
    var found = date == null
        ? null
        : utils_1.dateFormats.find(function (f) { return (0, utils_1.parseDate)(date, f.format) != null; });
    return found ? found.format : 'mm dd yyyy';
}
function getInitialMappings(transactions) {
    if (transactions.length === 0) {
        return {};
    }
    var transaction = (0, utils_1.stripCsvImportTransaction)(transactions[0]);
    var fields = Object.entries(transaction);
    function key(entry) {
        return entry ? entry[0] : null;
    }
    var dateField = key(fields.find(function (_a) {
        var name = _a[0];
        return name.toLowerCase().includes('date');
    }) ||
        fields.find(function (_a) {
            var _b;
            var value = _a[1];
            return (_b = String(value)) === null || _b === void 0 ? void 0 : _b.match(/^\d+[-/]\d+[-/]\d+$/);
        }));
    var amountField = key(fields.find(function (_a) {
        var name = _a[0];
        return name.toLowerCase().includes('amount');
    }) ||
        fields.find(function (_a) {
            var _b;
            var value = _a[1];
            return (_b = String(value)) === null || _b === void 0 ? void 0 : _b.match(/^-?[.,\d]+$/);
        }));
    var categoryField = key(fields.find(function (_a) {
        var name = _a[0];
        return name.toLowerCase().includes('category');
    }));
    var payeeField = key(fields.find(function (_a) {
        var name = _a[0];
        return name.toLowerCase().includes('payee');
    }) ||
        fields.find(function (_a) {
            var name = _a[0];
            return name !== dateField && name !== amountField && name !== categoryField;
        }));
    var notesField = key(fields.find(function (_a) {
        var name = _a[0];
        return name.toLowerCase().includes('notes');
    }) ||
        fields.find(function (_a) {
            var name = _a[0];
            return name !== dateField &&
                name !== amountField &&
                name !== categoryField &&
                name !== payeeField;
        }));
    var inOutField = key(fields.find(function (_a) {
        var name = _a[0];
        return name !== dateField &&
            name !== amountField &&
            name !== payeeField &&
            name !== notesField;
    }));
    return {
        date: dateField,
        amount: amountField,
        payee: payeeField,
        notes: notesField,
        inOut: inOutField,
        category: categoryField,
    };
}
function parseCategoryFields(trans, categories) {
    var match = null;
    categories.forEach(function (category) {
        if (category.id === trans.category) {
            return null;
        }
        if (category.name === trans.category) {
            match = category.id;
        }
    });
    return match;
}
function ImportTransactionsModal(_a) {
    var _this = this;
    var _b;
    var originalFileName = _a.filename, accountId = _a.accountId, onImported = _a.onImported;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var _c = (0, useSyncedPrefs_1.useSyncedPrefs)(), prefs = _c[0], savePrefs = _c[1];
    var dispatch = (0, redux_1.useDispatch)();
    var categories = (0, useCategories_1.useCategories)();
    var _d = (0, react_1.useState)(''), multiplierAmount = _d[0], setMultiplierAmount = _d[1];
    var _e = (0, react_1.useState)('parsing'), loadingState = _e[0], setLoadingState = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(originalFileName), filename = _g[0], setFilename = _g[1];
    var _h = (0, react_1.useState)([]), transactions = _h[0], setTransactions = _h[1];
    var _j = (0, react_1.useState)([]), parsedTransactions = _j[0], setParsedTransactions = _j[1];
    var _k = (0, react_1.useState)('unknown'), filetype = _k[0], setFileType = _k[1];
    var _l = (0, react_1.useState)(null), fieldMappings = _l[0], setFieldMappings = _l[1];
    var _m = (0, react_1.useState)(false), splitMode = _m[0], setSplitMode = _m[1];
    var _o = (0, react_1.useState)(false), flipAmount = _o[0], setFlipAmount = _o[1];
    var _p = (0, react_1.useState)(false), multiplierEnabled = _p[0], setMultiplierEnabled = _p[1];
    var _q = (0, react_1.useState)(true), reconcile = _q[0], setReconcile = _q[1];
    var _r = (0, react_1.useState)(true), importNotes = _r[0], setImportNotes = _r[1];
    // This cannot be set after parsing the file, because changing it
    // requires re-parsing the file. This is different from the other
    // options which are simple post-processing. That means if you
    // parsed different files without closing the modal, it wouldn't
    // re-read this.
    var _s = (0, react_1.useState)(prefs["csv-delimiter-".concat(accountId)] ||
        (filename.endsWith('.tsv') ? '\t' : ',')), delimiter = _s[0], setDelimiter = _s[1];
    var _t = (0, react_1.useState)(parseInt(prefs["csv-skip-lines-".concat(accountId)], 10) || 0), skipLines = _t[0], setSkipLines = _t[1];
    var _u = (0, react_1.useState)(String(prefs["csv-in-out-mode-".concat(accountId)]) === 'true'), inOutMode = _u[0], setInOutMode = _u[1];
    var _v = (0, react_1.useState)((_b = prefs["csv-out-value-".concat(accountId)]) !== null && _b !== void 0 ? _b : ''), outValue = _v[0], setOutValue = _v[1];
    var _w = (0, react_1.useState)(String(prefs["csv-has-header-".concat(accountId)]) !== 'false'), hasHeaderRow = _w[0], setHasHeaderRow = _w[1];
    var _x = (0, react_1.useState)(String(prefs["ofx-fallback-missing-payee-".concat(accountId)]) !== 'false'), fallbackMissingPayeeToMemo = _x[0], setFallbackMissingPayeeToMemo = _x[1];
    var _y = (0, react_1.useState)(null), parseDateFormat = _y[0], setParseDateFormat = _y[1];
    var _z = (0, react_1.useState)(true), clearOnImport = _z[0], setClearOnImport = _z[1];
    var getImportPreview = (0, react_1.useCallback)(function (transactions, filetype, flipAmount, fieldMappings, splitMode, parseDateFormat, inOutMode, outValue, multiplierAmount) { return __awaiter(_this, void 0, void 0, function () {
        var previewTransactions, inOutModeEnabled, _i, transactions_1, trans, date, amount, category_id, inflow, outflow, inOut, existing, ignored, selected, selected_merge, tombstone, finalTransaction, previewTrx, matchedUpdateMap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previewTransactions = [];
                    inOutModeEnabled = isOfxFile(filetype) ? false : inOutMode;
                    for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                        trans = transactions_1[_i];
                        if (trans.isMatchedTransaction) {
                            // skip transactions that are matched transaction (existing transaction added to show update changes)
                            continue;
                        }
                        trans = fieldMappings
                            ? (0, utils_1.applyFieldMappings)(trans, fieldMappings)
                            : trans;
                        date = isOfxFile(filetype)
                            ? trans.date
                            : (0, utils_1.parseDate)(trans.date, parseDateFormat);
                        if (date == null) {
                            console.log("Unable to parse date ".concat(trans.date || '(empty)', " with given date format"));
                            break;
                        }
                        if (trans.payee_name == null || typeof trans.payee_name !== 'string') {
                            console.log("Unable\u00B7to\u00B7parse\u00B7payee\u00B7".concat(trans.payee_name || '(empty)'));
                            break;
                        }
                        amount = (0, utils_1.parseAmountFields)(trans, splitMode, inOutModeEnabled, outValue, flipAmount, multiplierAmount).amount;
                        if (amount == null) {
                            console.log("Transaction on ".concat(trans.date, " has no amount"));
                            break;
                        }
                        category_id = parseCategoryFields(trans, categories.list);
                        if (category_id != null) {
                            trans.category = category_id;
                        }
                        inflow = trans.inflow, outflow = trans.outflow, inOut = trans.inOut, existing = trans.existing, ignored = trans.ignored, selected = trans.selected, selected_merge = trans.selected_merge, tombstone = trans.tombstone, finalTransaction = __rest(trans, ["inflow", "outflow", "inOut", "existing", "ignored", "selected", "selected_merge", "tombstone"]);
                        previewTransactions.push(__assign(__assign({}, finalTransaction), { date: date, amount: (0, util_1.amountToInteger)(amount), cleared: clearOnImport }));
                    }
                    return [4 /*yield*/, dispatch((0, accountsSlice_1.importPreviewTransactions)({
                            accountId: accountId,
                            transactions: previewTransactions,
                        })).unwrap()];
                case 1:
                    previewTrx = _a.sent();
                    matchedUpdateMap = previewTrx.reduce(function (map, entry) {
                        // @ts-expect-error - entry.transaction might not have trx_id property
                        map[entry.transaction.trx_id] = entry;
                        return map;
                    }, {});
                    return [2 /*return*/, transactions
                            .filter(function (trans) { return !trans.isMatchedTransaction; })
                            .reduce(function (previous, current_trx) {
                            var _a;
                            var next = previous;
                            var entry = matchedUpdateMap[current_trx.trx_id];
                            var existing_trx = entry === null || entry === void 0 ? void 0 : entry.existing;
                            // if the transaction is matched with an existing one for update
                            current_trx.existing = !!existing_trx;
                            // if the transaction is an update that will be ignored
                            // (reconciled transactions or no change detected)
                            current_trx.ignored = (entry === null || entry === void 0 ? void 0 : entry.ignored) || false;
                            current_trx.tombstone = (entry === null || entry === void 0 ? void 0 : entry.tombstone) || false;
                            current_trx.selected = !current_trx.ignored;
                            current_trx.selected_merge = current_trx.existing;
                            next = next.concat(__assign({}, current_trx));
                            if (existing_trx) {
                                // add the updated existing transaction in the list, with the
                                // isMatchedTransaction flag to identify it in display and not send it again
                                existing_trx.isMatchedTransaction = true;
                                existing_trx.category = (_a = categories.list.find(function (cat) { return cat.id === existing_trx.category; })) === null || _a === void 0 ? void 0 : _a.name;
                                // add parent transaction attribute to mimic behaviour
                                existing_trx.trx_id = current_trx.trx_id;
                                existing_trx.existing = current_trx.existing;
                                existing_trx.selected = current_trx.selected;
                                existing_trx.selected_merge = current_trx.selected_merge;
                                next = next.concat(__assign({}, existing_trx));
                            }
                            return next;
                        }, [])];
            }
        });
    }); }, [accountId, categories.list, clearOnImport, dispatch]);
    var parse = (0, react_1.useCallback)(function (filename, options) { return __awaiter(_this, void 0, void 0, function () {
        var filetype, _a, errors, _b, parsedTransactions, index, transactions, flipAmount_1, fieldMappings_1, splitMode_1, parseDateFormat_1, mappings, reversedTransactions, transactionPreview;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoadingState('parsing');
                    filetype = getFileType(filename);
                    setFilename(filename);
                    setFileType(filetype);
                    return [4 /*yield*/, (0, fetch_1.send)('transactions-parse-file', {
                            filepath: filename,
                            options: options,
                        })];
                case 1:
                    _a = _c.sent(), errors = _a.errors, _b = _a.transactions, parsedTransactions = _b === void 0 ? [] : _b;
                    index = 0;
                    transactions = parsedTransactions.map(function (trans) {
                        // Add a transient transaction id to match preview with imported transactions
                        // @ts-expect-error - trans is unknown type, adding properties dynamically
                        trans.trx_id = String(index++);
                        // Select all parsed transactions before first preview run
                        // @ts-expect-error - trans is unknown type, adding properties dynamically
                        trans.selected = true;
                        return trans;
                    });
                    setLoadingState(null);
                    setError(null);
                    if (!(errors.length > 0)) return [3 /*break*/, 2];
                    setError({
                        parsed: true,
                        message: errors[0].message || 'Internal error',
                    });
                    return [3 /*break*/, 4];
                case 2:
                    flipAmount_1 = false;
                    fieldMappings_1 = null;
                    splitMode_1 = false;
                    parseDateFormat_1 = null;
                    if (filetype === 'csv' || filetype === 'qif') {
                        flipAmount_1 =
                            String(prefs["flip-amount-".concat(accountId, "-").concat(filetype)]) === 'true';
                        setFlipAmount(flipAmount_1);
                    }
                    if (filetype === 'csv') {
                        mappings = prefs["csv-mappings-".concat(accountId)];
                        mappings = mappings
                            ? JSON.parse(mappings)
                            : getInitialMappings(transactions);
                        fieldMappings_1 = mappings;
                        // @ts-expect-error - mappings might not have outflow/inflow properties
                        setFieldMappings(mappings);
                        // Set initial split mode based on any saved mapping
                        // @ts-expect-error - mappings might not have outflow/inflow properties
                        splitMode_1 = !!(mappings.outflow || mappings.inflow);
                        setSplitMode(splitMode_1);
                        parseDateFormat_1 =
                            prefs["parse-date-".concat(accountId, "-").concat(filetype)] ||
                                getInitialDateFormat(transactions, mappings);
                        setParseDateFormat((0, utils_1.isDateFormat)(parseDateFormat_1) ? parseDateFormat_1 : null);
                    }
                    else if (filetype === 'qif') {
                        parseDateFormat_1 =
                            prefs["parse-date-".concat(accountId, "-").concat(filetype)] ||
                                getInitialDateFormat(transactions, { date: 'date' });
                        setParseDateFormat((0, utils_1.isDateFormat)(parseDateFormat_1) ? parseDateFormat_1 : null);
                    }
                    else {
                        setFieldMappings(null);
                        setParseDateFormat(null);
                    }
                    reversedTransactions = transactions.reverse();
                    setParsedTransactions(reversedTransactions);
                    return [4 /*yield*/, getImportPreview(reversedTransactions, filetype, flipAmount_1, fieldMappings_1, splitMode_1, (0, utils_1.isDateFormat)(parseDateFormat_1) ? parseDateFormat_1 : null, inOutMode, outValue, multiplierAmount)];
                case 3:
                    transactionPreview = _c.sent();
                    setTransactions(transactionPreview);
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, 
    // We use some state variables from the component, but do not want to re-parse when they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountId, getImportPreview, prefs]);
    function onMultiplierChange(e) {
        var amt = e;
        if (!amt || amt.match(/^\d{1,}(\.\d{0,4})?$/)) {
            setMultiplierAmount(amt);
        }
    }
    (0, react_1.useEffect)(function () {
        var fileType = getFileType(originalFileName);
        var parseOptions = getParseOptions(fileType, {
            delimiter: delimiter,
            hasHeaderRow: hasHeaderRow,
            skipLines: skipLines,
            fallbackMissingPayeeToMemo: fallbackMissingPayeeToMemo,
            importNotes: importNotes,
        });
        parse(originalFileName, parseOptions);
    }, [
        originalFileName,
        delimiter,
        hasHeaderRow,
        skipLines,
        fallbackMissingPayeeToMemo,
        importNotes,
        parse,
    ]);
    function onSplitMode() {
        if (fieldMappings == null) {
            return;
        }
        var isSplit = !splitMode;
        setSplitMode(isSplit);
        // Run auto-detection on the fields to try to detect the fields
        // automatically
        var mappings = getInitialMappings(transactions);
        var newFieldMappings = isSplit
            ? {
                amount: null,
                outflow: mappings.amount,
                inflow: null,
            }
            : {
                amount: mappings.amount,
                outflow: null,
                inflow: null,
            };
        setFieldMappings(__assign(__assign({}, fieldMappings), newFieldMappings));
    }
    function onNewFile() {
        return __awaiter(this, void 0, void 0, function () {
            var res, fileType, parseOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.Actual.openFileDialog({
                            filters: [
                                {
                                    name: 'Financial Files',
                                    extensions: ['qif', 'ofx', 'qfx', 'csv', 'tsv', 'xml'],
                                },
                            ],
                        })];
                    case 1:
                        res = _a.sent();
                        fileType = getFileType(res[0]);
                        parseOptions = getParseOptions(fileType, {
                            delimiter: delimiter,
                            hasHeaderRow: hasHeaderRow,
                            skipLines: skipLines,
                            fallbackMissingPayeeToMemo: fallbackMissingPayeeToMemo,
                            importNotes: importNotes,
                        });
                        parse(res[0], parseOptions);
                        return [2 /*return*/];
                }
            });
        });
    }
    function onUpdateFields(field, name) {
        var _a;
        var newFieldMappings = __assign(__assign({}, fieldMappings), (_a = {}, _a[field] = name === '' ? null : name, _a));
        setFieldMappings(newFieldMappings);
    }
    function onCheckTransaction(trx_id) {
        var newTransactions = transactions.map(function (trans) {
            if (trans.trx_id === trx_id) {
                if (trans.existing) {
                    // 3-states management for transactions with existing (merged transactions)
                    // flow of states:
                    // (selected true && selected_merge true)
                    //   => (selected true && selected_merge false)
                    //     => (selected false)
                    //       => back to (selected true && selected_merge true)
                    if (!trans.selected) {
                        return __assign(__assign({}, trans), { selected: true, selected_merge: true });
                    }
                    else if (trans.selected_merge) {
                        return __assign(__assign({}, trans), { selected: true, selected_merge: false });
                    }
                    else {
                        return __assign(__assign({}, trans), { selected: false, selected_merge: false });
                    }
                }
                else {
                    return __assign(__assign({}, trans), { selected: !trans.selected });
                }
            }
            return trans;
        });
        setTransactions(newTransactions);
    }
    function onImport(close) {
        return __awaiter(this, void 0, void 0, function () {
            var finalTransactions, errorMessage, _i, transactions_2, trans, date, amount, category_id, inflow, outflow, inOut, existing, ignored, selected, selected_merge, trx_id, finalTransaction, key, didChange;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        setLoadingState('importing');
                        finalTransactions = [];
                        for (_i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
                            trans = transactions_2[_i];
                            if (trans.isMatchedTransaction ||
                                (reconcile && !trans.selected && !trans.ignored)) {
                                // skip transactions that are
                                // - matched transaction (existing transaction added to show update changes)
                                // - unselected transactions that are not ignored by the reconcilation algorithm (only when reconcilation is enabled)
                                continue;
                            }
                            trans = fieldMappings ? (0, utils_1.applyFieldMappings)(trans, fieldMappings) : trans;
                            date = isOfxFile(filetype) || isCamtFile(filetype)
                                ? trans.date
                                : (0, utils_1.parseDate)(trans.date, parseDateFormat);
                            if (date == null) {
                                errorMessage = t('Unable to parse date {{date}} with given date format', { date: trans.date || t('(empty)') });
                                break;
                            }
                            amount = (0, utils_1.parseAmountFields)(trans, splitMode, isOfxFile(filetype) ? false : inOutMode, outValue, flipAmount, multiplierAmount).amount;
                            if (amount == null) {
                                errorMessage = t('Transaction on {{date}} has no amount', {
                                    date: trans.date,
                                });
                                break;
                            }
                            category_id = parseCategoryFields(trans, categories.list);
                            trans.category = category_id;
                            inflow = trans.inflow, outflow = trans.outflow, inOut = trans.inOut, existing = trans.existing, ignored = trans.ignored, selected = trans.selected, selected_merge = trans.selected_merge, trx_id = trans.trx_id, finalTransaction = __rest(trans, ["inflow", "outflow", "inOut", "existing", "ignored", "selected", "selected_merge", "trx_id"]);
                            if (reconcile &&
                                ((trans.ignored && trans.selected) ||
                                    (trans.existing && trans.selected && !trans.selected_merge))) {
                                // in reconcile mode, force transaction add for
                                // - ignored transactions (aleardy existing) that are checked
                                // - transactions with existing (merged transactions) that are not selected_merge
                                finalTransaction.forceAddTransaction = true;
                            }
                            finalTransactions.push(__assign(__assign({}, finalTransaction), { date: date, amount: (0, util_1.amountToInteger)(amount), cleared: clearOnImport, notes: importNotes ? finalTransaction.notes : null }));
                        }
                        if (errorMessage) {
                            setLoadingState(null);
                            setError({ parsed: false, message: errorMessage });
                            return [2 /*return*/];
                        }
                        if (!isOfxFile(filetype) && !isCamtFile(filetype)) {
                            key = "parse-date-".concat(accountId, "-").concat(filetype);
                            savePrefs((_a = {}, _a[key] = parseDateFormat, _a));
                        }
                        if (isOfxFile(filetype)) {
                            savePrefs((_b = {},
                                _b["ofx-fallback-missing-payee-".concat(accountId)] = String(fallbackMissingPayeeToMemo),
                                _b));
                        }
                        if (filetype === 'csv') {
                            savePrefs((_c = {},
                                _c["csv-mappings-".concat(accountId)] = JSON.stringify(fieldMappings),
                                _c));
                            savePrefs((_d = {}, _d["csv-delimiter-".concat(accountId)] = delimiter, _d));
                            savePrefs((_e = {}, _e["csv-has-header-".concat(accountId)] = String(hasHeaderRow), _e));
                            savePrefs((_f = {}, _f["csv-skip-lines-".concat(accountId)] = String(skipLines), _f));
                            savePrefs((_g = {}, _g["csv-in-out-mode-".concat(accountId)] = String(inOutMode), _g));
                            savePrefs((_h = {}, _h["csv-out-value-".concat(accountId)] = String(outValue), _h));
                        }
                        if (filetype === 'csv' || filetype === 'qif') {
                            savePrefs((_j = {},
                                _j["flip-amount-".concat(accountId, "-").concat(filetype)] = String(flipAmount),
                                _j["import-notes-".concat(accountId, "-").concat(filetype)] = String(importNotes),
                                _j));
                        }
                        return [4 /*yield*/, dispatch((0, accountsSlice_1.importTransactions)({
                                accountId: accountId,
                                transactions: finalTransactions,
                                reconcile: reconcile,
                            })).unwrap()];
                    case 1:
                        didChange = _k.sent();
                        if (!didChange) return [3 /*break*/, 3];
                        return [4 /*yield*/, dispatch((0, payeesSlice_1.reloadPayees)())];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        if (onImported) {
                            onImported(didChange);
                        }
                        close();
                        return [2 /*return*/];
                }
            });
        });
    }
    var runImportPreview = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var selectionMap, transactionPreview, transactionPreviewWithSelections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectionMap = new Map();
                    transactions.forEach(function (trans) {
                        if (!trans.isMatchedTransaction) {
                            selectionMap.set(trans.trx_id, {
                                selected: trans.selected,
                                selected_merge: trans.selected_merge,
                            });
                        }
                    });
                    return [4 /*yield*/, getImportPreview(parsedTransactions, filetype, flipAmount, fieldMappings, splitMode, parseDateFormat, inOutMode, outValue, multiplierAmount)];
                case 1:
                    transactionPreview = _a.sent();
                    transactionPreviewWithSelections = transactionPreview.map(function (trans) {
                        if (!trans.isMatchedTransaction && selectionMap.has(trans.trx_id)) {
                            var saved = selectionMap.get(trans.trx_id);
                            return __assign(__assign({}, trans), { selected: saved.selected, selected_merge: saved.selected_merge });
                        }
                        return trans;
                    });
                    setTransactions(transactionPreviewWithSelections);
                    return [2 /*return*/];
            }
        });
    }); }, [
        getImportPreview,
        parsedTransactions,
        filetype,
        flipAmount,
        fieldMappings,
        splitMode,
        parseDateFormat,
        inOutMode,
        outValue,
        multiplierAmount,
    ]);
    (0, react_1.useEffect)(function () {
        if (parsedTransactions.length === 0 || loadingState === 'parsing') {
            return;
        }
        if (filetype === 'csv' || filetype === 'qif') {
            runImportPreview();
        }
        // intentionally exclude runImportPreview from dependencies to avoid infinite rerenders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filetype,
        flipAmount,
        fieldMappings,
        splitMode,
        parseDateFormat,
        inOutMode,
        outValue,
        multiplierAmount,
        loadingState,
        parsedTransactions.length,
    ]);
    var headers = [
        { name: t('Date'), width: 200 },
        { name: t('Payee'), width: 'flex' },
        { name: t('Notes'), width: 'flex' },
        { name: t('Category'), width: 'flex' },
    ];
    if (reconcile) {
        headers.unshift({ name: ' ', width: 31 });
    }
    if (inOutMode) {
        headers.push({
            name: t('In/Out'),
            width: 90,
            style: { textAlign: 'left' },
        });
    }
    if (splitMode) {
        headers.push({
            name: t('Outflow'),
            width: 90,
            style: { textAlign: 'right' },
        });
        headers.push({
            name: t('Inflow'),
            width: 90,
            style: { textAlign: 'right' },
        });
    }
    else {
        headers.push({
            name: t('Amount'),
            width: 90,
            style: { textAlign: 'right' },
        });
    }
    return (<Modal_1.Modal name="import-transactions" isLoading={loadingState === 'parsing'} containerProps={{ style: { width: 800 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Import transactions') +
                    (filetype ? " (".concat(filetype.toUpperCase(), ")") : '')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          {error && !error.parsed && (<view_1.View style={{ alignItems: 'center', marginBottom: 15 }}>
              <text_1.Text style={{ marginRight: 10, color: theme_1.theme.errorText }}>
                <strong>
                  <react_i18next_1.Trans>Error:</react_i18next_1.Trans>
                </strong>{' '}
                {error.message}
              </text_1.Text>
            </view_1.View>)}
          {(!error || !error.parsed) && (<view_1.View style={{
                        flex: 'unset',
                        height: 300,
                        border: '1px solid ' + theme_1.theme.tableBorder,
                    }}>
              <table_1.TableHeader headers={headers}/>

              {/* @ts-expect-error - ImportTransaction is not a TableItem */}
              <table_1.TableWithNavigator items={transactions.filter(function (trans) {
                        return !trans.isMatchedTransaction ||
                            (trans.isMatchedTransaction && reconcile);
                    })} fields={['payee', 'category', 'amount']} style={{ backgroundColor: theme_1.theme.tableHeaderBackground }} getItemKey={function (index) { return String(index); }} renderEmpty={function () {
                        return (<view_1.View style={{
                                textAlign: 'center',
                                marginTop: 25,
                                color: theme_1.theme.tableHeaderText,
                                fontStyle: 'italic',
                            }}>
                      <react_i18next_1.Trans>No transactions found</react_i18next_1.Trans>
                    </view_1.View>);
                    }} renderItem={function (_a) {
                        var item = _a.item;
                        return (<view_1.View>
                    <Transaction_1.Transaction transaction={item} showParsed={filetype === 'csv' || filetype === 'qif'} parseDateFormat={parseDateFormat} dateFormat={dateFormat} fieldMappings={fieldMappings} splitMode={splitMode} inOutMode={inOutMode} outValue={outValue} flipAmount={flipAmount} multiplierAmount={multiplierAmount} categories={categories.list} onCheckTransaction={onCheckTransaction} reconcile={reconcile}/>
                  </view_1.View>);
                    }}/>
            </view_1.View>)}
          {error && error.parsed && (<view_1.View style={{
                        color: theme_1.theme.errorText,
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
              <text_1.Text style={{ maxWidth: 450, marginBottom: 15 }}>
                <strong>Error:</strong> {error.message}
              </text_1.Text>
              {error.parsed && (<button_1.Button onPress={function () { return onNewFile(); }}>
                  <react_i18next_1.Trans>Select new file...</react_i18next_1.Trans>
                </button_1.Button>)}
            </view_1.View>)}

          {filetype === 'csv' && (<view_1.View style={{ marginTop: 10 }}>
              <FieldMappings_1.FieldMappings transactions={transactions} onChange={onUpdateFields} mappings={fieldMappings || undefined} splitMode={splitMode} inOutMode={inOutMode} hasHeaderRow={hasHeaderRow}/>
            </view_1.View>)}

          {isOfxFile(filetype) && (<CheckboxOption_1.CheckboxOption id="form_fallback_missing_payee" checked={fallbackMissingPayeeToMemo} onChange={function () {
                        setFallbackMissingPayeeToMemo(function (state) { return !state; });
                        parse(filename, getParseOptions('ofx', {
                            fallbackMissingPayeeToMemo: !fallbackMissingPayeeToMemo,
                            importNotes: importNotes,
                        }));
                    }}>
              <react_i18next_1.Trans>Use Memo as a fallback for empty Payees</react_i18next_1.Trans>
            </CheckboxOption_1.CheckboxOption>)}

          {filetype !== 'csv' && (<CheckboxOption_1.CheckboxOption id="import_notes" checked={importNotes} onChange={function () {
                        setImportNotes(!importNotes);
                        parse(filename, getParseOptions(filetype, {
                            delimiter: delimiter,
                            hasHeaderRow: hasHeaderRow,
                            skipLines: skipLines,
                            fallbackMissingPayeeToMemo: fallbackMissingPayeeToMemo,
                            importNotes: !importNotes,
                        }));
                    }}>
              <react_i18next_1.Trans>Import notes from file</react_i18next_1.Trans>
            </CheckboxOption_1.CheckboxOption>)}

          {(isOfxFile(filetype) || isCamtFile(filetype)) && (<CheckboxOption_1.CheckboxOption id="form_dont_reconcile" checked={reconcile} onChange={function () {
                        setReconcile(!reconcile);
                    }}>
              <react_i18next_1.Trans>Merge with existing transactions</react_i18next_1.Trans>
            </CheckboxOption_1.CheckboxOption>)}

          {/*Import Options */}
          {(filetype === 'qif' || filetype === 'csv') && (<view_1.View style={{ marginTop: 10 }}>
              <stack_1.Stack direction="row" align="flex-start" spacing={1} style={{ marginTop: 5 }}>
                {/* Date Format */}
                <view_1.View>
                  {(filetype === 'qif' || filetype === 'csv') && (<DateFormatSelect_1.DateFormatSelect transactions={transactions} fieldMappings={fieldMappings || undefined} parseDateFormat={parseDateFormat || undefined} onChange={function (value) {
                            setParseDateFormat((0, utils_1.isDateFormat)(value) ? value : null);
                        }}/>)}
                </view_1.View>

                {/* CSV Options */}
                {filetype === 'csv' && (<view_1.View style={{ marginLeft: 10, gap: 5 }}>
                    <forms_1.SectionLabel title={t('CSV OPTIONS')}/>
                    <label style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'baseline',
                        }}>
                      <react_i18next_1.Trans>Delimiter:</react_i18next_1.Trans>
                      <select_1.Select options={[
                            [',', ','],
                            [';', ';'],
                            ['|', '|'],
                            ['\t', 'tab'],
                        ]} value={delimiter} onChange={function (value) {
                            setDelimiter(value);
                            parse(filename, getParseOptions('csv', {
                                delimiter: value,
                                hasHeaderRow: hasHeaderRow,
                                skipLines: skipLines,
                                importNotes: importNotes,
                            }));
                        }} style={{ width: 50 }}/>
                    </label>
                    <label style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'baseline',
                        }}>
                      <react_i18next_1.Trans>Skip lines:</react_i18next_1.Trans>
                      <input_1.Input type="number" value={skipLines} min="0" onChangeValue={function (value) {
                            setSkipLines(+value);
                            parse(filename, getParseOptions('csv', {
                                delimiter: delimiter,
                                hasHeaderRow: hasHeaderRow,
                                skipLines: +value,
                                importNotes: importNotes,
                            }));
                        }} style={{ width: 50 }}/>
                    </label>
                    <CheckboxOption_1.CheckboxOption id="form_has_header" checked={hasHeaderRow} onChange={function () {
                            setHasHeaderRow(!hasHeaderRow);
                            parse(filename, getParseOptions('csv', {
                                delimiter: delimiter,
                                hasHeaderRow: !hasHeaderRow,
                                skipLines: skipLines,
                                importNotes: importNotes,
                            }));
                        }}>
                      <react_i18next_1.Trans>File has header row</react_i18next_1.Trans>
                    </CheckboxOption_1.CheckboxOption>
                    <CheckboxOption_1.CheckboxOption id="clear_on_import" checked={clearOnImport} onChange={function () {
                            setClearOnImport(!clearOnImport);
                        }}>
                      <react_i18next_1.Trans>Clear transactions on import</react_i18next_1.Trans>
                    </CheckboxOption_1.CheckboxOption>
                    <CheckboxOption_1.CheckboxOption id="form_dont_reconcile" checked={reconcile} onChange={function () {
                            setReconcile(!reconcile);
                        }}>
                      <react_i18next_1.Trans>Merge with existing transactions</react_i18next_1.Trans>
                    </CheckboxOption_1.CheckboxOption>
                  </view_1.View>)}

                <view_1.View style={{ flex: 1 }}/>

                <view_1.View style={{ marginRight: 10, gap: 5 }}>
                  <forms_1.SectionLabel title={t('AMOUNT OPTIONS')}/>
                  <CheckboxOption_1.CheckboxOption id="form_flip" checked={flipAmount} onChange={function () {
                        setFlipAmount(!flipAmount);
                    }}>
                    <react_i18next_1.Trans>Flip amount</react_i18next_1.Trans>
                  </CheckboxOption_1.CheckboxOption>
                  <MultiplierOption_1.MultiplierOption multiplierEnabled={multiplierEnabled} multiplierAmount={multiplierAmount} onToggle={function () {
                        setMultiplierEnabled(!multiplierEnabled);
                        setMultiplierAmount('');
                    }} onChangeAmount={onMultiplierChange}/>
                  {filetype === 'csv' && (<>
                      <CheckboxOption_1.CheckboxOption id="form_split" checked={splitMode} onChange={function () {
                            onSplitMode();
                        }}>
                        <react_i18next_1.Trans>
                          Split amount into separate inflow/outflow columns
                        </react_i18next_1.Trans>
                      </CheckboxOption_1.CheckboxOption>
                      <InOutOption_1.InOutOption inOutMode={inOutMode} outValue={outValue} onToggle={function () {
                            setInOutMode(!inOutMode);
                        }} onChangeText={setOutValue}/>
                    </>)}
                </view_1.View>
              </stack_1.Stack>
            </view_1.View>)}

          <view_1.View style={{ flexDirection: 'row', marginTop: 5 }}>
            {/*Submit Button */}
            <view_1.View style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '1em',
                }}>
              {(function () {
                    var count = transactions === null || transactions === void 0 ? void 0 : transactions.filter(function (trans) {
                        return !trans.isMatchedTransaction &&
                            trans.selected &&
                            !trans.tombstone;
                    }).length;
                    return (<button_1.ButtonWithLoading variant="primary" autoFocus isDisabled={count === 0} isLoading={loadingState === 'importing'} onPress={function () {
                            onImport(close);
                        }}>
                    <react_i18next_1.Trans count={count}>Import {{ count: count }} transactions</react_i18next_1.Trans>
                  </button_1.ButtonWithLoading>);
                })()}
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
function getParseOptions(fileType, options) {
    if (options === void 0) { options = {}; }
    if (fileType === 'csv') {
        var delimiter = options.delimiter, hasHeaderRow = options.hasHeaderRow, skipLines = options.skipLines;
        return { delimiter: delimiter, hasHeaderRow: hasHeaderRow, skipLines: skipLines };
    }
    if (isOfxFile(fileType)) {
        var fallbackMissingPayeeToMemo = options.fallbackMissingPayeeToMemo, importNotes_1 = options.importNotes;
        return { fallbackMissingPayeeToMemo: fallbackMissingPayeeToMemo, importNotes: importNotes_1 };
    }
    if (isCamtFile(fileType)) {
        var importNotes_2 = options.importNotes;
        return { importNotes: importNotes_2 };
    }
    var importNotes = options.importNotes;
    return { importNotes: importNotes };
}
function isOfxFile(fileType) {
    return fileType === 'ofx' || fileType === 'qfx';
}
function isCamtFile(fileType) {
    return fileType === 'xml';
}
