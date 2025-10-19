"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleError = exports.TransactionError = exports.ValidationError = exports.SyncError = exports.HTTPError = exports.BankSyncError = exports.PostError = void 0;
exports.APIError = APIError;
exports.FileDownloadError = FileDownloadError;
exports.FileUploadError = FileUploadError;
// TODO: normalize error types
class PostError extends Error {
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
exports.PostError = PostError;
class BankSyncError extends Error {
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
exports.BankSyncError = BankSyncError;
class HTTPError extends Error {
    statusCode;
    responseBody;
    constructor(code, body) {
        super(`HTTPError: unsuccessful status code (${code}): ${body}`);
        this.statusCode = code;
        this.responseBody = body;
    }
}
exports.HTTPError = HTTPError;
class SyncError extends Error {
    meta;
    reason;
    constructor(reason, meta) {
        super('SyncError: ' + reason);
        this.reason = reason;
        this.meta = meta;
    }
}
exports.SyncError = SyncError;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
class TransactionError extends Error {
}
exports.TransactionError = TransactionError;
class RuleError extends Error {
    type;
    constructor(name, message) {
        super('RuleError: ' + message);
        this.type = name;
    }
}
exports.RuleError = RuleError;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function APIError(msg, meta) {
    return { type: 'APIError', message: msg, meta };
}
function FileDownloadError(reason, meta) {
    return { type: 'FileDownloadError', reason, meta };
}
function FileUploadError(reason, meta) {
    return { type: 'FileUploadError', reason, meta };
}
