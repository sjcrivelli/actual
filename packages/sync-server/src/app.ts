
import express from 'express';
import { config } from './load-config.js';
import { handlers as accountApp } from './app-account.js';
import { handlers as adminApp } from './app-admin.js';
import { handlers as corsProxyApp } from './app-cors-proxy.js';
import { handlers as openidApp } from './app-openid.js';
// Add other Express apps as needed
// import { handlers as secretsApp } from './app-secrets.js';
// import { handlers as simplefinApp } from './app-simplefin/app-simplefin.js';

const app = express();

// Mount sub-apps on their respective routes
app.use('/account', accountApp);
app.use('/admin', adminApp);
app.use('/cors-proxy', corsProxyApp);
app.use('/openid', openidApp);
// Uncomment and mount other apps as needed
// app.use('/secrets', secretsApp);
// app.use('/simplefin', simplefinApp);

// Stub /sync route if not an Express app
app.use('/sync', (req, res) => {
  res.status(501).send('Sync module not implemented');
});

// Health check route
app.get('/', (_req, res) => res.send('Actual Sync Server is running'));

// Get port from config or default
const port = config.get('port') || 5000;

export function run() {
  app.listen(port, () => {
    // Print port for confirmation
    console.log(`Actual sync server listening on port ${port}`);
  });
}
