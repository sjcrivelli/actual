import { join, resolve } from 'node:path';
import bcrypt from 'bcrypt';
import { bootstrapOpenId } from './accounts/openid.js';
import { bootstrapPassword, loginWithPassword } from './accounts/password.js';
import { openDatabase } from './db.js';
import { config } from './load-config.js';
let _accountDb;
// ==============================
// 🧱 Core Accessors
// ==============================
export function getAccountDb() {
    if (!_accountDb) {
        const dbPath = join(resolve(config.get('serverFiles')), 'account.sqlite');
        _accountDb = openDatabase(dbPath);
    }
    // TypeScript: _accountDb is always initialized here
    return _accountDb;
}
// ==============================
// 🧩 Authentication Logic
// ==============================
export function needsBootstrap() {
    const accountDb = getAccountDb();
    const rows = accountDb.all('SELECT * FROM auth');
    return rows.length === 0;
}
export function listLoginMethods() {
    const accountDb = getAccountDb();
    const rows = accountDb.all('SELECT method, display_name, active FROM auth');
    return rows
        .filter((f) => rows.length > 1 && config.get('enforceOpenId')
        ? f.method === 'openid'
        : true)
        .map((r) => ({
        method: r.method,
        active: r.active,
        displayName: r.display_name,
    }));
}
export function getActiveLoginMethod() {
    const accountDb = getAccountDb();
    const result = accountDb.first('SELECT method FROM auth WHERE active = 1');
    return result?.method;
}
export function getLoginMethod(req) {
    if (req?.body?.loginMethod &&
        config.get('allowedLoginMethods').includes(req.body.loginMethod)) {
        return req.body.loginMethod;
    }
    // Force header-based auth if configured
    if (config.get('loginMethod') === 'header' &&
        config.get('allowedLoginMethods').includes('header')) {
        return config.get('loginMethod');
    }
    const activeMethod = getActiveLoginMethod();
    return activeMethod || config.get('loginMethod');
}
// ==============================
// 🚀 Bootstrap
// ==============================
export async function bootstrap(loginSettings, forced = false) {
    if (!loginSettings)
        return { error: 'invalid-login-settings' };
    const passEnabled = 'password' in loginSettings;
    const openIdEnabled = 'openId' in loginSettings;
    const accountDb = getAccountDb();
    accountDb.mutate('BEGIN TRANSACTION');
    try {
        const { countOfOwner = 0 } = accountDb.first(`SELECT count(*) as countOfOwner
         FROM users
         WHERE users.user_name <> '' and users.owner = 1`) || {};
        if (!forced && (!openIdEnabled || countOfOwner > 0)) {
            if (!needsBootstrap()) {
                accountDb.mutate('ROLLBACK');
                return { error: 'already-bootstrapped' };
            }
        }
        if (!passEnabled && !openIdEnabled) {
            accountDb.mutate('ROLLBACK');
            return { error: 'no-auth-method-selected' };
        }
        if (passEnabled && openIdEnabled && !forced) {
            accountDb.mutate('ROLLBACK');
            return { error: 'max-one-method-allowed' };
        }
        if (passEnabled) {
            const { error } = bootstrapPassword(loginSettings.password);
            if (error) {
                accountDb.mutate('ROLLBACK');
                return { error };
            }
        }
        if (openIdEnabled && forced) {
            const { error } = await bootstrapOpenId(loginSettings.openId);
            if (error) {
                accountDb.mutate('ROLLBACK');
                return { error };
            }
        }
        accountDb.mutate('COMMIT');
        return passEnabled
            ? loginWithPassword(loginSettings.password)
            : {};
    }
    catch (error) {
        accountDb.mutate('ROLLBACK');
        throw error;
    }
}
// ==============================
// 🔐 Permissions & Roles
// ==============================
export function isAdmin(userId) {
    return hasPermission(userId, 'ADMIN');
}
export function hasPermission(userId, permission) {
    return getUserPermission(userId) === permission;
}
// ==============================
// 🪪 OpenID Lifecycle
// ==============================
export async function enableOpenID(loginSettings) {
    if (!loginSettings?.openId)
        return { error: 'invalid-login-settings' };
    const { error } = (await bootstrapOpenId(loginSettings.openId)) || {};
    if (error)
        return { error };
    getAccountDb().mutate('DELETE FROM sessions');
    return {};
}
export async function disableOpenID(loginSettings) {
    if (!loginSettings?.password)
        return { error: 'invalid-login-settings' };
    const accountDb = getAccountDb();
    const { extra_data: passwordHash } = accountDb.first('SELECT extra_data FROM auth WHERE method = ?', [
        'password'
    ]) || {};
    if (!passwordHash)
        return { error: 'invalid-password' };
    const confirmed = bcrypt.compareSync(loginSettings.password, passwordHash);
    if (!confirmed)
        return { error: 'invalid-password' };
    const { error } = (await bootstrapPassword(loginSettings.password)) || {};
    if (error)
        return { error };
    try {
        accountDb.transaction?.(() => {
            accountDb.mutate('DELETE FROM sessions');
            accountDb.mutate(`DELETE FROM user_access
         WHERE user_access.user_id IN (
           SELECT users.id FROM users WHERE users.user_name <> ?
         );`, ['']);
            accountDb.mutate('DELETE FROM users WHERE user_name <> ?', ['']);
            accountDb.mutate('DELETE FROM auth WHERE method = ?', ['openid']);
        });
        return {};
    }
    catch (err) {
        console.error('Error cleaning up openid information:', err);
        return { error: 'database-error' };
    }
}
// ==============================
// 👤 User Data & Sessions
// ==============================
export function getSession(token) {
    const accountDb = getAccountDb();
    return accountDb.first('SELECT * FROM sessions WHERE token = ?', [token]);
}
export function getUserInfo(userId) {
    const accountDb = getAccountDb();
    const row = accountDb.first('SELECT * FROM users WHERE id = ?', [userId]);
    if (!row)
        return null;
    return {
        id: row.id,
        user_name: row.user_name,
        display_name: row.display_name,
        role: row.role,
        owner: row.owner,
    };
}
export function getUserPermission(userId) {
    const accountDb = getAccountDb();
    const { role = '' } = accountDb.first('SELECT role FROM users WHERE users.id = ?', [userId]) ||
        {};
    return role;
}
// ==============================
// 🧹 Maintenance
// ==============================
export function clearExpiredSessions() {
    const clearThreshold = Math.floor(Date.now() / 1000) - 3600;
    const result = getAccountDb().mutate('DELETE FROM sessions WHERE expires_at <> -1 and expires_at < ?', [clearThreshold.toString()]);
    console.log(`Deleted ${result.changes ?? 0} old sessions`);
}
