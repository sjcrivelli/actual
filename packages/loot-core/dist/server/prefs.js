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
exports.UPCOMING_SCHEDULED_TRANSACTION_LENGTHS = exports.BUDGET_TYPES = void 0;
exports.loadPrefs = loadPrefs;
exports.savePrefs = savePrefs;
exports.unloadPrefs = unloadPrefs;
exports.getPrefs = getPrefs;
exports.getDefaultPrefs = getDefaultPrefs;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const fs = __importStar(require("../platform/server/fs"));
const sync_1 = require("./sync");
exports.BUDGET_TYPES = ['tracking', 'envelope'];
exports.UPCOMING_SCHEDULED_TRANSACTION_LENGTHS = [
    '1',
    '7',
    '14',
    '30',
];
let prefs = null;
async function loadPrefs(id) {
    if (process.env.NODE_ENV === 'test' && !id) {
        prefs = getDefaultPrefs('test', 'test_LocalPrefs');
        return prefs;
    }
    const fullpath = fs.join(fs.getBudgetDir(id), 'metadata.json');
    try {
        prefs = JSON.parse(await fs.readFile(fullpath));
    }
    catch (e) {
        // If the user messed something up, be flexible and allow them to
        // still load the budget database. Default the budget name to the
        // id.
        prefs = { id, budgetName: id };
    }
    // No matter what is in `id` field, force it to be the current id.
    // This makes it resilient to users moving around folders, etc
    prefs.id = id;
    return prefs;
}
async function savePrefs(prefsToSet, { avoidSync = false } = {}) {
    Object.assign(prefs, prefsToSet);
    if (!avoidSync) {
        // Sync whitelisted prefs
        const messages = Object.keys(prefsToSet)
            .map(key => {
            if (key === 'budgetName') {
                return {
                    dataset: 'prefs',
                    row: key,
                    column: 'value',
                    value: prefsToSet[key],
                    timestamp: crdt_1.Timestamp.send(),
                };
            }
            return null;
        })
            .filter(x => x);
        if (messages.length > 0) {
            await (0, sync_1.sendMessages)(messages);
        }
    }
    if (process.env.NODE_ENV !== 'test') {
        const prefsPath = fs.join(fs.getBudgetDir(prefs.id), 'metadata.json');
        await fs.writeFile(prefsPath, JSON.stringify(prefs));
    }
}
function unloadPrefs() {
    prefs = null;
}
function getPrefs() {
    return prefs;
}
function getDefaultPrefs(id, budgetName) {
    return { id, budgetName };
}
