"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrivacyMode = usePrivacyMode;
var useSyncedPref_1 = require("./useSyncedPref");
function usePrivacyMode() {
    var isPrivacyEnabled = (0, useSyncedPref_1.useSyncedPref)('isPrivacyEnabled')[0];
    return String(isPrivacyEnabled) === 'true';
}
