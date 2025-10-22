"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReport = useReport;
var react_1 = require("react");
var useSpreadsheet_1 = require("@desktop-client/hooks/useSpreadsheet");
function useReport(sheetName, getData) {
    var spreadsheet = (0, useSpreadsheet_1.useSpreadsheet)();
    var _a = (0, react_1.useState)(null), results = _a[0], setResults = _a[1];
    (0, react_1.useEffect)(function () {
        getData(spreadsheet, function (results) { return setResults(results); });
    }, [getData]);
    return results;
}
