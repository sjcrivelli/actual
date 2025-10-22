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
// @ts-strict-ignore
var asyncStorage = require("../../platform/server/asyncStorage");
var app_1 = require("../app");
var post_1 = require("../post");
var server_config_1 = require("../server-config");
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('users-get', getUsers);
exports.app.method('user-delete-all', deleteAllUsers);
exports.app.method('user-add', addUser);
exports.app.method('user-update', updateUser);
exports.app.method('access-add', addAccess);
exports.app.method('access-delete-all', deleteAllAccess);
exports.app.method('access-get-available-users', accessGetAvailableUsers);
exports.app.method('transfer-ownership', transferOwnership);
exports.app.method('owner-created', ownerCreated);
function getUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', {
                            headers: {
                                'X-ACTUAL-TOKEN': userToken,
                            },
                        })];
                case 2:
                    res = _a.sent();
                    if (res) {
                        try {
                            list = JSON.parse(res);
                            return [2 /*return*/, list];
                        }
                        catch (err) {
                            return [2 /*return*/, { error: 'Failed to parse response: ' + err.message }];
                        }
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
function deleteAllUsers(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.del)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users', {
                            ids: ids,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3:
                    res = _a.sent();
                    if (res) {
                        return [2 /*return*/, res];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    return [2 /*return*/, { error: err_1.reason }];
                case 5: return [2 /*return*/, { someDeletionsFailed: true }];
            }
        });
    });
}
function addUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', user, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res];
                case 4:
                    err_2 = _a.sent();
                    return [2 /*return*/, { error: err_2.reason }];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
function updateUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.patch)((0, server_config_1.getServer)().BASE_SERVER + '/admin/users/', user, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res];
                case 4:
                    err_3 = _a.sent();
                    return [2 /*return*/, { error: err_3.reason }];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
function addAccess(access) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/access/', access, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {}];
                case 4:
                    err_4 = _a.sent();
                    return [2 /*return*/, { error: err_4.reason }];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
function deleteAllAccess(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, res, err_5;
        var fileId = _b.fileId, ids = _b.ids;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.del)((0, server_config_1.getServer)().BASE_SERVER + "/admin/access?fileId=".concat(fileId), {
                            token: userToken,
                            ids: ids,
                        })];
                case 3:
                    res = _c.sent();
                    if (res) {
                        return [2 /*return*/, res];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_5 = _c.sent();
                    return [2 /*return*/, { error: err_5.reason }];
                case 5: return [2 /*return*/, { someDeletionsFailed: true }];
            }
        });
    });
}
function accessGetAvailableUsers(fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, post_1.get)("".concat((0, server_config_1.getServer)().BASE_SERVER + '/admin/access/users', "?fileId=").concat(fileId), {
                            headers: {
                                'X-ACTUAL-TOKEN': userToken,
                            },
                        })];
                case 2:
                    res = _a.sent();
                    if (res) {
                        try {
                            return [2 /*return*/, JSON.parse(res)];
                        }
                        catch (err) {
                            return [2 /*return*/, { error: 'Failed to parse response: ' + err.message }];
                        }
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, []];
            }
        });
    });
}
function transferOwnership(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, err_6;
        var fileId = _b.fileId, newUserId = _b.newUserId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken) return [3 /*break*/, 5];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().BASE_SERVER + '/admin/access/transfer-ownership/', { fileId: fileId, newUserId: newUserId }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_6 = _c.sent();
                    return [2 /*return*/, { error: err_6.reason }];
                case 5: return [2 /*return*/, {}];
            }
        });
    });
}
function ownerCreated() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, post_1.get)((0, server_config_1.getServer)().BASE_SERVER + '/admin/owner-created/')];
                case 1:
                    res = _a.sent();
                    if (res) {
                        return [2 /*return*/, JSON.parse(res)];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
