"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWidget = useWidget;
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var useQuery_1 = require("./useQuery");
function useWidget(id, type) {
    var _a = (0, useQuery_1.useQuery)(function () { return (0, query_1.q)('dashboard').filter({ id: id, type: type }).select('*'); }, [id, type]), _b = _a.data, data = _b === void 0 ? [] : _b, isLoading = _a.isLoading;
    return (0, react_1.useMemo)(function () { return ({
        isLoading: isLoading,
        data: data === null || data === void 0 ? void 0 : data[0],
    }); }, [data, isLoading]);
}
