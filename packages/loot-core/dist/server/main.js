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
exports.lib = exports.handlers = void 0;
exports.getDefaultDocumentDir = getDefaultDocumentDir;
exports.initApp = initApp;
exports.init = init;
// @ts-strict-ignore
require("./polyfills");
const injectAPI = __importStar(require("@actual-app/api/injected"));
const asyncStorage = __importStar(require("../platform/server/asyncStorage"));
const connection = __importStar(require("../platform/server/connection"));
const fs = __importStar(require("../platform/server/fs"));
const log_1 = require("../platform/server/log");
const sqlite = __importStar(require("../platform/server/sqlite"));
const query_1 = require("../shared/query");
const util_1 = require("../shared/util");
const app_1 = require("./accounts/app");
const app_2 = require("./admin/app");
const api_1 = require("./api");
const aql_1 = require("./aql");
const app_3 = require("./auth/app");
const app_4 = require("./budget/app");
const app_5 = require("./budgetfiles/app");
const app_6 = require("./dashboard/app");
const db = __importStar(require("./db"));
const encryption = __importStar(require("./encryption"));
const app_7 = require("./encryption/app");
const app_8 = require("./filters/app");
const main_app_1 = require("./main-app");
const mutators_1 = require("./mutators");
const app_9 = require("./notes/app");
const app_10 = require("./payees/app");
const post_1 = require("./post");
const app_11 = require("./preferences/app");
const prefs = __importStar(require("./prefs"));
const app_12 = require("./reports/app");
const app_13 = require("./rules/app");
const app_14 = require("./schedules/app");
const server_config_1 = require("./server-config");
const app_15 = require("./spreadsheet/app");
const sync_1 = require("./sync");
const app_16 = require("./sync/app");
const app_17 = require("./tags/app");
const app_18 = require("./tools/app");
const app_19 = require("./transactions/app");
const rules = __importStar(require("./transactions/transaction-rules"));
const undo_1 = require("./undo");
// handlers
// need to work around the type system here because the object
// is /currently/ empty but we promise to fill it in later
exports.handlers = {};
exports.handlers['undo'] = (0, mutators_1.mutator)(async function () {
    return (0, undo_1.undo)();
});
exports.handlers['redo'] = (0, mutators_1.mutator)(function () {
    return (0, undo_1.redo)();
});
exports.handlers['make-filters-from-conditions'] = async function ({ conditions, applySpecialCases, }) {
    return rules.conditionsToAQL(conditions, { applySpecialCases });
};
exports.handlers['query'] = async function (query) {
    if (query['table'] == null) {
        throw new Error('query has no table, did you forgot to call `.serialize`?');
    }
    return (0, aql_1.aqlQuery)(query);
};
exports.handlers['get-server-version'] = async function () {
    if (!(0, server_config_1.getServer)()) {
        return { error: 'no-server' };
    }
    let version;
    try {
        const res = await (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/info');
        const info = JSON.parse(res);
        version = info.build.version;
    }
    catch (err) {
        return { error: 'network-failure' };
    }
    return { version };
};
exports.handlers['get-server-url'] = async function () {
    return (0, server_config_1.getServer)() && (0, server_config_1.getServer)().BASE_SERVER;
};
exports.handlers['set-server-url'] = async function ({ url, validate = true }) {
    if (url == null) {
        await asyncStorage.removeItem('user-token');
    }
    else {
        url = url.replace(/\/+$/, '');
        if (validate) {
            // Validate the server is running
            const result = await (0, mutators_1.runHandler)(exports.handlers['subscribe-needs-bootstrap'], {
                url,
            });
            if ('error' in result) {
                return { error: result.error };
            }
        }
    }
    await asyncStorage.setItem('server-url', url);
    await asyncStorage.setItem('did-bootstrap', true);
    (0, server_config_1.setServer)(url);
    return {};
};
exports.handlers['app-focused'] = async function () {
    if (prefs.getPrefs() && prefs.getPrefs().id) {
        // First we sync
        (0, sync_1.fullSync)();
    }
};
exports.handlers = (0, api_1.installAPI)(exports.handlers);
injectAPI.override((name, args) => (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args));
// A hack for now until we clean up everything
main_app_1.app.handlers = exports.handlers;
main_app_1.app.combine(app_3.app, app_14.app, app_4.app, app_6.app, app_9.app, app_11.app, app_18.app, app_8.app, app_12.app, app_13.app, app_2.app, app_19.app, app_1.app, app_10.app, app_15.app, app_16.app, app_5.app, app_7.app, app_17.app);
function getDefaultDocumentDir() {
    return fs.join(process.env.ACTUAL_DOCUMENT_DIR, 'Actual');
}
async function setupDocumentsDir() {
    async function ensureExists(dir) {
        // Make sure the document folder exists
        if (!(await fs.exists(dir))) {
            await fs.mkdir(dir);
        }
    }
    let documentDir = await asyncStorage.getItem('document-dir');
    // Test the existing documents directory to make sure it's a valid
    // path that exists, and if it errors fallback to the default one
    if (documentDir) {
        try {
            await ensureExists(documentDir);
        }
        catch (e) {
            documentDir = null;
        }
    }
    if (!documentDir) {
        documentDir = getDefaultDocumentDir();
    }
    await ensureExists(documentDir);
    fs._setDocumentDir(documentDir);
}
async function initApp(isDev, socketName) {
    await sqlite.init();
    await Promise.all([asyncStorage.init(), fs.init()]);
    await setupDocumentsDir();
    const keysStr = await asyncStorage.getItem('encrypt-keys');
    if (keysStr) {
        try {
            const keys = JSON.parse(keysStr);
            // Load all the keys
            await Promise.all(Object.keys(keys).map(fileId => {
                return encryption.loadKey(keys[fileId]);
            }));
        }
        catch (e) {
            log_1.logger.log('Error loading key', e);
            throw new Error('load-key-error');
        }
    }
    const url = await asyncStorage.getItem('server-url');
    if (!url) {
        await asyncStorage.removeItem('user-token');
    }
    (0, server_config_1.setServer)(url);
    connection.init(socketName, main_app_1.app.handlers);
    // Allow running DB queries locally
    global.$query = aql_1.aqlQuery;
    global.$q = query_1.q;
    if (isDev) {
        global.$send = (name, args) => (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args);
        global.$db = db;
        global.$setSyncingMode = sync_1.setSyncingMode;
    }
}
async function init(config) {
    // Get from build
    let dataDir, serverURL;
    if (config) {
        dataDir = config.dataDir;
        serverURL = config.serverURL;
        // Set verbose mode if specified
        if (config.verbose !== undefined) {
            (0, log_1.setVerboseMode)(config.verbose);
        }
    }
    else {
        dataDir = process.env.ACTUAL_DATA_DIR;
        serverURL = process.env.ACTUAL_SERVER_URL;
    }
    await sqlite.init();
    await Promise.all([asyncStorage.init({ persist: false }), fs.init()]);
    fs._setDocumentDir(dataDir || process.cwd());
    if (serverURL) {
        (0, server_config_1.setServer)(serverURL);
        if (config.password) {
            await (0, mutators_1.runHandler)(exports.handlers['subscribe-sign-in'], {
                password: config.password,
            });
        }
    }
    else {
        // This turns off all server URLs. In this mode we don't want any
        // access to the server, we are doing things locally
        (0, server_config_1.setServer)(null);
        main_app_1.app.events.on('load-budget', () => {
            (0, sync_1.setSyncingMode)('offline');
        });
    }
    return exports.lib;
}
// Export a few things required for the platform
exports.lib = {
    getDataDir: fs.getDataDir,
    sendMessage: (msg, args) => connection.send(msg, args),
    send: async (name, args) => {
        const res = await (0, mutators_1.runHandler)(main_app_1.app.handlers[name], args);
        return res;
    },
    on: (name, func) => main_app_1.app.events.on(name, func),
    q: query_1.q,
    db,
    amountToInteger: util_1.amountToInteger,
    integerToAmount: util_1.integerToAmount,
};
