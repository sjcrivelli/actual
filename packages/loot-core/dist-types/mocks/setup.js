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
// @ts-strict-ignore
const nativeFs = __importStar(require("fs"));
const fetchClient = __importStar(require("../platform/client/fetch"));
const sqlite = __importStar(require("../platform/server/sqlite"));
const db = __importStar(require("../server/db"));
const mutators_1 = require("../server/mutators");
const server_config_1 = require("../server/server-config");
const sheet = __importStar(require("../server/sheet"));
const sync_1 = require("../server/sync");
const rules = __importStar(require("../server/transactions/transaction-rules"));
const update_1 = require("../server/update");
const test_helpers_1 = require("../shared/test-helpers");
vi.mock('../platform/client/fetch');
vi.mock('../platform/exceptions');
vi.mock('../platform/server/asyncStorage');
vi.mock('../platform/server/connection');
vi.mock('../server/post');
// By default, syncing is disabled
(0, sync_1.setSyncingMode)('disabled');
// Set a mock url for the testing server
(0, server_config_1.setServer)('https://test.env');
process.on('unhandledRejection', reason => {
    console.log('REJECTION', reason);
});
global.IS_TESTING = true;
let _time = 123456789;
const _oldDateNow = global.Date.now;
global.Date.now = () => _time;
global.restoreDateNow = () => (global.Date.now = _oldDateNow);
global.restoreFakeDateNow = () => (global.Date.now = () => _time);
global.stepForwardInTime = time => {
    if (time) {
        _time = time;
    }
    else {
        _time += 1000;
    }
};
global.resetTime = () => {
    _time = 123456789;
};
let _id = 1;
global.resetRandomId = () => {
    _id = 1;
};
vi.mock('uuid', () => ({
    v4: () => {
        return 'id' + _id++;
    },
}));
vi.mock('../server/migrate/migrations', async () => {
    const realMigrations = await vi.importActual('../server/migrate/migrations');
    return {
        ...realMigrations,
        migrate: async (db) => {
            _id = 100_000_000;
            await realMigrations.migrate(db);
            _id = 1;
        },
    };
});
global.getDatabaseDump = async function (tables) {
    if (!tables) {
        const rows = await sqlite.runQuery(db.getDatabase(), "SELECT name FROM sqlite_master WHERE type='table'", [], true);
        tables = rows.map(row => row.name);
    }
    const data = await Promise.all(tables.map(async (table) => {
        let sortColumn;
        switch (table) {
            case 'spreadsheet_cells':
                sortColumn = 'name';
                break;
            case 'created_budgets':
                sortColumn = 'month';
                break;
            case 'db_version':
                sortColumn = 'version';
                break;
            default:
                sortColumn = 'id';
        }
        return [
            table,
            await sqlite.runQuery(db.getDatabase(), 'SELECT * FROM ' + table + ' ORDER BY ' + sortColumn, [], true),
        ];
    }));
    const grouped = {};
    data.forEach(table => (grouped[table[0]] = table[1]));
    return grouped;
};
// If you want to test the sql.js backend, you need this so it knows
// where to find the webassembly file
// process.env.PUBLIC_URL =
//   __dirname + '/../../../../node_modules/@jlongster/sql.js/dist/';
global.emptyDatabase = function (avoidUpdate) {
    return async () => {
        const path = ':memory:';
        // let path = `/tmp/foo-${Math.random()}.sqlite`;
        // console.log('Using db ' + path);
        await sqlite.init();
        const memoryDB = await sqlite.openDatabase(path);
        sqlite.execQuery(memoryDB, nativeFs.readFileSync(__dirname + '/../server/sql/init.sql', 'utf8'));
        db.setDatabase(memoryDB);
        await db.runQuery('INSERT INTO db_version (version) VALUES (?)', ['0.0.1']);
        if (!avoidUpdate) {
            await (0, update_1.updateVersion)();
            await db.loadClock();
        }
    };
};
beforeEach(() => {
    // This is necessary to create a valid rules state
    rules.resetState();
    (0, test_helpers_1.resetTracer)();
});
afterEach(() => {
    global.resetRandomId();
    test_helpers_1.tracer.end();
    fetchClient.clearServer();
    return new Promise(resolve => {
        if (sheet.get()) {
            sheet.get().onFinish(() => {
                sheet.unloadSpreadsheet();
                resolve(undefined);
            });
        }
        else {
            resolve(undefined);
        }
    });
});
// Tests by default are allowed to mutate the db at any time
beforeEach(() => (0, mutators_1.enableGlobalMutations)());
afterEach(() => (0, mutators_1.disableGlobalMutations)());
//# sourceMappingURL=setup.js.map