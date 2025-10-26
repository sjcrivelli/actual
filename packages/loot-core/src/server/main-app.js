import * as connection from '../platform/server/connection';
import { createApp } from './app';
// Main app
export const app = createApp();
app.events.on('sync', event => {
    connection.send('sync-event', event);
});
