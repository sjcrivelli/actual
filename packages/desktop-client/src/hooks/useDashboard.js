"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboard = useDashboard;
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var useQuery_1 = require("./useQuery");
function useDashboard() {
    var _a = (0, useQuery_1.useQuery)(function () { return (0, query_1.q)('dashboard').select('*'); }, []), queryData = _a.data, isLoading = _a.isLoading;
    return (0, react_1.useMemo)(function () { return ({
        isLoading: isLoading,
        data: queryData || [],
    }); }, [isLoading, queryData]);
}
