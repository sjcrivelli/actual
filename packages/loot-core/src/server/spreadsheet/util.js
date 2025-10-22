"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unresolveName = unresolveName;
exports.resolveName = resolveName;
// @ts-strict-ignore
function unresolveName(name) {
    var idx = name.indexOf('!');
    if (idx !== -1) {
        return {
            sheet: name.slice(0, idx),
            name: name.slice(idx + 1),
        };
    }
    return { sheet: null, name: name };
}
function resolveName(sheet, name) {
    return sheet + '!' + name;
}
