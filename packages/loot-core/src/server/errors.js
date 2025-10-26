// TODO: normalize error types
export class PostError extends Error {
    meta;
    reason;
    type;
    constructor(reason, meta) {
        super('PostError: ' + reason);
        this.type = 'PostError';
        this.reason = reason;
        this.meta = meta;
    }
}
export class BankSyncError extends Error {
    reason;
    category;
    code;
    type;
    constructor(reason, category, code) {
        super('BankSyncError: ' + reason);
        this.type = 'BankSyncError';
        this.reason = reason;
        this.category = category;
        this.code = code;
    }
}
export class HTTPError extends Error {
    statusCode;
    responseBody;
    constructor(code, body) {
        super(`HTTPError: unsuccessful status code (${code}): ${body}`);
        this.statusCode = code;
        this.responseBody = body;
    }
}
export class SyncError extends Error {
    meta;
    reason;
    constructor(reason, meta) {
        super('SyncError: ' + reason);
        this.reason = reason;
        this.meta = meta;
    }
}
export class ValidationError extends Error {
}
export class TransactionError extends Error {
}
export class RuleError extends Error {
    type;
    constructor(name, message) {
        super('RuleError: ' + message);
        this.type = name;
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function APIError(msg, meta) {
    return { type: 'APIError', message: msg, meta };
}
export function FileDownloadError(reason, meta) {
    return { type: 'FileDownloadError', reason, meta };
}
export function FileUploadError(reason, meta) {
    return { type: 'FileUploadError', reason, meta };
}
