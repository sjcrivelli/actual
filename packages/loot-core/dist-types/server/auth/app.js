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
exports.app = void 0;
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const log_1 = require("../../platform/server/log");
const app_1 = require("../app");
const encryption = __importStar(require("../encryption"));
const errors_1 = require("../errors");
const post_1 = require("../post");
const server_config_1 = require("../server-config");
exports.app = (0, app_1.createApp)();
exports.app.method('get-did-bootstrap', didBootstrap);
exports.app.method('subscribe-needs-bootstrap', needsBootstrap);
exports.app.method('subscribe-bootstrap', bootstrap);
exports.app.method('subscribe-get-login-methods', getLoginMethods);
exports.app.method('subscribe-get-user', getUser);
exports.app.method('subscribe-change-password', changePassword);
exports.app.method('subscribe-sign-in', signIn);
exports.app.method('subscribe-sign-out', signOut);
exports.app.method('subscribe-set-token', setToken);
exports.app.method('enable-openid', enableOpenId);
exports.app.method('get-openid-config', getOpenIdConfig);
exports.app.method('enable-password', enablePassword);
async function didBootstrap() {
    return Boolean(await asyncStorage.getItem('did-bootstrap'));
}
async function needsBootstrap({ url } = {}) {
    if (url && !(0, server_config_1.isValidBaseURL)(url)) {
        return { error: 'get-server-failure' };
    }
    let serverConfig;
    try {
        serverConfig = (0, server_config_1.getServer)(url);
        if (!serverConfig) {
            return { bootstrapped: true, hasServer: false };
        }
    }
    catch (err) {
        return { error: 'get-server-failure' };
    }
    let resText;
    try {
        resText = await (0, post_1.get)(serverConfig.SIGNUP_SERVER + '/needs-bootstrap');
    }
    catch (err) {
        return { error: 'network-failure' };
    }
    let res;
    try {
        res = JSON.parse(resText);
    }
    catch (err) {
        return { error: 'parse-failure' };
    }
    return {
        bootstrapped: res.data.bootstrapped,
        availableLoginMethods: res.data.availableLoginMethods || [
            { method: 'password', active: true, displayName: 'Password' },
        ],
        multiuser: res.data.multiuser || false,
        hasServer: true,
    };
}
async function bootstrap(loginConfig) {
    try {
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        await (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/bootstrap', loginConfig);
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    return {};
}
async function getLoginMethods() {
    let res;
    try {
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        res = await fetch(serverConfig.SIGNUP_SERVER + '/login-methods').then(res => res.json());
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    if (res.methods) {
        return { methods: res.methods };
    }
    return { error: 'internal' };
}
async function getUser() {
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        if (!(await asyncStorage.getItem('did-bootstrap'))) {
            return null;
        }
        return { offline: false };
    }
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return null;
    }
    try {
        const res = await (0, post_1.get)(serverConfig.SIGNUP_SERVER + '/validate', {
            headers: {
                'X-ACTUAL-TOKEN': userToken,
            },
        });
        let tokenExpired = false;
        const { status, reason, data: { userName = null, permission = '', userId = null, displayName = null, loginMethod = null, } = {}, } = JSON.parse(res) || {};
        if (status === 'error') {
            if (reason === 'unauthorized') {
                return null;
            }
            else if (reason === 'token-expired') {
                tokenExpired = true;
            }
            else {
                return { offline: true };
            }
        }
        return {
            offline: false,
            userName,
            permission,
            userId,
            displayName,
            loginMethod,
            tokenExpired,
        };
    }
    catch (e) {
        log_1.logger.log(e);
        return { offline: true };
    }
}
async function changePassword({ password }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'not-logged-in' };
    }
    try {
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        await (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/change-password', {
            token: userToken,
            password,
        });
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    return {};
}
async function signIn(loginInfo) {
    if (typeof loginInfo.loginMethod !== 'string' ||
        loginInfo.loginMethod == null) {
        loginInfo.loginMethod = 'password';
    }
    let res;
    try {
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        res = await (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/login', loginInfo);
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    if (res.returnUrl) {
        return { redirectUrl: res.returnUrl };
    }
    if (!res.token) {
        throw new Error('login: User token not set');
    }
    await asyncStorage.setItem('user-token', res.token);
    return {};
}
async function signOut() {
    encryption.unloadAllKeys();
    await asyncStorage.multiRemove([
        'user-token',
        'encrypt-keys',
        'lastBudget',
        'readOnly',
    ]);
    return 'ok';
}
async function setToken({ token }) {
    await asyncStorage.setItem('user-token', token);
}
async function enableOpenId(openIdConfig) {
    try {
        const userToken = await asyncStorage.getItem('user-token');
        if (!userToken) {
            return { error: 'unauthorized' };
        }
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        await (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/enable', openIdConfig, {
            'X-ACTUAL-TOKEN': userToken,
        });
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    return {};
}
async function getOpenIdConfig({ password }) {
    try {
        const userToken = await asyncStorage.getItem('user-token');
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        const res = await (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/config', { password }, {
            'X-ACTUAL-TOKEN': userToken,
        });
        if (res) {
            return res;
        }
        return null;
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
}
async function enablePassword(passwordConfig) {
    try {
        const userToken = await asyncStorage.getItem('user-token');
        if (!userToken) {
            return { error: 'unauthorized' };
        }
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        await (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/disable', passwordConfig, {
            'X-ACTUAL-TOKEN': userToken,
        });
    }
    catch (err) {
        if (err instanceof errors_1.PostError) {
            return {
                error: err.reason || 'network-failure',
            };
        }
        throw err;
    }
    return {};
}
//# sourceMappingURL=app.js.map