#!/usr/bin/env node --trace-warnings
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var fs = require("fs");
var path = require("path");
var log_1 = require("../../platform/server/log");
var sqlite = require("../../platform/server/sqlite");
var migrations_1 = require("./migrations");
var argv = require('yargs').options({
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
    var migrationsDir = (0, migrations_1.getMigrationsDir)();
    var ts = Date.now();
    var up = path.resolve(migrationsDir, ts + '_' + migrationName + '.sql');
    fs.writeFileSync(up, 'BEGIN TRANSACTION;\n\nCOMMIT;', 'utf8');
}
function list(db) {
    return __awaiter(this, void 0, void 0, function () {
        var migrationsDir, applied, all, pending;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    migrationsDir = (0, migrations_1.getMigrationsDir)();
                    return [4 /*yield*/, (0, migrations_1.getAppliedMigrations)(db)];
                case 1:
                    applied = _a.sent();
                    return [4 /*yield*/, (0, migrations_1.getMigrationList)(migrationsDir)];
                case 2:
                    all = _a.sent();
                    pending = (0, migrations_1.getPending)(applied, all);
                    log_1.logger.log('Applied migrations:');
                    applied.forEach(function (id) { return log_1.logger.log('  ', (0, migrations_1.getUpMigration)(id, all)); });
                    log_1.logger.log('\nPending migrations:');
                    pending.forEach(function (name) { return log_1.logger.log('  ', name); });
                    return [2 /*return*/];
            }
        });
    });
}
var cmd = argv._[0];
(0, migrations_1.withMigrationsDir)(argv.migrationsDir || (0, migrations_1.getMigrationsDir)(), function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, initSql, applied, name_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = cmd;
                switch (_a) {
                    case 'reset': return [3 /*break*/, 1];
                    case 'migrate': return [3 /*break*/, 2];
                    case 'list': return [3 /*break*/, 4];
                    case 'create': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 6];
            case 1:
                fs.unlinkSync(argv.db);
                initSql = fs.readFileSync(path.join(__dirname, '../../../src/server/sql/init.sql'), 'utf8');
                getDatabase().exec(initSql);
                return [3 /*break*/, 8];
            case 2: return [4 /*yield*/, (0, migrations_1.migrate)(getDatabase())];
            case 3:
                applied = _b.sent();
                if (applied.length === 0) {
                    log_1.logger.log('No pending migrations');
                }
                else {
                    log_1.logger.log('Applied migrations:\n' + applied.join('\n'));
                }
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, list(getDatabase())];
            case 5:
                _b.sent();
                return [3 /*break*/, 8];
            case 6:
                name_1 = argv.name;
                if (name_1 == null || name_1 === '') {
                    log_1.logger.log('Must pass a name for the new migration with --name');
                    process.exit(1);
                }
                return [4 /*yield*/, create(name_1)];
            case 7:
                _b.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
