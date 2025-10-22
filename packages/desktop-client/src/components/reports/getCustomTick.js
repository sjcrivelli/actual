"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomTick = void 0;
var getCustomTick = function (value, isPrivacyModeEnabled) {
    if (isPrivacyModeEnabled) {
        return '...';
    }
    else {
        return value;
    }
};
exports.getCustomTick = getCustomTick;
