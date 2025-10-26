// ESM shim for exceptions: provide both default + named exports
import * as ExceptionsNS from '../exceptions.js';

export default ExceptionsNS;
export * from '../exceptions.js';
