import express, { Request, Response } from 'express';

import {
  bootstrap,
  needsBootstrap,
  getLoginMethod,
  listLoginMethods,
  getUserInfo,
  getActiveLoginMethod,
} from './account-db.js';
import { isValidRedirectUrl, loginWithOpenIdSetup } from './accounts/openid.js';
import { changePassword, loginWithPassword } from './accounts/password.js';
import {
  errorMiddleware,
  requestLoggerMiddleware,
} from './util/middlewares.js';
import { validateAuthHeader, validateSession } from './util/validate-user.js';

// ==============================
// ✅ Types
// ==============================

interface TokenResponse {
  error?: string;
  token?: string;
}

interface OpenIdResponse {
  error?: string;
  url?: string;
}

interface BootstrapResponse {
  error?: string;
  [key: string]: unknown;
}

// ==============================
// ✅ Express App Setup
// ==============================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.use(requestLoggerMiddleware);

export { app as handlers };

// ==============================
// 🌱 Non-authenticated Endpoints
// ==============================

app.get('/needs-bootstrap', (req: Request, res: Response): void => {
  const availableLoginMethods = listLoginMethods();

  res.send({
    status: 'ok',
    data: {
      bootstrapped: !needsBootstrap(),
      loginMethod:
        availableLoginMethods.length === 1
          ? availableLoginMethods[0].method
          : getLoginMethod(req as unknown as Record<string, unknown>),
      availableLoginMethods,
      multiuser: getActiveLoginMethod() === 'openid',
    },
  });
});

app.post('/bootstrap', async (req: Request, res: Response): Promise<void> => {
  const boot: BootstrapResponse = await bootstrap(req.body);

  if (boot?.error) {
    res.status(400).send({ status: 'error', reason: boot.error });
    return;
  }

  res.send({ status: 'ok', data: boot });
});

app.get('/login-methods', (req: Request, res: Response): void => {
  const methods = listLoginMethods();
  res.send({ status: 'ok', methods });
});

app.post('/login', async (req: Request, res: Response): Promise<void> => {
  const loginMethod = getLoginMethod(req as unknown as Record<string, unknown>);
  console.log('Logging in via ' + loginMethod);

  let tokenRes: TokenResponse | null = null;

  switch (loginMethod) {
    case 'header': {
      const headerVal: string = req.get('x-actual-password') ?? '';
      const obfuscated = headerVal ? '*'.repeat(headerVal.length) : 'No password provided.';
      console.debug('HEADER VALUE: ' + obfuscated);

      if (!headerVal) {
        res.status(400).send({ status: 'error', reason: 'invalid-header' });
        return;
      }

      if (validateAuthHeader(req)) {
        const result = await loginWithPassword(headerVal);
        if ('token' in result && typeof result.token === 'string') {
          tokenRes = { token: result.token };
        } else if ('error' in result && typeof result.error === 'string') {
          tokenRes = { error: result.error };
        } else {
          tokenRes = { error: 'Invalid token type' };
        }
      } else {
        res.status(400).send({ status: 'error', reason: 'proxy-not-trusted' });
        return;
      }
      break;
    }

    case 'openid': {
      if (!isValidRedirectUrl(req.body.returnUrl)) {
        res.status(400).send({ status: 'error', reason: 'Invalid redirect URL' });
        return;
      }

      const { error, url }: OpenIdResponse = await loginWithOpenIdSetup(
        req.body.returnUrl,
        req.body.password
      );

      if (error) {
        res.status(400).send({ status: 'error', reason: error });
        return;
      }

      res.send({ status: 'ok', data: { returnUrl: url } });
      return;
    }

    default: {
      {
        const result = await loginWithPassword(req.body.password);
        if ('token' in result && typeof result.token !== 'string') {
          tokenRes = { error: 'Invalid token type' };
        } else {
          tokenRes = result as TokenResponse;
        }
      }
      break;
    }
  }

  if (!tokenRes) {
    res.status(400).send({ status: 'error', reason: 'Missing token response' });
    return;
  }

  const { error, token } = tokenRes;

  if (error || !token) {
    res.status(400).send({ status: 'error', reason: error ?? 'Missing token' });
    return;
  }

  res.send({ status: 'ok', data: { token } });
});

app.post('/change-password', (req: Request, res: Response): void => {
  const session = validateSession(req, res);
  if (!session) return;

  const { error } = changePassword(req.body.password);

  if (error) {
    res.status(400).send({ status: 'error', reason: error });
    return;
  }

  res.send({ status: 'ok', data: {} });
});

app.get('/validate', (req: Request, res: Response): void => {
  const session = validateSession(req, res);
  if (!session) return;

  if (typeof session.user_id !== 'string') {
    res.status(400).send({ status: 'error', reason: 'Invalid user id' });
    return;
  }
  const user = getUserInfo(session.user_id);

  if (!user) {
    res.status(400).send({ status: 'error', reason: 'User not found' });
    return;
  }

  res.send({
    status: 'ok',
    data: {
      validated: true,
      userName: user.user_name,
      permission: user.role,
      userId: session.user_id,
      displayName: user.display_name,
      loginMethod: session.auth_method,
    },
  });
});
