import { createApp } from '../app';
import { repairSync as _repairSync } from './repair';
import { resetSync as _resetSync } from './reset';
import { fullSync } from '.';
export const app = createApp();
app.method('sync', sync);
app.method('sync-reset', resetSync);
app.method('sync-repair', repairSync);
async function sync() {
    return await fullSync();
}
async function resetSync() {
    return await _resetSync();
}
async function repairSync() {
    await _repairSync();
}
