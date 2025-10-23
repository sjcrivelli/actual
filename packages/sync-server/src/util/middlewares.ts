// Convert this file to fully typed TypeScript. Add proper Express types for all parameters and functions.


import { Request, Response, NextFunction } from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';

import { validateSession } from './validate-user.js';

async function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (res.headersSent) {
    // If you call next() with an error after you have started writing the response
    // (for example, if you encounter an error while streaming the response
    // to the client), the Express default error handler closes
    // the connection and fails the request.

    // So when you add a custom error handler, you must delegate
    // to the default Express error handler, when the headers
    // have already been sent to the client
    // Source: https://expressjs.com/en/guide/error-handling.html
    return next(err);
  }

  console.log(`Error on endpoint %s`, {
    requestUrl: req.url,
    stacktrace: err.stack,
  });
  res.status(500).send({ status: 'error', reason: 'internal-error' });
}

const validateSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await validateSession(req, res);
  if (!session) {
    return;
  }

  res.locals = session;
  next();
};

const requestLoggerMiddleware = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    ...(Object.prototype.hasOwnProperty.call(process.env, 'NO_COLOR')
      ? []
      : [winston.format.colorize()]),
    winston.format.timestamp(),
    winston.format.printf((args: winston.Logform.TransformableInfo & {
      meta?: {
        req?: Request;
        res?: Response;
      };
    }) => {
      const { timestamp, level, meta } = args;
      const req = meta?.req;
      const res = meta?.res;
      if (req && res) {
        return `${timestamp} ${level}: ${req.method} ${res.statusCode} ${req.url}`;
      }
      return `${timestamp} ${level}: [no req/res info]`;
    }),
  ),
});

export { validateSessionMiddleware, errorMiddleware, requestLoggerMiddleware };
