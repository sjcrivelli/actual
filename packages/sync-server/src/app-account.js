
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const __generator = (this && this.__generator) || function (thisArg, body) {
    let _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) {try {
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
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }}
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlers = void 0;
const express_1 = require("express");

const account_db_js_1 = require("./account-db.js");
const openid_js_1 = require("./accounts/openid.js");
const password_js_1 = require("./accounts/password.js");
const middlewares_js_1 = require("./util/middlewares.js");
const validate_user_js_1 = require("./util/validate-user.js");
const app = (0, express_1.default)();
exports.handlers = app;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middlewares_js_1.errorMiddleware);
app.use(middlewares_js_1.requestLoggerMiddleware);
// Non-authenticated endpoints:
//
// /needs-bootstrap
// /boostrap (special endpoint for setting up the instance, cant call again)
// /login
app.get('/needs-bootstrap', function (req, res) {
    const availableLoginMethods = (0, account_db_js_1.listLoginMethods)();
    res.send({
        status: 'ok',
        data: {
            bootstrapped: !(0, account_db_js_1.needsBootstrap)(),
            loginMethod: availableLoginMethods.length === 1
                ? availableLoginMethods[0].method
                : (0, account_db_js_1.getLoginMethod)(),
            availableLoginMethods,
            multiuser: (0, account_db_js_1.getActiveLoginMethod)() === 'openid',
        },
    });
});
app.post('/bootstrap', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    let boot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, account_db_js_1.bootstrap)(req.body)];
            case 1:
                boot = _a.sent();
                if (boot === null || boot === void 0 ? void 0 : boot.error) {
                    res.status(400).send({ status: 'error', reason: boot === null || boot === void 0 ? void 0 : boot.error });
                    return [2 /*return*/];
                }
                res.send({ status: 'ok', data: boot });
                return [2 /*return*/];
        }
    });
}); });
app.get('/login-methods', function (req, res) {
    const methods = (0, account_db_js_1.listLoginMethods)();
    res.send({ status: 'ok', methods });
});
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    let loginMethod, tokenRes, _a, headerVal, obfuscated, _b, error_1, url, error, token;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                loginMethod = (0, account_db_js_1.getLoginMethod)(req);
                console.log('Logging in via ' + loginMethod);
                tokenRes = null;
                _a = loginMethod;
                switch (_a) {
                    case 'header': return [3 /*break*/, 1];
                    case 'openid': return [3 /*break*/, 2];
                }
                return [3 /*break*/, 4];
            case 1:
                {
                    headerVal = req.get('x-actual-password') || '';
                    obfuscated = '*'.repeat(headerVal.length) || 'No password provided.';
                    console.debug('HEADER VALUE: ' + obfuscated);
                    if (headerVal === '') {
                        res.send({ status: 'error', reason: 'invalid-header' });
                        return [2 /*return*/];
                    }
                    else {
                        if ((0, validate_user_js_1.validateAuthHeader)(req)) {
                            tokenRes = (0, password_js_1.loginWithPassword)(headerVal);
                        }
                        else {
                            res.send({ status: 'error', reason: 'proxy-not-trusted' });
                            return [2 /*return*/];
                        }
                    }
                    return [3 /*break*/, 5];
                }
                _c.label = 2;
            case 2:
                if (!(0, openid_js_1.isValidRedirectUrl)(req.body.returnUrl)) {
                    res
                        .status(400)
                        .send({ status: 'error', reason: 'Invalid redirect URL' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, openid_js_1.loginWithOpenIdSetup)(req.body.returnUrl, req.body.password)];
            case 3:
                _b = _c.sent(), error_1 = _b.error, url = _b.url;
                if (error_1) {
                    res.status(400).send({ status: 'error', reason: error_1 });
                    return [2 /*return*/];
                }
                res.send({ status: 'ok', data: { returnUrl: url } });
                return [2 /*return*/];
            case 4:
                tokenRes = (0, password_js_1.loginWithPassword)(req.body.password);
                return [3 /*break*/, 5];
            case 5:
                error = tokenRes.error, token = tokenRes.token;
                if (error) {
                    res.status(400).send({ status: 'error', reason: error });
                    return [2 /*return*/];
                }
                res.send({ status: 'ok', data: { token } });
                return [2 /*return*/];
        }
    });
}); });
app.post('/change-password', function (req, res) {
    const session = (0, validate_user_js_1.validateSession)(req, res);
    if (!session)
        {return;}
    const error = (0, password_js_1.changePassword)(req.body.password).error;
    if (error) {
        res.status(400).send({ status: 'error', reason: error });
        return;
    }
    res.send({ status: 'ok', data: {} });
});
app.get('/validate', function (req, res) {
    const session = (0, validate_user_js_1.validateSession)(req, res);
    if (session) {
        const user = (0, account_db_js_1.getUserInfo)(session.user_id);
        if (!user) {
            res.status(400).send({ status: 'error', reason: 'User not found' });
            return;
        }
        res.send({
            status: 'ok',
            data: {
                validated: true,
                userName: user === null || user === void 0 ? void 0 : user.user_name,
                permission: user === null || user === void 0 ? void 0 : user.role,
                userId: session === null || session === void 0 ? void 0 : session.user_id,
                displayName: user === null || user === void 0 ? void 0 : user.display_name,
                loginMethod: session === null || session === void 0 ? void 0 : session.auth_method,
            },
        });
    }
});
