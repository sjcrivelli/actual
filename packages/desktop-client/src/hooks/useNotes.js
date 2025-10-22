"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotes = useNotes;
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var useQuery_1 = require("./useQuery");
function useNotes(id) {
    var data = (0, useQuery_1.useQuery)(function () { return (0, query_1.q)('notes').filter({ id: id }).select('*'); }, [id]).data;
    return (0, react_1.useMemo)(function () { return (data && data.length > 0 ? data[0].note : null); }, [data]);
}
