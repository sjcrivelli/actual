"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("../app");
const sheet = __importStar(require("../sheet"));
const util_1 = require("./util");
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('get-cell', getCell);
exports.app.method('get-cell-names', getCellNames);
exports.app.method('create-query', createQuery);
async function getCell({ sheetName, name, }) {
    const node = sheet.get()._getNode((0, util_1.resolveName)(sheetName, name));
    return { name: node.name, value: node.value };
}
async function getCellNames({ sheetName }) {
    const names = [];
    for (const name of sheet.get().getNodes().keys()) {
        const { sheet: nodeSheet, name: nodeName } = (0, util_1.unresolveName)(name);
        if (nodeSheet === sheetName) {
            names.push(nodeName);
        }
    }
    return names;
}
async function createQuery({ sheetName, name, query, }) {
    // Always run it regardless of cache. We don't know anything has changed
    // between the cache value being saved and now
    sheet.get().createQuery(sheetName, name, query);
    return 'ok';
}
//# sourceMappingURL=app.js.map