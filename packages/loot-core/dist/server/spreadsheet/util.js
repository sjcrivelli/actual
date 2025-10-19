"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unresolveName = unresolveName;
exports.resolveName = resolveName;
// @ts-strict-ignore
function unresolveName(name) {
    const idx = name.indexOf('!');
    if (idx !== -1) {
        return {
            sheet: name.slice(0, idx),
            name: name.slice(idx + 1),
        };
    }
    return { sheet: null, name };
}
function resolveName(sheet, name) {
    return sheet + '!' + name;
}
