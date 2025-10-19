import { createApp } from '../app';
import * as db from '../db';
import { mutator } from '../mutators';
import { undoable } from '../undo';
export const app = createApp();
app.method('notes-save', updateNotes);
app.method('notes-save-undoable', mutator(undoable(updateNotes)));
async function updateNotes({ id, note }) {
    await db.update('notes', { id, note });
}
