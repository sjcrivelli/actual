import { join, resolve } from 'node:path';
import bcrypt from 'bcrypt';

import { bootstrapOpenId } from './accounts/openid.js';
import { bootstrapPassword, loginWithPassword } from './accounts/password.js';
import { openDatabase } from './db.js';
import { config } from './load-config.js';

// ==============================
// ✅ Types
// ==============================

export interface UserInfo {
  id: string;
  user_name: string;
  display_name: string;
  role: string;
  owner?: number;
}

export interface LoginSettings {
  password?: string;
  openId?: Record<string, unknown>;
}

export interface BootstrapResult {
  error?: string;
  token?: string;
  [key: string]: unknown;
}

interface AccountDb {
  all: (query: string, params?: string[]) => Array<Record<string, unknown>>;
  first: (query: string, params?: string[]) => Record<string, unknown> | null;
  mutate: (query: string, params?: string[]) => { changes?: number };
  transaction?: (fn: () => void) => void;
}

let _accountDb: AccountDb | undefined;

// ==============================
// 🧱 Core Accessors
// ==============================

export function getAccountDb(): AccountDb {
  if (!_accountDb) {
    const serverFilesRaw = config.get('serverFiles');
    if (typeof serverFilesRaw !== 'string') {
      throw new Error("config.get('serverFiles') did not return a string");
    }
    const dbPath = join(resolve(serverFilesRaw), 'account.sqlite');
    _accountDb = openDatabase(dbPath);
  }
  // TypeScript: _accountDb is always initialized here
  return _accountDb as AccountDb;
}

// ==============================
// 🧩 Authentication Logic
// ==============================

export function needsBootstrap(): boolean {
  const accountDb = getAccountDb();
  const rows = accountDb.all('SELECT * FROM auth');
  return rows.length === 0;
}

export function listLoginMethods(): Array<{
  method: string;
  active: number;
  displayName: string;
}> {
  const accountDb = getAccountDb();
  const rowsRaw = accountDb.all('SELECT method, display_name, active FROM auth');
  const rows: Array<{ method: string; display_name: string; active: number }> =
    Array.isArray(rowsRaw)
      ? rowsRaw.filter(
          (r): r is { method: string; display_name: string; active: number } => {
            if (typeof r !== 'object' || r === null) return false;
            const rec = r as Record<string, unknown>;
            return (
              typeof rec.method === 'string' &&
              typeof rec.display_name === 'string' &&
              typeof rec.active === 'number'
            );
          }
        )
      : [];

  const enforceOpenIdRaw = config.get('enforceOpenId');
  const enforceOpenId = typeof enforceOpenIdRaw === 'boolean' ? enforceOpenIdRaw : false;
  return rows
    .filter(
      (f) =>
        rows.length > 1 && enforceOpenId
          ? f.method === 'openid'
          : true
    )
    .map(
      (r) => ({
        method: r.method,
        active: r.active,
        displayName: r.display_name,
      })
    );
}

export function getActiveLoginMethod(): string | undefined {
  const accountDb = getAccountDb();
  const result = accountDb.first('SELECT method FROM auth WHERE active = 1');
  if (result && typeof result === 'object' && 'method' in result && typeof (result as Record<string, unknown>).method === 'string') {
    return (result as Record<string, unknown>).method as string;
  }
  return undefined;
}

export function getLoginMethod(req: Record<string, unknown>): string {
  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const loginMethod = typeof (body as Record<string, unknown>).loginMethod === 'string' ? (body as Record<string, unknown>).loginMethod : undefined;
  const allowedLoginMethodsRaw = config.get('allowedLoginMethods');
  let allowedLoginMethods: string[] = [];
  if (Array.isArray(allowedLoginMethodsRaw) && allowedLoginMethodsRaw.every(m => typeof m === 'string')) {
    allowedLoginMethods = allowedLoginMethodsRaw as string[];
  }
  if (
    typeof loginMethod === 'string' &&
    allowedLoginMethods.includes(loginMethod)
  ) {
    return loginMethod;
  }

  // Force header-based auth if configured
  const loginMethodConfigRaw = config.get('loginMethod');
  if (
    typeof loginMethodConfigRaw === 'string' &&
    loginMethodConfigRaw === 'header' &&
    allowedLoginMethods.includes('header')
  ) {
    return loginMethodConfigRaw;
  }

  const activeMethod = getActiveLoginMethod();
  if (activeMethod) {
    return activeMethod;
  }
  if (typeof loginMethodConfigRaw === 'string') {
    return loginMethodConfigRaw;
  }
  throw new Error("config.get('loginMethod') did not return a string");
}

// ==============================
// 🚀 Bootstrap
// ==============================

export async function bootstrap(
  loginSettings: LoginSettings,
  forced = false
): Promise<BootstrapResult> {
  if (!loginSettings) return { error: 'invalid-login-settings' };

  const passEnabled = 'password' in loginSettings;
  const openIdEnabled = 'openId' in loginSettings;
  const accountDb = getAccountDb();

  accountDb.mutate('BEGIN TRANSACTION');

  try {
    const firstResult = accountDb.first(
      `SELECT count(*) as countOfOwner
       FROM users
       WHERE users.user_name <> '' and users.owner = 1`
    );
    let countOfOwner = 0;
    if (
      firstResult &&
      typeof firstResult === 'object' &&
      'countOfOwner' in firstResult &&
      typeof (firstResult as Record<string, unknown>).countOfOwner === 'number'
    ) {
      countOfOwner = (firstResult as Record<string, unknown>).countOfOwner as number;
    }

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
      const { error } = bootstrapPassword(loginSettings.password!);
      if (error) {
        accountDb.mutate('ROLLBACK');
        return { error };
      }
    }

    if (openIdEnabled && forced) {
      const { error } = await bootstrapOpenId(loginSettings.openId!);
      if (error) {
        accountDb.mutate('ROLLBACK');
        return { error };
      }
    }

    accountDb.mutate('COMMIT');
    if (passEnabled) {
      const loginResult = await loginWithPassword(loginSettings.password!);
      if (
        loginResult &&
        typeof loginResult === 'object' &&
        'token' in loginResult &&
        (typeof (loginResult as Record<string, unknown>).token === 'string' || typeof (loginResult as Record<string, unknown>).token === 'undefined')
      ) {
        return loginResult as BootstrapResult;
      }
      return { error: 'invalid-login-result' };
    }
    return {};
  } catch (error) {
    accountDb.mutate('ROLLBACK');
    throw error;
  }
}

// ==============================
// 🔐 Permissions & Roles
// ==============================

export function isAdmin(userId: string): boolean {
  return hasPermission(userId, 'ADMIN');
}

export function hasPermission(userId: string, permission: string): boolean {
  return getUserPermission(userId) === permission;
}

// ==============================
// 🪪 OpenID Lifecycle
// ==============================

export async function enableOpenID(
  loginSettings: LoginSettings
): Promise<{ error?: string }> {
  if (!loginSettings?.openId) return { error: 'invalid-login-settings' };

  const { error } = (await bootstrapOpenId(loginSettings.openId)) || {};
  if (error) return { error };

  getAccountDb().mutate('DELETE FROM sessions');
  return {};
}

export async function disableOpenID(
  loginSettings: LoginSettings
): Promise<{ error?: string }> {
  if (!loginSettings?.password) return { error: 'invalid-login-settings' };

  const accountDb = getAccountDb();
  const firstResult = accountDb.first('SELECT extra_data FROM auth WHERE method = ?', [
    'password'
  ]);
  const passwordHash =
    firstResult && typeof firstResult === 'object' && 'extra_data' in firstResult && typeof (firstResult as Record<string, unknown>).extra_data === 'string'
      ? (firstResult as Record<string, unknown>).extra_data as string
      : undefined;

  if (!passwordHash) return { error: 'invalid-password' };

  const confirmed = bcrypt.compareSync(loginSettings.password, passwordHash);
  if (!confirmed) return { error: 'invalid-password' };

  const { error } = (await bootstrapPassword(loginSettings.password)) || {};
  if (error) return { error };

  try {
    accountDb.transaction?.(() => {
      accountDb.mutate('DELETE FROM sessions');
      accountDb.mutate(
        `DELETE FROM user_access
         WHERE user_access.user_id IN (
           SELECT users.id FROM users WHERE users.user_name <> ?
         );`,
        ['']
      );
      accountDb.mutate('DELETE FROM users WHERE user_name <> ?', ['']);
      accountDb.mutate('DELETE FROM auth WHERE method = ?', ['openid']);
    });
    return {};
  } catch (err) {
    console.error('Error cleaning up openid information:', err);
    return { error: 'database-error' };
  }
}

// ==============================
// 👤 User Data & Sessions
// ==============================

export function getSession(token: string): Record<string, unknown> | null {
  const accountDb = getAccountDb();
  return accountDb.first('SELECT * FROM sessions WHERE token = ?', [token]);
}

export function getUserInfo(userId: string): UserInfo | null {
  const accountDb = getAccountDb();
  const row = accountDb.first('SELECT * FROM users WHERE id = ?', [userId]);
  if (!row) return null;
  if (
    typeof row.id === 'string' &&
    typeof row.user_name === 'string' &&
    typeof row.display_name === 'string' &&
    typeof row.role === 'string' &&
    (typeof row.owner === 'number' || typeof row.owner === 'undefined')
  ) {
    return {
      id: row.id as string,
      user_name: row.user_name as string,
      display_name: row.display_name as string,
      role: row.role as string,
      owner: row.owner as number | undefined,
    } satisfies UserInfo;
  }
  return null;
}

export function getUserPermission(userId: string): string {
  const accountDb = getAccountDb();
  const firstResult = accountDb.first('SELECT role FROM users WHERE users.id = ?', [userId]);
  let role = '';
  if (
    firstResult &&
    typeof firstResult === 'object' &&
    'role' in firstResult &&
    typeof (firstResult as Record<string, unknown>).role === 'string'
  ) {
    role = (firstResult as Record<string, unknown>).role as string;
  }
  return role;
}

// ==============================
// 🧹 Maintenance
// ==============================

export function clearExpiredSessions(): void {
  const clearThreshold = Math.floor(Date.now() / 1000) - 3600;
  const result = getAccountDb().mutate(
    'DELETE FROM sessions WHERE expires_at <> -1 and expires_at < ?',
    [clearThreshold.toString()]
  );
  console.log(`Deleted ${result.changes ?? 0} old sessions`);
}
