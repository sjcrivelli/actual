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
exports.loadMappings = loadMappings;
exports.getMappings = getMappings;
exports.getMapping = getMapping;
// @ts-strict-ignore
const index_1 = require("../sync/index");
const db = __importStar(require("./index"));
// This file keeps all the mappings in memory so we can access it
// synchronously. This is primarily used in the rules system, but
// there may be other uses in the future. You don't need to worry
// about this generally; if you are querying transactions, ids are
// transparently mapped for you. But if you are building something
// that stores ids and later uses them, you need to remember to map
// the ids.
//
// IMPORTANT: `loadMappings` must be called first before other modules
// that listen for sync changes. This must be the first sync listener
// to run in case other listeners use this mapping table; otherwise
// they might see stale mappings.
let allMappings;
let unlistenSync;
async function loadMappings() {
    // The mappings are separated into tables specific to the type of
    // data. But you know, we really could keep a global mapping table.
    const categories = (await db.all('SELECT * FROM category_mapping')).map(r => [r.id, r.transferId]);
    const payees = (await db.all('SELECT * FROM payee_mapping')).map(r => [r.id, r.targetId]);
    // All ids are unique, so we can just keep a global table of mappings
    allMappings = new Map(categories.concat(payees));
    if (unlistenSync) {
        unlistenSync();
    }
    unlistenSync = (0, index_1.addSyncListener)(onApplySync);
}
function onApplySync(oldValues, newValues) {
    newValues.forEach((items, table) => {
        if (table.indexOf('mapping') !== -1) {
            const field = table === 'category_mapping' ? 'transferId' : 'targetId';
            items.forEach(newValue => {
                allMappings.set(newValue.id, newValue[field]);
            });
        }
    });
}
function getMappings() {
    return allMappings;
}
function getMapping(id) {
    return allMappings.get(id) || null;
}
