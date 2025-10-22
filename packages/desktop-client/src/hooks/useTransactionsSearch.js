"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactionsSearch = useTransactionsSearch;
var react_1 = require("react");
var debounce_1 = require("lodash/debounce");
var queries = require("@desktop-client/queries");
function useTransactionsSearch(_a) {
    var updateQuery = _a.updateQuery, resetQuery = _a.resetQuery, dateFormat = _a.dateFormat, _b = _a.delayMs, delayMs = _b === void 0 ? 150 : _b;
    var _c = (0, react_1.useState)(false), isSearching = _c[0], setIsSearching = _c[1];
    var updateQueryRef = (0, react_1.useRef)(updateQuery);
    updateQueryRef.current = updateQuery;
    var resetQueryRef = (0, react_1.useRef)(resetQuery);
    resetQueryRef.current = resetQuery;
    var updateSearchQuery = (0, react_1.useMemo)(function () {
        return (0, debounce_1.default)(function (searchText) {
            var _a, _b;
            if (searchText === '') {
                (_a = resetQueryRef.current) === null || _a === void 0 ? void 0 : _a.call(resetQueryRef);
                setIsSearching(false);
            }
            else if (searchText) {
                (_b = resetQueryRef.current) === null || _b === void 0 ? void 0 : _b.call(resetQueryRef);
                updateQueryRef.current(function (previousQuery) {
                    return queries.transactionsSearch(previousQuery, searchText, dateFormat);
                });
                setIsSearching(true);
            }
        }, delayMs);
    }, [dateFormat, delayMs]);
    (0, react_1.useEffect)(function () {
        return function () { return updateSearchQuery.cancel(); };
    }, [updateSearchQuery]);
    return {
        isSearching: isSearching,
        search: updateSearchQuery,
    };
}
