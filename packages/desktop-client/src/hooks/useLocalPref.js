"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalPref = useLocalPref;
var usehooks_ts_1 = require("usehooks-ts");
var useMetadataPref_1 = require("./useMetadataPref");
/**
 * Local preferences are scoped to a specific budget file.
 */
function useLocalPref(prefName) {
    var budgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    return (0, usehooks_ts_1.useLocalStorage)("".concat(budgetId, "-").concat(prefName), undefined, {
        deserializer: JSON.parse,
        serializer: JSON.stringify,
    });
}
