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
exports.runMigrations = runMigrations;
exports.applyResurrectedData = applyResurrectedData;
exports.performUpdateWorkflow = performUpdateWorkflow;
const migrations = __importStar(require("./migrate/migrations"));
const db = __importStar(require("./db/index"));
// --------------------------------------------------------
// Database Migration
// --------------------------------------------------------
async function runMigrations() {
    const database = db.getDatabase();
    if (!database) {
        throw new Error('Database instance is null – cannot run migrations');
    }
    try {
        await migrations.migrate(database);
        console.log('✅ Database migrations complete');
    }
    catch (e) {
        if (e instanceof Error) {
            console.error('❌ Migration error:', e.message);
        }
        else {
            console.error('❌ Unknown migration error:', e);
        }
        throw e;
    }
}
// --------------------------------------------------------
// Data Resync Handling
// --------------------------------------------------------
/**
 * Apply resurrected data updates to the database.
 */
async function applyResurrectedData(resurrect) {
    const results = [];
    for (const desc of resurrect) {
        try {
            // Update the value in the table dynamically
            await db.update(desc.dataset, {
                id: desc.row,
                [desc.column]: desc.value,
                timestamp: desc.timestamp,
            });
            results.push({
                dataset: desc.dataset,
                row: desc.row,
                column: desc.column,
                value: desc.value,
                timestamp: desc.timestamp ?? null,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(`Error applying resurrected data to ${desc.dataset}:${desc.row}:${desc.column}`, e.message);
            }
            else {
                console.error('Unknown error applying resurrected data:', e);
            }
        }
    }
    return results;
}
// --------------------------------------------------------
// Update Workflow
// --------------------------------------------------------
async function performUpdateWorkflow() {
    console.log('🔄 Starting update workflow...');
    await runMigrations();
    const idsPerTable = {};
    const prefsToSet = {};
    try {
        // Example placeholder: collect IDs and preferences
        const tables = Object.keys(idsPerTable);
        for (const table of tables) {
            const ids = idsPerTable[table];
            const rows = await fetchAll(table, ids);
            console.log(`Fetched ${rows.length} rows from ${table}`);
        }
        // Apply preference updates (example)
        // TODO: Implement preference update logic using correct db API
        console.log('✅ Preferences update logic placeholder');
    }
    catch (e) {
        if (e instanceof Error) {
            console.error('Error during update workflow:', e.message);
        }
        else {
            console.error('Unknown update workflow error:', e);
        }
    }
}
// --------------------------------------------------------
// Internal Utility
// --------------------------------------------------------
async function fetchAll(table, ids) {
    const results = [];
    for (const id of ids) {
        try {
            // Use db.select to fetch by id
            const result = await db.select(table, id);
            if (result)
                results.push(result);
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(`Error fetching ${table}:${id} → ${e.message}`);
            }
            else {
                console.error(`Unknown error fetching ${table}:${id}`, e);
            }
        }
    }
    return results;
}
//# sourceMappingURL=update.js.map