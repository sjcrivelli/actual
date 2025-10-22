"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePayee = usePayee;
var react_1 = require("react");
var usePayees_1 = require("./usePayees");
function usePayee(id) {
    var payees = (0, usePayees_1.usePayees)();
    return (0, react_1.useMemo)(function () { return payees.find(function (p) { return p.id === id; }); }, [id, payees]);
}
