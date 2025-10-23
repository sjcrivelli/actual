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
exports.withMigrationsDir = withMigrationsDir;
exports.getMigrationsDir = getMigrationsDir;
exports.getUpMigration = getUpMigration;
exports.getAppliedMigrations = getAppliedMigrations;
exports.getMigrationList = getMigrationList;
exports.getPending = getPending;
exports.applyMigration = applyMigration;
exports.migrate = migrate;
const _1632571489012_remove_cache_1 = __importDefault(require("../../../migrations/1632571489012_remove_cache"));
const _1722717601000_reports_move_selected_categories_1 = __importDefault(require("../../../migrations/1722717601000_reports_move_selected_categories"));
const _1722804019000_create_dashboard_table_1 = __importDefault(require("../../../migrations/1722804019000_create_dashboard_table"));
const _1723665565000_prefs_1 = __importDefault(require("../../../migrations/1723665565000_prefs"));
const fs = __importStar(require("../../platform/server/fs"));
const log_1 = require("../../platform/server/log");
const sqlite = __importStar(require("../../platform/server/sqlite"));
const prefs = __importStar(require("../prefs"));
let MIGRATIONS_DIR = fs.migrationsPath;
const javascriptMigrations = {
    1632571489012: _1632571489012_remove_cache_1.default,
    1722717601000: _1722717601000_reports_move_selected_categories_1.default,
    1722804019000: _1722804019000_create_dashboard_table_1.default,
    1723665565000: _1723665565000_prefs_1.default,
};
async function withMigrationsDir(dir, func) {
    const oldDir = MIGRATIONS_DIR;
    MIGRATIONS_DIR = dir;
    await func();
    MIGRATIONS_DIR = oldDir;
}
function getMigrationsDir() {
    return MIGRATIONS_DIR;
}
function getMigrationId(name) {
    return parseInt(name.match(/^(\d)+/)[0]);
}
function getUpMigration(id, names) {
    for (const m of names) {
        if (getMigrationId(m) === id) {
            return m;
        }
    }
}
async function patchBadMigrations(db) {
    const badFiltersMigration = 1685375406832;
    const newFiltersMigration = 1688749527273;
    const appliedIds = await getAppliedMigrations(db);
    if (appliedIds.includes(badFiltersMigration)) {
        await sqlite.runQuery(db, 'DELETE FROM __migrations__ WHERE id = ?', [
            badFiltersMigration,
        ]);
        await sqlite.runQuery(db, 'INSERT INTO __migrations__ (id) VALUES (?)', [
            newFiltersMigration,
        ]);
    }
}
async function getAppliedMigrations(db) {
    const rows = await sqlite.runQuery(db, 'SELECT * FROM __migrations__ ORDER BY id ASC', [], true);
    return rows.map(row => row.id);
}
async function getMigrationList(migrationsDir) {
    const files = await fs.listDir(migrationsDir);
    return files
        .filter(name => name.match(/(\.sql|\.js)$/))
        .sort((m1, m2) => {
        const id1 = getMigrationId(m1);
        const id2 = getMigrationId(m2);
        if (id1 < id2) {
            return -1;
        }
        else if (id1 > id2) {
            return 1;
        }
        return 0;
    });
}
function getPending(appliedIds, all) {
    return all.filter(name => {
        const id = getMigrationId(name);
        return appliedIds.indexOf(id) === -1;
    });
}
async function applyJavaScript(db, id) {
    const dbInterface = {
        runQuery: (query, params, fetchAll) => sqlite.runQuery(db, query, params, fetchAll),
        execQuery: query => sqlite.execQuery(db, query),
        transaction: func => sqlite.transaction(db, func),
    };
    if (javascriptMigrations[id] == null) {
        throw new Error('Could not find JS migration code to run for ' + id);
    }
    const run = javascriptMigrations[id];
    return run(dbInterface, {
        fs,
        fileId: prefs.getPrefs()?.id,
    });
}
async function applySql(db, sql) {
    try {
        await sqlite.execQuery(db, sql);
    }
    catch (e) {
        log_1.logger.log('Error applying sql:', sql);
        throw e;
    }
}
async function applyMigration(db, name, migrationsDir) {
    const code = await fs.readFile(fs.join(migrationsDir, name));
    if (name.match(/\.js$/)) {
        await applyJavaScript(db, getMigrationId(name));
    }
    else {
        await applySql(db, code);
    }
    await sqlite.runQuery(db, 'INSERT INTO __migrations__ (id) VALUES (?)', [
        getMigrationId(name),
    ]);
}
function checkDatabaseValidity(appliedIds, available) {
    for (let i = 0; i < appliedIds.length; i++) {
        if (i >= available.length ||
            appliedIds[i] !== getMigrationId(available[i])) {
            log_1.logger.error('Database is out of sync with migrations:', {
                appliedIds,
                available,
            });
            throw new Error('out-of-sync-migrations');
        }
    }
}
async function migrate(db) {
    await patchBadMigrations(db);
    const appliedIds = await getAppliedMigrations(db);
    const available = await getMigrationList(MIGRATIONS_DIR);
    checkDatabaseValidity(appliedIds, available);
    const pending = getPending(appliedIds, available);
    for (const migration of pending) {
        await applyMigration(db, migration, MIGRATIONS_DIR);
    }
    return pending;
}
//# sourceMappingURL=migrations.js.map