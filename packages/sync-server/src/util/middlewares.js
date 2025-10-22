"use strict";
// Convert this file to fully typed TypeScript. Add proper Express types for all parameters and functions.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = exports.validateSessionMiddleware = void 0;
exports.errorMiddleware = errorMiddleware;
var expressWinston = require("express-winston");
var winston = require("winston");
var validate_user_js_1 = require("./validate-user.js");
function errorMiddleware(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (res.headersSent) {
                // If you call next() with an error after you have started writing the response
                // (for example, if you encounter an error while streaming the response
                // to the client), the Express default error handler closes
                // the connection and fails the request.
                // So when you add a custom error handler, you must delegate
                // to the default Express error handler, when the headers
                // have already been sent to the client
                // Source: https://expressjs.com/en/guide/error-handling.html
                return [2 /*return*/, next(err)];
            }
            console.log("Error on endpoint %s", {
                requestUrl: req.url,
                stacktrace: err.stack,
            });
            res.status(500).send({ status: 'error', reason: 'internal-error' });
            return [2 /*return*/];
        });
    });
}
var validateSessionMiddleware = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, validate_user_js_1.validateSession)(req, res)];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/];
                }
                res.locals = session;
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.validateSessionMiddleware = validateSessionMiddleware;
var requestLoggerMiddleware = expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: (_a = winston.format).combine.apply(_a, __spreadArray(__spreadArray([], (Object.prototype.hasOwnProperty.call(process.env, 'NO_COLOR')
        ? []
        : [winston.format.colorize()]), false), [winston.format.timestamp(),
        winston.format.printf(function (args) {
            var timestamp = args.timestamp, level = args.level, meta = args.meta;
            var req = meta === null || meta === void 0 ? void 0 : meta.req;
            var res = meta === null || meta === void 0 ? void 0 : meta.res;
            if (req && res) {
                return "".concat(timestamp, " ").concat(level, ": ").concat(req.method, " ").concat(res.statusCode, " ").concat(req.url);
            }
            return "".concat(timestamp, " ").concat(level, ": [no req/res info]");
        })], false)),
});
exports.requestLoggerMiddleware = requestLoggerMiddleware;
