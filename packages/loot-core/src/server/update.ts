import * as migrations from './migrate/migrations';
import * as db from './db/index';
import type { Timestamp } from '@actual-app/crdt';

// --------------------------------------------------------
// Types
// --------------------------------------------------------

interface UpdateDescriptor {
  dataset: string;
  row: string;
  column: string;
  value: number;
  timestamp: Timestamp | null;
}

// Temporary local Message definition
interface Message {
  dataset: string;
  row: string;
  column: string;
  value: number;
  timestamp: Timestamp | null;
}

// --------------------------------------------------------
// Database Migration
// --------------------------------------------------------

export async function runMigrations(): Promise<void> {
  const database = db.getDatabase();
  if (!database) {
    throw new Error('Database instance is null – cannot run migrations');
  }

  try {
    await migrations.migrate(database);
    console.log('✅ Database migrations complete');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('❌ Migration error:', e.message);
    } else {
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
export async function applyResurrectedData(
  resurrect: UpdateDescriptor[],
): Promise<Message[]> {
  const results: Message[] = [];

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
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(
          `Error applying resurrected data to ${desc.dataset}:${desc.row}:${desc.column}`,
          e.message,
        );
      } else {
        console.error('Unknown error applying resurrected data:', e);
      }
    }
  }

  return results;
}

// --------------------------------------------------------
// Update Workflow
// --------------------------------------------------------

export async function performUpdateWorkflow(): Promise<void> {
  console.log('🔄 Starting update workflow...');
  await runMigrations();

  const idsPerTable: Record<string, string[]> = {};
  const prefsToSet: Record<string, unknown> = {};

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
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Error during update workflow:', e.message);
    } else {
      console.error('Unknown update workflow error:', e);
    }
  }
}

// --------------------------------------------------------
// Internal Utility
// --------------------------------------------------------

async function fetchAll(
  table: string,
  ids: Array<string | number>,
): Promise<any[]> {
  const results: any[] = [];

  for (const id of ids) {
    try {
  // Use db.select to fetch by id
  const result = await db.select(table, id);
  if (result) results.push(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`Error fetching ${table}:${id} → ${e.message}`);
      } else {
        console.error(`Unknown error fetching ${table}:${id}`, e);
      }
    }
  }

  return results;
}
