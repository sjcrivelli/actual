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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const fast_check_1 = __importDefault(require("fast-check"));
const arbs = __importStar(require("../../mocks/arbitrary-schema"));
const test_helpers_1 = require("../../shared/test-helpers");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const migrate_1 = require("./migrate");
const index_1 = require("./index");
beforeEach(() => {
    (0, migrate_1.listen)();
    return global.emptyDatabase()();
});
afterEach(() => {
    (0, migrate_1.unlisten)();
});
const tableSchema = aql_1.schema.transactions;
const fields = Object.keys(tableSchema);
function toInternalField(publicField) {
    return aql_1.schemaConfig.views.transactions.fields[publicField];
}
const messageArb = fast_check_1.default
    .oneof(...fields.filter(f => f !== 'id').map(field => fast_check_1.default.constant(field)))
    .chain(field => {
    const value = arbs
        .typeArbitrary(tableSchema[field])
        .map(v => (0, aql_1.convertInputType)(v, tableSchema[field].type));
    const timestamp = fast_check_1.default
        .noShrink(fast_check_1.default.noBias(fast_check_1.default.date({
        min: new Date('2020-01-01T00:00:00.000Z'),
        max: new Date('2020-05-01T00:00:00.000Z'),
    })))
        .map(date => date.toISOString() + '-0000-0123456789ABCDEF')
        .map(crdt_1.Timestamp.parse);
    return fast_check_1.default.record({
        timestamp,
        dataset: fast_check_1.default.constant('transactions'),
        column: fast_check_1.default.constant(toInternalField(field) || field),
        row: fast_check_1.default.oneof(fast_check_1.default.integer({ min: 0, max: 5 }).map(i => `id${i}`), fast_check_1.default.integer({ min: 0, max: 5 }).chain(i => {
            return fast_check_1.default.integer({ min: 0, max: 5 }).map(j => `id${i}/child${j}`);
        })),
        value,
    });
});
describe('sync migrations', () => {
    it('should set the parent_id', async () => {
        const tracer = (0, test_helpers_1.execTracer)();
        tracer.start();
        const cleanup = (0, index_1.addSyncListener)((oldValues, newValues) => {
            const transactionsMap = newValues.get('transactions');
            tracer.event('applied', [...transactionsMap.keys()]);
        });
        await db.insert('transactions', {
            id: 'trans1/child1',
            isChild: 1,
            amount: 4500,
        });
        tracer.expectNow('applied', ['trans1/child1']);
        await tracer.expectWait('applied', ['trans1/child1']);
        const transactions = db.runQuery('SELECT * FROM transactions', [], true);
        expect(transactions.length).toBe(1);
        expect(transactions[0].parent_id).toBe('trans1');
        cleanup();
        tracer.end();
    });
    it('child transactions should always have a parent_id', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty(fast_check_1.default.array(messageArb, { maxLength: 100 }), async (msgs) => {
            const tracer = (0, test_helpers_1.execTracer)();
            tracer.start();
            const cleanup = (0, index_1.addSyncListener)((oldValues, newValues) => {
                const ts = newValues.get('transactions');
                if (ts &&
                    [...ts.values()].find(t => t.isChild === 1 && t.parent_id == null && t.id.includes('/'))) {
                }
                else {
                    tracer.event('applied');
                }
            });
            await (0, index_1.sendMessages)(msgs);
            await tracer.expect('applied');
            const transactions = await db.all('SELECT * FROM transactions', []);
            for (const trans of transactions) {
                const transMsgs = msgs
                    .filter(msg => msg.row === trans.id)
                    .sort((m1, m2) => {
                    const t1 = m1.timestamp.toString();
                    const t2 = m2.timestamp.toString();
                    if (t1 < t2) {
                        return 1;
                    }
                    else if (t1 > t2) {
                        return -1;
                    }
                    return 0;
                });
                const msg = transMsgs.find(m => m.column === 'parent_id');
                if (trans.isChild === 1 &&
                    trans.id.includes('/') &&
                    (msg == null || msg.value == null)) {
                    // This is a child transaction didn't have a `parent_id`
                    // set in the messages. It should have gotten set from
                    // the `id`
                    const [parentId] = trans.id.split('/');
                    expect(parentId).not.toBe(null);
                    expect(trans.parent_id).toBe(parentId);
                }
                else if (msg) {
                    // At least one message set `parent_id`
                    expect(trans.parent_id).toBe(msg.value);
                }
                else {
                    // `parent_id` should never have been set
                    expect(trans.parent_id).toBe(null);
                }
            }
            cleanup();
            tracer.end();
        })
            .beforeEach(() => {
            return db.execQuery(`DELETE FROM transactions`);
        }));
    });
});
