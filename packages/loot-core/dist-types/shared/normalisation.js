"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalisedString = getNormalisedString;
function getNormalisedString(value) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}
//# sourceMappingURL=normalisation.js.map