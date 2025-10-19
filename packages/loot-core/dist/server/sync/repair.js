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
exports.rebuildMerkleHash = rebuildMerkleHash;
exports.repairSync = repairSync;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const db = __importStar(require("../db"));
function rebuildMerkleHash() {
    const rows = db.runQuery('SELECT timestamp FROM messages_crdt', [], true);
    let trie = crdt_1.merkle.emptyTrie();
    for (let i = 0; i < rows.length; i++) {
        trie = crdt_1.merkle.insert(trie, crdt_1.Timestamp.parse(rows[i].timestamp));
    }
    return {
        numMessages: rows.length,
        trie,
    };
}
async function repairSync() {
    const rebuilt = rebuildMerkleHash();
    const clock = (0, crdt_1.getClock)();
    // Save it locally
    clock.merkle = rebuilt.trie;
    // Persist it in the db
    db.runQuery(db.cache('INSERT OR REPLACE INTO messages_clock (id, clock) VALUES (1, ?)'), [(0, crdt_1.serializeClock)(clock)]);
}
