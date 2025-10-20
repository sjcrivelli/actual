import ipaddr from 'ipaddr.js';

import { getSession } from '../account-db.js';
import { config } from '../load-config.js';
import { Request, Response } from 'express';

export const TOKEN_EXPIRATION_NEVER = -1;
const MS_PER_SECOND = 1000;

export function validateSession(
  req: Request,
  res: Response
): ReturnType<typeof getSession> | null {
  let { token } = req.body || {};

  if (!token) {
    token = req.headers['x-actual-token'];
  }

  const session = getSession(token);

  if (!session) {
    res.status(401);
    res.send({
      status: 'error',
      reason: 'unauthorized',
      details: 'token-not-found',
    });
    return null;
  }

  if (
    session.expires_at !== TOKEN_EXPIRATION_NEVER &&
    session.expires_at * MS_PER_SECOND <= Date.now()
  ) {
    res.status(401);
    res.send({
      status: 'error',
      reason: 'token-expired',
    });
    return null;
  }

  return session;
}

export function validateAuthHeader(req: Request): boolean {
  // fallback to trustedProxies when trustedAuthProxies not set
  const trustedAuthProxies =
    config.get('trustedAuthProxies') ?? config.get('trustedProxies');
  // ensure the first hop from our server is trusted
  const peer = req.socket.remoteAddress;
  if (!peer) {
    console.warn('Header Auth Login attempted from unknown peer');
    return false;
  }
  const peerIp = ipaddr.process(peer);
  const rangeList = {
    allowed_ips: trustedAuthProxies.map((q: string) => ipaddr.parseCIDR(q)),
  };

  // @ts-ignore : there is an error in the ts definition for the function, but this is valid
  const matched = ipaddr.subnetMatch(peerIp, rangeList, 'fail');

  if (matched === 'allowed_ips') {
    console.info(`Header Auth Login permitted from ${peer}`);
    return true;
  } else {
    console.warn(`Header Auth Login attempted from ${peer}`);
    return false;
  }
}
