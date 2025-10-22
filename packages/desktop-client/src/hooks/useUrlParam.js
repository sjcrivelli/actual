"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUrlParam = useUrlParam;
var react_1 = require("react");
var react_router_1 = require("react-router");
/**
 * Hook to get and set a specific URL search parameter value
 */
function useUrlParam(name) {
    var _a = (0, react_router_1.useSearchParams)(), searchParams = _a[0], setSearchParams = _a[1];
    var setParam = (0, react_1.useCallback)(function (value, opts) {
        setSearchParams(function (prev) {
            var next = new URLSearchParams(prev);
            if (value == null || value === '') {
                next.delete(name);
            }
            else {
                next.set(name, value);
            }
            return next;
        }, opts);
    }, [name, setSearchParams]);
    return [searchParams.get(name), setParam];
}
