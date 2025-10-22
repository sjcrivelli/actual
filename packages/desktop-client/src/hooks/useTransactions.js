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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactions = useTransactions;
exports.calculateRunningBalancesBottomUp = calculateRunningBalancesBottomUp;
exports.calculateRunningBalancesTopDown = calculateRunningBalancesTopDown;
var react_1 = require("react");
var pagedQuery_1 = require("@desktop-client/queries/pagedQuery");
function useTransactions(_a) {
    var _this = this;
    var query = _a.query, _b = _a.options, options = _b === void 0 ? { pageCount: 50, calculateRunningBalances: false } : _b;
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(false), isLoadingMore = _d[0], setIsLoadingMore = _d[1];
    var _e = (0, react_1.useState)(undefined), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)([]), transactions = _f[0], setTransactions = _f[1];
    var _g = (0, react_1.useState)(new Map()), runningBalances = _g[0], setRunningBalances = _g[1];
    var pagedQueryRef = (0, react_1.useRef)(null);
    // We don't want to re-render if options changes.
    // Putting options in a ref will prevent that and
    // allow us to use the latest options on next render.
    var optionsRef = (0, react_1.useRef)(options);
    optionsRef.current = options;
    (0, react_1.useEffect)(function () {
        var isUnmounted = false;
        setError(undefined);
        if (!query) {
            return;
        }
        function onError(error) {
            if (!isUnmounted) {
                setError(error);
                setIsLoading(false);
            }
        }
        if (query.state.table !== 'transactions') {
            onError(new Error('Query must be a transactions query.'));
            return;
        }
        setIsLoading(true);
        pagedQueryRef.current = (0, pagedQuery_1.pagedQuery)(query, {
            onData: function (data) {
                var _a, _b, _c;
                if (!isUnmounted) {
                    setTransactions(data);
                    var calculateFn = getCalculateRunningBalancesFn((_a = optionsRef.current) === null || _a === void 0 ? void 0 : _a.calculateRunningBalances);
                    if (calculateFn) {
                        setRunningBalances(calculateFn(data, (_b = query.state.tableOptions) === null || _b === void 0 ? void 0 : _b.splits, (_c = optionsRef.current) === null || _c === void 0 ? void 0 : _c.startingBalance));
                    }
                    setIsLoading(false);
                }
            },
            onError: onError,
            options: optionsRef.current.pageCount
                ? { pageCount: optionsRef.current.pageCount }
                : {},
        });
        return function () {
            var _a;
            isUnmounted = true;
            (_a = pagedQueryRef.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        };
    }, [query]);
    var loadMore = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pagedQueryRef.current) {
                        return [2 /*return*/];
                    }
                    setIsLoadingMore(true);
                    return [4 /*yield*/, pagedQueryRef.current
                            .fetchNext()
                            .catch(setError)
                            .finally(function () {
                            setIsLoadingMore(false);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var reload = (0, react_1.useCallback)(function () {
        var _a;
        (_a = pagedQueryRef.current) === null || _a === void 0 ? void 0 : _a.run();
    }, []);
    return __assign(__assign({ transactions: transactions, runningBalances: runningBalances, isLoading: isLoading }, (error && { error: error })), { reload: reload, loadMore: loadMore, isLoadingMore: isLoadingMore });
}
function getCalculateRunningBalancesFn(calculateRunningBalances) {
    if (calculateRunningBalances === void 0) { calculateRunningBalances = false; }
    return calculateRunningBalances === true
        ? calculateRunningBalancesBottomUp
        : typeof calculateRunningBalances === 'function'
            ? calculateRunningBalances
            : undefined;
}
function calculateRunningBalancesBottomUp(transactions, splits, startingBalance) {
    if (startingBalance === void 0) { startingBalance = 0; }
    return (transactions
        .filter(function (t) {
        switch (splits) {
            case 'all':
                // Only calculate parent/non-split amounts
                return !t.parent_id;
            default:
                // inline
                // grouped
                // none
                return true;
        }
    })
        // We're using `reduceRight` here to calculate the running balance in reverse order (bottom up).
        .reduceRight(function (acc, transaction, index, arr) {
        var _a;
        var previousTransactionIndex = index + 1;
        if (previousTransactionIndex >= arr.length) {
            // This is the last transaction in the list,
            // so we set the running balance to the starting balance + the amount of the transaction
            acc.set(transaction.id, startingBalance + transaction.amount);
            return acc;
        }
        var previousTransaction = arr[previousTransactionIndex];
        var previousRunningBalance = (_a = acc.get(previousTransaction.id)) !== null && _a !== void 0 ? _a : 0;
        var currentRunningBalance = previousRunningBalance + transaction.amount;
        acc.set(transaction.id, currentRunningBalance);
        return acc;
    }, new Map()));
}
function calculateRunningBalancesTopDown(transactions, splits, startingBalance) {
    if (startingBalance === void 0) { startingBalance = 0; }
    return transactions
        .filter(function (t) {
        switch (splits) {
            case 'all':
                // Only calculate parent/non-split amounts
                return !t.parent_id;
            default:
                // inline
                // grouped
                // none
                return true;
        }
    })
        .reduce(function (acc, transaction, index, arr) {
        var _a, _b;
        if (index === 0) {
            // This is the first transaction in the list,
            // so we set the running balance to the starting balance
            acc.set(transaction.id, startingBalance);
            return acc;
        }
        if (index === arr.length - 1) {
            // This is the last transaction in the list,
            // so we set the running balance to the amount of the transaction
            acc.set(transaction.id, transaction.amount);
            return acc;
        }
        var previousTransaction = arr[index - 1];
        var previousRunningBalance = (_a = acc.get(previousTransaction.id)) !== null && _a !== void 0 ? _a : 0;
        var previousAmount = (_b = previousTransaction.amount) !== null && _b !== void 0 ? _b : 0;
        var currentRunningBalance = previousRunningBalance - previousAmount;
        acc.set(transaction.id, currentRunningBalance);
        return acc;
    }, new Map());
}
