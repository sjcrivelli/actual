"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("../app");
const repair_1 = require("./repair");
const reset_1 = require("./reset");
const _1 = require(".");
exports.app = (0, app_1.createApp)();
exports.app.method('sync', sync);
exports.app.method('sync-reset', resetSync);
exports.app.method('sync-repair', repairSync);
async function sync() {
    return await (0, _1.fullSync)();
}
async function resetSync() {
    return await (0, reset_1.resetSync)();
}
async function repairSync() {
    await (0, repair_1.repairSync)();
}
//# sourceMappingURL=app.js.map