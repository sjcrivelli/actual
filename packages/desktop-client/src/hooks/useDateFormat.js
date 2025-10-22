"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateFormat = useDateFormat;
var useSyncedPref_1 = require("./useSyncedPref");
function useDateFormat() {
    var dateFormat = (0, useSyncedPref_1.useSyncedPref)('dateFormat')[0];
    return dateFormat;
}
