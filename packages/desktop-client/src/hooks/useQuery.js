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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = useQuery;
var react_1 = require("react");
var liveQuery_1 = require("@desktop-client/queries/liveQuery");
function useQuery(makeQuery, dependencies) {
    // Memo the resulting query. We don't care if the function
    // that creates the query changes, only the resulting query.
    // Safe to ignore the eslint warning here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var query = (0, react_1.useMemo)(makeQuery, dependencies);
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(undefined), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        setError(query === null ? new Error('Query is null') : undefined);
        setIsLoading(!!query);
        if (!query) {
            return;
        }
        var isUnmounted = false;
        var live = (0, liveQuery_1.liveQuery)(query, {
            onData: function (data) {
                if (!isUnmounted) {
                    setData(data);
                    setIsLoading(false);
                }
            },
            onError: setError,
        });
        return function () {
            isUnmounted = true;
            live === null || live === void 0 ? void 0 : live.unsubscribe();
            live = null;
        };
    }, [query]);
    return __assign({ data: data, isLoading: isLoading }, (error && { error: error }));
}
