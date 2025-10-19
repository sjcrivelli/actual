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
const jsverify_1 = __importDefault(require("jsverify"));
const db = __importStar(require("../db"));
const prefs = __importStar(require("../prefs"));
const sheet = __importStar(require("../sheet"));
const mockSyncServer = __importStar(require("../tests/mockSyncServer"));
const encoder = __importStar(require("./encoder"));
const utils_1 = require("./utils");
const sync = __importStar(require("./index"));
const uuidGenerator = jsverify_1.default.integer(97, 122).smap(x => String.fromCharCode(x), x => x.charCodeAt(Number(x)));
beforeEach(() => {
    sync.setSyncingMode('enabled');
    mockSyncServer.reset();
    global.restoreDateNow();
});
afterEach(() => {
    sync.setSyncingMode('disabled');
    global.resetTime();
});
const schema = {
    spreadsheet_cells: {
        expr: 'text',
    },
    accounts: {
        account_id: 'text',
        name: 'text',
        balance_current: 'integer',
        balance_available: 'integer',
        balance_limit: 'integer',
        mask: 'text',
        official_name: 'text',
        type: 'text',
        subtype: 'text',
        bank: 'text',
        offbudget: 'integer',
        closed: 'integer',
        tombstone: 'integer',
    },
    transactions: {
        isParent: 'integer',
        isChild: 'integer',
        acct: 'text',
        category: 'text',
        amount: 'integer',
        description: 'text',
        notes: 'text',
        date: 'integer',
        financial_id: 'text',
        type: 'text',
        location: 'text',
        error: 'text',
        imported_description: 'text',
        starting_balance_flag: 'integer',
        transferred_id: 'text',
        sort_order: 'real',
        tombstone: 'integer',
    },
    categories: {
        name: 'text',
        is_income: 'integer',
        cat_group: 'text',
        sort_order: 'real',
        tombstone: 'integer',
    },
    category_groups: {
        name: 'text',
        is_income: 'integer',
        sort_order: 'real',
        tombstone: 'integer',
    },
    category_mapping: { transferId: 'text' },
    payees: {
        name: 'text',
        transfer_acct: 'text',
        category: 'text',
        tombstone: 'integer',
    },
    payee_mapping: { targetId: 'text' },
};
// The base time is 2019-08-09T18:14:31.903Z
const baseTime = 1565374471903;
const clientId1 = '80dd7da215247293';
const clientId2 = '90xU1sd5124329ac';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeGen({ table, row, field, value, }) {
    return jsverify_1.default.record({
        dataset: jsverify_1.default.constant(table),
        row: row || uuidGenerator,
        column: jsverify_1.default.constant(field),
        value,
        timestamp: jsverify_1.default.integer(1000, 10000).smap(x => {
            let clientId;
            switch (jsverify_1.default.random(0, 1)) {
                case 0:
                    clientId = clientId1;
                    break;
                case 1:
                default:
                    clientId = clientId2;
            }
            return new crdt_1.Timestamp(baseTime + x, 0, clientId);
        }, x => x.millis() - baseTime),
    });
}
const generators = [];
Object.keys(schema).forEach(table => {
    Object.keys(schema[table]).reduce((obj, field) => {
        if (table === 'spreadsheet_cells' && field === 'expr') {
            generators.push(makeGen({
                table,
                row: jsverify_1.default.asciinestring.smap(x => 'sheet!' + x, x => x),
                field: 'expr',
                value: jsverify_1.default.constant(JSON.stringify('fooooo')),
            }));
            return obj;
        }
        const type = schema[table][field];
        switch (type) {
            case 'text':
                generators.push(makeGen({ table, field, value: jsverify_1.default.asciinestring }));
                break;
            case 'integer':
                if (field === 'amount') {
                    generators.push(makeGen({ table, field, value: jsverify_1.default.uint8 }));
                }
                else {
                    generators.push(makeGen({ table, field, value: jsverify_1.default.elements([0, 1]) }));
                }
                break;
            case 'real':
                generators.push(makeGen({ table, field, value: jsverify_1.default.uint32 }));
                break;
            default:
                throw new Error('Unknown type: ' + type);
        }
        return obj;
    }, {});
});
function shuffle(arr) {
    const src = [...arr];
    const shuffled = new Array(src.length);
    let item;
    while ((item = src.pop())) {
        const idx = Math.floor(Math.random() * shuffled.length);
        if (shuffled[idx]) {
            src.push(item);
        }
        else {
            shuffled[idx] = item;
        }
    }
    return shuffled;
}
function divide(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i += 10) {
        res.push(arr.slice(i, i + 10));
    }
    return res;
}
async function run(msgs) {
    mockSyncServer.reset();
    // Do some post-processing of the data
    const knownTimestamps = new Set();
    const res = msgs.reduce((acc, msg) => {
        // Filter out duplicate timestamps
        const ts = msg.timestamp.toString();
        if (knownTimestamps.has(ts)) {
            return acc;
        }
        knownTimestamps.add(ts);
        if (msg.timestamp.node() === clientId1) {
            acc.firstMessages.push(msg);
        }
        else if (msg.timestamp.node() === clientId2) {
            acc.secondMessages.push(msg);
        }
        else {
            throw new Error('unknown client');
        }
        return acc;
    }, { firstMessages: [], secondMessages: [] });
    prefs.loadPrefs();
    prefs.savePrefs({
        groupId: 'group',
        lastSyncedTimestamp: new crdt_1.Timestamp(Date.now(), 0, '0000000000000000').toString(),
    });
    await global.emptyDatabase()();
    await sheet.loadSpreadsheet(db, () => { });
    // The test: split up the messages into chunks and in parallel send
    // them all through `sendMessages`. Then add some messages to the
    // server from another client, wait for all the `sendMessages` to
    // complete, then do another `fullSync`, and finally check the
    // merkle tree to see if there are any differences.
    const chunks = divide(res.firstMessages);
    const client1Sync = Promise.all(chunks.slice(0, -1).map(slice => sync.receiveMessages(slice)));
    await client1Sync;
    await mockSyncServer.handlers['/sync/sync'](await encoder.encode('group', clientId2, crdt_1.Timestamp.zero, res.secondMessages.map(x => ({
        ...x,
        value: sync.serializeValue(x.value),
        timestamp: x.timestamp.toString(),
    }))));
    const syncPromise = sync.fullSync();
    // Add in some more messages while the sync is running, this makes
    // sure that the loop works
    const lastReceive = sync.receiveMessages(chunks[chunks.length - 1]);
    mockSyncServer.handlers['/sync/sync'](await encoder.encode('group', clientId2, crdt_1.Timestamp.zero, res.secondMessages.map(x => ({
        ...x,
        value: sync.serializeValue(x.value),
        timestamp: x.timestamp.toString(),
    }))));
    const result = await syncPromise;
    if ((0, utils_1.isError)(result)) {
        console.log(result.error);
        throw result.error;
    }
    const serverMerkle = mockSyncServer.getClock().merkle;
    // Double-check that the data is in sync
    let diff = crdt_1.merkle.diff(serverMerkle, (0, crdt_1.getClock)().merkle);
    if (diff !== null) {
        return false;
    }
    // Make sure that last batch of messages is applied
    await lastReceive;
    // The full sync should have looped completely until it was fully in
    // sync, including the messages we sent while it was syncing. Make
    // sure it properly finished by compared the previous merkle trie on
    // the server.
    diff = crdt_1.merkle.diff(serverMerkle, (0, crdt_1.getClock)().merkle);
    if (diff !== null) {
        return false;
    }
    return true;
}
describe('sync property test', () => {
    it.skip('should always sync clients into the same state', async () => {
        const test = await jsverify_1.default.check(jsverify_1.default.forall(jsverify_1.default.tuple(Array.from(new Array(100)).map(() => jsverify_1.default.oneof(generators))), async (msgs) => {
            let r;
            try {
                r = await run(msgs);
            }
            catch (e) {
                console.log(e);
                throw e;
            }
            if (r === false) {
                return false;
            }
            for (let i = 0; i < 10; i++) {
                const shuffled = shuffle(msgs);
                r = await run(shuffled);
                if (r === false) {
                    return false;
                }
            }
            return true;
        }), { tests: 100, quiet: true });
        if (test.counterexample) {
            console.log('---------------------');
            console.log(test.counterexample[0].map(x => ({
                ...x,
                timestamp: x.timestamp.toString(),
            })));
            throw new Error('property test failed');
        }
    }, 50000);
    it.skip('should run a counterexample that needs to be fixed', async () => {
        function convert(data) {
            return data.map(x => ({
                ...x,
                timestamp: crdt_1.Timestamp.parse(x.timestamp),
            }));
        }
        // Copy and paste a counterexample that the property test finds
        // here. That way you can work on it separately and figure out
        // what's wrong.
        const msgs = convert([
            {
                dataset: 'accounts',
                row: 't',
                column: 'balance_limit',
                value: 0,
                timestamp: '2019-08-09T18:14:34.545Z-0000-90xU1sd5124329ac',
            },
            // ...
        ]);
        const res = await run(msgs);
        expect(res).toBe(true);
    });
});
