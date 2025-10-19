#!/usr/bin/env node --trace-warnings
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const log_1 = require("../../platform/server/log");
const sqlite = __importStar(require("../../platform/server/sqlite"));
const migrations_1 = require("./migrations");
const argv = require('yargs').options({
    m: {
        alias: 'migrationsDir',
        requiresArg: true,
        type: 'string',
        describe: 'Migrations directory',
    },
    name: {
        requiresArg: true,
        type: 'string',
        describe: 'Name of new migration',
    },
    db: {
        requiresArg: true,
        type: 'string',
        describe: 'Path to database',
    },
}).argv;
function getDatabase() {
    return sqlite.openDatabase(argv.db);
}
function create(migrationName) {
    const migrationsDir = (0, migrations_1.getMigrationsDir)();
    const ts = Date.now();
    const up = path.resolve(migrationsDir, ts + '_' + migrationName + '.sql');
    fs.writeFileSync(up, 'BEGIN TRANSACTION;\n\nCOMMIT;', 'utf8');
}
async function list(db) {
    const migrationsDir = (0, migrations_1.getMigrationsDir)();
    const applied = await (0, migrations_1.getAppliedMigrations)(db);
    const all = await (0, migrations_1.getMigrationList)(migrationsDir);
    const pending = (0, migrations_1.getPending)(applied, all);
    log_1.logger.log('Applied migrations:');
    applied.forEach(id => log_1.logger.log('  ', (0, migrations_1.getUpMigration)(id, all)));
    log_1.logger.log('\nPending migrations:');
    pending.forEach(name => log_1.logger.log('  ', name));
}
const cmd = argv._[0];
(0, migrations_1.withMigrationsDir)(argv.migrationsDir || (0, migrations_1.getMigrationsDir)(), async () => {
    switch (cmd) {
        case 'reset':
            fs.unlinkSync(argv.db);
            const initSql = fs.readFileSync(path.join(__dirname, '../../../src/server/sql/init.sql'), 'utf8');
            getDatabase().exec(initSql);
            break;
        case 'migrate':
            const applied = await (0, migrations_1.migrate)(getDatabase());
            if (applied.length === 0) {
                log_1.logger.log('No pending migrations');
            }
            else {
                log_1.logger.log('Applied migrations:\n' + applied.join('\n'));
            }
            break;
        case 'list':
            await list(getDatabase());
            break;
        case 'create':
        default:
            const name = argv.name;
            if (name == null || name === '') {
                log_1.logger.log('Must pass a name for the new migration with --name');
                process.exit(1);
            }
            await create(name);
            break;
    }
});
