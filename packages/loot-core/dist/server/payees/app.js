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
const db = __importStar(require("../db"));
const models_1 = require("../models");
const mutators_1 = require("../mutators");
const sync_1 = require("../sync");
const rules = __importStar(require("../transactions/transaction-rules"));
const undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('payee-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createPayee)));
exports.app.method('common-payees-get', getCommonPayees);
exports.app.method('payees-get', getPayees);
exports.app.method('payees-get-orphaned', getOrphanedPayees);
exports.app.method('payees-get-rule-counts', getPayeeRuleCounts);
exports.app.method('payees-merge', (0, mutators_1.mutator)((0, undo_1.undoable)(mergePayees, args => ({
    mergeIds: args.mergeIds,
    targetId: args.targetId,
}))));
exports.app.method('payees-batch-change', (0, mutators_1.mutator)((0, undo_1.undoable)(batchChangePayees)));
exports.app.method('payees-check-orphaned', checkOrphanedPayees);
exports.app.method('payees-get-rules', getPayeeRules);
async function createPayee({ name }) {
    return db.insertPayee({ name });
}
async function getCommonPayees() {
    // TODO: Update to an AQL query. Server must return AQL entities not the raw DB data.
    return (await db.getCommonPayees()).map(models_1.payeeModel.fromDb);
}
async function getPayees() {
    // TODO: Update to an AQL query. Server must return AQL entities not the raw DB data.
    return (await db.getPayees()).map(models_1.payeeModel.fromDb);
}
async function getOrphanedPayees() {
    return await db.syncGetOrphanedPayees();
}
async function getPayeeRuleCounts() {
    const payeeCounts = {};
    rules.iterateIds(rules.getRules(), 'payee', (rule, id) => {
        if (payeeCounts[id] == null) {
            payeeCounts[id] = 0;
        }
        payeeCounts[id]++;
    });
    return payeeCounts;
}
async function mergePayees({ targetId, mergeIds, }) {
    await db.mergePayees(targetId, mergeIds);
}
async function batchChangePayees({ added, deleted, updated, }) {
    await (0, sync_1.batchMessages)(async () => {
        if (deleted) {
            await Promise.all(deleted.map(p => ({ id: p.id })).map(p => db.deletePayee(p)));
        }
        if (added) {
            await Promise.all(added.map(p => models_1.payeeModel.toDb(p)).map(p => db.insertPayee(p)));
        }
        if (updated) {
            await Promise.all(updated
                .map(p => models_1.payeeModel.toDb(p, { update: true }))
                .map(p => db.updatePayee(p)));
        }
    });
}
async function checkOrphanedPayees({ ids, }) {
    const orphaned = new Set(await db.getOrphanedPayees());
    return ids.filter(id => orphaned.has(id));
}
async function getPayeeRules({ id, }) {
    return rules.getRulesForPayee(id).map(rule => rule.serialize());
}
