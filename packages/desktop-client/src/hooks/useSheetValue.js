"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSheetValue = useSheetValue;
var react_1 = require("react");
var useSheetName_1 = require("./useSheetName");
var useSpreadsheet_1 = require("./useSpreadsheet");
function useSheetValue(binding, onChange) {
    var _a = (0, useSheetName_1.useSheetName)(binding), sheetName = _a.sheetName, fullSheetName = _a.fullSheetName;
    var memoizedBinding = useMemoizedBinding(function () {
        return typeof binding === 'string'
            ? { name: binding, value: undefined, query: undefined }
            : binding;
    }, binding);
    var spreadsheet = (0, useSpreadsheet_1.useSpreadsheet)();
    var _b = (0, react_1.useState)({
        name: fullSheetName,
        value: memoizedBinding.value ? memoizedBinding.value : null,
    }), result = _b[0], setResult = _b[1];
    var latestOnChange = (0, react_1.useRef)(onChange);
    latestOnChange.current = onChange;
    var latestValue = (0, react_1.useRef)(result.value);
    latestValue.current = result.value;
    (0, react_1.useLayoutEffect)(function () {
        var isMounted = true;
        var unbind = spreadsheet.bind(sheetName, memoizedBinding, function (newResult) {
            if (!isMounted) {
                return;
            }
            var newCastedResult = {
                name: newResult.name,
                // TODO: Spreadsheets, SheetNames, SheetFields, etc must be moved to the loot-core package
                value: newResult.value,
            };
            if (latestOnChange.current) {
                latestOnChange.current(newCastedResult);
            }
            if (newResult.value !== latestValue.current) {
                setResult(newCastedResult);
            }
        });
        return function () {
            isMounted = false;
            unbind();
        };
    }, [spreadsheet, sheetName, memoizedBinding]);
    return result.value;
}
function useMemoizedBinding(memoBinding, key) {
    var _a;
    var ref = (0, react_1.useRef)(null);
    var bindingName = typeof key === 'string' ? key : key.name;
    var bindingValue = typeof key === 'string' ? undefined : key.value;
    var serializedBindingQuery = typeof key === 'string' ? undefined : (_a = key.query) === null || _a === void 0 ? void 0 : _a.serializeAsString();
    if (!ref.current ||
        bindingName !== ref.current.key.name ||
        bindingValue !== ref.current.key.value ||
        serializedBindingQuery !== ref.current.key.serializedQuery) {
        // This should not update the binding reference if the binding name, value, and query values are the same.
        // Since query objects are immutable, we compare the serialized query string to make sure that we don't cause
        // a re-render whenever a new query object with the same parameter values (QueryState) is passed in.
        ref.current = {
            key: {
                name: bindingName,
                value: bindingValue,
                serializedQuery: serializedBindingQuery,
            },
            value: memoBinding(),
        };
    }
    return ref.current.value;
}
