import m1632571489012 from '../../../migrations/1632571489012_remove_cache';
import m1722717601000 from '../../../migrations/1722717601000_reports_move_selected_categories';
import m1722804019000 from '../../../migrations/1722804019000_create_dashboard_table';
import m1723665565000 from '../../../migrations/1723665565000_prefs';
import * as fs from '../../platform/server/fs';
import { logger } from '../../platform/server/log';
import * as sqlite from '../../platform/server/sqlite';
import * as prefs from '../prefs';
let MIGRATIONS_DIR = fs.migrationsPath;
const javascriptMigrations = {
    1632571489012: m1632571489012,
    1722717601000: m1722717601000,
    1722804019000: m1722804019000,
    1723665565000: m1723665565000,
};
export async function withMigrationsDir(dir, func) {
    const oldDir = MIGRATIONS_DIR;
    MIGRATIONS_DIR = dir;
    await func();
    MIGRATIONS_DIR = oldDir;
}
export function getMigrationsDir() {
    return MIGRATIONS_DIR;
}
function getMigrationId(name) {
    return parseInt(name.match(/^(\d)+/)[0]);
}
export function getUpMigration(id, names) {
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
export async function getAppliedMigrations(db) {
    const rows = await sqlite.runQuery(db, 'SELECT * FROM __migrations__ ORDER BY id ASC', [], true);
    return rows.map(row => row.id);
}
export async function getMigrationList(migrationsDir) {
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
export function getPending(appliedIds, all) {
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
        logger.log('Error applying sql:', sql);
        throw e;
    }
}
export async function applyMigration(db, name, migrationsDir) {
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
            logger.error('Database is out of sync with migrations:', {
                appliedIds,
                available,
            });
            throw new Error('out-of-sync-migrations');
        }
    }
}
export async function migrate(db) {
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
