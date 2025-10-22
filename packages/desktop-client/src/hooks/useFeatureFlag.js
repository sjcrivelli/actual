"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeatureFlag = useFeatureFlag;
var useSyncedPref_1 = require("./useSyncedPref");
var DEFAULT_FEATURE_FLAG_STATE = {
    goalTemplatesEnabled: false,
    goalTemplatesUIEnabled: false,
    actionTemplating: false,
    currency: false,
    plugins: false,
};
function useFeatureFlag(name) {
    var value = (0, useSyncedPref_1.useSyncedPref)("flags.".concat(name))[0];
    return value === undefined
        ? DEFAULT_FEATURE_FLAG_STATE[name] || false
        : String(value) === 'true';
}
