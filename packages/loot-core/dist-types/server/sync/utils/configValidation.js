"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
function validateConfig(config) {
    if (!config) {
        throw new Error('[sync] Missing configuration object.');
        // Placeholder validation — expand later
        if (Object.keys(config).length === 0) {
            throw new Error('[sync] Empty configuration object.');
        }
    }
}
//# sourceMappingURL=configValidation.js.map