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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.internal = void 0;
exports.init = init;
exports.shutdown = shutdown;
// @ts-ignore: bundle not available until we build it
// eslint-disable-next-line import/extensions
const bundle = __importStar(require("./app/bundle.api.js"));
const injected = __importStar(require("./injected"));
const validateNodeVersion_1 = require("./validateNodeVersion");
let actualApp;
exports.internal = bundle.lib;
__exportStar(require("./methods"), exports);
exports.utils = __importStar(require("./utils"));
async function init(config = {}) {
    if (actualApp) {
        return;
    }
    (0, validateNodeVersion_1.validateNodeVersion)();
    if (!globalThis.fetch) {
        globalThis.fetch = (url, init) => {
            return import('node-fetch').then(({ default: fetch }) => fetch(url, init));
        };
    }
    await bundle.init(config);
    actualApp = bundle.lib;
    injected.override(bundle.lib.send);
    return bundle.lib;
}
async function shutdown() {
    if (actualApp) {
        try {
            await actualApp.send('sync');
        }
        catch (e) {
            // most likely that no budget is loaded, so the sync failed
        }
        await actualApp.send('close-budget');
        actualApp = null;
    }
}
