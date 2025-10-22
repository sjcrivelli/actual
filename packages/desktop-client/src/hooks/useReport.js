"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReport = useReport;
var react_1 = require("react");
var useReports_1 = require("./useReports");
function useReport(id) {
    var _a = (0, useReports_1.useReports)(), data = _a.data, isLoading = _a.isLoading;
    return (0, react_1.useMemo)(function () { return ({
        data: data.find(function (report) { return report.id === id; }),
        isLoading: isLoading,
    }); }, [data, id, isLoading]);
}
