"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var asyncStorage = require("../../platform/server/asyncStorage");
var log_1 = require("../../platform/server/log");
var app_1 = require("../app");
var encryption = require("../encryption");
var errors_1 = require("../errors");
var post_1 = require("../post");
var server_config_1 = require("../server-config");
exports.app = (0, app_1.createApp)();
exports.app.method('get-did-bootstrap', didBootstrap);
exports.app.method('subscribe-needs-bootstrap', needsBootstrap);
exports.app.method('subscribe-bootstrap', bootstrap);
exports.app.method('subscribe-get-login-methods', getLoginMethods);
exports.app.method('subscribe-get-user', getUser);
exports.app.method('subscribe-change-password', changePassword);
exports.app.method('subscribe-sign-in', signIn);
exports.app.method('subscribe-sign-out', signOut);
exports.app.method('subscribe-set-token', setToken);
exports.app.method('enable-openid', enableOpenId);
exports.app.method('get-openid-config', getOpenIdConfig);
exports.app.method('enable-password', enablePassword);
function didBootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = Boolean;
                    return [4 /*yield*/, asyncStorage.getItem('did-bootstrap')];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
}
function needsBootstrap() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var serverConfig, resText, err_1, res;
        var _b = _a === void 0 ? {} : _a, url = _b.url;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (url && !(0, server_config_1.isValidBaseURL)(url)) {
                        return [2 /*return*/, { error: 'get-server-failure' }];
                    }
                    try {
                        serverConfig = (0, server_config_1.getServer)(url);
                        if (!serverConfig) {
                            return [2 /*return*/, { bootstrapped: true, hasServer: false }];
                        }
                    }
                    catch (err) {
                        return [2 /*return*/, { error: 'get-server-failure' }];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, post_1.get)(serverConfig.SIGNUP_SERVER + '/needs-bootstrap')];
                case 2:
                    resText = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    return [2 /*return*/, { error: 'network-failure' }];
                case 4:
                    try {
                        res = JSON.parse(resText);
                    }
                    catch (err) {
                        return [2 /*return*/, { error: 'parse-failure' }];
                    }
                    return [2 /*return*/, {
                            bootstrapped: res.data.bootstrapped,
                            availableLoginMethods: res.data.availableLoginMethods || [
                                { method: 'password', active: true, displayName: 'Password' },
                            ],
                            multiuser: res.data.multiuser || false,
                            hasServer: true,
                        }];
            }
        });
    });
}
function bootstrap(loginConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/bootstrap', loginConfig)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_2.reason || 'network-failure',
                            }];
                    }
                    throw err_2;
                case 3: return [2 /*return*/, {}];
            }
        });
    });
}
function getLoginMethods() {
    return __awaiter(this, void 0, void 0, function () {
        var res, serverConfig, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, fetch(serverConfig.SIGNUP_SERVER + '/login-methods').then(function (res) {
                            return res.json();
                        })];
                case 1:
                    res = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    if (err_3 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_3.reason || 'network-failure',
                            }];
                    }
                    throw err_3;
                case 3:
                    if (res.methods) {
                        return [2 /*return*/, { methods: res.methods }];
                    }
                    return [2 /*return*/, { error: 'internal' }];
            }
        });
    });
}
function getUser() {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig, userToken, res, tokenExpired, _a, status_1, reason, _b, _c, _d, userName, _e, permission, _f, userId, _g, displayName, _h, loginMethod, e_1;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    serverConfig = (0, server_config_1.getServer)();
                    if (!!serverConfig) return [3 /*break*/, 2];
                    return [4 /*yield*/, asyncStorage.getItem('did-bootstrap')];
                case 1:
                    if (!(_j.sent())) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, { offline: false }];
                case 2: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 3:
                    userToken = _j.sent();
                    if (!userToken) {
                        return [2 /*return*/, null];
                    }
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, post_1.get)(serverConfig.SIGNUP_SERVER + '/validate', {
                            headers: {
                                'X-ACTUAL-TOKEN': userToken,
                            },
                        })];
                case 5:
                    res = _j.sent();
                    tokenExpired = false;
                    _a = JSON.parse(res) || {}, status_1 = _a.status, reason = _a.reason, _b = _a.data, _c = _b === void 0 ? {} : _b, _d = _c.userName, userName = _d === void 0 ? null : _d, _e = _c.permission, permission = _e === void 0 ? '' : _e, _f = _c.userId, userId = _f === void 0 ? null : _f, _g = _c.displayName, displayName = _g === void 0 ? null : _g, _h = _c.loginMethod, loginMethod = _h === void 0 ? null : _h;
                    if (status_1 === 'error') {
                        if (reason === 'unauthorized') {
                            return [2 /*return*/, null];
                        }
                        else if (reason === 'token-expired') {
                            tokenExpired = true;
                        }
                        else {
                            return [2 /*return*/, { offline: true }];
                        }
                    }
                    return [2 /*return*/, {
                            offline: false,
                            userName: userName,
                            permission: permission,
                            userId: userId,
                            displayName: displayName,
                            loginMethod: loginMethod,
                            tokenExpired: tokenExpired,
                        }];
                case 6:
                    e_1 = _j.sent();
                    log_1.logger.log(e_1);
                    return [2 /*return*/, { offline: true }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function changePassword(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, serverConfig, err_4;
        var password = _b.password;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'not-logged-in' }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/change-password', {
                            token: userToken,
                            password: password,
                        })];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _c.sent();
                    if (err_4 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_4.reason || 'network-failure',
                            }];
                    }
                    throw err_4;
                case 5: return [2 /*return*/, {}];
            }
        });
    });
}
function signIn(loginInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var res, serverConfig, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof loginInfo.loginMethod !== 'string' ||
                        loginInfo.loginMethod == null) {
                        loginInfo.loginMethod = 'password';
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.SIGNUP_SERVER + '/login', loginInfo)];
                case 2:
                    res = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    if (err_5 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_5.reason || 'network-failure',
                            }];
                    }
                    throw err_5;
                case 4:
                    if (res.returnUrl) {
                        return [2 /*return*/, { redirectUrl: res.returnUrl }];
                    }
                    if (!res.token) {
                        throw new Error('login: User token not set');
                    }
                    return [4 /*yield*/, asyncStorage.setItem('user-token', res.token)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function signOut() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encryption.unloadAllKeys();
                    return [4 /*yield*/, asyncStorage.multiRemove([
                            'user-token',
                            'encrypt-keys',
                            'lastBudget',
                            'readOnly',
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function setToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var token = _b.token;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.setItem('user-token', token)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function enableOpenId(openIdConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/enable', openIdConfig, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    if (err_6 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_6.reason || 'network-failure',
                            }];
                    }
                    throw err_6;
                case 4: return [2 /*return*/, {}];
            }
        });
    });
}
function getOpenIdConfig(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, serverConfig, res, err_7;
        var password = _b.password;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/config', { password: password }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 2:
                    res = _c.sent();
                    if (res) {
                        return [2 /*return*/, res];
                    }
                    return [2 /*return*/, null];
                case 3:
                    err_7 = _c.sent();
                    if (err_7 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_7.reason || 'network-failure',
                            }];
                    }
                    throw err_7;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function enablePassword(passwordConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('No sync server configured.');
                    }
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.BASE_SERVER + '/openid/disable', passwordConfig, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _a.sent();
                    if (err_8 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: err_8.reason || 'network-failure',
                            }];
                    }
                    throw err_8;
                case 4: return [2 /*return*/, {}];
            }
        });
    });
}
