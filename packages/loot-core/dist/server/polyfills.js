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
// Polyfills for browser/web worker environment
const jspb = __importStar(require("google-protobuf"));
if (typeof globalThis !== 'undefined') {
    // Add a basic require polyfill for CommonJS modules
    if (typeof globalThis.require === 'undefined') {
        // @ts-ignore - we're creating a minimal require implementation
        globalThis.require = (moduleId) => {
            switch (moduleId) {
                case 'google-protobuf':
                    return jspb;
                default:
                    throw new Error(`Module not found: ${moduleId}. Add to polyfills if needed.`);
            }
        };
    }
}
// Also set on global for compatibility
if (typeof global !== 'undefined') {
    if (typeof global.require === 'undefined') {
        // @ts-ignore - assigning minimal require implementation to global
        global.require = globalThis.require;
    }
}
