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
const db = __importStar(require("../db"));
const migrations_1 = require("./migrations");
beforeEach(global.emptyDatabase(true));
describe('Migrations', () => {
    test('gets the latest migrations', async () => {
        const applied = await (0, migrations_1.getAppliedMigrations)(db.getDatabase());
        const available = await (0, migrations_1.getMigrationList)(__dirname + '/../../mocks/migrations');
        expect(applied.length).toBe(0);
        expect(available).toMatchSnapshot();
        expect((0, migrations_1.getPending)(applied, available)).toMatchSnapshot();
    });
    test('applied migrations are returned in order', async () => {
        return (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', async () => {
            await (0, migrations_1.migrate)(db.getDatabase());
            const migrations = await (0, migrations_1.getAppliedMigrations)(db.getDatabase());
            const last = 0;
            for (const migration of migrations) {
                if (migration <= last) {
                    throw new Error('Found older migration out of order');
                }
            }
        });
    });
    test('checks if there are unknown migrations', async () => {
        return (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', async () => {
            // Insert a random migration id
            await db.runQuery('INSERT INTO __migrations__ (id) VALUES (1000)');
            try {
                await (0, migrations_1.migrate)(db.getDatabase());
            }
            catch (e) {
                expect(getErrorMessage(e)).toBe('out-of-sync-migrations');
                return;
            }
            expect('should never reach here').toBe(null);
        });
    });
    test('app runs database migrations', async () => {
        return (0, migrations_1.withMigrationsDir)(__dirname + '/../../mocks/migrations', async () => {
            let desc = await db.first("SELECT * FROM sqlite_master WHERE name = 'poop'");
            expect(desc).toBe(null);
            await (0, migrations_1.migrate)(db.getDatabase());
            desc = await db.first("SELECT * FROM sqlite_master WHERE name = 'poop'");
            expect(desc).toBeDefined();
            expect(desc.sql.indexOf('is_income')).toBe(-1);
            expect(desc.sql.indexOf('is_expense')).not.toBe(-1);
        });
    });
});
