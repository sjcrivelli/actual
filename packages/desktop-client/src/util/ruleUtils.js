"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupActionsBySplitIndex = groupActionsBySplitIndex;
var uuid_1 = require("uuid");
function groupActionsBySplitIndex(actions) {
    return actions.reduce(function (acc, action) {
        var _a, _b, _c;
        var splitIndex = 'options' in action ? ((_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0) : 0;
        acc[splitIndex] = (_c = acc[splitIndex]) !== null && _c !== void 0 ? _c : { id: (0, uuid_1.v4)(), actions: [] };
        acc[splitIndex].actions.push(action);
        return acc;
    }, []);
}
