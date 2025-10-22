"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleError = exports.TransactionError = exports.ValidationError = exports.SyncError = exports.HTTPError = exports.BankSyncError = exports.PostError = void 0;
exports.APIError = APIError;
exports.FileDownloadError = FileDownloadError;
exports.FileUploadError = FileUploadError;
// TODO: normalize error types
var PostError = /** @class */ (function (_super) {
    __extends(PostError, _super);
    function PostError(reason, meta) {
        var _this = _super.call(this, 'PostError: ' + reason) || this;
        _this.type = 'PostError';
        _this.reason = reason;
        _this.meta = meta;
        return _this;
    }
    return PostError;
}(Error));
exports.PostError = PostError;
var BankSyncError = /** @class */ (function (_super) {
    __extends(BankSyncError, _super);
    function BankSyncError(reason, category, code) {
        var _this = _super.call(this, 'BankSyncError: ' + reason) || this;
        _this.type = 'BankSyncError';
        _this.reason = reason;
        _this.category = category;
        _this.code = code;
        return _this;
    }
    return BankSyncError;
}(Error));
exports.BankSyncError = BankSyncError;
var HTTPError = /** @class */ (function (_super) {
    __extends(HTTPError, _super);
    function HTTPError(code, body) {
        var _this = _super.call(this, "HTTPError: unsuccessful status code (".concat(code, "): ").concat(body)) || this;
        _this.statusCode = code;
        _this.responseBody = body;
        return _this;
    }
    return HTTPError;
}(Error));
exports.HTTPError = HTTPError;
var SyncError = /** @class */ (function (_super) {
    __extends(SyncError, _super);
    function SyncError(reason, meta) {
        var _this = _super.call(this, 'SyncError: ' + reason) || this;
        _this.reason = reason;
        _this.meta = meta;
        return _this;
    }
    return SyncError;
}(Error));
exports.SyncError = SyncError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
var TransactionError = /** @class */ (function (_super) {
    __extends(TransactionError, _super);
    function TransactionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TransactionError;
}(Error));
exports.TransactionError = TransactionError;
var RuleError = /** @class */ (function (_super) {
    __extends(RuleError, _super);
    function RuleError(name, message) {
        var _this = _super.call(this, 'RuleError: ' + message) || this;
        _this.type = name;
        return _this;
    }
    return RuleError;
}(Error));
exports.RuleError = RuleError;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function APIError(msg, meta) {
    return { type: 'APIError', message: msg, meta: meta };
}
function FileDownloadError(reason, meta) {
    return { type: 'FileDownloadError', reason: reason, meta: meta };
}
function FileUploadError(reason, meta) {
    return { type: 'FileUploadError', reason: reason, meta: meta };
}
